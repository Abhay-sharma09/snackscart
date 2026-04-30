import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Use a generic placeholder if image is missing, you can adjust this later
  const imageSrc = product.image_url || 'https://via.placeholder.com/400x300/1e1e2d/a0a0b0?text=Snack+Image';

  return (
    <div className="product-card glass-card">
      <div className="product-image-container">
        <img src={imageSrc} alt={product.name} className="product-image" loading="lazy" />
        {/* Badge overlay */}
        <span className="product-category-badge">{product.category}</span>
        {(!product.in_stock || product.stock_quantity <= 0) && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description || 'Delicious traditional snack.'}</p>
        
        <div className="product-bottom-row">
          <span className="product-price">₹{product.price.toFixed(2)}</span>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {(product.stock_quantity > 0 && product.stock_quantity < 5) && (
              <span style={{color: 'var(--accent-magenta)', fontSize: '0.8rem', fontWeight: '600'}}>Only {product.stock_quantity} left!</span>
            )}
            <button 
              className="icon-btn add-to-cart-btn" 
              disabled={!product.in_stock || product.stock_quantity <= 0}
              aria-label="Add to cart"
              title="Add to cart"
              onClick={() => addToCart(product)}
            >
            <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
