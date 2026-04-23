from app.db.database import SessionLocal
from app.models.product import Product

def update_images():
    db = SessionLocal()
    products = db.query(Product).all()
    
    for product in products:
        if product.category.lower() == 'namkeen':
            product.image_url = '/images/namkeen.png'
        elif product.category.lower() == 'sweets':
            product.image_url = '/images/sweets.png'
        elif product.category.lower() == 'traditional':
            product.image_url = '/images/traditional.png'
            
    db.commit()
    print("Successfully mapped generated local images to all products in the database!")
    db.close()

if __name__ == "__main__":
    update_images()
