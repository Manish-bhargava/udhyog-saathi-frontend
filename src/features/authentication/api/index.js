import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Automatically attach token to every request from LocalStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  // Signup: expects { name, email, password }
  signup: async (userData) => {
    const response = await API.post('/auth/signUp', userData);
    return response.data;
  },

  // Login: expects { name, email, password }
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await API.post('/auth/logout');
    return response.data;
  }
};