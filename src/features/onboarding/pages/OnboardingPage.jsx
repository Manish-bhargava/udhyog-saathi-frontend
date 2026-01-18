// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { onboardingAPI } from '../api';
// import AuthCard from '../../auth/components/AuthCard';
// import Heading from '../../auth/components/Heading';
// import Subheading from '../../auth/components/Subheading';
// import InputField from '../../auth/components/InputField';
// import Button from '../../auth/components/Button';
// import ErrorMessage from '../../auth/components/ErrorMessage';

// const OnboardingPage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const [formData, setFormData] = useState({
//     companyName: '', companyEmail: '', companyAddress: '', companyPhone: '',
//     GST: '', accountNumber: '', IFSC: '', bankName: '', branchName: ''
//   });

//   const handleChange = (e) => {
//     // This now works because we added the 'value' prop to inputs below
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//         const result = await onboardingAPI.submit(formData);
//         if (result.success) {
//         // 1. Get current user from storage
//         const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        
//         // 2. Update the user object with the new onboarding status
//         const updatedUser = { 
//             ...currentUser, 
//             onboarding: true // THE SINGLE TAG
//         };
        
//         // 3. Save everything back to localStorage
//         localStorage.setItem('user', JSON.stringify(updatedUser));
//         localStorage.setItem('onboardingData', JSON.stringify(result.data));
//         localStorage.setItem('isNewUser', 'false'); // Exit the initial flow
        
//         window.location.href = '/tour'; // Move to tour
//         }
//     } catch (err) {
//         setError(err.response?.data?.message || 'Onboarding failed.');
//     } finally {
//         setLoading(false);
//     }
//     };

//   const handleSkip = () => {
//     localStorage.setItem('onboardingComplete', 'true'); // Mark step done
//     navigate('/tour'); // Move forward to tour
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
//       <div className="max-w-2xl w-full">
//         <AuthCard>
//           <Heading>Business Profile</Heading>
//           <Subheading>Setup your company and bank details</Subheading>
          
//           {error && <ErrorMessage type="error">{error}</ErrorMessage>}

//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
//               <InputField label="Company Email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} required />
//               <InputField label="Company Phone" name="companyPhone" value={formData.companyPhone} onChange={handleChange} required />
//               <InputField label="GST Number" name="GST" value={formData.GST} onChange={handleChange} required />
//             </div>
//             <InputField label="Company Address" name="companyAddress" value={formData.companyAddress} onChange={handleChange} required />

//             <div className="border-t pt-4">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InputField label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
//                 <InputField label="IFSC Code" name="IFSC" value={formData.IFSC} onChange={handleChange} required />
//                 <InputField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} required />
//                 <InputField label="Branch Name" name="branchName" value={formData.branchName} onChange={handleChange} required />
//               </div>
//             </div>

//             <div className="flex flex-col space-y-3">
//               <Button type="submit" disabled={loading} fullWidth>
//                 {loading ? 'Saving...' : 'Complete Onboarding'}
//               </Button>
//               <button type="button" onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-700">
//                 Skip for now
//               </button>
//             </div>
//           </form>
//         </AuthCard>
//       </div>
//     </div>
//   );
// };

// export default OnboardingPage;




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
    setLoading(true);
    try {
        const result = await onboardingAPI.submit(formData);
        if (result.success) {
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        
        const updatedUser = { 
            ...currentUser, 
            onboarding: true
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
    localStorage.setItem('onboardingComplete', 'true');
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