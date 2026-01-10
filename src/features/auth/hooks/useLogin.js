import { useState } from 'react';
import { useAuthForm } from './useAuthForm';
import { validationRules } from '../types';

const validateLogin = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!validationRules.email.pattern.test(value)) return validationRules.email.message;
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < validationRules.password.minLength) return validationRules.password.message;
      return '';
    default:
      return '';
  }
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false); // Add this line

  const form = useAuthForm({
    email: '',
    password: ''
  }, validateLogin);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setAuthError('');
    setLoginSuccess(false);
    
    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock validation
      if (formData.email === 'demo@udhyogsaathi.com' && formData.password === 'password') {
        console.log('Login successful:', formData);
        setLoginSuccess(true);
        // In real app, you would:
        // 1. Set authentication token
        // 2. Redirect to dashboard
        // 3. Update auth state
      } else {
        throw new Error('Invalid credentials. Try demo@udhyogsaathi.com / password');
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...form,
    isLoading,
    authError,
    loginSuccess, // Add this to the return object
    handleLogin: form.handleSubmit(handleLogin)
  };
};