# backend/app/common/exceptions/handlers.py
"""NEXA AI Global Exception Handlers.

Provides standard FastAPI exception mappings returning consistent error payloads.
"""

import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.common.exceptions.base import NexaException

logger = logging.getLogger("nexa.errors")

async def nexa_exception_handler(request: Request, exc: NexaException) -> JSONResponse:
    """Handles all custom NEXA exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handles Pydantic payload validation check failures."""
    details = []
    for error in exc.errors():
        details.append({
            "field": " -> ".join(str(loc) for loc in error["loc"]),
            "issue": error["msg"]
        })
        
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_FAILED",
                "message": "Input validation checks failed.",
                "details": details
            }
        }
    )

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handles all unhandled Python system level exceptions."""
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"Unhandled Exception | ID: {request_id} | Error: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred.",
                "details": str(exc) if request.app.debug else None
            }
        }
    )
