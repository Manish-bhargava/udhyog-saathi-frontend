import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
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