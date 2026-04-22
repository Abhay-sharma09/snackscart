import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Snacks Cart API"
    
    # We will add database URL later during Step 2
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost/snackscart"
    
    class Config:
        env_file = ".env"

settings = Settings()
