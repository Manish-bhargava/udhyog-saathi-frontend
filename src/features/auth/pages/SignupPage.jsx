import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import { useAuthForm } from '../hooks/useAuthForm';
import AuthCard from '../components/AuthCard';
import Heading from '../components/Heading';
import Subheading from '../components/Subheading';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Divider from '../components/Divider';
import SocialLoginButton from '../components/SocialLoginButton';
import Logo from '../../../components/Logo';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading, error: apiError } = useSignup();
  
 // Initialize form state with all required fields for signup
  const { formState, errors, handleChange, validateForm } = useAuthForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }, false); // Pass false for isLogin (or omit since default is false)

  const [localError, setLocalError] = useState('');

  useEffect(() => {
    // Clear any previous errors on mount
    setLocalError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Check if passwords match
    if (formState.password !== formState.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    // Prepare data for API - includes name field
    const userData = {
      name: formState.name,
      email: formState.email,
      password: formState.password
    };
    
    const result = await signup(userData);
    
    if (result.success) {
      // Use window.location to ensure complete page reload and state reset
      window.location.href = '/dashboard';
    } else {
      setLocalError(result.error || 'Signup failed');
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard>
        <div className="text-center mb-8">
          <Logo className="mx-auto h-12 w-auto" />
          <Heading>Create your account</Heading>
          <Subheading>Start your free trial today</Subheading>
        </div>

        {(apiError || localError) && (
          <ErrorMessage message={apiError || localError} />
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name field - required for signup */}
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={formState.name || ''}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Enter your full name"
          />
          
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formState.email || ''}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Enter your email"
          />
          
          <PasswordField
            label="Password"
            name="password"
            value={formState.password || ''}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Create a password"
          />
          
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={formState.confirmPassword || ''}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            placeholder="Confirm your password"
          />
          
          <Button 
            type="submit" 
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <Divider>Or continue with</Divider>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <SocialLoginButton 
            provider="google" 
            onClick={() => handleSocialLogin('google')}
          />
          <SocialLoginButton 
            provider="github" 
            onClick={() => handleSocialLogin('github')}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default SignupPage;