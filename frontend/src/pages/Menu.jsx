import React, { useState, useEffect } from 'react';
import { getProductsApi } from '../api/apiClient';
import ProductCard from '../components/ProductCard';
import { AlertCircle, Loader } from 'lucide-react';
import './Menu.css';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Namkeen', 'Sweets', 'Traditional'];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // If the backend is off, this will gracefully fail and set error
        const data = await getProductsApi(activeCategory);
        setProducts(data || []);
      } catch (err) {
        setError("Could not load products. Please ensure the backend is running.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="container page-wrapper menu-page">
      <div className="menu-header">
        <h1 className="gradient-text">Explore Our Snacks</h1>
        <p className="subtitle">Discover premium tastes delivered to your door.</p>
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-content">
        {isLoading ? (
          <div className="loading-state">
            <Loader className="spinner" size={40} />
            <p>Loading delicious snacks...</p>
          </div>
        ) : error ? (
          <div className="error-state glass">
            <AlertCircle size={32} color="var(--accent-magenta)" />
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state glass">
             <p>No snacks found in this category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
