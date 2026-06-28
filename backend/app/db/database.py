from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Strip URL-level SSL params that PyMySQL doesn't support via query string
_db_url = settings.DATABASE_URL.split("?")[0] if "?" in settings.DATABASE_URL else settings.DATABASE_URL

if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
elif "mysql" in settings.DATABASE_URL:
    # Aiven MySQL: enable SSL via connect_args + add timeout so it never hangs
    engine = create_engine(
        _db_url,
        connect_args={"ssl": {}, "connect_timeout": 10},
    )
else:
    engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
