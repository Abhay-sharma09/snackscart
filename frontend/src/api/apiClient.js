const BASE_URL = 'http://localhost:8000/api';

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
