import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
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
import { useNotifications } from '../../dashboard/context/NotificationContext';
import MessageAlert from '../../profile/components/Common/MessageAlert';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error: apiError } = useLogin();
  
  // Initialize notification context
  const { addNotification, notifications, removeNotification } = useNotifications();

  const { formState, errors, handleChange, validateForm } = useAuthForm({
    email: '',
    password: ''
  }, true);

  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!validateForm()) return;

    const result = await login(formState);

    if (result.success) {
      addNotification('Login successful!', 'success');
      navigate('/dashboard');
    } else {
      // This comes from the 'throw' in index.js via AuthContext
      const msg = result.error; 
      setLocalError(msg);

      // Specific Redirect: "User does not exist" -> Signup
      if (msg === 'User does not exist') {
        addNotification('No account found. Redirecting to Signup...', 'error');
        setTimeout(() => navigate('/signup'), 3000);
      }
    }
  };

  return (
    <div className="relative">
    {/* 1. Global Toasts */}
    {notifications.map(note => (
      <MessageAlert key={note.id} message={note} onClose={() => removeNotification(note.id)} />
    ))}

      <AuthCard>
        <div className="text-center mb-8">
          <Logo className="mx-auto h-12 w-auto" />
          <Heading>Welcome back</Heading>
          <Subheading>Sign in to your account</Subheading>
        </div>

        {/* 4. Corrected ErrorMessage implementation using children */}
        {(apiError || localError) && (
          <ErrorMessage type="error">
            {localError || apiError}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* No name field for login */}
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
            placeholder="Enter your password"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            fullWidth
          >
            {loading ? 'Signing in...' : 'Sign in'}
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
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;