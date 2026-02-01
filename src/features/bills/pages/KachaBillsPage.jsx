import React, { useState, useEffect, useRef } from 'react';
import BillForm from '../components/BillForm';
import BillPreview from '../components/BillPreview';
import billAPI from '../api';
import { profileAPI } from '../../profiles/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const KachaBillsPage = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [isDragging, setIsDragging] = useState(false);
  const [formWidth, setFormWidth] = useState(50);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await profileAPI.getProfile(); 
        if (response.success) {
          setBusinessData(response.data);
          if (!response.data.company?.companyName) {
            toast.error('Onboarding Required', {
              description: 'Please complete your business profile in Settings to enable billing.'
            });
          }
        }
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 403) {
            toast.error('Complete your profile setup to start creating bills.');
        }
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
  console.log("Kacha Bill Form Data:", formData);


  const totals = (() => {
    const subtotal = formData.products.reduce((s, p) => s + (Number(p.rate || 0) * Number(p.quantity || 0)), 0);
    const discountAmount = Number(formData.discount) || 0; // Treat as Amount
    const gst = 0;
    
    return {
      subtotal,
      discount: discountAmount,
      grandTotal: Math.max(0, subtotal + (gst || 0) - discountAmount)
    };
  })();

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleDrag = (e) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    let newWidth = (mouseX / containerRect.width) * 100;
    setFormWidth(Math.max(30, Math.min(70, newWidth)));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  const handleSave = async () => {
    if (!businessData?.company?.companyName) {
      toast.error('Action Blocked', { description: 'Onboarding required.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await billAPI.createKachaBill(formData);

      if (response.success) {
        toast.success('Kacha Bill Created!', {
          description: 'Your proforma invoice has been saved.',
          action: {
            label: 'View Dashboard',
            onClick: () => navigate('/dashboard')
          }
        });
        
        setFormData({
          buyer: { clientName: '', clientAddress: '', clientGst: '' },
          products: [{ name: '', rate: 0, quantity: 1 }],
          discount: 0,
          notes: ''
        });
      }
    } catch (err) {
      toast.error('Failed to Save');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = formData.buyer.clientName.trim() && 
    formData.products.every(p => p.name.trim() && p.rate > 0 && p.quantity > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p- overflow-hidden">
      <div className="max-w-[1800px] mx-auto h-full flex flex-col">
        
        {/* COMPACT HEADER */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2 mb-2">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm md:text-lg font-bold text-gray-900 truncate">Kacha Bill</h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] md:text-[10px] font-bold uppercase rounded">Proforma</span>
              
              {/* COMPACT WARNING */}
              {!businessData?.company?.companyName && (
                <div className="hidden lg:flex items-center gap-1.5 ml-4 px-2 py-1 bg-red-50 border border-red-100 rounded text-[10px] text-red-600">
                  <span className="font-bold">Note:</span> Complete onboarding in Settings for full bill details.
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setFormData({ buyer: { clientName: '', clientAddress: '', clientGst: '' }, products: [{ name: '', rate: 0, quantity: 1 }], discount: 0, notes: '' })}
                className="px-2 md:px-3 py-1.5 border border-gray-300 text-gray-600 text-[10px] md:text-xs font-medium rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={handleSave}
                disabled={submitting || !isFormValid}
                className={`px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md text-white shadow-sm transition-all ${submitting || !isFormValid ? 'bg-amber-300' : 'bg-amber-600 hover:bg-amber-700'}`}
              >
                {submitting ? 'Saving...' : 'Save Bill'}
              </button>
            </div>
          </div>
          
          {/* MOBILE ONLY WARNING */}
          {!businessData?.company?.companyName && (
            <div className="lg:hidden mt-1 text-[9px] text-red-500 font-medium">
              ⚠️ Complete onboarding in Settings for full bill details.
            </div>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div ref={containerRef} className="hidden md:flex flex-row h-[calc(100vh-130px)] relative">
          {/* FORM COLUMN */}
          <div className="overflow-y-auto pr-2" style={{ width: `${formWidth}%` }}>
            <BillForm formData={formData} setFormData={setFormData} isKachaBill={true} />
          </div>

          {/* DRAGGABLE DIVIDER */}
          <div
            className={`w-1.5 group ${isDragging ? 'bg-amber-500' : 'bg-gray-200 hover:bg-amber-400'} cursor-col-resize transition-colors rounded-full mx-0.5`}
            onMouseDown={handleDragStart}
          >
            <div className="h-8 w-1 bg-gray-400 mx-auto mt-[35vh] rounded-full opacity-50"></div>
          </div>

          {/* PREVIEW COLUMN */}
          <div className="overflow-y-auto pl-2" style={{ width: `${100 - formWidth}%` }}>
            {!loading && (
              <div className="shadow-lg rounded-xl overflow-hidden border border-gray-200 bg-white">
                <BillPreview 
                  formData={formData} 
                  totals={totals} 
                  isKachaBill={true}
                  companyDetails={{
                    companyName: businessData?.company?.companyName,
                    companyAddress: businessData?.company?.companyAddress,
                    companyEmail: businessData?.company?.companyEmail,
                    companyLogo: businessData?.company?.companyLogo,
                    companyStamp: businessData?.company?.companyStamp,
                    companySignature: businessData?.company?.companySignature,
                    GST: businessData?.company?.GST,
                    bankName: businessData?.bankDetails?.bankName,
                    accountNumber: businessData?.bankDetails?.accountNumber,
                    IFSC: businessData?.bankDetails?.IFSC
                  }} 
                />
              </div>
            )}
          </div>
        </div>

        {/* MOBILE VIEW TABS */}
        <div className="md:hidden flex flex-col h-[calc(100vh-160px)]">
          <div className="flex border-b border-gray-200 mb-2">
            <button 
              className={`flex-1 py-2 text-xs font-bold ${activeTab === 'form' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-400'}`}
              onClick={() => setActiveTab('form')}
            >
              Edit Form
            </button>
            <button 
              className={`flex-1 py-2 text-xs font-bold ${activeTab === 'preview' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-400'}`}
              onClick={() => setActiveTab('preview')}
            >
              View Preview
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-16">
            {activeTab === 'form' ? (
              <BillForm formData={formData} setFormData={setFormData} isKachaBill={true} />
            ) : (
              <div className="scale-[0.98] origin-top">
                {!loading && (
                  <BillPreview 
                    formData={formData} 
                    totals={totals} 
                    isKachaBill={true}
                    companyDetails={{
                      companyName: businessData?.company?.companyName,
                      companyAddress: businessData?.company?.companyAddress,
                      companyEmail: businessData?.company?.companyEmail,
                      companyLogo: businessData?.company?.companyLogo,
                      companyStamp: businessData?.company?.companyStamp,
                      companySignature: businessData?.company?.companySignature,
                      GST: businessData?.company?.GST,
                      bankName: businessData?.bankDetails?.bankName,
                      accountNumber: businessData?.bankDetails?.accountNumber,
                      IFSC: businessData?.bankDetails?.IFSC
                    }} 
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Improve scrollbar for cleaner look */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default KachaBillsPage;