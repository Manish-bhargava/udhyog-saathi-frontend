import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { profileAPI } from '../api';
import { useAuth } from '../../auth/context/AuthContext';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    personal: { firstName: '', lastName: '', email: '' },
    company: { 
      companyName: '', 
      GST: '', 
      companyAddress: '', 
      companyPhone: '', 
      companyEmail: '',
      companyDescription: '',
      companyStamp: '',
      companySignature: '',
      companyLogo: ''
    },
    bank: { 
      bankName: '', 
      accountNumber: '', 
      IFSC: '', 
      branchName: '' 
    },
    onboarding: false,
    isCompanyLocked: false
  });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const { isAuthenticated } = useAuth();

  const clearMessage = () => setMessage(null);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    // Don't fetch if not authenticated
    if (!isAuthenticated()) {
      console.log('Not authenticated, skipping profile fetch');
      setLoading(false);
      return;
    }

    // Only fetch once unless forced
    if (hasFetched && !forceRefresh) {
      console.log('Profile already fetched, skipping');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching profile data...');
      const result = await profileAPI.getProfile();
      
      if (result.success && result.data) {
        console.log('Profile data loaded:', result.data);
        setProfile(result.data);
        setHasFetched(true);
      } else {
        console.error('Failed to fetch profile:', result);
        // Don't show error message for initial fetch to prevent UI disruption
        if (hasFetched) {
          setMessage({ type: 'error', text: result.message || 'Failed to load profile' });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't show error message for initial fetch
      if (hasFetched) {
        setMessage({ type: 'error', text: error.message || 'Failed to load profile' });
      }
    } finally {
      setLoading(false);
    }
  }, [hasFetched, isAuthenticated]);

  useEffect(() => {
    // Only fetch profile when auth is initialized and user is authenticated
    if (isAuthenticated() && !hasFetched) {
      console.log('Auth is ready, fetching profile...');
      fetchProfile();
    } else if (!isAuthenticated()) {
      // Clear profile if user logs out
      setProfile({
        personal: { firstName: '', lastName: '', email: '' },
        company: { 
          companyName: '', 
          GST: '', 
          companyAddress: '', 
          companyPhone: '', 
          companyEmail: '',
          companyDescription: '',
          companyStamp: '',
          companySignature: '',
          companyLogo: ''
        },
        bank: { 
          bankName: '', 
          accountNumber: '', 
          IFSC: '', 
          branchName: '' 
        },
        onboarding: false,
        isCompanyLocked: false
      });
      setHasFetched(false);
      setLoading(false);
    }
  }, [isAuthenticated, fetchProfile, hasFetched]);

  const updateProfile = async (section, data) => {
    console.log(`Updating profile section: ${section}`, data);
    
    let result;
    try {
      switch (section) {
        case 'personal':
          result = await profileAPI.updatePersonalInfo(data);
          break;
        case 'company':
          result = await profileAPI.updateCompanyDetails(data);
          break;
        case 'password':
          result = await profileAPI.changePassword(data);
          break;
        default:
          throw new Error(`Unknown profile section: ${section}`);
      }

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        
        // Refresh profile data after successful update
        await fetchProfile(true); // Force refresh
        
        return result;
      } else {
        setMessage({ type: 'error', text: result.message });
        return result;
      }
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      setMessage({ 
        type: 'error', 
        text: error.message || `Failed to update ${section}` 
      });
      throw error;
    }
  };

  const value = {
    profile,
    loading,
    message,
    fetchProfile,
    updateProfile,
    clearMessage,
    isCompanyLocked: profile.onboarding || false
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};