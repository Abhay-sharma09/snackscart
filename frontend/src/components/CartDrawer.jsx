import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer glass" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="title-row">
            <ShoppingBag size={24} className="accent-primary" />
            <h2>Your Cart</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '20px' }}
                onClick={() => { onClose(); navigate('/menu'); }}
              >
                Go to Menu
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.product.id} className="cart-item glass-card">
                  <div className="item-info">
                    <h3>{item.product.name}</h3>
                    <p className="item-price">₹{item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Total:</span>
              <span className="total-price">₹{cartTotal.toFixed(2)}</span>
            </div>
            <button 
              className="btn-primary checkout-btn"
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
