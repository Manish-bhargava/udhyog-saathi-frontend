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
      const response = await api.post('/auth/signUp', userData);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      // Map status codes if backend message is generic
      let errorMsg = error.response?.data?.message || error.response?.data?.error || 'Signup failed';
      
      if (status === 409) errorMsg = 'User already exists';
      
      throw { message: errorMsg, status };
    }
  },

  // Login API - UPDATED: Using real token from response
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data?.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      let errorMsg = error.response?.data?.message || error.response?.data?.error || 'Login failed';

      // FRONTEND LOGIC: Override generic messages based on status code
      if (status === 404) errorMsg = 'User does not exist';
      if (status === 401) errorMsg = 'Password is incorrect';
      if (status === 403) errorMsg = 'Email is incorrect';

      throw { message: errorMsg, status };
    }
  },

  // Logout API - NO CHANGES
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('onboardingData');
      
      return response.data;
    } catch (error) {
      // Even if API fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('onboardingData');
      throw error.response?.data || { 
        message: 'Logged out successfully.' 
      };
    }
  },

  // Onboarding API - UPDATED for new response structure
  onboarding: async (onboardingData) => {
    try {
      const { userId, ...cleanData } = onboardingData;
      const response = await api.post('/user/onboarding', cleanData);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Update local user state
      const updatedUser = {
        ...user,
        isOnboarded: true,
        onboarding: true,
        // Store the returned company/bank data if the backend returns it here
        company: response.data?.data?.company || response.data?.data || null,
        BankDetails: response.data?.data?.BankDetails || null
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('onboardingData', JSON.stringify(response.data?.data || cleanData));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Onboarding failed.' };
    }
  },

  // Change Password API - UPDATED request body
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to change password.' 
      };
    }
  },

  // Update Profile API - UPDATED request body
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      
      // Update user in localStorage
      if (response.data?.data) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...currentUser,
          ...response.data.data
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error);
      throw error.response?.data || { 
        message: 'Failed to update profile.' 
      };
    }
  },

  // Bills API - NO CHANGES
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
    // Simplified: check if token exists and isn't the old placeholder
    return !!(token && user && token.length > 30); 
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

  // TEST ENDPOINT - NO CHANGES
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

  // NEW: Get user profile from backend - FIXED endpoint path
  getUserProfile: async () => {
    try {
      console.log('Fetching full user profile from /user/profile...');
      const response = await api.get('/user/profile');
      
      if (response.data?.success && response.data?.data) {
        const backendData = response.data.data;
        
        // Structure the user object to match your app's expectations
        const updatedUser = {
          ...backendData,
          _id: backendData.id || backendData._id, // Support both id formats
          isOnboarded: backendData.isOnboarded || false,
          // Map backend 'bankDetails' to frontend 'BankDetails' if necessary
          BankDetails: backendData.bankDetails || {} 
        };

        // Save to localStorage so other parts of the app (like Sidebar) can see it
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Profile successfully synced from database.');
      }
      
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  },

  // Test onboarding endpoint
  testOnboardingEndpoint: async () => {
    try {
      console.log('Testing onboarding endpoint...');
      
      const response = await api.post('/user/onboarding', {
        companyName: 'Test Company',
        companyEmail: 'test@test.com',
        GST: 'TEST123',
        accountNumber: '1234567890',
        IFSC: 'TEST0001234',
        bankName: 'Test Bank',
        branchName: 'Test Branch'
      });
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