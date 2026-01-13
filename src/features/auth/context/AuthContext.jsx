import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../api/index.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state
  const initAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = authAPI.getCurrentUser();
      
      if (token && storedUser) {
        console.log('Auth initialized with user:', storedUser);
        setUser(storedUser);
      } else {
        console.log('No valid auth found during initialization');
        setUser(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('onboardingData');
      setUser(null);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials) => {
    try {
      console.log('AuthContext.login called with credentials:', { email: credentials.email });
      
      // Call API directly to get response
      const response = await authAPI.login(credentials);
      
      console.log('AuthContext.login API response:', {
        status: response.status,
        hasData: !!response.data,
        message: response.message
      });
      
      if (response?.status === 200 || response?.message?.includes('successfully')) {
        // Get fresh user data from localStorage (set by authAPI.login)
        const userData = authAPI.getCurrentUser();
        
        if (!userData) {
          console.error('User data not found in localStorage after login');
          throw new Error('Failed to retrieve user data after login');
        }
        
        console.log('Setting user state with:', userData);
        setUser(userData);
        
        // Double-check token is stored (placeholder token)
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage after login');
          throw new Error('Authentication token missing');
        }
        
        console.log('Login successful, user stored:', userData);
        
        return { success: true, data: userData };
      }
      
      console.error('Login API response indicates failure:', response);
      return { success: false, error: response?.message || 'Login failed' };
      
    } catch (error) {
      console.error('AuthContext login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      if (response?.status === 200 || response?.message?.includes('successfully')) {
        // Signup successful but user needs to login
        // Return success but don't set user state (no token yet)
        return { 
          success: true, 
          message: response.message || 'Signup successful. Please login.',
          data: response.data 
        };
      }
      return { success: false, error: response?.message || 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error?.message || 'Signup failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state and storage
      setUser(null);
      setIsInitialized(false);
      
      // Clear all localStorage data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('onboardingData');
      
      // Clear any auth-related data
      const authKeys = Object.keys(localStorage).filter(key => 
        key.includes('auth') || key.includes('token') || key.includes('user') || key.includes('onboarding')
      );
      authKeys.forEach(key => localStorage.removeItem(key));
      
      // Force navigation to login
      window.location.href = '/login';
    }
  };

  // Function to update user information
  const updateUser = useCallback((updatedUserData) => {
    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Merge with updated data
      const newUser = {
        ...currentUser,
        ...updatedUserData
      };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Update state
      setUser(newUser);
      
      console.log('User updated successfully:', newUser);
      return { success: true, data: newUser };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  }, []);

  // Function to refresh user from localStorage
  const refreshUser = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = authAPI.getCurrentUser();
      
      if (token && storedUser) {
        setUser(storedUser);
        return { success: true, data: storedUser };
      }
      
      console.warn('No valid token or user found during refresh');
      return { success: false, error: 'No authenticated user found' };
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token');
    const userExists = !!user;
    
    console.log('isAuthenticated check:', {
      hasToken: !!token,
      hasUserState: userExists,
      user: user
    });
    
    return !!(token && user);
  }, [user]);

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated,
    loading,
    isInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};