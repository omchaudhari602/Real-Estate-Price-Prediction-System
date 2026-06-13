import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from prometheus_client import Counter, Histogram

# HTTP metrics
REQUEST_COUNT = Counter(
    'app_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'http_status']
)
REQUEST_LATENCY = Histogram('app_request_latency_seconds', 'Request latency', ['method', 'endpoint'])
REQUEST_ERRORS = Counter('app_requests_failed_total', 'Failed HTTP requests')

class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method
        start = time.time()
        response = None
        try:
            response = await call_next(request)
            status = response.status_code
        except Exception:
            REQUEST_ERRORS.inc()
            raise
        finally:
            elapsed = time.time() - start
            REQUEST_LATENCY.labels(method=method, endpoint=path).observe(elapsed)
            REQUEST_COUNT.labels(method=method, endpoint=path, http_status=str(getattr(response, 'status_code', 500))).inc()
        return response
