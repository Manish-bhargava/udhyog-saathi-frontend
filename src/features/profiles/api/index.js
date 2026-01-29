import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // CRITICAL: If data is FormData, remove Content-Type to let the browser
  // set the boundary (multipart/form-data; boundary=----...)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

export const profileAPI = {
  getProfile: async () => {
    const response = await API.get('/user/profile');
    return response.data;
  },
  updateBusinessInfo: async (formData) => {
    // Ensure the endpoint matches your backend route exactly
    const response = await API.post('/user/onboarding', formData);
    return response.data;
  },

  updatePersonalInfo: async (payload) => {
    const response = await API.put('/auth/update-profile', payload);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await API.put('/auth/change-password', passwordData);
    return response.data;
  }
};