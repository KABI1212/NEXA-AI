# backend/app/core/security.py
"""NEXA AI Core Security Utilities.

Handles password hashing via bcrypt and JSON Web Token (JWT) creation/decoding
supporting both RS256 (for staging/production) and HS256 (fallback for local dev).
"""

import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Dict, Any
import jwt
import bcrypt

from app.core.config.settings import settings

logger = logging.getLogger("nexa.security")

# ── Password Cryptography ─────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Generates a secure bcrypt hash from a plain text password string."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Validates a plain text password against its matching bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), 
            hashed_password.encode("utf-8")
        )
    except Exception as e:
        logger.error(f"Password verification failure: {str(e)}")
        return False


# ── JSON Web Token (JWT) Cryptography ──────────────────────────────────

def _load_keys() -> tuple[Optional[str], Optional[str]]:
    """Loads RSA private/public keys from configured file paths if present."""
    private_key, public_key = None, None
    
    if settings.JWT_PRIVATE_KEY_PATH and os.path.exists(settings.JWT_PRIVATE_KEY_PATH):
        try:
            with open(settings.JWT_PRIVATE_KEY_PATH, "r") as f:
                private_key = f.read()
        except Exception as e:
            logger.error(f"Failed to read private key path: {str(e)}")
            
    if settings.JWT_PUBLIC_KEY_PATH and os.path.exists(settings.JWT_PUBLIC_KEY_PATH):
        try:
            with open(settings.JWT_PUBLIC_KEY_PATH, "r") as f:
                public_key = f.read()
        except Exception as e:
            logger.error(f"Failed to read public key path: {str(e)}")
            
    return private_key, public_key


def create_token(
    subject: Union[str, Any], 
    expires_in_seconds: int, 
    token_type: str = "access"
) -> str:
    """Encodes a JWT payload with expiration and token types flags.

    Uses RS256 if certificates are configured on disk, otherwise defaults to HS256.
    """
    now = datetime.now(timezone.utc)
    expire = now + timedelta(seconds=expires_in_seconds)
    
    payload = {
        "sub": str(subject),
        "type": token_type,
        "iat": now,
        "exp": expire
    }

    # Load RS256 key pairs if configured
    private_key, _ = _load_keys()
    
    if private_key:
        algorithm = "RS256"
        secret_or_key = private_key
    else:
        # Fallback to HMAC HS256 for local development
        algorithm = "HS256"
        secret_or_key = settings.SECRET_KEY

    try:
        return jwt.encode(payload, secret_or_key, algorithm=algorithm)
    except Exception as e:
        logger.error(f"Token generation failed: {str(e)}", exc_info=True)
        raise ValueError("Could not encode security token.")


def decode_token(token: str) -> Dict[str, Any]:
    """Decodes a JWT and verifies expiration.

    Raises jwt.PyJWTError if signature is invalid or expired.
    """
    private_key, public_key = _load_keys()
    
    # Try verifying with public key (RS256) first if configured, else default secret key (HS256)
    if public_key:
        secret_or_key = public_key
        algorithms = ["RS256"]
    else:
        secret_or_key = settings.SECRET_KEY
        algorithms = ["HS256"]

    return jwt.decode(token, secret_or_key, algorithms=algorithms)
