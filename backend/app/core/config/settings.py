# backend/app/core/config/settings.py
"""Central Settings Loader for NEXA AI.

Reads the ENVIRONMENT variable and returns the appropriate settings instance.
"""

import os
from app.core.config.base import NexaBaseSettings
from app.core.config.development import NexaDevelopmentSettings
from app.core.config.testing import NexaTestingSettings
from app.core.config.staging import NexaStagingSettings
from app.core.config.production import NexaProductionSettings

def get_settings() -> NexaBaseSettings:
    """Returns the settings object loaded according to the ENVIRONMENT value."""
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "testing":
        return NexaTestingSettings()
    elif env == "staging":
        return NexaStagingSettings()
    elif env == "production":
        return NexaProductionSettings()
    else:
        return NexaDevelopmentSettings()

# Global settings instance
settings = get_settings()
