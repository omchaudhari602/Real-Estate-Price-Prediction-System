import pytest


@pytest.mark.asyncio
async def test_health_endpoint(async_client):
    r = await async_client.get('/api/v1/health')
    assert r.status_code == 200
    assert 'status' in r.json()


@pytest.mark.asyncio
async def test_predict_endpoint_monkeypatched(async_client, monkeypatch):
    # monkeypatch predict function to avoid model loading
    async def fake_predict(features):
        return 42.0

    from backend import services
    monkeypatch.setattr(services.predict_service, 'predict', lambda features: 42.0)

    r = await async_client.post('/api/v1/predict', json={'features': {'x': 1}})
    assert r.status_code == 200
    assert 'prediction' in r.json()
    assert r.json()['prediction'] == 42.0
