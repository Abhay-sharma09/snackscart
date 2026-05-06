from app.db.database import SessionLocal
from app.models.product import Product

def update_specific_images():
    db = SessionLocal()
    
    image_map = {
        "Classic Aloo Bhujia": "/images/aloo_bhujia.png",
        "Spicy Moong Dal": "/images/spicy_moong_dal.png",
        "Kaju Katli": "/images/kaju_katli.png",
        "Gulab Jamun (1kg)": "/images/gulab_jamun.png",
        "Mathri Delight": "/images/mathri.png",
        "Navratan Mixture": "/images/navratan_mixture.png",
        "Rasgulla": "/images/rasgulla.png",
        "Murukku Wheels": "/images/murukku.png",
        "Bakarwadi": "/images/bakarwadi.png",
        "Premium Pistachio Barfi": "/images/pistachio_barfi.png"
    }
    
    for name, url in image_map.items():
        product = db.query(Product).filter(Product.name == name).first()
        if product:
            product.image_url = url
            
    db.commit()
    print("Successfully updated specific images for all products!")
    db.close()

if __name__ == "__main__":
    update_specific_images()
