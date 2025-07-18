from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from database import engine, Base, check_database_health, get_connection_stats, cleanup_connections
import os
import logging
import time
import uuid
from pathlib import Path
from contextlib import asynccontextmanager
import asyncio

# Import routes
from routes.portfolio import router as portfolio_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure enhanced logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Custom middleware for request monitoring and database connection management
class DatabaseHealthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.request_count = 0
        self.error_count = 0
        
    async def dispatch(self, request: Request, call_next):
        # Generate request ID for tracking
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        
        # Log request
        start_time = time.time()
        self.request_count += 1
        
        logger.info(f"Request {request_id}: {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            
            # Log response
            process_time = time.time() - start_time
            logger.info(f"Request {request_id}: Completed in {process_time:.3f}s - Status: {response.status_code}")
            
            # Add custom headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}"
            
            return response
            
        except Exception as e:
            self.error_count += 1
            process_time = time.time() - start_time
            logger.error(f"Request {request_id}: Error after {process_time:.3f}s - {str(e)}")
            
            # Return proper error response
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal server error",
                    "request_id": request_id,
                    "timestamp": time.time()
                }
            )

# Lifespan event handler for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Portfolio API starting up...")
    logger.info("📊 Performing initial database health check...")
    
    health = check_database_health()
    if health["status"] == "healthy":
        logger.info(f"✅ Database connection healthy (Response time: {health['response_time']})")
    else:
        logger.error(f"❌ Database connection unhealthy: {health.get('error', 'Unknown error')}")
    
    # Start background tasks
    asyncio.create_task(periodic_health_check())
    
    yield
    
    # Shutdown
    logger.info("🔄 Portfolio API shutting down...")
    logger.info("🧹 Cleaning up database connections...")
    cleanup_connections()
    logger.info("✅ Shutdown complete")

# Background task for periodic health checks
async def periodic_health_check():
    """Periodic health check and connection monitoring."""
    while True:
        try:
            await asyncio.sleep(300)  # Check every 5 minutes
            
            health = check_database_health()
            stats = get_connection_stats()
            
            if health["status"] == "healthy":
                logger.info(f"🟢 Periodic health check: OK (Response: {health['response_time']})")
                logger.info(f"📊 Pool stats: {stats}")
            else:
                logger.warning(f"🟡 Periodic health check: Issues detected - {health.get('error', 'Unknown')}")
                # Attempt to cleanup connections if issues detected
                cleanup_connections()
                
        except Exception as e:
            logger.error(f"❌ Periodic health check failed: {e}")

# Create the main app with enhanced configuration
app = FastAPI(
    title="Portfolio API - Enhanced",
    description="Enhanced API for Hocine IRATNI's portfolio website with improved stability and monitoring",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add custom middleware
app.add_middleware(DatabaseHealthMiddleware)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Process-Time"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enhanced health check endpoints
@api_router.get("/")
async def root():
    return {
        "message": "Portfolio API v2.0 - Enhanced Edition",
        "status": "running",
        "version": "2.0.0",
        "timestamp": time.time()
    }

@api_router.get("/health")
async def health_check():
    """Comprehensive health check with database connectivity."""
    try:
        # Basic health info
        health_info = {
            "status": "healthy",
            "service": "portfolio-api",
            "version": "2.0.0",
            "timestamp": time.time(),
        }
        
        # Database health check
        db_health = check_database_health()
        health_info["database"] = db_health
        
        # Connection pool stats
        pool_stats = get_connection_stats()
        health_info["connection_pool"] = pool_stats
        
        # Overall status
        overall_status = "healthy" if db_health["status"] == "healthy" else "degraded"
        health_info["status"] = overall_status
        
        return health_info
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": time.time()
            }
        )

@api_router.get("/metrics")
async def get_metrics():
    """Get application metrics and statistics."""
    try:
        middleware = None
        for middleware_item in app.user_middleware:
            if isinstance(middleware_item[0], type) and issubclass(middleware_item[0], DatabaseHealthMiddleware):
                middleware = middleware_item[0]
                break
        
        metrics = {
            "database": check_database_health(),
            "connection_pool": get_connection_stats(),
            "timestamp": time.time()
        }
        
        return metrics
        
    except Exception as e:
        logger.error(f"Metrics collection failed: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to collect metrics", "timestamp": time.time()}
        )

@api_router.post("/admin/cleanup-connections")
async def cleanup_db_connections():
    """Admin endpoint to cleanup database connections."""
    try:
        result = cleanup_connections()
        if result:
            return {"message": "Database connections cleaned up successfully", "status": "success"}
        else:
            return JSONResponse(
                status_code=500,
                content={"message": "Failed to cleanup connections", "status": "error"}
            )
    except Exception as e:
        logger.error(f"Connection cleanup failed: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "status": "error"}
        )

# Include portfolio routes
api_router.include_router(portfolio_router, prefix="/portfolio", tags=["portfolio"])

# Include the router in the main app
app.include_router(api_router)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, 'request_id', 'unknown')
    logger.error(f"Unhandled exception for request {request_id}: {exc}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "request_id": request_id,
            "timestamp": time.time()
        }
    )

# Custom 404 handler
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "path": str(request.url.path),
            "request_id": request_id,
            "timestamp": time.time()
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )