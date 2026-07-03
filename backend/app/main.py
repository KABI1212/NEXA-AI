# backend/app/main.py
"""NEXA AI FastAPI Main Application Entrypoint.

Initializes middleware, registers routes, sets up global error handling,
and runs database connections lifecycle hooks.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config.settings import settings
from app.core.config.validator import validate_environment
from app.core.database import init_mongodb, init_redis, init_qdrant, close_connections
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.logging import StructuredLoggingMiddleware
from app.api.v1.router import api_router

from app.common.exceptions.base import NexaException
from app.common.exceptions.handlers import (
    nexa_exception_handler,
    validation_exception_handler,
    global_exception_handler
)

# ── Structured Logging Configuration ──────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL, logging.INFO),
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s"}',
)
logger = logging.getLogger("nexa.main")

# ── Application Lifespan Context ─────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Orchestrates database connection pools and indexing validations."""
    logger.info("Initializing system context database loaders...")
    
    # Run environment integrity validator on startup
    validate_environment()
    
    # Init database connection pools
    await init_mongodb()
    await init_redis()
    await init_qdrant()
    
    yield
    
    # Close database connection pools
    await close_connections()

# ── App Instantiation ────────────────────────────────────────────────
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Enterprise AI Career Guidance Platform Backend Services.",
    lifespan=lifespan,
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# ── Register Global Exception Handlers ────────────────────────────────
app.add_exception_handler(NexaException, nexa_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# ── Middleware Chains (Outer to Inner) ───────────────────────────────
# 1. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with explicit whitelist settings in staging/production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. GZip Middleware (Compression)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 3. Trusted Host Middleware (Header checks)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "testserver"]
)

# 4. Custom Request ID Tracing Middleware
app.add_middleware(RequestIDMiddleware)

# 5. Custom Structured Request logging Middleware
app.add_middleware(StructuredLoggingMiddleware)

# ── Register Routes ──────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_STR)

# ── Probe Check Endpoints ───────────────────────────────────────────
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Probes"])
async def health_check():
    """Simple API live health check endpoint."""
    return {"status": "ok", "environment": settings.ENVIRONMENT}

@app.get("/ready", status_code=status.HTTP_200_OK, tags=["Probes"])
async def readiness_check():
    """Verifies backend database connection pools are operational."""
    # Database ping tests will be integrated in step 4
    return {"status": "ready"}

@app.get("/live", status_code=status.HTTP_200_OK, tags=["Probes"])
async def liveness_check():
    """Liveness probe for system metrics orchestrators."""
    return {"status": "live"}
