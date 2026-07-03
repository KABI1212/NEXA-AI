# backend/app/middleware/request_id.py
"""Request ID Middleware.

Injects a unique request ID into the headers of each incoming request
and outgoing response to facilitate request tracing in logs.
"""

import uuid
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

class RequestIDMiddleware(BaseHTTPMiddleware):
    """Middleware that attaches a unique X-Request-ID header to requests and responses."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Extract X-Request-ID if provided, otherwise generate one
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        
        # Store in request state for access in other middleware / logs
        request.state.request_id = request_id
        
        response = await call_next(request)
        
        # Attach request ID to response header
        response.headers["X-Request-ID"] = request_id
        return response
