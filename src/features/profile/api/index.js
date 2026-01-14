import { authAPI } from '../../auth/api/index.js';

export const profileAPI = {
  async getProfile() {
    try {
      const response = await authAPI.getUserProfile();
      
      if (response.success && response.data) {
        const userData = response.data;
        
        // Handle name splitting
        const nameParts = userData.name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Format the data for the Profile Form
        const profileData = {
          personal: {
            firstName: firstName,
            lastName: lastName,
            email: userData.email || ''
          },
          company: {
            companyName: userData.company?.companyName || '',
            GST: userData.company?.GST || '',
            companyAddress: userData.company?.companyAddress || '',
            companyPhone: userData.company?.companyPhone || '',
            companyEmail: userData.company?.companyEmail || '',
            companyDescription: userData.company?.companyDescription || '',
            companyLogo: userData.company?.companyLogo || '',
            companyStamp: userData.company?.companyStamp || '',
            companySignature: userData.company?.companySignature || ''
          },
          bank: {
            // Mapping backend 'bankDetails' to form 'bank' object
            bankName: userData.bankDetails?.bankName || userData.BankDetails?.bankName || '',
            accountNumber: userData.bankDetails?.accountNumber || userData.BankDetails?.accountNumber || '',
            IFSC: userData.bankDetails?.IFSC || userData.BankDetails?.IFSC || '',
            branchName: userData.bankDetails?.branchName || userData.BankDetails?.branchName || ''
          },
          onboarding: userData.isOnboarded || false
        };
        
        return { success: true, data: profileData };
      }
      throw new Error('No data returned');
    } catch (error) {
      console.error('Profile cleaning error:', error);
      return { success: false, data: { personal: {}, company: {}, bank: {} } };
    }
  },

  async updateCompanyDetails(data) {
    try {
      console.log('Company data received for onboarding:', data);
      
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

      const response = await authAPI.onboarding(formattedData);
      
      console.log('Onboarding API Response:', response);
      
      return {
        success: true,
        message: response?.message || 'Onboarding Completed Successfully',
        data: response?.data || formattedData,
        onboardingCompleted: true
      };
      
    } catch (error) {
      console.error('Update company error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to save company details',
        error: error
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
      
      const response = await authAPI.updateProfile(formattedData);
      
      return {
        success: true,
        message: response?.message || 'Profile updated successfully',
        data: response?.data
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
    return { success: true, message: 'Data cleared' };
  }
};