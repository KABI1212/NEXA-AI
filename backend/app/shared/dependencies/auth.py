# backend/app/shared/dependencies/auth.py
"""NEXA AI Global Authentication Dependencies.

Provides FastAPI dependency injection hooks to extract and validate JWT tokens
and fetch active user records.
"""

import logging
from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.core.config.settings import settings
from app.core.security import decode_token

logger = logging.getLogger("nexa.auth_deps")

# OAuth2 Password Bearer flow specification
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=True
)


async def get_current_user_token_payload(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Decodes token and extracts payload validation.

    Raises 401 Unauthorized if invalid or expired.
    """
    try:
        payload = decode_token(token)
        subject: str = payload.get("sub")
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token validation failed: Missing subject claim.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
