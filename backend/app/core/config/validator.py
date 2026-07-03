# backend/app/core/config/validator.py
"""NEXA AI Configuration & Environment Validator.

Runs validation checks on the settings object to ensure required values
are set and properly formatted before starting the server.
"""

import sys
import logging
from urllib.parse import urlparse
from app.core.config.settings import settings

logger = logging.getLogger("nexa.config")

def validate_environment() -> None:
    """Validates the active environment configurations.

    Raises ValueError if critical requirements are missing or malformed.
    """
    logger.info(f"Validating configuration for environment: {settings.ENVIRONMENT}")
    errors = []

    # 1. Database URL Formatting Checks
    try:
        parsed_mongo = urlparse(settings.MONGO_URL)
        if parsed_mongo.scheme != "mongodb":
            errors.append(f"MONGO_URL must start with 'mongodb' scheme, got: '{parsed_mongo.scheme}'")
    except Exception as e:
        errors.append(f"Invalid MONGO_URL format: {str(e)}")

    try:
        parsed_redis = urlparse(settings.REDIS_URL)
        if parsed_redis.scheme not in ("redis", "rediss"):
            errors.append(f"REDIS_URL must start with 'redis' or 'rediss' scheme, got: '{parsed_redis.scheme}'")
    except Exception as e:
        errors.append(f"Invalid REDIS_URL format: {str(e)}")

    # 2. Production Security Protections Check
    if settings.ENVIRONMENT in ("staging", "production"):
        if settings.SECRET_KEY == "replace-with-a-secure-random-64-character-hex-string":
            errors.append("SECRET_KEY cannot remain at default value in staging or production.")
            
        if not settings.JWT_PRIVATE_KEY_PATH or not settings.JWT_PUBLIC_KEY_PATH:
            errors.append("JWT key file paths must be defined in staging or production.")

        # AI Key checks in production environment profiles
        if not settings.OPENAI_API_KEY and not settings.GEMINI_API_KEY:
            errors.append("At least one primary AI API Key (OpenAI or Gemini) must be configured in production.")

    if errors:
        for error in errors:
            logger.critical(f"Config Validation Error: {error}")
        sys.exit(1)

    logger.info("Configuration validation succeeded.")
