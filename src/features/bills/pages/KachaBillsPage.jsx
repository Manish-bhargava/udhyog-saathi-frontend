import React, { useState, useEffect, useRef } from 'react';
import BillForm from '../components/BillForm';
import BillPreview from '../components/BillPreview';
import billAPI from '../api';
import { profileAPI } from '../../profiles/api';

const KachaBillsPage = () => {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [isDragging, setIsDragging] = useState(false);
  const [formWidth, setFormWidth] = useState(60);
  const containerRef = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await profileAPI.getProfile(); 
        if (response.success) {
          setBusinessData(response.data); 
        }
      } catch (err) {
        console.error("Error fetching company data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, []);

  const [formData, setFormData] = useState({
    buyer: { clientName: '', clientAddress: '', clientGst: '' },
    products: [{ name: '', rate: 0, quantity: 1 }],
    discount: 0,
    notes: ''
  });

  const totals = (() => {
    const subtotal = formData.products.reduce((s, p) => s + (p.rate * p.quantity), 0);
    return {
      subtotal,
      discount: formData.discount,
      grandTotal: subtotal - formData.discount
    };
  })();

  // Handle drag start
  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Handle dragging
  const handleDrag = (e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    let newWidth = (mouseX / containerWidth) * 100;
    newWidth = Math.max(30, Math.min(70, newWidth));
    
    setFormWidth(newWidth);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Add event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e) => handleDrag(e);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const response = await billAPI.createKachaBill(formData);
      if (response.success) {
        showNotification('Kacha Bill Saved!', 'Your proforma invoice has been created.', 'success');
        
        setFormData({
          buyer: { clientName: '', clientAddress: '', clientGst: '' },
          products: [{ name: '', rate: 0, quantity: 1 }],
          discount: 0,
          notes: ''
        });
      }
    } catch (err) {
      showNotification('Failed to Save', 'Please check your connection.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for notifications to keep handleSave clean
  const showNotification = (title, msg, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-6 right-6 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-in`;
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="mr-3">${type === 'success' ? '✓' : '✕'}</div>
        <div>
          <p class="font-semibold">${title}</p>
          <p class="text-sm opacity-90">${msg}</p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  };

  const isFormValid = formData.buyer.clientName.trim() && 
    formData.products.every(p => p.name.trim() && p.rate > 0 && p.quantity > 0);

  // Reset to default widths
  const resetLayout = () => {
    setFormWidth(60);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header with Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">Create Kacha Bill</h1>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded">Proforma</span>
              </div>
              <p className="text-xs text-gray-500">Estimates and non-tax quotations</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({
                  buyer: { clientName: '', clientAddress: '', clientGst: '' },
                  products: [{ name: '', rate: 0, quantity: 1 }],
                  discount: 0,
                  notes: ''
                })}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleSave}
                disabled={submitting || !isFormValid}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  submitting || !isFormValid
                    ? 'bg-amber-400 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-sm'
                } text-white flex items-center`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : 'Save Kacha Bill'}
              </button>
            </div>
          </div>
          
          {/* Layout Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600">Layout:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFormWidth(40)}
                  className={`px-2 py-1 text-xs rounded border ${
                    Math.round(formWidth) === 40
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  title="More preview space"
                >
                  More Preview
                </button>
                <button
                  onClick={resetLayout}
                  className={`px-2 py-1 text-xs rounded border ${
                    Math.round(formWidth) === 60
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Balanced view"
                >
                  Balanced
                </button>
                <button
                  onClick={() => setFormWidth(70)}
                  className={`px-2 py-1 text-xs rounded border ${
                    Math.round(formWidth) === 70
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  title="More form space"
                >
                  More Form
                </button>
                <button
                  onClick={resetLayout}
                  className="px-2 py-1 text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded hover:bg-gray-100"
                  title="Reset to default"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Current: {Math.round(formWidth)}% Form / {Math.round(100 - formWidth)}% Preview
            </div>
          </div>
          
          {/* Tabs for mobile view */}
          <div className="md:hidden flex border-b border-gray-200 mb-4 mt-4">
            <button
              className={`flex-1 py-2 text-sm font-medium text-center ${
                activeTab === 'form'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('form')}
            >
              Form
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium text-center ${
                activeTab === 'preview'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
          </div>
          
          {!isFormValid && (
            <div className="mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-700 flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.338 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Required: Client Name and at least one Product with rate/quantity.
              </p>
            </div>
          )}
        </div>

        {/* Two Column Layout - Dynamic with draggable divider */}
        <div 
          ref={containerRef}
          className="hidden md:flex flex-row h-[calc(100vh-180px)] relative"
        >
          {/* Left Column - Form */}
          <div 
            className="overflow-y-auto pr-2"
            style={{ width: `${formWidth}%` }}
          >
            <div className="sticky top-0 bg-gray-50 pt-1 pb-3 mb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Invoice Details</h2>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                  Fill all details
                </span>
              </div>
            </div>
            <div className="pr-2">
              <BillForm formData={formData} setFormData={setFormData} isKachaBill={true} />
            </div>
          </div>

          {/* Draggable Divider */}
          <div
            ref={dividerRef}
            className={`relative flex items-center justify-center w-2 group ${
              isDragging ? 'bg-amber-500' : 'bg-gray-200 hover:bg-amber-400'
            } cursor-col-resize transition-colors`}
            onMouseDown={handleDragStart}
            style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-10 bg-gray-400 group-hover:bg-white rounded-full"></div>
            </div>
            <div className="absolute -left-1 -right-1 top-0 bottom-0"></div>
          </div>

          {/* Right Column - Preview */}
          <div 
            className="overflow-y-auto pl-2"
            style={{ width: `${100 - formWidth}%` }}
          >
            <div className="sticky top-0 bg-gray-50 pt-1 pb-3 mb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                  Kacha Bill Mode
                </span>
              </div>
            </div>

            {loading ? (
              <div className="bg-white w-full h-full rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-3"></div>
                  <p className="text-sm text-gray-500">Loading profile...</p>
                </div>
              </div>
            ) : (
              <div className="shadow-xl rounded-xl overflow-hidden border border-gray-200">
                <BillPreview 
                  formData={formData} 
                  totals={totals} 
                  isKachaBill={true}
                  companyDetails={{
                    companyName: businessData?.company?.companyName,
                    companyAddress: businessData?.company?.companyAddress,
                    companyEmail: businessData?.company?.companyEmail,
                    companyLogo: businessData?.company?.companyLogo,
                    GST: businessData?.company?.GST,
                    bankName: businessData?.bankDetails?.bankName,
                    accountNumber: businessData?.bankDetails?.accountNumber,
                    IFSC: businessData?.bankDetails?.IFSC
                  }} 
                />
                
                {/* Quick Stats */}
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                      <p className="text-lg font-bold text-gray-800">₹{totals.subtotal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Grand Total</p>
                      <p className="text-lg font-bold text-amber-700">₹{totals.grandTotal.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Help Text */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-xs text-amber-700 flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <span className="font-semibold">Note:</span> This is a Kacha Bill (Proforma Invoice). 
                  Drag the divider or use layout buttons to adjust the view. Convert to Pakka Bill for official use.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Mobile view - Tabbed interface */}
        <div className="md:hidden">
          <div className={`${activeTab === 'form' ? 'block' : 'hidden'}`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Invoice Details</h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                Fill all details
              </span>
            </div>
            <BillForm formData={formData} setFormData={setFormData} isKachaBill={true} />
          </div>
          
          <div className={`${activeTab === 'preview' ? 'block' : 'hidden'}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                Kacha Bill Mode
              </span>
            </div>
            
            {loading ? (
              <div className="bg-white w-full h-96 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-3"></div>
                  <p className="text-sm text-gray-500">Loading profile...</p>
                </div>
              </div>
            ) : (
              <div className="shadow-xl rounded-xl overflow-hidden border border-gray-200">
                <BillPreview 
                  formData={formData} 
                  totals={totals} 
                  isKachaBill={true}
                  companyDetails={{
                    companyName: businessData?.company?.companyName,
                    companyAddress: businessData?.company?.companyAddress,
                    companyEmail: businessData?.company?.companyEmail,
                    companyLogo: businessData?.company?.companyLogo,
                    GST: businessData?.company?.GST,
                    bankName: businessData?.bankDetails?.bankName,
                    accountNumber: businessData?.bankDetails?.accountNumber,
                    IFSC: businessData?.bankDetails?.IFSC
                  }} 
                />
                
                {/* Quick Stats */}
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                      <p className="text-lg font-bold text-gray-800">₹{totals.subtotal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Grand Total</p>
                      <p className="text-lg font-bold text-amber-700">₹{totals.grandTotal.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile navigation buttons */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-10">
          <div className="bg-white rounded-xl shadow-lg p-3 flex justify-between items-center border border-gray-200">
            <span className="text-sm text-gray-600">
              {activeTab === 'form' ? 'Form View' : 'Preview View'}
            </span>
            <button
              onClick={() => setActiveTab(activeTab === 'form' ? 'preview' : 'form')}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              {activeTab === 'form' ? 'View Preview' : 'Back to Form'}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        
        /* Improve scrollbar */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default KachaBillsPage;