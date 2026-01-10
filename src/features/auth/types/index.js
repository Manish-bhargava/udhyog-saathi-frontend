// Types for authentication feature
export const AuthFormTypes = Object.freeze({
  LOGIN: 'login',
  SIGNUP: 'signup'
});

// Form data interfaces
export const LoginFormData = {
  email: '',
  password: ''
};

export const SignupFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  phoneNumber: ''
};

// Validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters'
  },
  name: {
    required: true,
    minLength: 2,
    message: 'Name must be at least 2 characters'
  },
  businessName: {
    required: true,
    minLength: 2,
    message: 'Business name is required'
  },
  phoneNumber: {
    required: true,
    pattern: /^[0-9]{10}$/,
    message: 'Please enter a valid 10-digit phone number'
  }
};