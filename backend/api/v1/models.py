from fastapi import APIRouter, HTTPException
from services.predict_service import list_models
from pathlib import Path
import json

router = APIRouter(prefix="/api/v1", tags=["models"])


@router.get("/models")
async def get_models():
    return {"models": list_models()}


@router.get("/history")
async def get_history():
    results = Path(__file__).resolve().parents[2] / "ml-pipeline" / "tracking" / "results.json"
    if not results.exists():
        raise HTTPException(status_code=404, detail="No training history found")
    return json.loads(results.read_text())
