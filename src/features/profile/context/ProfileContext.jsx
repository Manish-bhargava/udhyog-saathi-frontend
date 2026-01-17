import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { profileAPI } from '../api';
import { useAuth } from '../../auth/context/AuthContext';
import { useNotifications } from '../../dashboard/context/NotificationContext';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { addNotification } = useNotifications();
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
    onboarding: false
  });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const { isAuthenticated } = useAuth();

  const clearMessage = () => setMessage(null);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated()) {
      console.log('Not authenticated, skipping profile fetch');
      setLoading(false);
      return;
    }

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
        if (hasFetched) {
          setMessage({ type: 'error', text: result.message || 'Failed to load profile' });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (hasFetched) {
        setMessage({ type: 'error', text: error.message || 'Failed to load profile' });
      }
    } finally {
      setLoading(false);
    }
  }, [hasFetched, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated() && !hasFetched) {
      console.log('Auth is ready, fetching profile...');
      fetchProfile();
    } else if (!isAuthenticated()) {
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
        onboarding: false
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
        // Set appropriate success message
        let successMessage = result.message;
        if (section === 'company') {
          // Check if it's onboarding completion (first time saving company email)
          const isOnboarding = !profile.company?.companyEmail && data.companyEmail;
          if (isOnboarding) {
            successMessage = 'Onboarding completed successfully!';
            // Update profile to mark as onboarded
            setProfile(prev => ({
              ...prev,
              company: { ...prev.company, ...data },
              bank: {
                ...prev.bank,
                bankName: data.bankName || prev.bank.bankName,
                accountNumber: data.accountNumber || prev.bank.accountNumber,
                IFSC: data.IFSC || prev.bank.IFSC,
                branchName: data.branchName || prev.bank.branchName
              }
            }));
          } else {
            successMessage = 'Company details updated successfully!';
          }
        }
        
        setMessage({ type: 'success', text: successMessage });
        
        // TRIGGER GLOBAL NOTIFICATION
        addNotification(successMessage, 'success');
        
        // Refresh profile data from server
        await fetchProfile(true); 
        return { ...result, successMessage };
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
    isCompanyLocked: false // Always false to allow editing all fields except email
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};