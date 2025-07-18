import asyncio
import time
import logging
from typing import Dict, List, Optional, Callable
from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from contextlib import asynccontextmanager
from database import get_db_context, SessionLocal
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timedelta

# Configure logging
logger = logging.getLogger(__name__)

@dataclass
class RequestMetrics:
    """Request performance metrics."""
    request_id: str
    method: str
    path: str
    start_time: float
    end_time: Optional[float] = None
    duration: Optional[float] = None
    status_code: Optional[int] = None
    error: Optional[str] = None
    db_operations: int = 0
    db_time: float = 0.0

class PerformanceMonitoringMiddleware(BaseHTTPMiddleware):
    """Middleware for monitoring request performance and database interactions."""
    
    def __init__(self, app, max_request_time: float = 30.0, slow_request_threshold: float = 5.0):
        super().__init__(app)
        self.max_request_time = max_request_time
        self.slow_request_threshold = slow_request_threshold
        self.active_requests: Dict[str, RequestMetrics] = {}
        self.completed_requests: List[RequestMetrics] = []
        self.max_completed_requests = 1000
        
    async def dispatch(self, request: Request, call_next):
        # Generate request ID
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        
        # Create metrics
        metrics = RequestMetrics(
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            start_time=time.time()
        )
        
        self.active_requests[request_id] = metrics
        
        try:
            # Set request timeout
            response = await asyncio.wait_for(
                call_next(request),
                timeout=self.max_request_time
            )
            
            # Update metrics
            metrics.end_time = time.time()
            metrics.duration = metrics.end_time - metrics.start_time
            metrics.status_code = response.status_code
            
            # Log performance
            self._log_request_performance(metrics)
            
            # Add performance headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{metrics.duration:.3f}"
            
            return response
            
        except asyncio.TimeoutError:
            # Handle timeout
            metrics.end_time = time.time()
            metrics.duration = metrics.end_time - metrics.start_time
            metrics.error = "Request timeout"
            
            logger.error(f"Request {request_id} timed out after {metrics.duration:.3f}s")
            
            return JSONResponse(
                status_code=504,
                content={
                    "error": "Request timeout",
                    "request_id": request_id,
                    "timeout": self.max_request_time,
                    "timestamp": time.time()
                }
            )
            
        except Exception as e:
            # Handle other errors
            metrics.end_time = time.time()
            metrics.duration = metrics.end_time - metrics.start_time
            metrics.error = str(e)
            
            logger.error(f"Request {request_id} failed after {metrics.duration:.3f}s: {e}")
            
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal server error",
                    "request_id": request_id,
                    "timestamp": time.time()
                }
            )
            
        finally:
            # Move to completed requests
            if request_id in self.active_requests:
                completed_metrics = self.active_requests.pop(request_id)
                self.completed_requests.append(completed_metrics)
                
                # Limit completed requests
                if len(self.completed_requests) > self.max_completed_requests:
                    self.completed_requests = self.completed_requests[-self.max_completed_requests:]
    
    def _log_request_performance(self, metrics: RequestMetrics):
        """Log request performance metrics."""
        if metrics.duration is None:
            return
            
        if metrics.duration > self.slow_request_threshold:
            logger.warning(
                f"🐌 Slow request {metrics.request_id}: {metrics.method} {metrics.path} "
                f"took {metrics.duration:.3f}s (threshold: {self.slow_request_threshold}s)"
            )
        else:
            logger.info(
                f"✅ Request {metrics.request_id}: {metrics.method} {metrics.path} "
                f"completed in {metrics.duration:.3f}s"
            )
    
    def get_performance_stats(self) -> Dict:
        """Get performance statistics."""
        if not self.completed_requests:
            return {"message": "No completed requests"}
        
        durations = [r.duration for r in self.completed_requests if r.duration is not None]
        if not durations:
            return {"message": "No duration data available"}
        
        slow_requests = [r for r in self.completed_requests if r.duration and r.duration > self.slow_request_threshold]
        error_requests = [r for r in self.completed_requests if r.error is not None]
        
        return {
            "total_requests": len(self.completed_requests),
            "active_requests": len(self.active_requests),
            "average_duration": sum(durations) / len(durations),
            "min_duration": min(durations),
            "max_duration": max(durations),
            "slow_requests": len(slow_requests),
            "error_requests": len(error_requests),
            "error_rate": (len(error_requests) / len(self.completed_requests)) * 100,
            "slow_request_rate": (len(slow_requests) / len(self.completed_requests)) * 100,
        }

