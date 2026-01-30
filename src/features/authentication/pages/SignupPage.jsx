import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import AuthCard from '../../auth/components/AuthCard';
import Heading from '../../auth/components/Heading';
import Subheading from '../../auth/components/Subheading';
import InputField from '../../auth/components/InputField';
import PasswordField from '../../auth/components/PasswordField';
import Button from '../../auth/components/Button';
import Divider from '../../auth/components/Divider';
import { toast } from 'sonner';

// Your Google Client ID
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// Use the API URL from your .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://udhyogsaathi.in/api/v1';

const SignupPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '' 
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false); 
  const [loading, setLoading] = useState(false); 

  // --- GOOGLE AUTH LOGIC ---
  const handleGoogleResponse = async (response) => {
    setLoading(true);
    
    try {
      // FIX: Changed from localhost:3000 to the live API URL
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        handleSignupSuccess(data);
      } else {
        toast.error(data.message || 'Google signup failed');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error during Google signup');
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
            text: "signup_with" 
          } 
        );
      }
    }
  }, []);

  // --- SHARED SUCCESS LOGIC ---
  const handleSignupSuccess = (data) => {
    setSuccess(true); 
    toast.success('Account Created!');
    
    localStorage.setItem('token', data.token);
    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    localStorage.setItem('isNewUser', 'true');

    setTimeout(() => {
         window.location.href = '/dashboard'; 
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.signup(formData);
      
      if (result.status === 201 || result.status === 200 || result.token) {
        handleSignupSuccess(result);
      }
    } catch (err) {
        setLoading(false);
        const serverMessage = err.response?.data?.message || '';
        toast.error(serverMessage || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <AuthCard className="max-w-md w-full relative overflow-hidden">
        
        {(loading || success) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all duration-300">
            {success ? (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Account Created!</h3>
                <p className="text-sm text-gray-500 mt-1">Setting up your dashboard...</p>
              </div>
            ) : (
              <div className="text-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                 <p className="text-sm font-medium text-gray-600">Creating your account...</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mb-10">
          <Heading className="text-3xl">Create an account</Heading>
          <Subheading className="mt-3 text-gray-600">Start your journey with us today</Subheading>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" disabled={loading} />
          <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" disabled={loading} />
          <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password (min. 6 characters)" disabled={loading} />
          <PasswordField label="Confirm Password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required placeholder="Re-enter your password" disabled={loading} />
          
          <Button type="submit" disabled={loading} fullWidth className="py-3.5 text-base font-semibold">Create Account</Button>
        </form>

        <Divider className="my-8" text="Or sign up with"></Divider>
        <div className="flex flex-col gap-4">
          <div id="google-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Sign in</Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default SignupPage;