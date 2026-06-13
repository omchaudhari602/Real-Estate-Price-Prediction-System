import os
from pathlib import Path
import joblib
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyRegressor


def ensure_example_model(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    # create a tiny pipeline and save if missing
    if not path.exists():
        X = np.array([[0.0], [1.0], [2.0]])
        y = np.array([0.0, 1.0, 2.0])
        pipe = Pipeline([("scaler", StandardScaler()), ("model", DummyRegressor())])
        pipe.fit(X, y)
        joblib.dump(pipe, path)


def pytest_configure(config):
    # ensure example model exists for local dev/tests
    root = Path(__file__).resolve().parents[2]
    tracking = root / "ml-pipeline" / "tracking"
    ensure_example_model(tracking / "ExampleModel.joblib")
