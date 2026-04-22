from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.api.deps import get_current_active_user, get_current_active_admin

router = APIRouter()

@router.post("/", response_model=OrderOut)
def create_order(
    *,
    db: Session = Depends(get_db),
    order_in: OrderCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new order.
    """
    total_price = 0.0
    items_to_create = []

    # Calculate total price and verify products
    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        if not product.in_stock:
            raise HTTPException(status_code=400, detail=f"Product with id {item.product_id} is out of stock")
        
        # Calculate item price and add to total
        total_price += product.price * item.quantity
        items_to_create.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "price_at_time": product.price
        })

    # Create the Order
    db_order = Order(
        user_id=current_user.id,
        total_price=total_price,
        status="pending"
    )
    db.add(db_order)
    db.flush() # Flush to get the db_order.id

    # Create OrderItems
    for item_data in items_to_create:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            price_at_time=item_data["price_at_time"]
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/me", response_model=List[OrderOut])
def read_user_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve current user's orders.
    """
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=OrderOut)
def read_order_by_id(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific order by id.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Must be admin or the owner
    if current_user.role != "admin" and order.user_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not enough privileges")

    return order

@router.get("/", response_model=List[OrderOut])
def read_all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
) -> Any:
    """
    Retrieve all orders (Admin only).
    """
    orders = db.query(Order).all()
    return orders

@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
) -> Any:
    """
    Update order status (Admin only).
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Simple validation, you could use an Enum or validate in schema
    valid_statuses = ["pending", "approved", "rejected", "delivered"]
    if status_update.status not in valid_statuses:
         raise HTTPException(status_code=400, detail="Invalid status")

    order.status = status_update.status
    db.commit()
    db.refresh(order)
    return order
