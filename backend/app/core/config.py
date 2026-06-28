import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Snacks Cart API"

    # Set via environment variable in production (Render dashboard)
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost/snackscart"

    SECRET_KEY: str = "fallback_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Frontend origin for CORS — set FRONTEND_URL env var in production
    FRONTEND_URL: str = "*"

    class Config:
        env_file = ".env"

settings = Settings()
