

import React, { useState } from 'react';
import BillForm from '../components/BillForm';
import BillPreview from '../components/BillPreview';
import billAPI from '../api';

const PakkaBillsPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const profile = JSON.parse(localStorage.getItem('profile')) || {};

  const [formData, setFormData] = useState({
    buyer: { clientName: '', clientAddress: '', clientGst: '' },
    products: [{ name: '', rate: 0, quantity: 1 }],
    gstPercentage: 18,
    discount: 0
  });

  const totals = (() => {
    const subtotal = formData.products.reduce((s, p) => s + (p.rate * p.quantity), 0);
    const gst = (subtotal * formData.gstPercentage) / 100;
    return {
      subtotal,
      gstAmount: gst,
      discount: formData.discount,
      grandTotal: subtotal + gst - formData.discount,
      discountPercentage: subtotal > 0 ? (formData.discount / subtotal) * 100 : 0
    };
  })();

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const response = await billAPI.createPakkaBill(formData);
      if (response.success) {
        // Success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-in';
        notification.innerHTML = `
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-semibold">Pakka Bill Created!</p>
              <p class="text-sm opacity-90">Your GST invoice has been saved successfully.</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
        // Reset form
        setFormData({
          buyer: { clientName: '', clientAddress: '', clientGst: '' },
          products: [{ name: '', rate: 0, quantity: 1 }],
          gstPercentage: 18,
          discount: 0
        });
      }
    } catch (err) {
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed top-6 right-6 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-in';
      errorNotification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-semibold">Failed to Save</p>
            <p class="text-sm opacity-90">Please check your connection and try again.</p>
          </div>
        </div>
      `;
      document.body.appendChild(errorNotification);
      setTimeout(() => errorNotification.remove(), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = formData.buyer.clientName.trim() && 
    formData.products.every(p => p.name.trim() && p.rate > 0 && p.quantity > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
       
        {/* <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-50 rounded-xl mr-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Pakka Bill</h1>
              <p className="text-gray-600 mt-1">Create a complete GST invoice for tax-compliant billing</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 font-medium">What is a Pakka Bill?</p>
                <p className="text-blue-700 text-sm mt-1">
                  Pakka Bills are official tax invoices that include GST calculations. 
                  They are legally valid for tax filing and compliance. Ensure client GST details are accurate.
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <BillForm formData={formData} setFormData={setFormData} />
            </div>
            
            {/* Action Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Ready to Create Invoice?</h4>
                  <p className="text-sm text-gray-600">Save this as a complete GST invoice</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({
                      buyer: { clientName: '', clientAddress: '', clientGst: '' },
                      products: [{ name: '', rate: 0, quantity: 1 }],
                      gstPercentage: 18,
                      discount: 0
                    })}
                    className="px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Clear Form
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={submitting || !isFormValid}
                    className={`px-6 py-3 font-semibold rounded-xl transition-all ${
                      submitting || !isFormValid
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md'
                    } text-white flex items-center`}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Invoice...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Save Pakka Bill
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {!isFormValid && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.338 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Please fill in all required fields (Client Name and Product details) before saving.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Pakka Bill • GST Invoice
              </span>
            </div>
            <BillPreview 
              formData={formData} 
              totals={totals} 
              companyDetails={profile.company || {}} 
            />
          </div>
        </div>
      </div>
      
      {/* Custom Animation CSS */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PakkaBillsPage;