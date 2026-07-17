import joblib
import json
from pathlib import Path
import pandas as pd
from typing import Any, Dict
import time
from prometheus_client import Histogram


TRACKING_DIR = Path(__file__).resolve().parents[2] / "ml-pipeline" / "tracking"


def _resolve_tracking_dir() -> Path:
    """Resolve the ML tracking directory across local and container layouts."""
    candidates = [
        Path(__file__).resolve().parents[2] / "ml-pipeline" / "tracking",
        Path(__file__).resolve().parents[1] / "ml-pipeline" / "tracking",
        Path.cwd() / "ml-pipeline" / "tracking",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[0]


TRACKING_DIR = _resolve_tracking_dir()


def list_models():
    if not TRACKING_DIR.exists():
        return []
    return [p.name for p in TRACKING_DIR.glob("*.joblib")]


_cached_best_model_name = None
_cached_best_model = None


def load_best_model():
    global _cached_best_model_name, _cached_best_model
    results_path = TRACKING_DIR / "results.json"
    if not results_path.exists():
        # fallback pick first model
        models = list_models()
        if not models:
            raise FileNotFoundError("No trained models found in tracking directory")
        best = models[0]
    else:
        data = json.loads(results_path.read_text())
        best = data.get("best")
        if best is None:
            models = list_models()
            if not models:
                raise FileNotFoundError("No trained models found in tracking directory")
            best = models[0]
        else:
            if not best.endswith(".joblib"):
                best = f"{best}.joblib"
                
    if _cached_best_model_name != best or _cached_best_model is None:
        model_file = TRACKING_DIR / best
        if not model_file.exists():
            # Try without extension if best is not ending with .joblib
            if not best.endswith(".joblib") and (TRACKING_DIR / f"{best}.joblib").exists():
                model_file = TRACKING_DIR / f"{best}.joblib"
            else:
                raise FileNotFoundError(f"Model file {model_file} not found")
        _cached_best_model = joblib.load(model_file)
        _cached_best_model_name = best
        
    return _cached_best_model

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
