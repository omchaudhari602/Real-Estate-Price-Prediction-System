from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import time


class SimpleRateLimiter(BaseHTTPMiddleware):
    """Very small in-memory rate limiter per-client IP (suitable for demo only)."""

    def __init__(self, app, calls: int = 60, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.storage = {}

    async def dispatch(self, request: Request, call_next):
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        entry = self.storage.get(ip, {"window_start": now, "count": 0})
        if now - entry["window_start"] > self.period:
            entry = {"window_start": now, "count": 0}
        entry["count"] += 1
        self.storage[ip] = entry
        if entry["count"] > self.calls:
            return Response(status_code=429, content="Rate limit exceeded")
        return await call_next(request)
