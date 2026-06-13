import pytest
from backend.services import auth_service
from backend.core.config import settings


def test_password_hash_and_verify():
    pwd = 's3cret!'
    hashed = auth_service.get_password_hash(pwd)
    assert auth_service.verify_password(pwd, hashed)
    assert not auth_service.verify_password('wrong', hashed)


def test_jwt_create_and_decode():
    # ensure secret is set for tests
    settings.SECRET_KEY = 'test-secret'
    token = auth_service.create_access_token(subject='user@example.com', role='user')
    payload = auth_service.decode_token(token)
    assert payload is not None
    assert payload.get('sub') == 'user@example.com'
    assert payload.get('role') == 'user'
