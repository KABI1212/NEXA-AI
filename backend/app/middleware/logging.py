# backend/app/middleware/logging.py
"""Structured Logging Middleware.

Logs HTTP request stats (method, path, status, and duration) in JSON format.
"""

import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("nexa.api")

class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware that logs the details of every incoming request and outgoing response."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start_time = time.perf_counter()
        
        # Get request ID from state (populated by RequestIDMiddleware)
        request_id = getattr(request.state, "request_id", "unknown")
        
        logger.info(f"Started Request | ID: {request_id} | {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            duration = (time.perf_counter() - start_time) * 1000
            
            logger.info(
                f"Finished Request | ID: {request_id} | "
                f"Status: {response.status_code} | Duration: {duration:.2f}ms"
            )
            return response
            
        except Exception as exc:
            duration = (time.perf_counter() - start_time) * 1000
            logger.error(
                f"Failed Request | ID: {request_id} | "
                f"Error: {str(exc)} | Duration: {duration:.2f}ms",
                exc_info=True
            )
            raise exc
