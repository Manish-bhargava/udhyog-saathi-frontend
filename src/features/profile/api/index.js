import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const profileAPI = {
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      console.log('Get Profile API Response:', response.data);
      
      if (response.data.success) {
        const userData = response.data.data;
        
        // Extract name parts
        const nameParts = userData.name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Return structured profile data
        return {
          success: true,
          data: {
            personal: {
              firstName: firstName,
              lastName: lastName,
              email: userData.email || ''
            },
            company: userData.company || { 
              companyName: '', 
              GST: '', 
              companyAddress: '', 
              companyPhone: '', 
              companyEmail: '',
              companyDescription: '',
              companyStamp: '',
              companySignature: ''
            },
            bank: userData.bank || { 
              bankName: '', 
              accountNumber: '', 
              IFSC: '', 
              branchName: '' 
            },
            onboarding: userData.onboarding || false,
            isCompanyLocked: userData.isCompanyLocked || false
          }
        };
      }
      
      throw new Error(response.data.message || 'Failed to fetch profile');
      
    } catch (error) {
      console.error('Get profile error:', error);
      
      // Fallback to current user data from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
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
          },
          onboarding: user.onboarding || false,
          isCompanyLocked: false
        }
      };
    }
  },

  async updateCompanyDetails(data) {
    try {
      console.log('Company data received:', data);
      
      const formattedData = {
        companyName: data.companyName || '',
        companyEmail: data.companyEmail || data.email || '',
        companyAddress: data.companyAddress || 
          `${data.address || ''}, ${data.city || ''}, ${data.state || ''} - ${data.pincode || ''}`.trim(),
        companyPhone: data.companyPhone || data.phone || '',
        companyDescription: data.companyDescription || '',
        GST: data.GST || data.gstNumber || '',
        companyStamp: data.companyStamp || '',
        companySignature: data.companySignature || '',
        accountNumber: data.accountNumber || '',
        IFSC: data.IFSC || data.ifscCode || '',
        bankName: data.bankName || '',
        branchName: data.branchName || '',
        onboarding: true // Mark onboarding as complete
      };

      console.log('Formatted data for API:', formattedData);
      
      const response = await api.post('/user/onboarding', formattedData);
      
      console.log('API Response:', response);
      
      return {
        success: true,
        message: response.data?.message || 'Company details saved successfully',
        data: response.data?.data || formattedData,
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
      
      const response = await api.put('/auth/update-profile', formattedData);
      
      console.log('Update personal info response:', response);
      
      // Update user in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        ...formattedData
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return {
        success: true,
        message: response.data?.message || 'Personal information updated successfully',
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
      console.log('Changing password with data:', {
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password
      });
      
      const formattedData = {
        oldPassword: data.current_password,
        newPassword: data.new_password
      };
      
      console.log('Sending to API with formatted data:', formattedData);
      
      const response = await api.put('/auth/change-password', formattedData);
      
      console.log('Change password response:', response);
      
      if (response.data?.success) {
        return {
          success: true,
          message: response.data?.message || 'Password changed successfully',
          data: response.data
        };
      } else {
        throw {
          success: false,
          message: response.data?.message || 'Failed to change password'
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
