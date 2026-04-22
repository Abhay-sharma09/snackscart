from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.db.database import engine
from app.models import user # Make sure to import models to register them
from app.db.database import Base

from app.api.auth import router as auth_router
from app.api.products import router as products_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development; adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(products_router, prefix="/api/products", tags=["products"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Snacks Cart API"}
