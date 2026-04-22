import React, { useState, useEffect } from 'react';
import { getMyOrdersApi } from '../api/apiClient';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrdersApi();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || "Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={18} color="#00f0ff" />;
      case 'rejected': return <XCircle size={18} color="#ff0055" />;
      case 'delivered': return <Package size={18} color="#7000ff" />;
      default: return <Clock size={18} color="#a0a0b0" />;
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
        <h1 className="gradient-text">My Orders</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track and manage your snack orders.</p>
      </div>

      <div className="dashboard-content">
        {isLoading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <div className="glass-card" style={{ padding: '20px', color: 'var(--accent-magenta)' }}>
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Order #{order.id}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                    {getStatusIcon(order.status)}
                    <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{order.status}</span>
                  </div>
                </div>

                <div className="order-items-mini" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                      <span>Snack ID: {item.product_id} x {item.quantity}</span>
                      <span style={{ color: 'var(--text-muted)' }}>₹{item.price_at_time.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontWeight: '600' }}>Total Paid</span>
                   <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>₹{order.total_price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
