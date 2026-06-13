from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

DATABASE_URL = settings.DATABASE_URL

# support both sync and async URL; prefer asyncpg for postgres, or use sqlite
if DATABASE_URL.startswith("postgresql://"):
    async_url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("sqlite://"):
    # For SQLite, use aiosqlite with proper path handling
    # sqlite:///relative/path.db -> sqlite+aiosqlite:///relative/path.db
    # sqlite:////absolute/path.db -> sqlite+aiosqlite:////absolute/path.db
    async_url = DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://", 1)
else:
    async_url = DATABASE_URL

engine = create_async_engine(async_url, future=True, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
