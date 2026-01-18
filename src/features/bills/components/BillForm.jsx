

import React from 'react';

const BillForm = ({ formData, setFormData, isKachaBill = false }) => {
  const updateBuyer = (field, value) => {
    setFormData({ ...formData, buyer: { ...formData.buyer, [field]: value } });
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;
    setFormData({ ...formData, products: newProducts });
  };

  const addProduct = () => {
    setFormData({ ...formData, products: [...formData.products, { name: '', rate: 0, quantity: 1 }] });
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index);
      setFormData({ ...formData, products: newProducts });
    }
  };

  return (
    <div className="space-y-8">
      {/* Buyer Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className={`p-2 rounded-lg ${isKachaBill ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} mr-3`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Buyer Details</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Client Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input 
              type="text"
              value={formData.buyer.clientName}
              onChange={(e) => updateBuyer('clientName', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Enter client name"
            />
          </div>
          
          {!isKachaBill && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Client GST</label>
              <input 
                type="text"
                value={formData.buyer.clientGst}
                onChange={(e) => updateBuyer('clientGst', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="GSTIN number"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Client Address</label>
            <textarea 
              value={formData.buyer.clientAddress}
              onChange={(e) => updateBuyer('clientAddress', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
              rows="3"
              placeholder="Complete address with city and state"
            />
          </div>
        </div>
      </div>

      {/* Products Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${isKachaBill ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} mr-3`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Products & Services</h3>
          </div>
          <button
            onClick={addProduct}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 mb-3 px-4">
          <div className="col-span-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</div>
          <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Rate (₹)</div>
          <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Quantity</div>
          <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Amount</div>
          <div className="col-span-1"></div>
        </div>
        
        <div className="space-y-3">
          {formData.products.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white transition-colors">
              <div className="col-span-5">
                <input
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
                  placeholder="Product/Service name"
                  value={p.name}
                  onChange={(e) => updateProduct(i, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-right text-sm"
                  type="number"
                  placeholder="0.00"
                  value={p.rate}
                  onChange={(e) => updateProduct(i, 'rate', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-right text-sm"
                  type="number"
                  placeholder="1"
                  value={p.quantity}
                  onChange={(e) => updateProduct(i, 'quantity', parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>
              <div className="col-span-2 text-right">
                <div className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800">
                  ₹{(p.rate * p.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                {formData.products.length > 1 && (
                  <button
                    onClick={() => removeProduct(i)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax & Discount Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className={`p-2 rounded-lg ${isKachaBill ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} mr-3`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {isKachaBill ? 'Discount' : 'Tax & Discount'}
          </h3>
        </div>
        
        <div className={`grid gap-6 ${isKachaBill ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {!isKachaBill && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">GST Percentage</label>
              <select
                value={formData.gstPercentage}
                onChange={(e) => setFormData({...formData, gstPercentage: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
              >
                <option value="0">0% - No GST</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Select applicable GST rate for this invoice</p>
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Discount Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Applied discount:</span>
              <span className="font-medium text-red-600">-₹{formData.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        
        {isKachaBill && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-700">
                This is a Kacha Bill (Proforma Invoice). GST calculation is not available. Convert to Pakka Bill for tax-compliant invoicing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillForm;