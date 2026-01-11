import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Debug logging
    console.log('Request interceptor - User ID:', user._id);
    console.log('Request interceptor - Token present:', !!token);
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set with token:', token.substring(0, 20) + '...');
    }
    
    // Note: Removed User-Id header as backend gets user from req.user (set by auth middleware)
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 401) {
      // Clear local storage on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.response?.status === 404) {
      console.error('Endpoint not found:', error.config.url);
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
        // IMPORTANT: Check if token is in response.data.token or response.data.data.token
        const token = response.data.token || response.data.data?.token || userWithoutPassword._id;
        localStorage.setItem('token', token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Signup failed. Please try again.' 
      };
    }
  },

  // Login API - UPDATED to include name in request body
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        name: credentials.name || '', // Added name field
        email: credentials.email,
        password: credentials.password
      });
      
      // Store user data (without password) and token
      if (response.data?.data) {
        const { password, ...userWithoutPassword } = response.data.data;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        // IMPORTANT: Check if token is in response.data.token or response.data.data.token
        const token = response.data.token || response.data.data?.token || userWithoutPassword._id;
        localStorage.setItem('token', token);
        console.log('Token stored after login:', token);
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

  // Onboarding API - UPDATED with userId in body
  onboarding: async (onboardingData) => {
    try {
      console.log('Sending onboarding data to endpoint:', '/user/onboarding');
      
      // Get user from localStorage to include userId
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Add userId to the request body as fallback for backend
      const dataWithUserId = {
        ...onboardingData,
        userId: user._id // Add userId as fallback
      };
      
      console.log('Data being sent with userId:', dataWithUserId);
      
      const response = await api.post('/user/onboarding', dataWithUserId);
      
      console.log('Onboarding response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Onboarding API error details:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
        data: error.config?.data
      });
      
      throw error.response?.data || { 
        message: 'Onboarding failed. Please try again.' 
      };
    }
  },

  // Change Password API - NEW endpoint
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to change password.' 
      };
    }
  },

  // Update Profile API - NEW endpoint
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to update profile.' 
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
  },

  // TEST ENDPOINT
  testConnection: async () => {
    try {
      const response = await api.get('/auth/test');
      return response.data;
    } catch (error) {
      console.error('Connection test failed:', error);
      return { 
        success: false, 
        message: 'Cannot connect to backend server',
        error: error.message 
      };
    }
  },

  // NEW: Test onboarding endpoint specifically
  testOnboardingEndpoint: async () => {
    try {
      console.log('Testing onboarding endpoint...');
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      console.log('Current user ID:', user._id);
      console.log('Current token:', token);
      
      // Try a simple POST to see if endpoint exists
      const testData = {
        companyName: 'Test Company',
        companyEmail: 'test@test.com',
        GST: 'TEST123',
        userId: user._id
      };
      
      const response = await api.post('/user/onboarding', testData);
      return response.data;
    } catch (error) {
      console.error('Onboarding endpoint test failed:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url
      });
      return { 
        success: false, 
        message: 'Onboarding endpoint not accessible',
        error: error.message,
        status: error.response?.status
      };
    }
  }
};

export default authAPI;