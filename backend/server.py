from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from database import engine, Base
import os
import logging
from pathlib import Path

# Import routes
from routes.portfolio import router as portfolio_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create database tables
Base.metadata.create_all(bind=engine)

# Create the main app without a prefix
app = FastAPI(
    title="Portfolio API",
    description="API for Hocine IRATNI's portfolio website",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add basic health check
@api_router.get("/")
async def root():
    return {"message": "Portfolio API is running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "portfolio-api"}

# Include portfolio routes
api_router.include_router(portfolio_router, prefix="/portfolio", tags=["portfolio"])

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Portfolio API starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Portfolio API shutting down...")