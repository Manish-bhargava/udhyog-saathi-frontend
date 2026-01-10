import React, { useEffect } from 'react'; // Import useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import AuthCard from '../components/AuthCard';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Divider from '../components/Divider';
import SocialLoginButton from '../components/SocialLoginButton';
import Heading from '../components/Heading';
import Subheading from '../components/Subheading';

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    isLoading,
    authError,
    loginSuccess, // Get loginSuccess from hook
    handleChange,
    handleBlur,
    handleLogin
  } = useLogin();

  // Add useEffect to handle redirect on successful login
  useEffect(() => {
    if (loginSuccess) {
      // You can show a success message here if you want
      // Then redirect after a short delay
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, navigate]);

  const handleDemoLogin = () => {
    handleChange('email', 'demo@udhyogsaathi.com');
    handleChange('password', 'password');
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // In real app, implement OAuth flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to your UdhyogSaathi account"
        footer={
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create an account
            </Link>
          </div>
        }
      >
        {authError && (
          <ErrorMessage type="error">
            {authError}
          </ErrorMessage>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            placeholder="you@business.com"
            value={values.email}
            onChange={(value) => handleChange('email', value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            required
            icon="✉️"
          />

          <div>
            <PasswordField
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChange={(value) => handleChange('password', value)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              touched={touched.password}
              required
            />
            
            <div className="flex justify-end mt-2">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me for 30 days
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Sign In
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            Try Demo Account
          </Button>
        </form>

        <Divider text="Or continue with" />

        <div className="space-y-4">
          <SocialLoginButton 
            provider="google"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          />
          
          <SocialLoginButton 
            provider="linkedin"
            onClick={() => handleSocialLogin('linkedin')}
            disabled={isLoading}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <Heading level="h3" size="sm" className="text-blue-800 mb-2">
            Demo Credentials
          </Heading>
          <Subheading className="text-blue-700 text-sm">
            Use <span className="font-mono font-bold">demo@udhyogsaathi.com</span> with password <span className="font-mono font-bold">password</span> to test the login
          </Subheading>
        </div>
      </AuthCard>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </button>
      </div>
    </div>
  );
};

export default LoginPage;