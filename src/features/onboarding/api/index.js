import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Reuse the token from local storage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const onboardingAPI = {
  submit: async (onboardingData) => {
    const response = await API.post('/user/onboarding', onboardingData);
    return response.data;
  }
};