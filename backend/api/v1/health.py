from fastapi import APIRouter
from core.config import settings
from database import engine

router = APIRouter(prefix="/api/v1", tags=["health"])


@router.get("/health")
async def health():
    # lightweight health check
    return {"status": "ok", "app": settings.APP_NAME}
