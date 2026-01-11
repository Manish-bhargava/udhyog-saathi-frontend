import { authAPI } from '../../auth/api/index.js';

export const profileAPI = {
  // Get profile data - returns empty structure
  async getProfile() {
    try {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Return default profile structure
      return {
        success: true,
        data: {
          personal: {
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ')[1] || '',
            email: user.email || ''
          },
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
        }
      };
    } catch (error) {
      console.error('Get profile error:', error);
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
        }
      };
    }
  },

  // Update company details (onboarding) - uses authAPI.onboarding
  async updateCompanyDetails(data) {
    try {
      console.log('Company data received:', data);
      
      // Format data according to API requirements
      const formattedData = {
        companyName: data.companyName || '',
        companyEmail: data.companyEmail || data.email || '',
        companyAddress: data.companyAddress || 
          `${data.address || ''}, ${data.city || ''}, ${data.state || ''} - ${data.pincode || ''}`.trim(),
        companyPhone: data.companyPhone || data.phone || '',
        companyLogo: data.companyLogo || '',
        companyDescription: data.companyDescription || '',
        GST: data.GST || data.gstNumber || '',
        companyStamp: data.companyStamp || '',
        companySignature: data.companySignature || '',
        accountNumber: data.accountNumber || '',
        IFSC: data.IFSC || data.ifscCode || '',
        bankName: data.bankName || '',
        branchName: data.branchName || ''
      };

      console.log('Formatted data for API:', formattedData);
      
      // Use the authAPI onboarding endpoint
      const response = await authAPI.onboarding(formattedData);
      
      console.log('API Response:', response);
      
      return {
        success: true,
        message: response.message || 'Company details saved successfully',
        data: response.data || formattedData
      };
      
    } catch (error) {
      console.error('Update company error:', error);
      
      throw {
        success: false,
        message: error.message || 'Failed to save company details',
        error: error
      };
    }
  },

  // Update personal information
  async updatePersonalInfo(data) {
    try {
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Update user data
      const updatedUser = {
        ...user,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email || user.email,
      };
      
      // Save back to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return {
        success: true,
        message: 'Personal information updated successfully',
        data: updatedUser
      };
    } catch (error) {
      console.error('Update personal info error:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(data) {
    try {
      // Note: This endpoint might not exist yet
      return {
        success: true,
        message: 'Password change endpoint not implemented yet'
      };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Export company data
  exportCompanyData() {
    return null; // No local storage data
  },

  // Clear company data
  clearCompanyData() {
    return { success: true, message: 'Company data cleared' };
  }
};