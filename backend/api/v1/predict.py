from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any
from services import predict_service
from starlette.concurrency import run_in_threadpool
import subprocess
from pathlib import Path
import pandas as pd
import numpy as np  # <-- ADD THIS LINE

router = APIRouter(prefix="/api/v1", tags=["predict"])

class PredictRequest(BaseModel):
    features: Dict[str, Any]

@router.post("/predict")
async def predict_endpoint(req: PredictRequest):
    try:
        # DEBUG: Print the incoming keys
        print(f"DEBUG: Incoming keys are: {list(req.features.keys())}")
        
        # Manually create the DataFrame with the exact column names expected by your model
        # REPLACE 'Area', 'Bedrooms', etc. with the EXACT names from your CSV headers
        input_df = pd.DataFrame([req.features])
        
        # If your frontend sends "Area (Sq. Feet)" but your CSV has "Area", 
        # you need to rename them here:
        # input_df = input_df.rename(columns={"Area (Sq. Feet)": "Area", ...})
        
        result = await run_in_threadpool(predict_service.predict, input_df)
        return {"prediction": float(result)}
    except Exception as e:
        print(f"DEBUG: Final Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))