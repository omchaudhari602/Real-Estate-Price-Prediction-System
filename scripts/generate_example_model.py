from pathlib import Path
import joblib
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyRegressor

out = Path('ml-pipeline') / 'tracking'
out.mkdir(parents=True, exist_ok=True)
X = np.array([[0.0], [1.0], [2.0]])
y = np.array([0.0, 1.0, 2.0])
pipe = Pipeline([("scaler", StandardScaler()), ("model", DummyRegressor())])
pipe.fit(X, y)
joblib.dump(pipe, out / 'ExampleModel.joblib')
print('wrote', out / 'ExampleModel.joblib')
