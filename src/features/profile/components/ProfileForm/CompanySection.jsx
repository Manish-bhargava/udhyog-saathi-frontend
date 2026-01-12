import React, { useState, useRef } from 'react';
import { useProfileForm } from '../../hooks/useProfileForm';
import { useProfile } from '../../context/ProfileContext';

const CompanySection = () => {
  const { profile, isCompanyLocked } = useProfile();
  const {
    formData,
    errors,
    touched,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormData
  } = useProfileForm('company', {
    companyName: profile.company.companyName || '',
    GST: profile.company.GST || '',
    companyAddress: profile.company.companyAddress || '',
    companyPhone: profile.company.companyPhone || '',
    companyEmail: profile.company.companyEmail || '',
    companyDescription: profile.company.companyDescription || '',
    companyStamp: profile.company.companyStamp || '',
    companySignature: profile.company.companySignature || '',
    bankName: profile.bank.bankName || '',
    accountNumber: profile.bank.accountNumber || '',
    IFSC: profile.bank.IFSC || '',
    branchName: profile.bank.branchName || ''
  });
  
  const [stampPreview, setStampPreview] = useState(profile.company.companyStamp || '');
  const [signaturePreview, setSignaturePreview] = useState(profile.company.companySignature || '');
  const stampInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      setFormData(prev => ({
        ...prev,
        [field]: base64String
      }));
      
      if (field === 'companyStamp') {
        setStampPreview(base64String);
      } else if (field === 'companySignature') {
        setSignaturePreview(base64String);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: ''
    }));
    
    if (field === 'companyStamp') {
      setStampPreview('');
      if (stampInputRef.current) stampInputRef.current.value = '';
    } else if (field === 'companySignature') {
      setSignaturePreview('');
      if (signatureInputRef.current) signatureInputRef.current.value = '';
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      address: formData.companyAddress || '',
      city: '',
      state: '',
      pincode: '',
      phone: formData.companyPhone || '',
      email: formData.companyEmail || '',
      gstNumber: formData.GST || '',
      ifscCode: formData.IFSC || ''
    };
    
    const result = await handleSubmit(e, submitData);
    return result;
  };
  
  return (
    <div className="space-y-6">
      {isCompanyLocked && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Company details are locked.</strong> Once onboarding is completed, company information cannot be edited. Please contact support if you need to make changes.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
          <p className="text-sm text-gray-600 mt-1">Fill in your company details for billing and invoicing.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isCompanyLocked}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyName && touched.companyName
                  ? 'border-red-500'
                  : 'border-gray-300'
              } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.companyName && touched.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Number *
            </label>
            <input
              type="text"
              name="GST"
              value={formData.GST}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isCompanyLocked}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.GST && touched.GST
                  ? 'border-red-500'
                  : 'border-gray-300'
              } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.GST && touched.GST && (
              <p className="mt-1 text-sm text-red-600">{errors.GST}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Address *
            </label>
            <textarea
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isCompanyLocked}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyAddress && touched.companyAddress
                  ? 'border-red-500'
                  : 'border-gray-300'
              } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.companyAddress && touched.companyAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.companyAddress}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Phone *
            </label>
            <input
              type="tel"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isCompanyLocked}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyPhone && touched.companyPhone
                  ? 'border-red-500'
                  : 'border-gray-300'
              } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.companyPhone && touched.companyPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.companyPhone}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Email *
            </label>
            <input
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isCompanyLocked}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyEmail && touched.companyEmail
                  ? 'border-red-500'
                  : 'border-gray-300'
              } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.companyEmail && touched.companyEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.companyEmail}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description
            </label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isCompanyLocked}
              rows={2}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyDescription && touched.companyDescription
                  ? 'border-red-500'
                  : 'border-gray-300'
              } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
        
        {/* Company Stamp and Signature - Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Stamp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Stamp/Seal
            </label>
            <div className="space-y-3">
              {stampPreview && (
                <div className="relative">
                  <img 
                    src={stampPreview} 
                    alt="Company stamp preview" 
                    className="w-32 h-32 object-contain border rounded-lg"
                  />
                  {!isCompanyLocked && (
                    <button
                      type="button"
                      onClick={() => removeImage('companyStamp')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
              <div>
                <input
                  type="file"
                  ref={stampInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'companyStamp')}
                  disabled={isCompanyLocked}
                  className="hidden"
                  id="stamp-upload"
                />
                <label
                  htmlFor="stamp-upload"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                    isCompanyLocked 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12h4a2 2 0 012 2v4a2 2 0 01-2 2H7z" />
                  </svg>
                  {stampPreview ? 'Change Stamp' : 'Upload Stamp'}
                </label>
                <p className="text-xs text-gray-500 mt-1">Optional: Company seal or stamp image</p>
              </div>
            </div>
          </div>
          
          {/* Company Signature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authorized Signature
            </label>
            <div className="space-y-3">
              {signaturePreview && (
                <div className="relative">
                  <img 
                    src={signaturePreview} 
                    alt="Signature preview" 
                    className="w-48 h-32 object-contain border rounded-lg"
                  />
                  {!isCompanyLocked && (
                    <button
                      type="button"
                      onClick={() => removeImage('companySignature')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
              <div>
                <input
                  type="file"
                  ref={signatureInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'companySignature')}
                  disabled={isCompanyLocked}
                  className="hidden"
                  id="signature-upload"
                />
                <label
                  htmlFor="signature-upload"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                    isCompanyLocked 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  {signaturePreview ? 'Change Signature' : 'Upload Signature'}
                </label>
                <p className="text-xs text-gray-500 mt-1">Optional: Authorized signature for documents</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bank Details */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Bank Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isCompanyLocked}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankName && touched.bankName
                    ? 'border-red-500'
                    : 'border-gray-300'
                } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.bankName && touched.bankName && (
                <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isCompanyLocked}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accountNumber && touched.accountNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.accountNumber && touched.accountNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code *
              </label>
              <input
                type="text"
                name="IFSC"
                value={formData.IFSC}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isCompanyLocked}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.IFSC && touched.IFSC
                    ? 'border-red-500'
                    : 'border-gray-300'
                } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.IFSC && touched.IFSC && (
                <p className="mt-1 text-sm text-red-600">{errors.IFSC}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isCompanyLocked}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.branchName && touched.branchName
                    ? 'border-red-500'
                    : 'border-gray-300'
                } ${isCompanyLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.branchName && touched.branchName && (
                <p className="mt-1 text-sm text-red-600">{errors.branchName}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading || isCompanyLocked}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save Company Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySection;
