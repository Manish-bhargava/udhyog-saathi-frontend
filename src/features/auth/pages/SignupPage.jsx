import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import AuthCard from '../components/AuthCard';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Divider from '../components/Divider';
import SocialLoginButton from '../components/SocialLoginButton';
import Heading from '../components/Heading';
import Subheading from '../components/Subheading';

const SignupPage = () => {
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    isLoading,
    authError,
    successMessage,
    handleChange,
    handleBlur,
    handleSignup
  } = useSignup();


  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`);
    // In real app, implement OAuth flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard
        title="Create Account"
        subtitle="Join thousands of businesses using UdhyogSaathi"
        footer={
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in here
            </Link>
          </div>
        }
      >
        {successMessage && (
          <ErrorMessage type="success">
            {successMessage}
          </ErrorMessage>
        )}

        {authError && (
          <ErrorMessage type="error">
            {authError}
          </ErrorMessage>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={values.name}
              onChange={(value) => handleChange('name', value)}
              onBlur={() => handleBlur('name')}
              error={errors.name}
              touched={touched.name}
              required
              icon="👤"
            />

            <InputField
              label="Business Name"
              type="text"
              placeholder="Your Business Pvt. Ltd."
              value={values.businessName}
              onChange={(value) => handleChange('businessName', value)}
              onBlur={() => handleBlur('businessName')}
              error={errors.businessName}
              touched={touched.businessName}
              required
              icon="🏢"
            />
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Phone Number"
              type="tel"
              placeholder="9876543210"
              value={values.phoneNumber}
              onChange={(value) => handleChange('phoneNumber', value)}
              onBlur={() => handleBlur('phoneNumber')}
              error={errors.phoneNumber}
              touched={touched.phoneNumber}
              required
              icon="📱"
            />


            {/* Password field with unique ID */}
            <PasswordField
              label="Password"
              placeholder="Create password"
              value={values.password}
              onChange={(value) => handleChange('password', value)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              touched={touched.password}
              required
              showStrength
              id="create-password" // Unique ID
            />
          </div>

          {/* Confirm Password field with unique ID */}
          <PasswordField
            label="Confirm Password"
            placeholder="Re-enter password"
            value={values.confirmPassword}
            onChange={(value) => handleChange('confirmPassword', value)}
            onBlur={() => handleBlur('confirmPassword')}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            required
            id="confirm-password" // Unique ID
          />

          <div className="space-y-4">
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex items-start">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                Send me product updates, tips, and offers via email
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        <Divider text="Or sign up with" />

        <div className="space-y-4">
          <SocialLoginButton 
            provider="google"
            onClick={() => handleSocialSignup('google')}
            disabled={isLoading}
          />
          
          <SocialLoginButton 
            provider="linkedin"
            onClick={() => handleSocialSignup('linkedin')}
            disabled={isLoading}
          />
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <Heading level="h3" size="sm" className="text-blue-800 mb-2">
            Why Join UdhyogSaathi?
          </Heading>
          <ul className="text-sm text-blue-700 space-y-1">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Manage Kacha & Pakka bills seamlessly
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              AI-powered business insights
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              14-day free trial, no credit card needed
            </li>
          </ul>
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

export default SignupPage;