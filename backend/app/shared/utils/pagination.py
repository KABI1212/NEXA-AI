# backend/app/shared/utils/pagination.py
"""NEXA AI Shared Kernel: Pagination Helpers.

Provides schema structures and utility wrappers to format paginated lists of data.
"""

from typing import Generic, TypeVar, List
from pydantic import BaseModel, Field

T = TypeVar("T")


class PageParams(BaseModel):
    """Pydantic query params validator for requests mapping paginated pages."""
    
    page: int = Field(default=1, ge=1, description="Page index (1-based).")
    size: int = Field(default=20, ge=1, le=100, description="Items limit limit per page.")

    @property
    def skip(self) -> int:
        """Returns offset count mapping offset skip index."""
        return (self.page - 1) * self.size


class PagedResponse(BaseModel, Generic[T]):
    """Generic payload wrapper returning standardized paginated payloads."""

    items: List[T] = Field(description="List of records for the active page index.")
    total: int = Field(description="Grand total count of active records.")
    page: int = Field(description="Current active page index.")
    size: int = Field(description="Record limit per page index.")
    pages: int = Field(description="Calculated total pages count.")
    has_next: bool = Field(description="Indicates if succeeding records exist.")

    @classmethod
    def create(cls, items: List[T], total: int, params: PageParams) -> "PagedResponse[T]":
        """Factory method compiling paged elements and metadata maps."""
        pages = (total + params.size - 1) // params.size if total > 0 else 0
        has_next = params.page < pages
        
        return cls(
            items=items,
            total=total,
            page=params.page,
            size=params.size,
            pages=pages,
            has_next=has_next
        )
