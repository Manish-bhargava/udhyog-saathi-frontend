import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingAPI } from '../api';
import AuthCard from '../../auth/components/AuthCard';
import Heading from '../../auth/components/Heading';
import Subheading from '../../auth/components/Subheading';
import InputField from '../../auth/components/InputField';
import Button from '../../auth/components/Button';
import ErrorMessage from '../../auth/components/ErrorMessage';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '', companyEmail: '', companyAddress: '', companyPhone: '',
    GST: '', accountNumber: '', IFSC: '', bankName: '', branchName: ''
  });

  const handleChange = (e) => {
    // This now works because we added the 'value' prop to inputs below
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const result = await onboardingAPI.submit(formData);
        if (result.success) {
        // 1. Get current user from storage
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        
        // 2. Update the user object with the new onboarding status
        const updatedUser = { 
            ...currentUser, 
            onboarding: true // THE SINGLE TAG
        };
        
        // 3. Save everything back to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('onboardingData', JSON.stringify(result.data));
        localStorage.setItem('isNewUser', 'false'); // Exit the initial flow
        
        window.location.href = '/tour'; // Move to tour
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Onboarding failed.');
    } finally {
        setLoading(false);
    }
    };

  const handleSkip = () => {
    localStorage.setItem('onboardingComplete', 'true'); // Mark step done
    navigate('/tour'); // Move forward to tour
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full">
        <AuthCard>
          <Heading>Business Profile</Heading>
          <Subheading>Setup your company and bank details</Subheading>
          
          {error && <ErrorMessage type="error">{error}</ErrorMessage>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
              <InputField label="Company Email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} required />
              <InputField label="Company Phone" name="companyPhone" value={formData.companyPhone} onChange={handleChange} required />
              <InputField label="GST Number" name="GST" value={formData.GST} onChange={handleChange} required />
            </div>
            <InputField label="Company Address" name="companyAddress" value={formData.companyAddress} onChange={handleChange} required />

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
                <InputField label="IFSC Code" name="IFSC" value={formData.IFSC} onChange={handleChange} required />
                <InputField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} required />
                <InputField label="Branch Name" name="branchName" value={formData.branchName} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Saving...' : 'Complete Onboarding'}
              </Button>
              <button type="button" onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-700">
                Skip for now
              </button>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default OnboardingPage;