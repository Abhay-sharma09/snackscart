import React, { useState, useEffect } from 'react';
import { getAllOrdersApi, updateOrderStatusApi } from '../api/apiClient';
import { Check, X, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const data = await getAllOrdersApi();
      setOrders(data || []);
    } catch (err) {
      setError("Failed to fetch all orders. Ensure you are logged in as Admin.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      // Refresh list
      fetchAllOrders();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
        <h1 className="gradient-text">Admin Order Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review and process customer orders.</p>
      </div>

      <div className="dashboard-content">
        {isLoading ? (
          <p>Loading system orders...</p>
        ) : error ? (
          <div className="glass-card" style={{ padding: '20px', color: 'var(--accent-magenta)' }}>
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <ClipboardList size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)' }}>No orders in the system yet.</p>
          </div>
        ) : (
          <div className="admin-orders-table glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <tr>
                  <th style={{ padding: '20px' }}>Order ID</th>
                  <th style={{ padding: '20px' }}>User ID</th>
                  <th style={{ padding: '20px' }}>Date</th>
                  <th style={{ padding: '20px' }}>Total</th>
                  <th style={{ padding: '20px' }}>Status</th>
                  <th style={{ padding: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '20px' }}>#{order.id}</td>
                    <td style={{ padding: '20px' }}>User_{order.user_id}</td>
                    <td style={{ padding: '20px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '20px', color: 'var(--accent-cyan)', fontWeight: '600' }}>₹{order.total_price.toFixed(2)}</td>
                    <td style={{ padding: '20px' }}>
                       <span className={`status-tag ${order.status}`} style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          background: order.status === 'pending' ? 'rgba(160,160,176,0.1)' : 
                                      order.status === 'approved' ? 'rgba(0,240,255,0.1)' : 
                                      'rgba(255,0,85,0.1)'
                       }}>
                          {order.status}
                       </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                       <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            className="icon-btn" 
                            style={{ color: '#00f0ff' }}
                            onClick={() => handleStatusUpdate(order.id, 'approved')}
                            title="Approve Order"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            className="icon-btn" 
                            style={{ color: '#ff0055' }}
                            onClick={() => handleStatusUpdate(order.id, 'rejected')}
                            title="Reject Order"
                          >
                            <X size={20} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
