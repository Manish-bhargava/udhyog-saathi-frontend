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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); 
  const [loading, setLoading] = useState(false); 

  // --- GOOGLE AUTH LOGIC ---
  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError('');
    
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
        setError(data.message || 'Google signup failed');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Network error during Google signup');
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
    if (error) setError(''); 
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
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
        setError(serverMessage || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4