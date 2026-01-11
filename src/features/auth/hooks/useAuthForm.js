import { useState } from 'react';

export const useAuthForm = (initialState = {}, isLogin = false) => {
  const [formState, setFormState] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    // Handle both event objects and direct value objects
    let name, value;
    
    if (e && e.target) {
      // It's an event object
      name = e.target.name;
      value = e.target.value;
    } else if (e && e.name) {
      // It's a direct object with name and value
      name = e.name;
      value = e.value;
    } else {
      console.error('Invalid change event:', e);
      return;
    }

    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // For login, only validate email and password
    // For signup, validate all fields
    if (!isLogin) {
      // Name validation - only for signup
      if (!formState.name?.trim()) {
        newErrors.name = 'Name is required';
      } else if (formState.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }
    
    // Email validation - for both login and signup
    if (!formState.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation - for both login and signup
    if (!formState.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation (only for signup)
    if (!isLogin && formState.confirmPassword !== undefined) {
      if (!formState.confirmPassword?.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formState.password !== formState.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    console.log('Validation errors:', newErrors); // Debug log
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormState(initialState);
    setErrors({});
  };

  return {
    formState,
    setFormState,
    errors,
    handleChange,
    validateForm,
    resetForm
  };
};