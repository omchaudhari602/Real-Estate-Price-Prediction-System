from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from schemas.auth import UserCreate, Token, UserOut
from database import get_db
from services.auth_service import create_user, get_user_by_email, verify_password, create_access_token
from datetime import timedelta


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        existing = await get_user_by_email(db, user_in.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user = await create_user(db, user_in.email, user_in.password, full_name=user_in.full_name)
        if not user:
            raise HTTPException(status_code=500, detail="Could not create user")
        return user
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login", response_model=Token)
async def login(form_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    try:
        user = await get_user_by_email(db, form_data.email)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        access_token = create_access_token(subject=user.email, expires_delta=timedelta(minutes=60), role=user.role)
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
