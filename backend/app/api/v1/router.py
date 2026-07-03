# backend/app/api/v1/router.py
"""NEXA AI Global v1 Router.

Imports and registers all feature routers from the modules package.
"""

from fastapi import APIRouter
from app.modules.identity.router import router as auth_router

api_router = APIRouter()

# Register sub-routers
api_router.include_router(auth_router)
