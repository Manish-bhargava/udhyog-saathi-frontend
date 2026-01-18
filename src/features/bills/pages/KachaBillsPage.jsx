


import React, { useState } from 'react';
import BillForm from '../components/BillForm';
import BillPreview from '../components/BillPreview';
import billAPI from '../api';

const KachaBillsPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const profile = JSON.parse(localStorage.getItem('user')) || {};

  const [formData, setFormData] = useState({
    buyer: { clientName: '', clientAddress: '', clientGst: '' },
    products: [{ name: '', rate: 0, quantity: 1 }],
    discount: 0
  });

  const totals = (() => {
    const subtotal = formData.products.reduce((s, p) => s + (p.rate * p.quantity), 0);
    return {
      subtotal,
      discount: formData.discount,
      grandTotal: subtotal - formData.discount
    };
  })();

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const response = await billAPI.createKachaBill(formData);
      if (response.success) {
        // Success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-in';
        notification.innerHTML = `
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p class="font-semibold">Kacha Bill Saved!</p>
              <p class="text-sm opacity-90">Your proforma invoice has been created successfully.</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
        // Reset form
        setFormData({
          buyer: { clientName: '', clientAddress: '', clientGst: '' },
          products: [{ name: '', rate: 0, quantity: 1 }],
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-amber-50 rounded-xl mr-4">
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Kacha Bill</h1>
              <p className="text-gray-600 mt-1">Create a proforma invoice for estimates and quotations</p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-amber-800 font-medium">What is a Kacha Bill?</p>
                <p className="text-amber-700 text-sm mt-1">
                  Kacha Bills are proforma invoices used for estimates, quotations, or temporary billing. 
                  They don't include GST calculations. Convert to Pakka Bill for official tax invoices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <BillForm formData={formData} setFormData={setFormData} isKachaBill={true} />
            </div>
            
            {/* Action Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Ready to Save?</h4>
                  <p className="text-sm text-gray-600">Save this Kacha Bill to your history</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({
                      buyer: { clientName: '', clientAddress: '', clientGst: '' },
                      products: [{ name: '', rate: 0, quantity: 1 }],
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
                        ? 'bg-amber-400 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-700 shadow-sm hover:shadow-md'
                    } text-white flex items-center`}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save Kacha Bill
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
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                Kacha Bill • Proforma
              </span>
            </div>
            <BillPreview 
              formData={formData} 
              totals={totals} 
              companyDetails={profile.company || {}} 
              isKachaBill={true} 
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

export default KachaBillsPage;