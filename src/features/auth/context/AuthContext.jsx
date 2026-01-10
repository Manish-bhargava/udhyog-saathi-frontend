import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = authAPI.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);
        return { success: true, data: userData };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      if (response.status === 200) {
        // Auto login after successful signup
        const loginResponse = await authAPI.login({
          email: userData.email,
          password: userData.password
        });
        
        if (loginResponse.status === 200) {
          setUser(loginResponse.data);
        }
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      setUser(null);
      return { success: false, error: error.message };
    }
  };

  const isAuthenticated = () => {
    return authAPI.isAuthenticated();
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};