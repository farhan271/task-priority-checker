import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/tasks';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Response interceptor for uniform error shape
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.errors?.[0]?.message ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const taskService = {
  getAll: () => api.get('/'),
  create: (data) => api.post('/', data),
  update: (id, data) => api.put(`/${id}`, data),
  toggle: (id) => api.patch(`/${id}/toggle`),
  delete: (id) => api.delete(`/${id}`),
};
