import { authAPI } from '../../auth/api/index.js';

export const profileAPI = {
  async getProfile() {
    try {
      console.log('Fetching profile data from backend...');
      
      // Use the authAPI's axios instance to ensure proper token handling
      const response = await authAPI.getUserProfile();
      
      if (response.success && response.data) {
        const userData = response.data;
        
        console.log('User profile from backend:', userData);
        
        // Get onboarding data from localStorage or fallback
        let onboardingData = {};
        try {
          onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        } catch (error) {
          console.log('No onboarding data in localStorage');
        }
        
        // Extract name parts
        const nameParts = userData.name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Structure the data
        const profileData = {
          personal: {
            firstName: firstName,
            lastName: lastName,
            email: userData.email || ''
          },
          company: {
            companyName: onboardingData.company?.companyName || '',
            GST: onboardingData.company?.GST || '',
            companyAddress: onboardingData.company?.companyAddress || '',
            companyPhone: onboardingData.company?.companyPhone || '',
            companyEmail: onboardingData.company?.companyEmail || '',
            companyDescription: onboardingData.company?.companyDescription || '',
            companyStamp: onboardingData.company?.companyStamp || '',
            companySignature: onboardingData.company?.companySignature || '',
            companyLogo: onboardingData.company?.companyLogo || ''
          },
          bank: {
            bankName: onboardingData.BankDetails?.bankName || '',
            accountNumber: onboardingData.BankDetails?.accountNumber || '',
            IFSC: onboardingData.BankDetails?.IFSC || '',
            branchName: onboardingData.BankDetails?.branchName || ''
          },
          onboarding: userData.isOnboarded || false,
          isCompanyLocked: userData.isOnboarded || false
        };
        
        console.log('Profile data compiled:', profileData);
        
        return {
          success: true,
          data: profileData
        };
      } else if (response.message) {
        // Handle the case where getUserProfile returns an error structure
        console.error('Failed to fetch profile:', response.message);
        throw new Error(response.message);
      } else {
        // This shouldn't happen but handle it
        throw new Error('Failed to fetch profile');
      }
      
    } catch (error) {
      console.error('Get profile error:', error);
      
      // Fallback to localStorage if backend fails
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        
        const nameParts = user.name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        return {
          success: true,
          data: {
            personal: { 
              firstName: firstName, 
              lastName: lastName, 
              email: user.email || '' 
            },
            company: { 
              companyName: onboardingData.companyName || '', 
              GST: onboardingData.GST || '', 
              companyAddress: onboardingData.companyAddress || '', 
              companyPhone: onboardingData.companyPhone || '', 
              companyEmail: onboardingData.companyEmail || '',
              companyDescription: onboardingData.companyDescription || '',
              companyStamp: onboardingData.companyStamp || '',
              companySignature: onboardingData.companySignature || '',
              companyLogo: onboardingData.companyLogo || ''
            },
            bank: { 
              bankName: onboardingData.bankName || '', 
              accountNumber: onboardingData.accountNumber || '', 
              IFSC: onboardingData.IFSC || '', 
              branchName: onboardingData.branchName || '' 
            },
            onboarding: user.onboarding || false,
            isCompanyLocked: user.onboarding || false
          }
        };
      } catch (localError) {
        // Return default structure
        return {
          success: true,
          data: {
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
          }
        };
      }
    }
  },

  async updateCompanyDetails(data) {
    try {
      console.log('Company data received for onboarding:', data);
      
      // Format data according to backend API
      const formattedData = {
        companyName: data.companyName || '',
        companyEmail: data.companyEmail || '',
        companyAddress: data.companyAddress || '',
        companyPhone: data.companyPhone || '',
        companyLogo: data.companyLogo || '',
        companyDescription: data.companyDescription || '',
        GST: data.GST || '',
        companyStamp: data.companyStamp || '',
        companySignature: data.companySignature || '',
        accountNumber: data.accountNumber || '',
        IFSC: data.IFSC || '',
        bankName: data.bankName || '',
        branchName: data.branchName || ''
      };

      console.log('Formatted data for onboarding:', formattedData);
      
      // Call the backend onboarding endpoint using authAPI
      const response = await authAPI.onboarding(formattedData);
      
      // Save to localStorage for backup
      localStorage.setItem('onboardingData', JSON.stringify({
        ...formattedData,
        company: {
          companyName: formattedData.companyName,
          companyEmail: formattedData.companyEmail,
          companyAddress: formattedData.companyAddress,
          companyPhone: formattedData.companyPhone,
          companyLogo: formattedData.companyLogo,
          companyDescription: formattedData.companyDescription,
          GST: formattedData.GST,
          companyStamp: formattedData.companyStamp,
          companySignature: formattedData.companySignature
        },
        BankDetails: {
          accountNumber: formattedData.accountNumber,
          IFSC: formattedData.IFSC,
          bankName: formattedData.bankName,
          branchName: formattedData.branchName
        }
      }));
      
      console.log('Onboarding API Response:', response);
      
      return {
        success: true,
        message: response?.message || 'Onboarding Completed Successfully',
        data: response?.data || formattedData,
        onboardingCompleted: true
      };
      
    } catch (error) {
      console.error('Update company error:', error);
      
      // Even if backend fails, save to localStorage for offline use
      const formattedData = {
        companyName: data.companyName || '',
        companyEmail: data.companyEmail || '',
        companyAddress: data.companyAddress || '',
        companyPhone: data.companyPhone || '',
        companyLogo: data.companyLogo || '',
        companyDescription: data.companyDescription || '',
        GST: data.GST || '',
        companyStamp: data.companyStamp || '',
        companySignature: data.companySignature || '',
        accountNumber: data.accountNumber || '',
        IFSC: data.IFSC || '',
        bankName: data.bankName || '',
        branchName: data.branchName || ''
      };
      
      localStorage.setItem('onboardingData', JSON.stringify({
        ...formattedData,
        company: {
          companyName: formattedData.companyName,
          companyEmail: formattedData.companyEmail,
          companyAddress: formattedData.companyAddress,
          companyPhone: formattedData.companyPhone,
          companyLogo: formattedData.companyLogo,
          companyDescription: formattedData.companyDescription,
          GST: formattedData.GST,
          companyStamp: formattedData.companyStamp,
          companySignature: formattedData.companySignature
        },
        BankDetails: {
          accountNumber: formattedData.accountNumber,
          IFSC: formattedData.IFSC,
          bankName: formattedData.bankName,
          branchName: formattedData.branchName
        }
      }));
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.onboarding = true;
      user.isOnboarded = true;
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        message: 'Company details saved locally',
        data: formattedData,
        onboardingCompleted: true
      };
    }
  },

  async updatePersonalInfo(data) {
    try {
      const formattedData = {
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email || ''
      };
      
      console.log('Updating personal info with:', formattedData);
      
      // Use authAPI to ensure proper authorization
      const response = await authAPI.updateProfile(formattedData);
      
      console.log('Update personal info response:', response);
      
      // Update user in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        ...formattedData,
        ...response?.data // Include any additional data from response
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return {
        success: true,
        message: response?.message || 'Profile updated successfully',
        data: updatedUser
      };
    } catch (error) {
      console.error('Update personal info error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update personal information',
        error: error
      };
    }
  },

  async changePassword(data) {
    try {
      const formattedData = {
        oldPassword: data.current_password,
        newPassword: data.new_password
      };
      
      // Use authAPI to ensure proper authorization
      const response = await authAPI.changePassword(formattedData);
      
      if (response?.success) {
        return {
          success: true,
          message: response?.message || 'Password changed successfully',
          data: response
        };
      } else {
        throw {
          success: false,
          message: response?.message || 'Failed to change password'
        };
      }
      
    } catch (error) {
      console.error('Change password error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to change password',
        error: error
      };
    }
  },

  exportCompanyData() {
    return null;
  },

  clearCompanyData() {
    return { success: true, message: 'Company data cleared' };
  }
};