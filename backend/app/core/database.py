# backend/app/core/database.py
"""NEXA AI Database Infrastructure Managers.

Handles active connection pools and client instances for MongoDB (via Motor & Beanie),
Redis (via Redis-py Async), and Qdrant Vector database.
"""

import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from redis.asyncio import Redis
from qdrant_client import AsyncQdrantClient

# ── Beanie / Motor Compatibility Monkeypatch ─────────────────────────
# Prevents a TypeError when Beanie 2.1.0 initializes under motor 3.5+.
# The client descriptors of newer motor releases conflict with Beanie's PyMongo checks.
def _patch_motor_append_metadata():
    try:
        if not hasattr(AsyncIOMotorClient, "append_metadata"):
            AsyncIOMotorClient.append_metadata = lambda self, *args, **kwargs: None
    except Exception:
        pass

_patch_motor_append_metadata()
# ─────────────────────────────────────────────────────────────────────

from app.core.config.settings import settings
from app.modules.system.models import SystemSettings

logger = logging.getLogger("nexa.database")

# ── Global Client Instances ──────────────────────────────────────────
mongo_client: Optional[AsyncIOMotorClient] = None
redis_client: Optional[Redis] = None
qdrant_client: Optional[AsyncQdrantClient] = None


async def init_mongodb() -> None:
    """Initializes the MongoDB connection pool and registers Beanie documents."""
    global mongo_client
    logger.info("Initializing MongoDB Client connection pool...")
    
    try:
        mongo_client = AsyncIOMotorClient(settings.MONGO_URL, serverSelectionTimeoutMS=2000)
        db = mongo_client.get_default_database()
        
        # Trigger connection check
        await mongo_client.server_info()
        
        # Initialize Beanie with our list of active document classes
        await init_beanie(
            database=db,
            document_models=[
                SystemSettings
            ]
        )
        logger.info("MongoDB & Beanie initialization completed successfully.")
    except Exception as e:
        if settings.ENVIRONMENT == "development":
            logger.warning(
                f"MongoDB connection failed: {str(e)}. "
                "Platform is running in fallback mock state for development."
            )
        else:
            logger.error(f"Failed to initialize MongoDB: {str(e)}", exc_info=True)
            raise e


async def init_redis() -> None:
    """Initializes the Redis async connection client."""
    global redis_client
    logger.info("Initializing Redis Cache connection client...")
    
    try:
        redis_client = Redis.from_url(
            settings.REDIS_URL, 
            decode_responses=True,
            socket_timeout=2.0
        )
        await redis_client.ping()
        logger.info("Redis cache client initialization completed successfully.")
    except Exception as e:
        if settings.ENVIRONMENT == "development":
            logger.warning(
                f"Redis connection failed: {str(e)}. "
                "Platform is running in fallback mock state for development."
            )
            redis_client = None
        else:
            logger.error(f"Failed to initialize Redis: {str(e)}", exc_info=True)
            raise e


async def init_qdrant() -> None:
    """Initializes the Qdrant async vector client connection."""
    global qdrant_client
    logger.info("Initializing Qdrant Vector Client connection client...")
    
    try:
        qdrant_client = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            timeout=2.0
        )
        # Attempt simple check
        logger.info("Qdrant vector client initialization completed successfully.")
    except Exception as e:
        logger.warning(f"Could not connect to Qdrant, check network/configs: {str(e)}")
        qdrant_client = None


async def close_connections() -> None:
    """Closes all active database client connection pools gracefully."""
    global mongo_client, redis_client, qdrant_client
    logger.info("Gracefully closing connection pools...")
    
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB connection pool closed.")
        
    if redis_client:
        await redis_client.aclose()
        logger.info("Redis connection closed.")
        
    if qdrant_client:
        await qdrant_client.close()
        logger.info("Qdrant connection closed.")
