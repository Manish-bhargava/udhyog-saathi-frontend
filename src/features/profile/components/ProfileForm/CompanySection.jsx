// src/features/profile/components/ProfileForm/CompanySection.jsx
import React, { useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useProfileForm } from '../../hooks/useProfileForm';

const CompanySection = () => {
  const { profile } = useProfile();
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
    companyName: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    companyDescription: '',
    companyLogo: '',
    companyStamp: '',
    companySignature: ''
  });
  
  useEffect(() => {
    if (profile.company) {
      // Parse address from companyAddress string
      const addressParts = profile.company.companyAddress?.split(', ') || [];
      let address = '', city = '', state = '', pincode = '';
      
      if (addressParts.length >= 3) {
        address = addressParts.slice(0, -2).join(', ');
        city = addressParts[addressParts.length - 2] || '';
        state = addressParts[addressParts.length - 1]?.split(' - ')[0] || '';
        pincode = addressParts[addressParts.length - 1]?.split(' - ')[1] || '';
      }
      
      setFormData({
        companyName: profile.company.companyName || '',
        gstNumber: profile.company.GST || '',
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        phone: profile.company.companyPhone || '',
        email: profile.company.companyEmail || '',
        website: '',
        bankName: profile.bank.bankName || '',
        accountNumber: profile.bank.accountNumber || '',
        ifscCode: profile.bank.IFSC || '',
        branchName: profile.bank.branchName || '',
        companyDescription: profile.company.companyDescription || '',
        companyLogo: profile.company.companyLogo || '',
        companyStamp: profile.company.companyStamp || '',
        companySignature: profile.company.companySignature || ''
      });
    }
  }, [profile.company, profile.bank, setFormData]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
      </div>
      
      {/* Basic Information */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyName && touched.companyName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
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
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.gstNumber && touched.gstNumber
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.gstNumber && touched.gstNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.gstNumber}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Address Information */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.address && touched.address
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.address && touched.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city && touched.city
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.city && touched.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.state && touched.state
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.state && touched.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pincode && touched.pincode
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.pincode && touched.pincode && (
                <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone && touched.phone
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.phone && touched.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email && touched.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      {/* Company Description */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Company Description</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="companyDescription"
            rows="3"
            value={formData.companyDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Brief description of your company"
          />
        </div>
      </div>
      
      {/* Bank Information */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Bank Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bankName && touched.bankName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.accountNumber && touched.accountNumber
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
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
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.ifscCode && touched.ifscCode
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.ifscCode && touched.ifscCode && (
              <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.branchName && touched.branchName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
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
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
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
  );
};

export default CompanySection;