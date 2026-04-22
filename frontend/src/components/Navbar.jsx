import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated: isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="navbar glass">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Zap className="logo-icon" size={28} />
            <span className="logo-text gradient-text">SnacksCart</span>
          </Link>

          {/* Links (Desktop) */}
          <div className="navbar-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>
              Menu
            </Link>
            
            {isLoggedIn && !isAdmin && (
               <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
               Dashboard
             </Link>
            )}

            {isLoggedIn && isAdmin && (
               <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
               Admin
             </Link>
            )}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            
            {isLoggedIn ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="icon-btn user-btn">
                  <User size={22} />
                </Link>
                <button onClick={logout} className="icon-btn logout-btn">
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-primary login-btn">
                Sign In
              </Link>
            )}

            
            {/* Mobile Toggle Placeholder */}
            <button className="icon-btn mobile-menu-btn d-none">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
