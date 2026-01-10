import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add user ID if available (some endpoints might need it)
    if (user?._id) {
      config.headers['User-Id'] = user._id;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Signup API
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signUp', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      
      // Store user data (without password) and token
      if (response.data?.data) {
        const { password, ...userWithoutPassword } = response.data.data;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('token', userWithoutPassword._id); // Using _id as token
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Signup failed. Please try again.' 
      };
    }
  },

  // Login API - Note: Login API only needs email and password (no name)
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      // Store user data (without password) and token
      if (response.data?.data) {
        const { password, ...userWithoutPassword } = response.data.data;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('token', userWithoutPassword._id); // Using _id as token
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Login failed. Please check your credentials.' 
      };
    }
  },

  // Logout API
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error) {
      // Even if API fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data || { 
        message: 'Logged out successfully.' 
      };
    }
  },

  // Onboarding API
  onboarding: async (onboardingData) => {
    try {
      const response = await api.post('/user/onboarding', onboardingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Onboarding failed. Please try again.' 
      };
    }
  },

  // Bills API
  bills: {
    create: async (billData, type = 'pakka') => {
      try {
        const response = await api.post(`/bill/create/${type}`, billData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { 
          message: 'Failed to create bill.' 
        };
      }
    },

    getAll: async (type = 'pakka') => {
      try {
        const response = await api.get(`/bill/all?type=${type}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { 
          message: 'Failed to fetch bills.' 
        };
      }
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authAPI;