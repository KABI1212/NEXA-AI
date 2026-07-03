# backend/app/shared/base/repository.py
"""NEXA AI Shared Kernel: Base Repository Interface.

Implements the repository pattern to encapsulate data access operations
using Beanie and MongoDB, maintaining separation of concerns and enforcing
default soft delete queries.
"""

from typing import TypeVar, Generic, Type, Optional, List
from beanie import PydanticObjectId
from app.shared.base.document import NexaBaseDocument

DocType = TypeVar("DocType", bound=NexaBaseDocument)


class NexaBaseRepository(Generic[DocType]):
    """Generic MongoDB Repository implementing base CRUD query abstractions."""

    def __init__(self, model_class: Type[DocType]):
        """Initializes the repository with the target Beanie document class."""
        self.model = model_class

    async def get_by_id(self, doc_id: str) -> Optional[DocType]:
        """Retrieves a single active document by its string ID.

        Returns None if not found or logically deleted.
        """
        try:
            obj_id = PydanticObjectId(doc_id)
        except Exception:
            return None

        return await self.model.find_one(
            self.model.id == obj_id,
            self.model.is_deleted == False
        )

    async def list_active(self, skip: int = 0, limit: int = 20) -> List[DocType]:
        """Lists active documents with skip/limit pagination."""
        return await self.model.find(
            self.model.is_deleted == False
        ).skip(skip).limit(limit).to_list()

    async def create(self, document: DocType, created_by: Optional[str] = None) -> DocType:
        """Saves a new document in the database and updates audit fields."""
        document.created_by = created_by
        document.updated_by = created_by
        await document.update_timestamp()
        return await document.insert()

    async def update(self, document: DocType, updated_by: Optional[str] = None) -> DocType:
        """Saves modifications made to an existing document."""
        document.updated_by = updated_by
        await document.update_timestamp()
        return await document.save()

    async def delete(self, doc_id: str, deleted_by: Optional[str] = None) -> bool:
        """Flags a document as logically deleted.

        Returns True if successful, False if the document was not found.
        """
        document = await self.get_by_id(doc_id)
        if not document:
            return False

        await document.soft_delete(deleted_by=deleted_by)
        return True
