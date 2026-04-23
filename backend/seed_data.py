import json
import random
from app.db.database import SessionLocal
from app.models.product import Product

snacks = [
    {
        "name": "Classic Aloo Bhujia",
        "description": "Crispy, golden potato strands seasoned with traditional Indian spices. Perfect with your evening tea.",
        "category": "Namkeen",
        "price": 120.0,
        "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6a3?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Spicy Moong Dal",
        "description": "Premium split yellow lentils deep-fried to a crunch and tossed in fiery chili powder.",
        "category": "Namkeen",
        "price": 95.0,
        "image_url": "https://images.unsplash.com/photo-1589131640167-24aadc8c67fb?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Kaju Katli",
        "description": "Diamond-shaped cashew fudge, elegantly garnished with edible silver foil (vark).",
        "category": "Sweets",
        "price": 850.0,
        "image_url": "https://images.unsplash.com/photo-1541781297597-28d8b3986ec3?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Gulab Jamun (1kg)",
        "description": "Soft milk-solid dumplings soaked in a warm, fragrant rose and cardamom syrup.",
        "category": "Sweets",
        "price": 450.0,
        "image_url": "https://images.unsplash.com/photo-1621683416439-d3bd13af87c7?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Mathri Delight",
        "description": "Flaky, savory crackers spiced with ajwain and black pepper. A North Indian staple.",
        "category": "Traditional",
        "price": 150.0,
        "image_url": "https://images.unsplash.com/photo-1596660636848-038cbe2f845d?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Navratan Mixture",
        "description": "A brilliant blend of nine premium ingredients including nuts, lentils, and crispy sev.",
        "category": "Namkeen",
        "price": 220.0,
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Rasgulla",
        "description": "Spongy, white cottage cheese balls swimming in a light, sweet sugar syrup.",
        "category": "Sweets",
        "price": 350.0,
        "image_url": "https://images.unsplash.com/photo-1588673752528-eb5d4ccf8f6b?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Murukku Wheels",
        "description": "Crunchy, twisted spirals made from rice flour and cumin seeds, freshly fried.",
        "category": "Traditional",
        "price": 110.0,
        "image_url": "https://images.unsplash.com/photo-1600869389279-b1d55e975d04?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Bakarwadi",
        "description": "Spicy, sweet, and tangy rolled western Indian snack with a crunchy exterior.",
        "category": "Traditional",
        "price": 180.0,
        "image_url": "https://images.unsplash.com/photo-1605338144214-dddc36b41d24?q=80&w=600&auto=format&fit=crop"
    },
    {
        "name": "Premium Pistachio Barfi",
        "description": "Rich milk fudge blended with pure crushed pistachios and saffron.",
        "category": "Sweets",
        "price": 950.0,
        "image_url": "https://images.unsplash.com/photo-1601050690117-94f5f6af1258?q=80&w=600&auto=format&fit=crop"
    }
]

def seed_db():
    db = SessionLocal()
    existing_count = db.query(Product).count()
    if existing_count > 0:
        print(f"Database already contains {existing_count} products. Skipping seeding.")
        return

    print("Adding 10 delicious snacks to the database...")
    for item in snacks:
        db_product = Product(
            name=item["name"],
            description=item["description"],
            category=item["category"],
            price=item["price"],
            image_url=item["image_url"],
            in_stock=True
        )
        db.add(db_product)
    
    db.commit()
    print("Seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_db()
