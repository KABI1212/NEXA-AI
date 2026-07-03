# backend/app/core/config/testing.py
from app.core.config.base import NexaBaseSettings
from pydantic_settings import SettingsConfigDict


class NexaTestingSettings(NexaBaseSettings):
    """Testing configuration overrides."""
    ENVIRONMENT: str = "testing"
    DEBUG: bool = True
    LOG_LEVEL: str = "WARNING"
    
    # Force mock DB paths
    MONGO_URL: str = "mongodb://localhost:27017/nexa_test"
    REDIS_URL: str = "redis://localhost:6379/1"
    
    # Disable actual emails during tests
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 1025

    model_config = SettingsConfigDict(
        env_file=".env.testing",
        env_file_encoding="utf-8",
        extra="ignore"
    )
