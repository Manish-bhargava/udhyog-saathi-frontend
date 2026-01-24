import axios from 'axios';

// 1. Define the instance
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// 2. Add the interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 3. Export the profile methods
export const profileAPI = {
  getProfile: async () => {
    const response = await API.get('/user/profile');
    return response.data;
  },

  // Use the Onboarding API for Business/Bank info
  updateBusinessInfo: async (payload) => {
    const response = await API.post('/user/onboarding', payload);
    return response.data;
  },

  // Use Update Profile API for Personal info
  updatePersonalInfo: async (payload) => {
    const response = await API.put('/auth/update-profile', payload);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await API.put('/auth/change-password', passwordData);
    return response.data;
  }
};