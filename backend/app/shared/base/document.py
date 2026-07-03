# backend/app/shared/base/document.py
"""NEXA AI Shared Kernel: Base Document Class.

Defines the parent document class that all Beanie collections inherit from,
enforcing unified audit fields, timestamps, optimistic concurrency lock revisions,
and soft delete capabilities.
"""

from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class NexaBaseDocument(Document):
    # ── Timestamps ──────────────────────────────────────────
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Timestamp when the document was initially created."
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Timestamp when the document was last updated."
    )
    
    # ── Audit Fields ────────────────────────────────────────
    created_by: Optional[str] = Field(
        default=None,
        description="Identifies the creator user of this document."
    )
    updated_by: Optional[str] = Field(
        default=None,
        description="Identifies the user who last modified this document."
    )
    
    # ── Soft Delete Fields ──────────────────────────────────
    is_deleted: bool = Field(
        default=False,
        description="Flags the document as logically deleted."
    )
    deleted_at: Optional[datetime] = Field(
        default=None,
        description="Timestamp when logical deletion occurred."
    )

    # ── Concurrency Control ─────────────────────────────────
    revision_id: Optional[str] = Field(
        default=None,
        alias="_rev",
        description="Optimistic lock version string handled by Beanie/MongoDB."
    )

    async def update_timestamp(self) -> None:
        """Hook to be invoked manually or via pre-save events to update timestamps."""
        self.updated_at = datetime.utcnow()

    async def soft_delete(self, deleted_by: Optional[str] = None) -> None:
        """Sets the deletion flags and updates the document database state."""
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()
        self.updated_by = deleted_by
        await self.save()
