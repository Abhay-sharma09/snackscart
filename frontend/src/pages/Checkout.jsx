import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrderApi } from '../api/apiClient';
import { CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));
      
      await createOrderApi(items);
      setIsSuccess(true);
      clearCart();
      
      // Auto redirect after a few seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to place order. Ensure you are logged in and the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container page-wrapper checkout-success">
        <div className="glass-card success-card">
          <CheckCircle size={64} className="accent-cyan" />
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. You are being redirected to your dashboard to track your order.</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
     return (
        <div className="container page-wrapper empty-checkout">
           <div className="glass-card">
             <ShoppingBag size={48} className="accent-magenta" />
             <h2>Your Cart is empty</h2>
             <button className="btn-primary" onClick={() => navigate('/menu')}>Explore Menu</button>
           </div>
        </div>
     );
  }

  return (
    <div className="container page-wrapper checkout-page">
      <h1 className="gradient-text">Checkout</h1>
      
      <div className="checkout-container">
        <div className="order-summary glass-card">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.product.id} className="order-item">
                <div className="item-main">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-qty">x {item.quantity}</span>
                </div>
                <span className="item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-total">
            <span>Total Amount</span>
            <span className="total-value">₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="payment-options glass-card">
          <h2>Payment Method</h2>
          <div className="mock-payment">
             <div className="payment-method active">
                <span>Direct Order (Simulated)</span>
             </div>
             <p className="payment-note">Note: Real Razorpay integration will be added in Step 10.</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button 
            className="btn-primary confirm-order-btn" 
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
