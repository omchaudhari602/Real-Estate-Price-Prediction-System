import joblib
import json
from pathlib import Path
import pandas as pd
from typing import Any, Dict
import time
from prometheus_client import Histogram


TRACKING_DIR = Path(__file__).resolve().parents[2] / "ml-pipeline" / "tracking"


def list_models():
    if not TRACKING_DIR.exists():
        return []
    return [p.name for p in TRACKING_DIR.glob("*.joblib")]


def load_best_model():
    results_path = TRACKING_DIR / "results.json"
    if not results_path.exists():
        # fallback pick first model
        models = list_models()
        if not models:
            raise FileNotFoundError("No trained models found in tracking directory")
        return joblib.load(TRACKING_DIR / models[0])
    data = json.loads(results_path.read_text())
    best = data.get("best")
    if best is None:
        return load_best_model()
    model_file = TRACKING_DIR / f"{best}.joblib"
    if not model_file.exists():
        raise FileNotFoundError(f"Model file {model_file} not found")
    return joblib.load(model_file)

def predict(features: Any, model=None):
    if model is None:
        model = load_best_model()
    
    # Simple conversion to DataFrame
    df = pd.DataFrame([features]) if isinstance(features, dict) else features
    
    # Just predict - no hacks needed anymore!
    preds = model.predict(df)
    return float(preds[0])
try:
    PREDICTION_LATENCY = Histogram('prediction_latency_seconds', 'Prediction latency', buckets=(0.001,0.01,0.05,0.1,0.5,1,2,5))
except ValueError:
    # metric already registered (e.g., tests re-importing modules); use a no-op fallback
    PREDICTION_LATENCY = None
