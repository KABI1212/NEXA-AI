# backend/app/modules/system/models.py
"""System Settings Database Model.

Defines site-wide configuration properties stored in MongoDB.
"""

from app.shared.base.document import NexaBaseDocument
from pydantic import Field


class SystemSettings(NexaBaseDocument):
    """Beanie model storing dynamic site configs."""

    site_name: str = Field(
        default="NEXA AI",
        description="Name of the platform site shown in headers."
    )
    maintenance_mode: bool = Field(
        default=False,
        description="Puts the frontend client into a maintenance view mode."
    )

    class Settings:
        name = "system_settings"
        indexes = ["site_name"]
