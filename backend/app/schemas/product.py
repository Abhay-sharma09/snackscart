from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    price: float
    in_stock: bool = True
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    in_stock: Optional[bool] = None
    image_url: Optional[str] = None

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True
