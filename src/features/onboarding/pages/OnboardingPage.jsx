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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // VALIDATION: Check if any field is empty
    const isFormIncomplete = Object.values(formData).some(value => value.trim() === '');
    
    if (isFormIncomplete) {
      setError('Please fill in ALL details to complete onboarding. Otherwise, use "Skip for now".');
      return;
    }

    setLoading(true);
    try {
        const result = await onboardingAPI.submit(formData);
        if (result.success) {
          const currentUser = JSON.parse(localStorage.getItem('user')) || {};
          
          const updatedUser = { 
              ...currentUser, 
              onboarding: true // Now guaranteed to have data
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          localStorage.setItem('onboardingData', JSON.stringify(result.data));
          localStorage.setItem('isNewUser', 'false');
          
          window.location.href = '/tour';
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Onboarding failed.');
    } finally {
        setLoading(false);
    }
  };

  const handleSkip = () => {
    // FIX: Set onboarding to false so they are restricted from billing
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    localStorage.setItem('user', JSON.stringify({ ...currentUser, onboarding: false }));
    localStorage.setItem('isNewUser', 'false'); // They are no longer "New" but not onboarded
    navigate('/tour');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <AuthCard>
          <div className="text-center mb-8">
            <Heading className="text-3xl">Complete Your Business Profile</Heading>
            <Subheading className="mt-3 text-gray-600">Setup your company and bank details to get started</Subheading>
          </div>
          
          {error && (
            <div className="mb-6">
              <ErrorMessage type="error">{error}</ErrorMessage>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🏢</span> Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField 
                  label="Company Name" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter company name"
                />
                <InputField 
                  label="Company Email" 
                  name="companyEmail" 
                  value={formData.companyEmail} 
                  onChange={handleChange} 
                  required 
                  placeholder="company@example.com"
                />
                <InputField 
                  label="Company Phone" 
                  name="companyPhone" 
                  value={formData.companyPhone} 
                  onChange={handleChange} 
                  required 
                  placeholder="+91 9876543210"
                />
                <InputField 
                  label="GST Number" 
                  name="GST" 
                  value={formData.GST} 
                  onChange={handleChange} 
                  required 
                  placeholder="GSTIN123456789"
                />
              </div>
              <div className="mt-5">
                <InputField 
                  label="Company Address" 
                  name="companyAddress" 
                  value={formData.companyAddress} 
                  onChange={handleChange} 
                  required 
                  placeholder="Full business address"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🏦</span> Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField 
                  label="Account Number" 
                  name="accountNumber" 
                  value={formData.accountNumber} 
                  onChange={handleChange} 
                  required 
                  placeholder="1234567890"
                />
                <InputField 
                  label="IFSC Code" 
                  name="IFSC" 
                  value={formData.IFSC} 
                  onChange={handleChange} 
                  required 
                  placeholder="ABCD0123456"
                />
                <InputField 
                  label="Bank Name" 
                  name="bankName" 
                  value={formData.bankName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Bank of India"
                />
                <InputField 
                  label="Branch Name" 
                  name="branchName" 
                  value={formData.branchName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Mumbai Main Branch"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4 pt-4">
              <Button 
                type="submit" 
                disabled={loading} 
                fullWidth 
                className="py-3.5 text-base font-semibold"
              >
                {loading ? 'Saving Details...' : 'Complete Onboarding'}
              </Button>
              <button 
                type="button" 
                onClick={handleSkip} 
                className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Skip for now →
              </button>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default OnboardingPage;