from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional
import os

from models.user import User
from database import AsyncSession
from core.config import settings

# Use a portable, pure-Python-friendly hashing scheme for tests and local dev
# pbkdf2_sha256 avoids bcrypt's 72-byte truncation behavior and native C extension
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    q = select(User).where(User.email == email)
    res = await db.execute(q)
    return res.scalars().first()


async def create_user(db: AsyncSession, email: str, password: str, full_name: str = None, role: str = "user"):
    user = User(email=email, hashed_password=get_password_hash(password), full_name=full_name, role=role)
    db.add(user)
    try:
        await db.commit()
        await db.refresh(user)
        return user
    except IntegrityError:
        await db.rollback()
        return None


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None, role: str = "user"):
    to_encode = {"sub": subject, "role": role}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
