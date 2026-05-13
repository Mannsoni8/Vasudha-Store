import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('vasudha_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vasudha_token');
      localStorage.removeItem('vasudha_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────
export const authAPI = {
  register:     (data) => API.post('/auth/register', data),
  login:        (data) => API.post('/auth/login', data),
  googleAuth:   (data) => API.post('/auth/google', data),   // Google OAuth
  getProfile:   ()     => API.get('/auth/profile'),
  updateProfile:(data) => API.put('/auth/profile', data),
  getAllUsers:   ()     => API.get('/auth/users'),
};

// ── Products ──────────────────────────────────────
export const productAPI = {
  getAll:    (params)      => API.get('/products', { params }),
  getOne:    (id)          => API.get(`/products/${id}`),
  create:    (data)        => API.post('/products', data),
  update:    (id, data)    => API.put(`/products/${id}`, data),
  delete:    (id)          => API.delete(`/products/${id}`),
  addReview: (id, data)    => API.post(`/products/${id}/reviews`, data),
};

// ── Cart ──────────────────────────────────────────
export const cartAPI = {
  get:    ()            => API.get('/cart'),
  add:    (data)        => API.post('/cart', data),
  update: (itemId, qty) => API.put(`/cart/${itemId}`, { quantity: qty }),
  remove: (itemId)      => API.delete(`/cart/${itemId}`),
  clear:  ()            => API.delete('/cart/clear'),
};

// ── Orders ────────────────────────────────────────
export const orderAPI = {
  create:       (data)         => API.post('/orders', data),
  getMy:        ()             => API.get('/orders/my'),
  getOne:       (id)           => API.get(`/orders/${id}`),
  getAll:       (params)       => API.get('/orders', { params }),
  updateStatus: (id, status)   => API.put(`/orders/${id}/status`, { orderStatus: status }),
};

// ── Upload ────────────────────────────────────────
export const uploadAPI = {
  image: (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default API;
