import React, { useState, useEffect } from 'react';
import { useProfileForm } from '../../hooks/useProfileForm';
import { useProfile } from '../../context/ProfileContext';

const PersonalSection = () => {
  const { profile } = useProfile();
  
  const {
    formData,
    errors,
    touched,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormData
  } = useProfileForm('personal', {
    firstName: profile.personal?.firstName || '',
    lastName: profile.personal?.lastName || '',
    email: profile.personal?.email || ''
  });

  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isFirstSave, setIsFirstSave] = useState(!profile.personal?.email);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.personal?.firstName || '',
        lastName: profile.personal?.lastName || '',
        email: profile.personal?.email || ''
      });
      
      // Check if this is the first save (no personal email in profile yet)
      setIsFirstSave(!profile.personal?.email);
    }
  }, [profile, setFormData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Show email confirmation only during first save
    if (isFirstSave && formData.email) {
      setShowEmailConfirmation(true);
      return;
    }
    
    const result = await handleSubmit(e);
    return result;
  };
  
  // Check if personal email exists (means it's already been saved)
  const isEmailLocked = !!profile.personal?.email;
  
  return (
    <div className="space-y-6">
      {/* Email Confirmation Modal (only shown during first save) */}
      {showEmailConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Confirm Your Personal Email</h3>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                You are about to set your personal email to: <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Important:</strong> This email cannot be changed after saving. It will be used for account login and notifications.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please double-check that this is the correct email address before proceeding.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowEmailConfirmation(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowEmailConfirmation(false);
                  setIsFirstSave(false);
                  await handleSubmit(null);
                }}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <p className="text-sm text-gray-600 mt-1">Update your personal details.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.firstName && touched.firstName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.firstName && touched.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lastName && touched.lastName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.lastName && touched.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isEmailLocked}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email && touched.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              } ${isEmailLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
            {isEmailLocked && (
              <p className="mt-1 text-xs text-gray-500">
                Personal email cannot be changed once saved.
              </p>
            )}
            {isFirstSave && !isEmailLocked && (
              <p className="mt-1 text-xs text-yellow-600">
                This email will be locked after saving and cannot be changed.
              </p>
            )}
          </div>
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
                Saving...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save Personal Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalSection;