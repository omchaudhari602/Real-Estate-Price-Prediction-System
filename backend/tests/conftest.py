import asyncio
import pytest
from httpx import AsyncClient

import os


@pytest.fixture(scope='session')
def anyio_backend():
    return 'asyncio'


@pytest.fixture
async def async_client():
    # Import app inside fixture to allow environment tweaks prior to import if needed
    from backend.main import app
    async with AsyncClient(app=app, base_url='http://test') as ac:
        yield ac
