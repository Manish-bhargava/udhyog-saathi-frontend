// src/features/profile/components/ProfileForm/PersonalSection.jsx
import React, { useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useProfileForm } from '../../hooks/useProfileForm';
import { useAuth } from '../../../auth/context/AuthContext';

const PersonalSection = () => {
  const { profile } = useProfile();
  const { user: authUser } = useAuth();
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
    firstName: '',
    lastName: '',
    email: ''
  });
  
  useEffect(() => {
    // Get name from auth user
    const nameParts = authUser?.name?.split(' ') || [];
    
    setFormData({
      firstName: nameParts[0] || profile.personal?.firstName || '',
      lastName: nameParts.slice(1).join(' ') || profile.personal?.lastName || '',
      email: authUser?.email || profile.personal?.email || ''
    });
  }, [profile.personal, authUser, setFormData]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-500 mt-1">
          This information appears on your profile and is used for account communications
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Enter your first name"
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
            placeholder="Enter your last name"
          />
          {errors.lastName && touched.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email && touched.email
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && touched.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          This email will be used for account notifications and password recovery
        </p>
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
              Save Personal Information
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PersonalSection;