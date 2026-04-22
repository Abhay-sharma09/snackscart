from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), index=True, nullable=False) # namkeen, sweets, traditional
    price = Column(Float, nullable=False)
    in_stock = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True) # Optional for now
