from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.db.database import engine
from app.models import user  # Make sure to import models to register them
from app.db.database import Base

from app.api.auth import router as auth_router
from app.api.products import router as products_router
from app.api.orders import router as orders_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs AFTER uvicorn starts (so health check passes first)
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created/verified successfully.")
    except Exception as e:
        print(f"Warning: Could not create tables on startup: {e}")
    yield
    # Shutdown logic (if any) goes here

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

# Build allowed origins list — always include the Vercel production frontend
_allowed_origins = ["https://frontend-steel-one-22.vercel.app"]
if settings.FRONTEND_URL and settings.FRONTEND_URL not in ("*", "https://frontend-steel-one-22.vercel.app"):
    _allowed_origins.append(settings.FRONTEND_URL)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(products_router, prefix="/api/products", tags=["products"])
app.include_router(orders_router, prefix="/api/orders", tags=["orders"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Snacks Cart API"}
