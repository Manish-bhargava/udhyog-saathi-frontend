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
  const [success, setSuccess] = useState('');
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
        setSuccess('Logged in successfully! Redirecting...');
        
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.data));
        localStorage.setItem('isNewUser', 'false');
        
        setTimeout(() => {
          window.location.href = '/dashboard'; 
        }, 1500);
      }
    } catch (err) {
        const status = err.response?.status;
        const serverMessage = err.response?.data?.message || '';

        if (serverMessage === "Invalid credentials") {
            setError("Invalid credentials. If you don't have an account, redirecting to Signup...");
            
            setTimeout(() => {
            navigate('/signup');
            }, 2500);
        } 
        else {
            setError(`Server error: ${status || 'Unknown'} - ${serverMessage || 'Internal error'}`);
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <AuthCard className="max-w-md w-full">
        <div className="text-center mb-10">
          {/* <Logo className="mx-auto h-14 w-auto mb-6" /> */}
          <Heading className="text-3xl">Welcome back</Heading>
          <Subheading className="mt-3 text-gray-600">Sign in to your account to continue</Subheading>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage type={error.includes('Redirecting') ? 'warning' : 'error'}>
              {error}
            </ErrorMessage>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center text-sm font-medium flex items-center justify-center">
            <span className="mr-2">✅</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="you@example.com"
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
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading} 
            fullWidth 
            className="py-3.5 text-base font-semibold"
          >
            {loading ? 'Signing in...' : 'Sign in to Dashboard'}
          </Button>
        </form>

        <Divider className="my-8">Or continue with</Divider>

        <div className="grid grid-cols-2 gap-4">
          <SocialLoginButton provider="google" onClick={() => {}} />
          <SocialLoginButton provider="github" onClick={() => {}} />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;