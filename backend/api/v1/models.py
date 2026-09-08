from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.predict_service import list_models
from pathlib import Path
import json

router = APIRouter(prefix="/api/v1", tags=["models"])


class ActiveModelRequest(BaseModel):
    model_name: str


@router.get("/models")
async def get_models():
    return {"models": list_models()}


@router.get("/history")
async def get_history():
    # /app/api/v1/models.py -> parents[2] == /app (project root inside container)
    results = Path(__file__).resolve().parents[2] / "ml-pipeline" / "tracking" / "results.json"
    if not results.exists():
        raise HTTPException(status_code=404, detail="No training history found")
    return json.loads(results.read_text())


@router.post("/models/active")
async def set_active_model(req: ActiveModelRequest):
    # /app/api/v1/models.py -> parents[2] == /app (project root inside container)
    results_path = Path(__file__).resolve().parents[2] / "ml-pipeline" / "tracking" / "results.json"
    if not results_path.exists():
        raise HTTPException(status_code=404, detail="No training history found to update")
    
    try:
        data = json.loads(results_path.read_text())
        
        # Verify the model exists on disk
        model_name = req.model_name
        # Strip .joblib if sent
        if model_name.endswith(".joblib"):
            model_name = model_name[:-7]
            
        model_file = results_path.parent / f"{model_name}.joblib"
        if not model_file.exists():
            raise FileNotFoundError()
            
        data["best"] = model_name
        results_path.write_text(json.dumps(data, indent=2))
        return {"status": "success", "active_model": model_name}
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail=f"Model '{req.model_name}' not found on disk")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

