import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { profileAPI } from '../api/index.js';
import { useAuth } from '../../auth/context/AuthContext';

const ProfileContext = createContext({});

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { updateUser } = useAuth();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await profileAPI.getProfile();
      if (response.success) {
        setProfile(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Failed to load profile' };
    } catch (error) {
      console.error('Fetch profile error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load profile. Please try again.' 
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (section, data) => {
    setLoading(true);
    try {
      let response;
      
      switch (section) {
        case 'company':
          response = await profileAPI.updateCompanyDetails(data);
          break;
        case 'personal':
          response = await profileAPI.updatePersonalInfo(data);
          break;
        case 'password':
          response = await profileAPI.changePassword(data);
          break;
        default:
          throw new Error(`Unknown section: ${section}`);
      }
      
      console.log('Update response for', section, ':', response);
      
      if (response.success) {
        // If it's personal info, update the auth context user
        if (section === 'personal') {
          const updatedUserData = {
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            email: data.email
          };
          
          // Update user in AuthContext
          await updateUser(updatedUserData);
        }
        
        // Refetch profile to update UI
        await fetchProfile();
        
        setMessage({ 
          type: 'success', 
          text: response.message || `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully` 
        });
        
        return { success: true, data: response.data };
      }
      
      setMessage({ 
        type: 'error', 
        text: response.message || `${section} update failed` 
      });
      return { success: false, error: response.message };
      
    } catch (error) {
      console.error('Update profile error:', error);
      
      // Check if it's a 404 error (endpoint not found)
      let errorMessage = error.message || 'Failed to update profile.';
      
      if (error.message?.includes('404') || error.error?.response?.status === 404) {
        errorMessage = 'Onboarding endpoint not found. Please check if backend server is running and endpoint is registered.';
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [updateUser, fetchProfile]);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const value = {
    profile: profile || {
      personal: { firstName: '', lastName: '', email: '' },
      company: { 
        companyName: '', 
        GST: '', 
        companyAddress: '', 
        companyPhone: '', 
        companyEmail: '',
        companyLogo: '',
        companyDescription: '',
        companyStamp: '',
        companySignature: ''
      },
      bank: { 
        bankName: '', 
        accountNumber: '', 
        IFSC: '', 
        branchName: '' 
      }
    },
    loading,
    message,
    fetchProfile,
    updateProfile,
    clearMessage,
    exportCompanyData: profileAPI.exportCompanyData,
    clearCompanyData: profileAPI.clearCompanyData
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};