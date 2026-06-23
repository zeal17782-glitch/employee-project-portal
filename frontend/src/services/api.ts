import axios from 'axios';

const API_URL = 'https://employee-project-portal-production.up.railway.app/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),
};

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id: number) => api.get(`/employees/${id}`),
  create: (data: FormData) => api.post('/employees', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, data: FormData) => api.put(`/employees/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => api.delete(`/employees/${id}`),
};

export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (data: object) => api.post('/projects', data),
  update: (id: number, data: object) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  assignEmployee: (projectId: number, employeeId: number) =>
    api.post(`/projects/${projectId}/assign`, { employee_id: employeeId }),
  removeEmployee: (projectId: number, employeeId: number) =>
    api.delete(`/projects/${projectId}/remove/${employeeId}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export default api;