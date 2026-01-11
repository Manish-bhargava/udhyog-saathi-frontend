// src/features/profile/components/ProfileForm/PasswordSection.jsx
import React, { useState } from 'react';
import { useProfileForm } from '../../hooks/useProfileForm';
import { validatePassword } from '../../utils/profileValidation';

const PasswordSection = () => {
  const {
    formData,
    errors,
    touched,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useProfileForm('password', {
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [validationError, setValidationError] = useState(null);
  
  const handlePasswordChange = (e) => {
    handleChange(e);
    
    if (e.target.name === 'new_password') {
      const validation = validatePassword(e.target.value);
      setPasswordStrength(validation);
      // Clear validation error when user types
      if (validationError) {
        setValidationError(null);
      }
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous validation error
    setValidationError(null);
    
    // Additional validation for password strength
    if (formData.new_password) {
      const validation = validatePassword(formData.new_password);
      setPasswordStrength(validation);
      
      if (!validation.isValid) {
        setValidationError('Password does not meet strength requirements');
        console.error('Password validation failed:', validation);
        return;
      }
    }
    
    console.log('Submitting password change form...');
    
    const result = await handleSubmit(e);
    console.log('Password change result:', result);
    
    if (result?.success) {
      resetForm();
      setPasswordStrength(null);
      setValidationError(null);
    }
  };
  
  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
      </div>
      
      {/* Display validation error */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {validationError}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password *
        </label>
        <input
          type="password"
          name="current_password"
          value={formData.current_password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.current_password && touched.current_password
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {errors.current_password && touched.current_password && (
          <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password *
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handlePasswordChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.new_password && touched.new_password
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {errors.new_password && touched.new_password && (
            <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
          )}
          
          {/* Password strength indicator */}
          {formData.new_password && passwordStrength && (
            <div className="mt-2">
              <div className="text-sm text-gray-600 mb-1">Password strength:</div>
              <div className="flex space-x-1">
                {Object.values(passwordStrength.requirements).map((met, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      met ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password *
          </label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.confirm_password && touched.confirm_password
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {errors.confirm_password && touched.confirm_password && (
            <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center">
            <svg className={`h-4 w-4 mr-2 ${formData.new_password?.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            At least 8 characters long
          </li>
          <li className="flex items-center">
            <svg className={`h-4 w-4 mr-2 ${/[A-Z]/.test(formData.new_password) && /[a-z]/.test(formData.new_password) ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Include uppercase and lowercase letters
          </li>
          <li className="flex items-center">
            <svg className={`h-4 w-4 mr-2 ${/\d/.test(formData.new_password) ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Include numbers
          </li>
          <li className="flex items-center">
            <svg className={`h-4 w-4 mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password) ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Include special characters
          </li>
        </ul>
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Changing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Change Password
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PasswordSection;