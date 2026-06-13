import pytest
from backend.services import predict_service


class DummyModel:
    def predict(self, df):
        return [123.456]


def test_predict_with_dummy_model(monkeypatch):
    monkeypatch.setattr(predict_service, 'load_best_model', lambda: DummyModel())
    val = predict_service.predict({'a': 1, 'b': 2})
    assert isinstance(val, float)
    assert abs(val - 123.456) < 1e-6
