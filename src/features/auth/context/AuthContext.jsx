import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

/**
 * AuthProvider
 * Mirrors the localStorage-based auth pattern already used in App.jsx and
 * DashboardLayout.jsx (token + isNewUser), so PrivateRoute / QuickTour can
 * share the same source of truth as the rest of the app.
 */
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const syncAuthState = () => {
      setToken(localStorage.getItem('token'));
    };

    // Keep in sync with other tabs/windows and with App.jsx's own storage listener
    window.addEventListener('storage', syncAuthState);
    setLoading(false);

    return () => window.removeEventListener('storage', syncAuthState);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  const login = useCallback((newToken, user) => {
    localStorage.setItem('token', newToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    localStorage.setItem('user', JSON.stringify({ ...currentUser, onboarding: true }));
    localStorage.setItem('isNewUser', 'false');
  }, []);

  const value = {
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
