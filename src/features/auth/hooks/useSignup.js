import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signup: authSignup } = useAuth();

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('All fields are required');
      }

      const result = await authSignup(userData);
      
      if (result.success) {
        return { 
          success: true, 
          data: result.data,
          message: result.message 
        };
      } else {
        throw new Error(result.error || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during signup';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};