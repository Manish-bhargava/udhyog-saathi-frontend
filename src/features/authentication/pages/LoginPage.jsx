import React, { useState, useEffect } from 'react';
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
import Logo from '../../../components/Logo';

// Your Google Client ID
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    // Name is usually not needed for login, just email/pass
    email: '', 
    password: '' 
  });
  
  // UI States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Controls Success Checkmark
  const [loading, setLoading] = useState(false); // Controls Spinner/Blur

  // --- GOOGLE AUTH LOGIC ---
  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError('');
    
    try {
      // Use the same endpoint as Signup. Backend usually handles "Login if exists, Create if not"
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        handleLoginSuccess(data);
      } else {
        setError(data.message || 'Google login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error during Google login');
      setLoading(false);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      initializeGoogleAuth();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    document.head.appendChild(script);

    function initializeGoogleAuth() {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "100%", 
            text: "signin_with" // Changing text to 'Sign in with Google'
          } 
        );
      }
    }
  }, []);

  // --- SHARED SUCCESS LOGIC ---
  const handleLoginSuccess = (result) => {
    setSuccess(true);
    
    // Save Token & User Data
    localStorage.setItem('token', result.token);
    if (result.user || result.data) {
        // Handle structure difference if any (result.user vs result.data)
        const userData = result.user || result.data;
        localStorage.setItem('user', JSON.stringify(userData));
    }
    
    localStorage.setItem('isNewUser', 'false'); // Usually false for login

    // Redirect after 1.5 seconds
    setTimeout(() => {
      window.location.href = '/dashboard'; 
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authAPI.login(formData);
      
      if (result.status === 200 || result.token) {
        handleLoginSuccess(result);
      }
    } catch (err) {
        setLoading(false);
        const serverMessage = err.response?.data?.message || '';

        if (serverMessage === "Invalid credentials") {
            setError("Invalid credentials. Please check your email/password.");
        } else if (serverMessage.includes("User not found")) {
             setError("User not found. Redirecting to Signup...");
             setTimeout(() => navigate('/signup'), 2500);
        } else {
            setError(serverMessage || 'Login failed. Please try again.');
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      
      <AuthCard className="max-w-md w-full relative overflow-hidden">
        
        {/* --- LOADING / SUCCESS OVERLAY --- */}
        {(loading || success) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all duration-300">
            {success ? (
              // SUCCESS STATE
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Welcome Back!</h3>
                <p className="text-sm text-gray-500 mt-1">Redirecting to dashboard...</p>
              </div>
            ) : (
              // LOADING SPINNER STATE
              <div className="text-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                 <p className="text-sm font-medium text-gray-600">Signing you in...</p>
              </div>
            )}
          </div>
        )}

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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Note: 'name' field removed for Login */}

          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            disabled={loading}
          />
          
          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            disabled={loading}
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
            Sign in to Dashboard
          </Button>
        </form>

        <Divider className="my-8" text="Or continue with" />

        <div className="flex flex-col gap-4">
          {/* GOOGLE BUTTON CONTAINER */}
          <div id="google-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
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
