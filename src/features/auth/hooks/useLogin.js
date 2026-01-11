import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (credentials) => {
    console.log('useLogin called with:', credentials); // Debug log
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        console.log('Missing credentials'); // Debug log
        throw { message: 'Email and password are required' };
      }

      console.log('Calling authAPI.login...'); // Debug log
      // Call API with only email and password
      const response = await authAPI.login({
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('API Response:', response); // Debug log
      
      if (response.status === 200 || response.success) {
        console.log('Login successful, navigating to dashboard'); // Debug log
        // Navigate to dashboard
        navigate('/dashboard');
        return { success: true, data: response.data || response };
      } else {
        console.log('Login failed with response:', response); // Debug log
        throw { message: response.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error caught:', err); // Debug log
      setError(err.message || 'An error occurred during login');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};