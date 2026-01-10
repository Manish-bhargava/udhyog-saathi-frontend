import { useState } from 'react';
import { useAuthForm } from './useAuthForm';
import { validationRules } from '../types';

const validateSignup = (field, value, allValues = {}) => {
  switch (field) {
    case 'name':
      if (!value) return 'Full name is required';
      if (value.length < validationRules.name.minLength) return validationRules.name.message;
      return '';
    case 'email':
      if (!value) return 'Email is required';
      if (!validationRules.email.pattern.test(value)) return validationRules.email.message;
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < validationRules.password.minLength) return validationRules.password.message;
      return '';
    case 'confirmPassword':
      if (!value) return 'Please confirm your password';
      if (value !== allValues.password) return 'Passwords do not match';
      return '';
    case 'businessName':
      if (!value) return 'Business name is required';
      return '';
    case 'phoneNumber':
      if (!value) return 'Phone number is required';
      if (!validationRules.phoneNumber.pattern.test(value)) return validationRules.phoneNumber.message;
      return '';
    default:
      return '';
  }
};

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false); // Add this

  const form = useAuthForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phoneNumber: ''
  }, (field, value) => validateSignup(field, value, form.values));

  const handleSignup = async (formData) => {
    setIsLoading(true);
    setAuthError('');
    setSuccessMessage('');
    setSignupSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Mock successful registration
      console.log('Registration successful:', formData);
      setSuccessMessage(`Welcome ${formData.name}! Your account has been created successfully.`);
      setSignupSuccess(true);
      
      // In real app, you would:
      // 1. Send data to backend
      // 2. Auto-login or redirect to login
      // 3. Send verification email
    } catch (error) {
      setAuthError('Registration failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...form,
    isLoading,
    authError,
    successMessage,
    signupSuccess, // Add this
    handleSignup: form.handleSubmit(handleSignup)
  };
};