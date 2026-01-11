import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
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
  const { user, isAuthenticated, isInitialized, updateUser } = useAuth();
  const timeoutRef = useRef(null);

  const setMessageWithTimeout = useCallback((newMessage) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setMessage(newMessage);
    
    if (newMessage) {
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated() || !user) {
      console.warn('Cannot fetch profile: No authenticated user');
      setProfile(null);
      return { success: false, error: 'No authenticated user' };
    }
    
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
      setMessageWithTimeout({ 
        type: 'error', 
        text: 'Failed to load profile. Please try again.' 
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, setMessageWithTimeout]);

  const updateProfile = useCallback(async (section, data) => {
    if (!isAuthenticated() || !user) {
      console.error('Cannot update profile: No authenticated user');
      setMessageWithTimeout({ 
        type: 'error', 
        text: 'No authenticated user. Please log in again.' 
      });
      return { success: false, error: 'No authenticated user' };
    }
    
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
        // Update user onboarding status if company info was completed
        if (section === 'company') {
          // Always set onboarding to true when company details are saved
          const updatedUser = {
            ...user,
            onboarding: true
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          updateUser(updatedUser);
        }
        
        // Force immediate refetch of profile to update progress bar
        await fetchProfile();
        
        setMessageWithTimeout({ 
          type: 'success', 
          text: response.message || `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully` 
        });
        
        return { success: true, data: response.data };
      }
      
      setMessageWithTimeout({ 
        type: 'error', 
        text: response.message || `${section} update failed` 
      });
      return { success: false, error: response.message };
      
    } catch (error) {
      console.error('Update profile error:', error);
      
      let errorMessage = error.message || 'Failed to update profile.';
      
      if (error.message?.includes('404') || error.error?.response?.status === 404) {
        errorMessage = 'Onboarding endpoint not found. Please check if backend server is running.';
      } else if (error.message?.includes('401')) {
        errorMessage = 'Session expired. Please log in again.';
      }
      
      setMessageWithTimeout({ 
        type: 'error', 
        text: errorMessage
      });
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, fetchProfile, setMessageWithTimeout, updateUser]);

  const isCompanyLocked = useCallback(() => {
    return user?.onboarding === true;
  }, [user]);

  useEffect(() => {
    if (isInitialized && isAuthenticated() && user) {
      console.log('ProfileContext: Fetching profile for authenticated user:', user);
      fetchProfile();
    } else {
      console.log('ProfileContext: No authenticated user, clearing profile');
      setProfile(null);
    }
  }, [user, isAuthenticated, fetchProfile, isInitialized]);

  const value = {
    profile: profile || {
      personal: { firstName: '', lastName: '', email: '' },
      company: { 
        companyName: '', 
        GST: '', 
        companyAddress: '', 
        companyPhone: '', 
        companyEmail: '',
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
    isCompanyLocked: isCompanyLocked(),
    exportCompanyData: profileAPI.exportCompanyData,
    clearCompanyData: profileAPI.clearCompanyData
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};