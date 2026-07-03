# backend/tests/conftest.py
"""NEXA AI Testing Infrastructure: Pytest Configuration.

Sets up standard fixtures including async event loop runners, MongoDB test connection
initializations, and async test client instances.
"""

import sys
import os
from typing import AsyncGenerator
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import monkeypatch to prevent dynamic descriptors type errors
import app.core.database  # Matches patch triggers

from app.core.config.settings import settings
from app.modules.system.models import SystemSettings
from app.main import app


@pytest_asyncio.fixture(scope="session", autouse=True)
async def init_test_db() -> AsyncGenerator[None, None]:
    """Bootstraps a dedicated MongoDB test database for the testing session."""
    test_mongo_url = "mongodb://localhost:27017/nexa_test"
    
    # Enforce test variables
    settings.MONGO_URL = test_mongo_url
    settings.ENVIRONMENT = "testing"
    
    try:
        client = AsyncIOMotorClient(test_mongo_url, serverSelectionTimeoutMS=2000)
        db = client.get_default_database()
        
        # Verify connection
        await client.server_info()
        
        await init_beanie(
            database=db,
            document_models=[
                SystemSettings
            ]
        )
    except Exception as e:
        print(f"\n[WARNING] Local MongoDB offline during tests initialization: {str(e)}")
        
    yield
    
    # Clean up test DB after run
    try:
        client = AsyncIOMotorClient(test_mongo_url)
        await client.drop_database("nexa_test")
        client.close()
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """Generates an HTTPX AsyncClient hitting the FastAPI app instance."""
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport,
        base_url="http://testserver",
        headers={"Content-Type": "application/json"}
    ) as ac:
        yield ac
