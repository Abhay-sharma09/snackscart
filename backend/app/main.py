from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.db.database import engine, SessionLocal
from app.models import user  # Make sure to import models to register them
from app.db.database import Base
from app.models.product import Product

from app.api.auth import router as auth_router
from app.api.products import router as products_router
from app.api.orders import router as orders_router

# --- Seed data ---
SNACKS = [
    {"name": "Classic Aloo Bhujia", "description": "Crispy, golden potato strands seasoned with traditional Indian spices. Perfect with your evening tea.", "category": "Namkeen", "price": 120.0, "in_stock": True, "stock_quantity": 50, "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6a3?q=80&w=600&auto=format&fit=crop"},
    {"name": "Spicy Moong Dal", "description": "Premium split yellow lentils deep-fried to a crunch and tossed in fiery chili powder.", "category": "Namkeen", "price": 95.0, "in_stock": True, "stock_quantity": 50, "image_url": "https://images.unsplash.com/photo-1589131640167-24aadc8c67fb?q=80&w=600&auto=format&fit=crop"},
    {"name": "Kaju Katli", "description": "Diamond-shaped cashew fudge, elegantly garnished with edible silver foil (vark).", "category": "Sweets", "price": 850.0, "in_stock": True, "stock_quantity": 30, "image_url": "https://images.unsplash.com/photo-1541781297597-28d8b3986ec3?q=80&w=600&auto=format&fit=crop"},
    {"name": "Gulab Jamun (1kg)", "description": "Soft milk-solid dumplings soaked in a warm, fragrant rose and cardamom syrup.", "category": "Sweets", "price": 450.0, "in_stock": True, "stock_quantity": 40, "image_url": "https://images.unsplash.com/photo-1621683416439-d3bd13af87c7?q=80&w=600&auto=format&fit=crop"},
    {"name": "Mathri Delight", "description": "Flaky, savory crackers spiced with ajwain and black pepper. A North Indian staple.", "category": "Traditional", "price": 150.0, "in_stock": True, "stock_quantity": 60, "image_url": "https://images.unsplash.com/photo-1596660636848-038cbe2f845d?q=80&w=600&auto=format&fit=crop"},
    {"name": "Navratan Mixture", "description": "A brilliant blend of nine premium ingredients including nuts, lentils, and crispy sev.", "category": "Namkeen", "price": 220.0, "in_stock": True, "stock_quantity": 45, "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop"},
    {"name": "Rasgulla", "description": "Spongy, white cottage cheese balls swimming in a light, sweet sugar syrup.", "category": "Sweets", "price": 350.0, "in_stock": True, "stock_quantity": 35, "image_url": "https://images.unsplash.com/photo-1588673752528-eb5d4ccf8f6b?q=80&w=600&auto=format&fit=crop"},
    {"name": "Murukku Wheels", "description": "Crunchy, twisted spirals made from rice flour and cumin seeds, freshly fried.", "category": "Traditional", "price": 110.0, "in_stock": True, "stock_quantity": 55, "image_url": "https://images.unsplash.com/photo-1600869389279-b1d55e975d04?q=80&w=600&auto=format&fit=crop"},
    {"name": "Bakarwadi", "description": "Spicy, sweet, and tangy rolled western Indian snack with a crunchy exterior.", "category": "Traditional", "price": 180.0, "in_stock": True, "stock_quantity": 40, "image_url": "https://images.unsplash.com/photo-1605338144214-dddc36b41d24?q=80&w=600&auto=format&fit=crop"},
    {"name": "Premium Pistachio Barfi", "description": "Rich milk fudge blended with pure crushed pistachios and saffron.", "category": "Sweets", "price": 950.0, "in_stock": True, "stock_quantity": 25, "image_url": "https://images.unsplash.com/photo-1601050690117-94f5f6af1258?q=80&w=600&auto=format&fit=crop"},
]

def seed_products():
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            print("Seeding products into the database...")
            for item in SNACKS:
                db.add(Product(**item))
            db.commit()
            print(f"Seeded {len(SNACKS)} products successfully.")
        else:
            print("Products already exist, skipping seed.")
    except Exception as e:
        print(f"Warning: Could not seed products: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs AFTER uvicorn starts (so health check passes first)
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created/verified successfully.")
        seed_products()
    except Exception as e:
        print(f"Warning: Could not initialize database on startup: {e}")
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
