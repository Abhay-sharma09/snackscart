import React, { useState, useEffect } from 'react';
import { getAllOrdersApi, updateOrderStatusApi, getProductsApi, updateProductApi } from '../api/apiClient';
import { Check, X, ClipboardList, Package, Edit2, Save } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'inventory'
  const [editingProduct, setEditingProduct] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, productsData] = await Promise.all([
        getAllOrdersApi(),
        getProductsApi()
      ]);
      setOrders(ordersData || []);
      setProducts(productsData || []);
    } catch (err) {
      setError("Failed to fetch data. Ensure you are logged in as Admin.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      // Refresh list
      fetchData();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleStockUpdate = async (productId) => {
    try {
      await updateProductApi(productId, { 
        stock_quantity: parseInt(editStock),
        in_stock: parseInt(editStock) > 0 
      });
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      alert("Failed to update stock: " + err.message);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-header" style={{ marginBottom: '20px' }}>
        <h1 className="gradient-text">Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage orders and product inventory.</p>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          className={`btn-primary ${activeTab === 'orders' ? '' : 'outline'}`} 
          style={activeTab !== 'orders' ? { background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' } : {}}
          onClick={() => setActiveTab('orders')}
        >
          <ClipboardList size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
          Order Management
        </button>
        <button 
          className={`btn-primary ${activeTab === 'inventory' ? '' : 'outline'}`}
          style={activeTab !== 'inventory' ? { background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' } : {}}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
          Inventory Management
        </button>
      </div>

      <div className="dashboard-content">
        {isLoading ? (
          <p>Loading system data...</p>
        ) : error ? (
          <div className="glass-card" style={{ padding: '20px', color: 'var(--accent-magenta)' }}>
            {error}
          </div>
        ) : orders.length === 0 && activeTab === 'orders' ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <ClipboardList size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)' }}>No orders in the system yet.</p>
          </div>
        ) : activeTab === 'orders' ? (
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
                                      order.status === 'approved' ? 'rgba(13, 110, 253, 0.1)' : 
                                      'rgba(220, 53, 69, 0.1)'
                       }}>
                          {order.status}
                       </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                       <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            className="icon-btn" 
                            style={{ color: 'var(--accent-cyan)' }}
                            onClick={() => handleStatusUpdate(order.id, 'approved')}
                            title="Approve Order"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            className="icon-btn" 
                            style={{ color: 'var(--accent-magenta)' }}
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
        ) : (
          <div className="admin-inventory-table glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <tr>
                  <th style={{ padding: '20px' }}>ID</th>
                  <th style={{ padding: '20px' }}>Product</th>
                  <th style={{ padding: '20px' }}>Category</th>
                  <th style={{ padding: '20px' }}>Price</th>
                  <th style={{ padding: '20px' }}>Stock Quantity</th>
                  <th style={{ padding: '20px' }}>Status</th>
                  <th style={{ padding: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '20px' }}>#{product.id}</td>
                    <td style={{ padding: '20px', fontWeight: '500' }}>{product.name}</td>
                    <td style={{ padding: '20px', textTransform: 'capitalize' }}>{product.category}</td>
                    <td style={{ padding: '20px', color: 'var(--text-main)' }}>₹{product.price.toFixed(2)}</td>
                    <td style={{ padding: '20px' }}>
                      {editingProduct === product.id ? (
                        <input 
                          type="number" 
                          value={editStock} 
                          onChange={(e) => setEditStock(e.target.value)}
                          style={{ width: '80px', padding: '8px', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                          min="0"
                        />
                      ) : (
                        <span style={{ fontWeight: '600', color: product.stock_quantity > 0 ? 'var(--text-main)' : 'var(--accent-magenta)' }}>
                          {product.stock_quantity !== undefined ? product.stock_quantity : 10}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '20px' }}>
                       <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: product.stock_quantity > 0 ? 'rgba(13, 110, 253, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                          color: product.stock_quantity > 0 ? 'var(--accent-primary)' : 'var(--accent-magenta)'
                       }}>
                          {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                       </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      {editingProduct === product.id ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="icon-btn" style={{ color: 'var(--accent-primary)' }} onClick={() => handleStockUpdate(product.id)} title="Save Stock">
                            <Save size={20} />
                          </button>
                          <button className="icon-btn" style={{ color: 'var(--text-muted)' }} onClick={() => setEditingProduct(null)} title="Cancel">
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="icon-btn" 
                          style={{ color: 'var(--text-muted)' }}
                          onClick={() => { setEditingProduct(product.id); setEditStock(product.stock_quantity !== undefined ? product.stock_quantity : 10); }}
                          title="Edit Stock"
                        >
                          <Edit2 size={20} />
                        </button>
                      )}
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
