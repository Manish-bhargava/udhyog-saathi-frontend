import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const login = async (credentials) => {
    console.log('useLogin called with:', credentials);
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        console.log('Missing credentials');
        throw { message: 'Email and password are required' };
      }

      console.log('Calling authLogin from AuthContext...');
      
      // Use the AuthContext login function which handles token storage and user state
      const result = await authLogin(credentials);
      
      console.log('AuthContext login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to dashboard');
        // Navigate to dashboard
        navigate('/dashboard');
        return { success: true, data: result.data };
      } else {
        console.log('Login failed with error:', result.error);
        throw { message: result.error || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error caught:', err);
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};