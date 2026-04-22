from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter()

# --- PUBLIC ROUTES ---

@router.get("/", response_model=List[ProductResponse])
def get_products(
    db: Session = Depends(deps.get_db),
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve all products (with optional category filtering). Publicly accessible.
    """
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int, 
    db: Session = Depends(deps.get_db)
):
    """
    Get a specific product by ID. Publicly accessible.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# --- ADMIN ONLY ROUTES ---

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: ProductCreate,
    current_admin=Depends(deps.get_current_active_admin),
):
    """
    Create new product. Admin Only.
    """
    db_product = Product(**product_in.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    product_in: ProductUpdate,
    current_admin=Depends(deps.get_current_active_admin),
):
    """
    Update a product. Admin Only.
    """
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_admin=Depends(deps.get_current_active_admin),
):
    """
    Delete a product. Admin Only.
    """
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return None
