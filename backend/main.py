from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.v1 import auth as auth_router
from api.v1 import predict as predict_router
from api.v1 import health as health_router
from api.v1 import metrics as metrics_router
from api.v1 import models as models_router
from middleware.rate_limit import SimpleRateLimiter
from middleware.logging import setup_structured_logging
from middleware.metrics import MetricsMiddleware
from core.config import settings
from database import engine, Base, get_db
# Import database models to register them with Base
import models.user  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    print(f"Database URL: {settings.DATABASE_URL}")
    try:
        print("Creating database tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✓ Database tables created successfully")
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        import traceback
        traceback.print_exc()
    yield
    # Shutdown
    print("Shutting down...")
    await engine.dispose()
    print("✓ Engine disposed")


app = FastAPI(title=settings.APP_NAME, version="0.1.0", lifespan=lifespan)

setup_structured_logging()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# register middleware
app.add_middleware(SimpleRateLimiter, calls=120, period=60)
app.add_middleware(MetricsMiddleware)

# include routers
app.include_router(auth_router.router)
app.include_router(predict_router.router)
app.include_router(health_router.router)
app.include_router(metrics_router.router)
app.include_router(models_router.router)


@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} is running"}


@app.get("/debug/db-test")
async def db_test(db=None):
    """Simple database connectivity test"""
    try:
        from sqlalchemy import text
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            return {"status": "ok", "message": "Database connection successful"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
