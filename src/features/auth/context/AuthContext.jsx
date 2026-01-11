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
  const navigate = useNavigate();

  // Initialize auth state
  const initAuth = useCallback(() => {
    try {
      const storedUser = authAPI.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response?.data || response?.status === 'success') {
        const userData = authAPI.getCurrentUser();
        setUser(userData);
        return { success: true, data: userData };
      }
      return { success: false, error: response?.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      if (response?.data || response?.status === 'success') {
        const userData = authAPI.getCurrentUser();
        setUser(userData);
        return { success: true, data: response.data || response };
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
      setUser(null);
      // Use window.location instead of navigate to ensure complete cleanup
      window.location.href = '/login';
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return { success: false, error: error.message };
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
      const storedUser = authAPI.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        return { success: true, data: storedUser };
      }
      return { success: false, error: 'No user found' };
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return authAPI.isAuthenticated();
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,  // Added
    refreshUser, // Added
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};