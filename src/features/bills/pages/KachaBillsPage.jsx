// src/features/bills/pages/KachaBillsPage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useKachaBillForm } from '../hooks/useKachaBillForm';
import BillForm from '../components/BillForm';
import BillPreview from '../components/BillPreview';
import billAPI from '../api';
import { INITIAL_KACHA_BILL_DATA } from '../types';
import { ProfileProvider, useProfile } from '../../profile/context/ProfileContext';
import { useAuth } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../auth/hooks/usePermissions';

const KachaBillsPageContent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [manualCompanyDetails, setManualCompanyDetails] = useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: ''
    // No GST, Stamp, or Signature for Kacha Bills
  });
  
  const { user } = useAuth();
  const { profile, isCompanyLocked } = useProfile();
  const { canPerformAction, getButtonProps } = usePermissions();
  const navigate = useNavigate();

  const {
    formData,
    errors,
    updateBuyer,
    updateProduct,
    addProduct,
    removeProduct,
    validateForm,
    calculateTotals,
    resetForm,
    setFormData
  } = useKachaBillForm(INITIAL_KACHA_BILL_DATA);

  const totals = calculateTotals();

  // Initialize company details based on onboarding status
  useEffect(() => {
    if (isCompanyLocked && profile?.company) {
      // Use profile company details when onboarding is complete
      setManualCompanyDetails({
        companyName: profile.company.companyName || '',
        companyAddress: profile.company.companyAddress || '',
        companyPhone: profile.company.companyPhone || '',
        companyEmail: profile.company.companyEmail || ''
        // No GST, Stamp, or Signature for Kacha Bills
      });
    }
  }, [isCompanyLocked, profile]);

  const handleSaveBill = async () => {
    if (!canPerformAction()) {
      setErrorMessage('Please complete your onboarding to save bills');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!validateForm()) {
      setErrorMessage('Please fix the errors in the form');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Calculate discount percentage
      const subtotal = formData.products.reduce((sum, product) => sum + (product.rate * product.quantity), 0);
      const discountPercentage = subtotal > 0 ? (formData.discount / subtotal) * 100 : 0;

      const billData = {
        buyer: formData.buyer,
        products: formData.products.map(p => ({
          name: p.name,
          rate: p.rate,
          quantity: p.quantity
        })),
        discount: discountPercentage,
        type: 'kacha'
        // No GST for Kacha Bills
      };

      const response = await billAPI.createKachaBill(billData);
      
      if (response.success) {
        setSuccessMessage('Kacha Bill created successfully!');
        resetForm();
        
        // Dispatch custom event to notify All Bills page
        window.dispatchEvent(new CustomEvent('billCreated'));
        
        // Auto-clear success message
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage(response.message || 'Failed to create bill');
      }
    } catch (error) {
      console.error('Error creating kacha bill:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to create bill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadBill = () => {
    // Create printable window
    const printWindow = window.open('', '_blank');
    
    const companyName = manualCompanyDetails.companyName || 'Your Company Name';
    const companyAddress = manualCompanyDetails.companyAddress || 'Company Address';
    const companyPhone = manualCompanyDetails.companyPhone || '';
    const companyEmail = manualCompanyDetails.companyEmail || '';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Kacha Bill ${Date.now().toString().slice(-6)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .company-details, .client-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .totals { float: right; margin-top: 20px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; }
            .company-header { text-align: right; }
            .kacha-label { 
              background-color: #f59e0b; 
              color: white; 
              padding: 2px 8px; 
              border-radius: 4px; 
              font-size: 12px; 
              margin-left: 8px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <h1>KACHA BILL <span class="kacha-label">PROFORMA</span></h1>
              <p>Bill #: KACHA-${Date.now().toString().slice(-6)}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="company-header">
              <h2>${companyName}</h2>
              ${companyAddress ? `<p>${companyAddress}</p>` : ''}
              ${companyPhone ? `<p>Phone: ${companyPhone}</p>` : ''}
              ${companyEmail ? `<p>Email: ${companyEmail}</p>` : ''}
            </div>
          </div>
          
          <div class="client-details">
            <h3>Bill To:</h3>
            <p><strong>${formData.buyer.clientName}</strong><br>
            ${formData.buyer.clientAddress || ''}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Rate (₹)</th>
                <th>Qty</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${formData.products.map((p, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${p.name}</td>
                  <td>${p.rate.toFixed(2)}</td>
                  <td>${p.quantity}</td>
                  <td>${(p.rate * p.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <p>Subtotal: ₹${totals.subtotal.toFixed(2)}</p>
            ${totals.discount > 0 ? `<p>Discount: ₹${totals.discount.toFixed(2)}</p>` : ''}
            <p><strong>Total Amount: ₹${totals.grandTotal.toFixed(2)}</strong></p>
            <p><em>Note: This is a Kacha Bill (Proforma Invoice)</em></p>
          </div>
          
          <div class="footer">
            <p><strong>Important:</strong> This is not a tax invoice. For official tax invoice, please request a Pakka Bill.</p>
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleUpdateDiscount = (value) => {
    setFormData(prev => ({ ...prev, discount: value }));
  };

  const handleUpdateCompany = (data) => {
    setManualCompanyDetails(prev => ({ ...prev, ...data }));
  };

  const handleSaveBillWithPermission = () => {
    if (!canPerformAction()) {
      setErrorMessage('Please complete your onboarding to save bills');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    handleSaveBill();
  };

  const handleDownloadBillWithPermission = () => {
    if (!canPerformAction()) {
      setErrorMessage('Please complete your onboarding to download bills');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    handleDownloadBill();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Kacha Bill</h1>
          <p className="text-gray-600 mt-1">Create a temporary/proforma invoice without GST</p>
          <div className="mt-2 flex items-center text-sm text-yellow-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.338 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            This is a temporary bill. Convert to Pakka Bill for GST invoice.
          </div>
          {isCompanyLocked && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Using company details from your profile
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Form
          </button>
          <button
            {...getButtonProps(handleDownloadBillWithPermission, {
              className: "px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors",
              onDisabledClick: () => {
                // This will be triggered when onboarding is not complete
              }
            })}
          >
            Download Bill
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div>
          <BillForm
            formData={formData}
            errors={errors}
            onUpdateBuyer={updateBuyer}
            onUpdateProduct={updateProduct}
            onAddProduct={addProduct}
            onRemoveProduct={removeProduct}
            discount={formData.discount}
            onUpdateDiscount={handleUpdateDiscount}
            companyDetails={manualCompanyDetails}
            isCompanyLocked={isCompanyLocked}
            onUpdateCompany={handleUpdateCompany}
            isKachaBill={true} // New prop to hide GST fields
          />
        </div>

        {/* Right Column - Preview */}
        <div>
          <div className="sticky top-24">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                Kacha Bill
              </span>
            </div>
            <BillPreview 
              formData={formData} 
              totals={totals} 
              companyDetails={manualCompanyDetails}
              isKachaBill={true} // New prop to customize preview
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>• Kacha Bills are temporary/proforma invoices</p>
            <p>• No GST calculation included</p>
            <p>• Can be converted to Pakka Bills later</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Clear All
            </button>
            <button
              {...getButtonProps(handleSaveBillWithPermission, {
                className: `px-6 py-3 rounded-lg transition-colors ${
                  isSubmitting
                    ? 'bg-yellow-400 cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                } text-white`,
                disabled: isSubmitting
              })}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Kacha Bill'
              )}
            </button>
            <button
              onClick={() => navigate('/bills/pakka')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Pakka Bill Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const KachaBillsPage = () => {
  return (
    <ProfileProvider>
      <KachaBillsPageContent />
    </ProfileProvider>
  );
};

export default KachaBillsPage;