from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

db_url = settings.DATABASE_URL

# Resolve postgres:// -> postgresql:// for SQLAlchemy 2.0+
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Resolve mysql:// -> mysql+pymysql:// for PyMySQL
if db_url.startswith("mysql://"):
    db_url = db_url.replace("mysql://", "mysql+pymysql://", 1)

# Strip URL-level SSL params that PyMySQL doesn't support via query string
_db_url = db_url.split("?")[0] if "?" in db_url else db_url

if db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
elif "mysql" in db_url:
    # Aiven MySQL: enable SSL via connect_args + add timeout so it never hangs
    engine = create_engine(
        _db_url,
        connect_args={"ssl": {}, "connect_timeout": 10},
    )
else:
    engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
