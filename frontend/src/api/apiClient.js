const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiCall = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    
    // For FormData (e.g. FastAPI OAuth2PasswordRequestForm), don't set Content-Type so the browser sets the boundary correctly
    const isFormData = options.body instanceof URLSearchParams || options.body instanceof FormData;
    
    const headers = {
        ...getAuthHeaders(),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.detail || response.statusText || 'API Call failed');
    }

    return data;
};

// --- Auth Endpoints ---

export const loginApi = async (email, password) => {
    // FastAPI OAuth2 requires x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects 'username' field
    formData.append('password', password);

    return await apiCall('/auth/login', {
        method: 'POST',
        body: formData,
    });
};

export const registerApi = async (email, password) => {
    return await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const getMeApi = async () => {
    return await apiCall('/auth/me', {
        method: 'GET',
    });
};

// --- Product Endpoints ---

export const getProductsApi = async (category = null) => {
    let endpoint = '/products/';
    if (category && category.toLowerCase() !== 'all') {
        endpoint += `?category=${encodeURIComponent(category)}`;
    }
    return await apiCall(endpoint, {
        method: 'GET',
    });
};

export const getProductByIdApi = async (id) => {
    return await apiCall(`/products/${id}`, {
        method: 'GET',
    });
};

export const updateProductApi = async (id, productData) => {
    return await apiCall(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
};

// --- Order Endpoints ---

export const createOrderApi = async (items) => {
    return await apiCall('/orders/', {
        method: 'POST',
        body: JSON.stringify({ items }),
    });
};

export const getMyOrdersApi = async () => {
    return await apiCall('/orders/me', {
        method: 'GET',
    });
};

export const getAllOrdersApi = async () => {
    return await apiCall('/orders/', {
        method: 'GET',
    });
};

export const updateOrderStatusApi = async (orderId, status) => {
    return await apiCall(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
};


