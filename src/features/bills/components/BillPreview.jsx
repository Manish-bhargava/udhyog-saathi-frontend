// src/features/bills/components/BillPreview.jsx
import React from 'react';

const BillPreview = ({ formData, totals, companyDetails, isKachaBill = false }) => {
  const hasCompanyLogo = companyDetails.companyStamp || companyDetails.companySignature;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isKachaBill ? 'KACHA BILL' : 'TAX INVOICE'}
            {isKachaBill && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                PROFORMA
              </span>
            )}
          </h2>
          <div className="mt-2">
            <div className="text-sm text-gray-600">
              {isKachaBill ? 'Bill' : 'Invoice'} #: {isKachaBill ? 'KACHA-' : 'INV-'}{Date.now().toString().slice(-6)}
            </div>
            <div className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</div>
            {isKachaBill && (
              <div className="text-xs text-yellow-600 mt-1">
                This is a temporary/proforma invoice
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          {hasCompanyLogo ? (
            <div className="flex items-center justify-end mb-2">
              {companyDetails.companyStamp && (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={companyDetails.companyStamp} 
                    alt="Company Stamp" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {companyDetails.companySignature && (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden ml-2">
                  <img 
                    src={companyDetails.companySignature} 
                    alt="Company Signature" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-2 ${
              isKachaBill ? 'bg-yellow-100' : 'bg-blue-100'
            }`}>
              <span className={`text-2xl font-bold ${isKachaBill ? 'text-yellow-600' : 'text-blue-600'}`}>
                C
              </span>
            </div>
          )}
          <div className="text-lg font-bold text-gray-800">{companyDetails.companyName || 'Company Name'}</div>
        </div>
      </div>

      {/* Company and Buyer Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">From:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-800">{companyDetails.companyName || 'Your Company Name'}</div>
            <div className="text-sm text-gray-600 mt-1">
              {companyDetails.companyAddress || 'Company Address'}
            </div>
            {/* Hide GST for Kacha Bills */}
            {!isKachaBill && companyDetails.GST && (
              <div className="text-sm text-gray-600 mt-1">
                GST: {companyDetails.GST}
              </div>
            )}
            {companyDetails.companyPhone && (
              <div className="text-sm text-gray-600 mt-1">
                Phone: {companyDetails.companyPhone}
              </div>
            )}
            {companyDetails.companyEmail && (
              <div className="text-sm text-gray-600 mt-1">
                Email: {companyDetails.companyEmail}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-800">
              {formData.buyer.clientName || 'Client Name'}
            </div>
            {formData.buyer.clientAddress && (
              <div className="text-sm text-gray-600 mt-1">
                {formData.buyer.clientAddress}
              </div>
            )}
            {/* Hide GST for Kacha Bills */}
            {!isKachaBill && formData.buyer.clientGst && (
              <div className="text-sm text-gray-600 mt-1">
                GST: {formData.buyer.clientGst}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${isKachaBill ? 'bg-yellow-100' : 'bg-gray-100'}`}>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-medium">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-medium">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-medium">Rate (₹)</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-medium">Qty</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-medium">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {formData.products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{product.name || 'Product Name'}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{product.rate.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{product.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{(product.rate * product.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals - Different for Kacha Bills */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
          </div>
          
          {/* GST only for Pakka Bills */}
          {!isKachaBill && formData.gstPercentage > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">GST ({formData.gstPercentage}%):</span>
              <span className="font-medium">₹{totals.gstAmount?.toFixed(2) || '0.00'}</span>
            </div>
          )}
          
          {/* Discount */}
          {totals.discount > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Discount ({totals.discountPercentage.toFixed(2)}%):</span>
              <span className="font-medium text-red-600">-₹{totals.discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between py-2 border-t border-gray-300 mt-2 pt-2">
            <span className={`${isKachaBill ? 'text-yellow-700' : 'text-gray-800'} text-lg font-bold`}>
              {isKachaBill ? 'Total Amount:' : 'Grand Total:'}
            </span>
            <span className={`${isKachaBill ? 'text-yellow-700' : 'text-gray-800'} text-lg font-bold`}>
              ₹{totals.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Notes - Different for Kacha Bills */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-1">Payment Terms:</div>
            <div>Net 30 days</div>
          </div>
          <div>
            <div className="font-medium mb-1">Notes:</div>
            <div>
              {isKachaBill 
                ? 'This is a Kacha Bill (Proforma Invoice). Not valid for tax purposes.' 
                : 'Thank you for your business!'}
            </div>
          </div>
        </div>
        {isKachaBill && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-yellow-700 text-xs">
              <strong>Important:</strong> This is a temporary invoice. For official tax invoice with GST, 
              please convert this to a Pakka Bill.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillPreview;