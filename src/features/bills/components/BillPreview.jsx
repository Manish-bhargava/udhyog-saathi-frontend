


import React from 'react';

const BillPreview = ({ formData, totals, companyDetails, isKachaBill = false }) => {
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 min-h-[700px] flex flex-col">
      {/* Invoice Header */}
      <div className="flex justify-between items-start pb-8 border-b border-gray-200 mb-8">
        <div>
          <div className={`text-3xl font-bold mb-2 ${isKachaBill ? 'text-amber-600' : 'text-blue-600'}`}>
            {isKachaBill ? 'PROFORMA INVOICE' : 'TAX INVOICE'}
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-500">
              Invoice #: <span className="font-medium text-gray-700">INV-{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="text-sm text-gray-500">
              Date: <span className="font-medium text-gray-700">{new Date().toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 mx-auto ${
            isKachaBill ? 'bg-amber-50' : 'bg-blue-50'
          }`}>
            <span className={`text-2xl font-bold ${isKachaBill ? 'text-amber-600' : 'text-blue-600'}`}>
              {companyDetails.companyName?.charAt(0) || 'C'}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">{companyDetails.companyName || 'Your Company'}</div>
          {companyDetails.GST && !isKachaBill && (
            <div className="text-sm text-gray-600 mt-1">GST: {companyDetails.GST}</div>
          )}
        </div>
      </div>

      {/* Company & Buyer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">From</h4>
          <div className="bg-gray-50 p-5 rounded-xl">
            <div className="font-semibold text-gray-900 text-lg mb-2">{companyDetails.companyName || 'Your Company Name'}</div>
            <div className="text-gray-600 text-sm mb-1">{companyDetails.companyAddress || 'Company Address, City, State'}</div>
            {companyDetails.companyEmail && (
              <div className="text-gray-600 text-sm mb-1">Email: {companyDetails.companyEmail}</div>
            )}
            {companyDetails.companyPhone && (
              <div className="text-gray-600 text-sm">Phone: {companyDetails.companyPhone}</div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Bill To</h4>
          <div className="bg-gray-50 p-5 rounded-xl">
            <div className="font-semibold text-gray-900 text-lg mb-2">{formData.buyer.clientName || 'Client Name'}</div>
            <div className="text-gray-600 text-sm mb-1">{formData.buyer.clientAddress || 'Client Address'}</div>
            {!isKachaBill && formData.buyer.clientGst && (
              <div className="text-gray-600 text-sm">GST: {formData.buyer.clientGst}</div>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="flex-1 mb-8">
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className={`${isKachaBill ? 'bg-amber-50' : 'bg-blue-50'} border-b border-gray-200`}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formData.products.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.name || `Item ${i + 1}`}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(p.rate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">x{p.quantity}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(p.rate * p.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="max-w-md ml-auto space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{formatCurrency(totals.subtotal)}</span>
          </div>
          
          {!isKachaBill && formData.gstPercentage > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GST ({formData.gstPercentage}%)</span>
              <span className="font-medium text-gray-900">{formatCurrency(totals.gstAmount || 0)}</span>
            </div>
          )}
          
          {totals.discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-red-600">-{formatCurrency(totals.discount)}</span>
            </div>
          )}
          
          <div className="border-t border-gray-300 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className={`text-xl font-bold ${isKachaBill ? 'text-amber-700' : 'text-blue-700'}`}>
                {isKachaBill ? 'Total Amount' : 'Grand Total'}
              </span>
              <span className={`text-2xl font-bold ${isKachaBill ? 'text-amber-700' : 'text-blue-700'}`}>
                {formatCurrency(totals.grandTotal)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Invoice Notes */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Payment Terms</h5>
              <p className="text-sm text-gray-600">Net 30 days from invoice date</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Notes</h5>
              <p className="text-sm text-gray-600">
                {isKachaBill 
                  ? 'This is a proforma invoice (Kacha Bill). Not valid for tax purposes.' 
                  : 'Thank you for your business!'}
              </p>
            </div>
          </div>
          
          {isKachaBill && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.338 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Important:</span> This is a temporary invoice. Convert to Pakka Bill for GST-compliant tax invoice.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillPreview;