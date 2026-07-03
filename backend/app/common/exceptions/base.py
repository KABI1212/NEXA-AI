# backend/app/common/exceptions/base.py
"""NEXA AI Common Exception Classes.

Defines the base exceptions that translate cleanly into client-facing
standard error JSON payloads.
"""

from typing import Optional, Any

class NexaException(Exception):
    """Base exception class for all NEXA AI custom errors."""
    def __init__(
        self,
        status_code: int = 500,
        error_code: str = "INTERNAL_SERVER_ERROR",
        message: str = "An unexpected error occurred.",
        details: Optional[Any] = None
    ):
        super().__init__(message)
        self.status_code = status_code
        self.error_code = error_code
        self.message = message
        self.details = details


class AuthenticationError(NexaException):
    """Raised when user credential validation fails."""
    def __init__(self, message: str = "Incorrect email or password.", details: Optional[Any] = None):
        super().__init__(
            status_code=401,
            error_code="UNAUTHORIZED",
            message=message,
            details=details
        )


class ResourceNotFoundError(NexaException):
    """Raised when a queried entity is missing."""
    def __init__(self, resource_name: str, resource_id: str):
        super().__init__(
            status_code=404,
            error_code="RESOURCE_NOT_FOUND",
            message=f"Requested resource '{resource_name}' with ID '{resource_id}' was not found."
        )
