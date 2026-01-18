import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import AuthCard from '../../auth/components/AuthCard';
import Heading from '../../auth/components/Heading';
import Subheading from '../../auth/components/Subheading';
import InputField from '../../auth/components/InputField';
import PasswordField from '../../auth/components/PasswordField';
import Button from '../../auth/components/Button';
import ErrorMessage from '../../auth/components/ErrorMessage';
import Divider from '../../auth/components/Divider';
import SocialLoginButton from '../../auth/components/SocialLoginButton';
import Logo from '../../../components/Logo';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State for success message
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); 
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authAPI.login(formData);
      
      if (result.status === 200 || result.token) {
        // 1. Success Message
        setSuccess('Logged in successfully! Redirecting...');
        
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.data));
        localStorage.setItem('isNewUser', 'false');
        
        // Short delay to allow user to see the success message
        setTimeout(() => {
          window.location.href = '/dashboard'; 
        }, 1500);
      }
    } catch (err) {
        const status = err.response?.status;
        const serverMessage = err.response?.data?.message || '';

        // 1. Check for the specific "Invalid credentials" message
        if (serverMessage === "Invalid credentials") {
            // Since the backend uses 400 for everything, we show a combined error
            setError("Invalid credentials. If you don't have an account, redirecting to Signup...");
            
            // Optional: Only redirect to signup if you are sure this message implies 'User not found'
            setTimeout(() => {
            navigate('/signup');
            }, 2500);
        } 
        // 2. Logic for General Server Errors (500, etc.)
        else {
            setError(`Server error: ${status || 'Unknown'} - ${serverMessage || 'Internal error'}`);
        }
    }
  };

  return (
    <div className="relative">
      <AuthCard>
        <div className="text-center mb-8">
          <Logo className="mx-auto h-12 w-auto" />
          <Heading>Welcome back</Heading>
          <Subheading>Sign in to your account</Subheading>
        </div>

        {/* Error Feedback */}
        {error && (
          <ErrorMessage type={error.includes('Redirecting') ? 'warning' : 'error'}>
            {error}
          </ErrorMessage>
        )}

        {/* Success Feedback */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
          
          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>
          
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <Divider>Or continue with</Divider>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <SocialLoginButton provider="google" onClick={() => {}} />
          <SocialLoginButton provider="github" onClick={() => {}} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;