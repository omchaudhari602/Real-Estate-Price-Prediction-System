from pathlib import Path

from pydantic import AnyHttpUrl

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        APP_NAME: str = "HousePrice API"
        ENV: str = "dev"
        SECRET_KEY: str
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
        DATABASE_URL: str
        MLFLOW_TRACKING_URI: AnyHttpUrl | None = None
        BASE_DIR: Path = Path(__file__).resolve().parents[2]

        model_config = SettingsConfigDict(
            env_file=str(Path(__file__).resolve().parents[2] / ".env")
        )

except ImportError:
    from pydantic import BaseSettings

    class Settings(BaseSettings):
        APP_NAME: str = "HousePrice API"
        ENV: str = "dev"
        SECRET_KEY: str
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
        DATABASE_URL: str
        MLFLOW_TRACKING_URI: AnyHttpUrl | None = None
        BASE_DIR: Path = Path(__file__).resolve().parents[2]

        class Config:
            env_file = str(Path(__file__).resolve().parents[2] / ".env")


settings = Settings()
