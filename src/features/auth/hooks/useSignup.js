import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        throw { message: 'All fields are required' };
      }

      // Call API with name, email, and password
      const response = await authAPI.signup({
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      
      if (response.status === 200) {
        // Navigate to dashboard after successful signup
        navigate('/dashboard');
        return { success: true, data: response.data };
      } else {
        throw { message: response.message || 'Signup failed' };
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};