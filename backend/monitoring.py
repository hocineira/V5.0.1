import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from database import check_database_health, get_connection_stats, cleanup_connections
import json
import os
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class HealthRecord:
    """Record of a health check."""
    timestamp: float
    status: str
    response_time: Optional[float] = None
    pool_stats: Optional[Dict] = None
    error: Optional[str] = None

@dataclass
class MonitoringConfig:
    """Configuration for monitoring system."""
    check_interval: int = 60  # seconds
    alert_threshold: int = 3   # consecutive failures
    max_records: int = 1000   # max health records to keep
    log_file: str = "monitoring.log"
    metrics_file: str = "metrics.json"

class DatabaseMonitor:
    """Enhanced database monitoring and stability management."""
    
    def __init__(self, config: MonitoringConfig = None):
        self.config = config or MonitoringConfig()
        self.health_records: List[HealthRecord] = []
        self.consecutive_failures = 0
        self.last_cleanup = time.time()
        self.is_running = False
        
        # Create monitoring directory
        self.monitoring_dir = Path("monitoring")
        self.monitoring_dir.mkdir(exist_ok=True)
        
        # Setup monitoring log
        self.monitoring_logger = logging.getLogger("monitoring")
        handler = logging.FileHandler(self.monitoring_dir / self.config.log_file)
        handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        self.monitoring_logger.addHandler(handler)
        self.monitoring_logger.setLevel(logging.INFO)
        
    async def start_monitoring(self):
        """Start the monitoring loop."""
        self.is_running = True
        self.monitoring_logger.info("🔍 Database monitoring started")
        
        while self.is_running:
            try:
                await self._perform_health_check()
                await asyncio.sleep(self.config.check_interval)
                
            except Exception as e:
                self.monitoring_logger.error(f"❌ Monitoring error: {e}")
                await asyncio.sleep(self.config.check_interval)
    
    async def _perform_health_check(self):
        """Perform a comprehensive health check."""
        try:
            # Database health check
            start_time = time.time()
            health = check_database_health()
            pool_stats = get_connection_stats()
            
            # Create health record
            record = HealthRecord(
                timestamp=time.time(),
                status=health["status"],
                response_time=health.get("response_time"),
                pool_stats=pool_stats,
                error=health.get("error")
            )
            
            # Add to records
            self.health_records.append(record)
            
            # Limit records
            if len(self.health_records) > self.config.max_records:
                self.health_records = self.health_records[-self.config.max_records:]
            
            # Handle status
            if health["status"] == "healthy":
                self.consecutive_failures = 0
                self.monitoring_logger.info(f"✅ Health check OK - Response: {health.get('response_time', 'N/A')}")
            else:
                self.consecutive_failures += 1
                self.monitoring_logger.warning(f"⚠️ Health check failed (#{self.consecutive_failures}): {health.get('error', 'Unknown')}")
                
                # Check if we need to take action
                if self.consecutive_failures >= self.config.alert_threshold:
                    await self._handle_persistent_failure()
            
            # Log pool statistics
            if pool_stats:
                self.monitoring_logger.info(f"📊 Pool stats: {pool_stats}")
            
            # Save metrics
            await self._save_metrics()
            
        except Exception as e:
            self.monitoring_logger.error(f"❌ Health check failed: {e}")
            self.consecutive_failures += 1
    
    async def _handle_persistent_failure(self):
        """Handle persistent database failures."""
        self.monitoring_logger.error(f"🚨 ALERT: {self.consecutive_failures} consecutive failures detected!")
        
        # Attempt connection cleanup
        self.monitoring_logger.info("🔄 Attempting connection cleanup...")
        try:
            cleanup_result = cleanup_connections()
            if cleanup_result:
                self.monitoring_logger.info("✅ Connection cleanup successful")
            else:
                self.monitoring_logger.error("❌ Connection cleanup failed")
        except Exception as e:
            self.monitoring_logger.error(f"❌ Connection cleanup error: {e}")
        
        # Reset failure count after cleanup attempt
        self.consecutive_failures = 0
        self.last_cleanup = time.time()
    
    async def _save_metrics(self):
        """Save current metrics to file."""
        try:
            metrics = {
                "timestamp": time.time(),
                "consecutive_failures": self.consecutive_failures,
                "total_health_records": len(self.health_records),
                "last_cleanup": self.last_cleanup,
                "recent_health_records": [
                    {
                        "timestamp": record.timestamp,
                        "status": record.status,
                        "response_time": record.response_time,
                        "error": record.error
                    }
                    for record in self.health_records[-10:]  # Last 10 records
                ]
            }
            
            metrics_file = self.monitoring_dir / self.config.metrics_file
            with open(metrics_file, 'w') as f:
                json.dump(metrics, f, indent=2)
                
        except Exception as e:
            self.monitoring_logger.error(f"❌ Failed to save metrics: {e}")
    
    def stop_monitoring(self):
        """Stop the monitoring loop."""
        self.is_running = False
        self.monitoring_logger.info("🛑 Database monitoring stopped")
    
    def get_health_summary(self) -> Dict:
        """Get a summary of recent health status."""
        if not self.health_records:
            return {"status": "no_data", "message": "No health records available"}
        
        recent_records = self.health_records[-10:]  # Last 10 records
        healthy_count = sum(1 for r in recent_records if r.status == "healthy")
        
        return {
            "status": "healthy" if healthy_count >= 7 else "degraded",
            "healthy_percentage": (healthy_count / len(recent_records)) * 100,
            "consecutive_failures": self.consecutive_failures,
            "total_records": len(self.health_records),
            "last_check": recent_records[-1].timestamp if recent_records else None,
            "last_cleanup": self.last_cleanup
        }
    
    def get_detailed_metrics(self) -> Dict:
        """Get detailed metrics for analysis."""
        if not self.health_records:
            return {"error": "No health records available"}
        
        # Calculate statistics
        total_records = len(self.health_records)
        healthy_records = [r for r in self.health_records if r.status == "healthy"]
        unhealthy_records = [r for r in self.health_records if r.status != "healthy"]
        
        # Response time statistics
        response_times = [r.response_time for r in healthy_records if r.response_time is not None]
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        return {
            "total_records": total_records,
            "healthy_records": len(healthy_records),
            "unhealthy_records": len(unhealthy_records),
            "health_percentage": (len(healthy_records) / total_records) * 100,
            "average_response_time": avg_response_time,
            "consecutive_failures": self.consecutive_failures,
            "monitoring_duration": time.time() - self.health_records[0].timestamp if self.health_records else 0,
            "last_cleanup": self.last_cleanup
        }

# Global monitor instance
monitor = DatabaseMonitor()

async def start_background_monitoring():
    """Start background monitoring task."""
    await monitor.start_monitoring()

def get_monitoring_summary():
    """Get current monitoring summary."""
    return monitor.get_health_summary()

def get_monitoring_metrics():
    """Get detailed monitoring metrics."""
    return monitor.get_detailed_metrics()

if __name__ == "__main__":
    # Run monitoring standalone
    asyncio.run(start_background_monitoring())