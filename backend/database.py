from sqlalchemy import create_engine, pool, event, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import Pool
from dotenv import load_dotenv
import os
import logging
from pathlib import Path
from contextlib import contextmanager
import time

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration with connection pooling and stability improvements
DATABASE_URL = os.environ.get("DATABASE_URL", "mysql+pymysql://portfolio_user:portfolio_password@localhost/portfolio_db")

# Enhanced engine configuration for stability
engine = create_engine(
    DATABASE_URL,
    # Connection pooling settings
    pool_size=20,                    # Number of connections to maintain
    max_overflow=30,                 # Additional connections beyond pool_size
    pool_pre_ping=True,             # Validate connections before use
    pool_recycle=3600,              # Recycle connections every hour
    pool_timeout=30,                # Timeout for getting connection from pool
    
    # Connection settings
    connect_args={
        "charset": "utf8mb4",
        "autocommit": False,
        "connect_timeout": 60,      # Connection timeout
        "read_timeout": 60,         # Read timeout
        "write_timeout": 60,        # Write timeout
        "init_command": "SET SESSION wait_timeout=28800, interactive_timeout=28800",  # 8 hours
    },
    
    # Additional engine options
    echo=False,                     # Set to True for SQL debugging
    future=True,                    # Use SQLAlchemy 2.0 style
)

# Add connection event listeners for better monitoring
@event.listens_for(engine, "connect")
def connect_handler(dbapi_connection, connection_record):
    logger.info("New database connection established")
    
    # Set connection-specific timeouts
    with dbapi_connection.cursor() as cursor:
        cursor.execute("SET SESSION wait_timeout=28800")
        cursor.execute("SET SESSION interactive_timeout=28800")
        cursor.execute("SET SESSION sql_mode='STRICT_TRANS_TABLES'")

@event.listens_for(engine, "checkout")
def checkout_handler(dbapi_connection, connection_record, connection_proxy):
    logger.debug("Connection checked out from pool")

@event.listens_for(engine, "checkin")
def checkin_handler(dbapi_connection, connection_record):
    logger.debug("Connection checked in to pool")

@event.listens_for(engine, "invalidate")
def invalidate_handler(dbapi_connection, connection_record, exception):
    logger.warning(f"Connection invalidated: {exception}")

# Session configuration
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,  # Keep objects usable after commit
)

Base = declarative_base()

# Enhanced database session dependency with error handling
def get_db():
    db = SessionLocal()
    try:
        # Test connection before yielding
        db.execute(text("SELECT 1"))
        yield db
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

# Health check function
def check_database_health():
    """Check database connectivity and performance."""
    try:
        start_time = time.time()
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as health_check"))
            response_time = time.time() - start_time
            
            return {
                "status": "healthy",
                "response_time": f"{response_time:.3f}s",
                "pool_size": engine.pool.size(),
                "checked_in": engine.pool.checkedin(),
                "checked_out": engine.pool.checkedout(),
                "invalid": engine.pool.invalidated(),
            }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "pool_size": engine.pool.size() if hasattr(engine, 'pool') else None,
        }

# Context manager for database operations
@contextmanager
def get_db_context():
    """Context manager for database operations with proper error handling."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        logger.error(f"Database operation failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

# Connection monitoring utilities
def get_connection_stats():
    """Get detailed connection pool statistics."""
    if hasattr(engine, 'pool'):
        return {
            "pool_size": engine.pool.size(),
            "checked_in": engine.pool.checkedin(),
            "checked_out": engine.pool.checkedout(),
            "overflow": engine.pool.overflow(),
            "invalid": engine.pool.invalidated(),
        }
    return {"error": "Pool not available"}

# Cleanup function
def cleanup_connections():
    """Cleanup and refresh connection pool."""
    try:
        engine.dispose()
        logger.info("Connection pool disposed and refreshed")
        return True
    except Exception as e:
        logger.error(f"Failed to cleanup connections: {e}")
        return False