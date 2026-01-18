// src/features/bills/pages/PakkaBillsPage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useBillForm } from '../hooks/useBillForm';
import BillForm from '../components/BillForm';
import BillPreview from '../components/BillPreview';
import billAPI from '../api';
import { INITIAL_BILL_DATA } from '../types';
import { ProfileProvider, useProfile } from '../../profile/context/ProfileContext';
import { useAuth } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../auth/hooks/usePermissions';

const PakkaBillsPageContent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [manualCompanyDetails, setManualCompanyDetails] = useState({
    companyName: '',
    companyAddress: '',
    GST: '',
    companyPhone: '',
    companyEmail: '',
    companyStamp: '',
    companySignature: ''
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
  } = useBillForm(INITIAL_BILL_DATA);

  const totals = calculateTotals();

  // Initialize company details based on onboarding status
  useEffect(() => {
    if (isCompanyLocked && profile?.company) {
      // Use profile company details when onboarding is complete
      setManualCompanyDetails({
        companyName: profile.company.companyName || '',
        companyAddress: profile.company.companyAddress || '',
        GST: profile.company.GST || '',
        companyPhone: profile.company.companyPhone || '',
        companyEmail: profile.company.companyEmail || '',
        companyStamp: profile.company.companyStamp || '',
        companySignature: profile.company.companySignature || ''
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
        gstPercentage: formData.gstPercentage,
        discount: discountPercentage // Send as percentage
      };

      const response = await billAPI.createPakkaBill(billData);
      
      if (response.success) {
        setSuccessMessage('Bill created successfully!');
        resetForm();
        
        // Dispatch custom event to notify All Bills page
        window.dispatchEvent(new CustomEvent('billCreated'));
        
        // Auto-clear success message
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage(response.message || 'Failed to create bill');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
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
    const companyGST = manualCompanyDetails.GST || '';
    const companyPhone = manualCompanyDetails.companyPhone || '';
    const companyEmail = manualCompanyDetails.companyEmail || '';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${Date.now().toString().slice(-6)}</title>
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
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <h1>TAX INVOICE</h1>
              <p>Invoice #: INV-${Date.now().toString().slice(-6)}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="company-header">
              <h2>${companyName}</h2>
              ${companyAddress ? `<p>${companyAddress}</p>` : ''}
              ${companyGST ? `<p>GST: ${companyGST}</p>` : ''}
              ${companyPhone ? `<p>Phone: ${companyPhone}</p>` : ''}
              ${companyEmail ? `<p>Email: ${companyEmail}</p>` : ''}
            </div>
          </div>
          
          <div class="client-details">
            <h3>Bill To:</h3>
            <p><strong>${formData.buyer.clientName}</strong><br>
            ${formData.buyer.clientAddress || ''}<br>
            GST: ${formData.buyer.clientGst || 'N/A'}</p>
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
            <p>GST (${formData.gstPercentage}%): ₹${totals.gstAmount.toFixed(2)}</p>
            <p>Discount (${totals.discountPercentage.toFixed(2)}%): ₹${totals.discount.toFixed(2)}</p>
            <p><strong>Grand Total: ₹${totals.grandTotal.toFixed(2)}</strong></p>
          </div>
          
          <div class="footer">
            <p>Payment Terms: Net 30 days</p>
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleUpdateGst = (value) => {
    setFormData(prev => ({ ...prev, gstPercentage: value }));
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
          <h1 className="text-2xl font-bold text-gray-800">Create Pakka Bill</h1>
          <p className="text-gray-600 mt-1">Create a complete tax invoice with GST calculation</p>
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
              className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",
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
            gstPercentage={formData.gstPercentage}
            discount={formData.discount}
            onUpdateGst={handleUpdateGst}
            onUpdateDiscount={handleUpdateDiscount}
            companyDetails={manualCompanyDetails}
            isCompanyLocked={isCompanyLocked}
            onUpdateCompany={handleUpdateCompany}
          />
        </div>

        {/* Right Column - Preview */}
        <div>
          <div className="sticky top-24">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
              <div className="text-sm text-gray-500">
                Updates in real-time
              </div>
            </div>
            <BillPreview formData={formData} totals={totals} companyDetails={manualCompanyDetails} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-end space-x-4">
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
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
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
              'Save Bill'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PakkaBillsPage = () => {
  return (
    <ProfileProvider>
      <PakkaBillsPageContent />
    </ProfileProvider>
  );
};

export default PakkaBillsPage;