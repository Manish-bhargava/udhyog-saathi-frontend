import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        throw { message: 'Email and password are required' };
      }

      // Call API with only email and password
      const response = await authAPI.login({
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.status === 200) {
        // Navigate to dashboard
        navigate('/dashboard');
        return { success: true, data: response.data };
      } else {
        throw { message: response.message || 'Login failed' };
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};