class DatabaseConnectionMiddleware(BaseHTTPMiddleware):
    """Middleware for managing database connections and preventing timeouts."""
    
    def __init__(self, app, connection_timeout: float = 30.0):
        super().__init__(app)
        self.connection_timeout = connection_timeout
        self.active_connections: Dict[str, float] = {}
        
    async def dispatch(self, request: Request, call_next):
        request_id = getattr(request.state, 'request_id', str(uuid.uuid4())[:8])
        
        # Track connection
        self.active_connections[request_id] = time.time()
        
        try:
            # Process request
            response = await call_next(request)
            return response
            
        except Exception as e:
            logger.error(f"Database connection error for request {request_id}: {e}")
            raise
            
        finally:
            # Clean up connection tracking
            if request_id in self.active_connections:
                connection_duration = time.time() - self.active_connections[request_id]
                del self.active_connections[request_id]
                
                if connection_duration > self.connection_timeout:
                    logger.warning(f"Long-running connection for request {request_id}: {connection_duration:.3f}s")

class CircuitBreakerMiddleware(BaseHTTPMiddleware):
    """Circuit breaker middleware to prevent cascading failures."""
    
    def __init__(self, app, failure_threshold: int = 5, recovery_timeout: float = 60.0):
        super().__init__(app)
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = 0
        self.state = "closed"  # closed, open, half-open
        
    async def dispatch(self, request: Request, call_next):
        # Check circuit breaker state
        if self.state == "open":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "half-open"
                logger.info("Circuit breaker moved to half-open state")
            else:
                logger.warning("Circuit breaker is OPEN - rejecting request")
                return JSONResponse(
                    status_code=503,
                    content={
                        "error": "Service temporarily unavailable",
                        "circuit_breaker": "open",
                        "retry_after": self.recovery_timeout - (time.time() - self.last_failure_time)
                    }
                )
        
        try:
            response = await call_next(request)
            
            # Success - reset failure count if in half-open state
            if self.state == "half-open":
                self.failure_count = 0
                self.state = "closed"
                logger.info("Circuit breaker reset to closed state")
            
            return response
            
        except Exception as e:
            # Failure - increment count and potentially open circuit
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = "open"
                logger.error(f"Circuit breaker OPENED after {self.failure_count} failures")
            
            raise

@asynccontextmanager
async def managed_db_session():
    """Context manager for database sessions with timeout protection."""
    session = SessionLocal()
    start_time = time.time()
    
    try:
        # Test connection
        session.execute("SELECT 1")
        yield session
        session.commit()
        
    except Exception as e:
        session.rollback()
        logger.error(f"Database session error: {e}")
        raise
        
    finally:
        session.close()
        duration = time.time() - start_time
        
        if duration > 30:  # Log long-running sessions
            logger.warning(f"Long-running database session: {duration:.3f}s")

# Utility functions for middleware management
def create_performance_middleware(app, **kwargs):
    """Create performance monitoring middleware with custom settings."""
    return PerformanceMonitoringMiddleware(app, **kwargs)

def create_database_middleware(app, **kwargs):
    """Create database connection middleware with custom settings."""
    return DatabaseConnectionMiddleware(app, **kwargs)

def create_circuit_breaker_middleware(app, **kwargs):
    """Create circuit breaker middleware with custom settings."""
    return CircuitBreakerMiddleware(app, **kwargs)

# Health check functions
def get_middleware_health() -> Dict:
    """Get health status of all middlewares."""
    return {
        "performance_monitoring": "active",
        "database_connection": "active",
        "circuit_breaker": "active",
        "timestamp": time.time()
    }