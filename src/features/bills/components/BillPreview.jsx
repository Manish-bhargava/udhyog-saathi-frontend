import React from 'react';

const BillPreview = ({ formData, totals, companyDetails, isKachaBill = false }) => {
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formattedDate = new Date().toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });

  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

  return (
    <div className="bg-white w-full shadow-2xl rounded-lg flex flex-col p-4 md:p-6 lg:p-10 print:shadow-none print:p-0 overflow-hidden scale-95 md:scale-100 origin-top">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 mb-6 md:mb-10 border-b pb-4 md:pb-8 border-slate-100">
        <div className="min-w-0 flex-1">
          <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 md:mb-6 break-words ${isKachaBill ? 'text-amber-600' : 'text-slate-800'}`}>
            {isKachaBill ? 'Proforma Invoice' : 'Invoice'}
          </h1>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <div className="min-w-0">
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Number</p>
              <p className="text-slate-800 font-semibold text-sm md:text-base break-all">{invoiceNumber}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Issue</p>
              <p className="text-slate-800 font-semibold text-sm md:text-base">{formattedDate}</p>
            </div>
          </div>
        </div>
        
        {/* COMPANY LOGO - Only shown if it exists */}
        {companyDetails.companyLogo && (
          <div className="flex-shrink-0 self-center md:self-start mt-2 md:mt-0">
            <img 
              src={companyDetails.companyLogo} 
              alt={`${companyDetails.companyName || 'Company'} Logo`} 
              className="max-h-12 md:max-h-16 lg:max-h-20 w-auto object-contain" 
            />
          </div>
        )}
      </div>

      {/* ADDRESSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12">
        <div className="min-w-0">
          <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Billed To</h3>
          <p className="font-bold text-slate-800 text-lg md:text-xl break-words leading-tight mb-1 md:mb-2">
            {formData.buyer.clientName}
          </p>
          <p className="text-slate-500 text-xs md:text-sm whitespace-pre-wrap break-words leading-relaxed">
            {formData.buyer.clientAddress}
          </p>
          {!isKachaBill && formData.buyer.clientGst && (
            <p className="text-slate-600 text-xs mt-2 md:mt-3 font-medium bg-slate-50 inline-block px-2 py-1 rounded">
              GSTIN: {formData.buyer.clientGst}
            </p>
          )}
        </div>

        <div className="min-w-0 md:text-right mt-4 md:mt-0">
          <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3 md:ml-auto">From</h3>
          <p className="font-bold text-slate-800 text-lg md:text-xl break-words leading-tight mb-1 md:mb-2">
            {companyDetails.companyName}
          </p>
          <p className="text-slate-500 text-xs md:text-sm whitespace-pre-wrap break-words leading-relaxed">
            {companyDetails.companyAddress}
          </p>
          {companyDetails.GST && !isKachaBill && (
             <p className="text-slate-600 text-xs mt-2 md:mt-3 font-medium bg-slate-50 inline-block px-2 py-1 rounded">
              GST: {companyDetails.GST}
            </p>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-x-auto -mx-2 md:mx-0">
        <table className="w-full mb-6 md:mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="text-left py-2 md:py-4 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest w-1/2 px-2">Description</th>
              <th className="text-right py-2 md:py-4 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Rate</th>
              <th className="text-right py-2 md:py-4 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest w-12 md:w-16 px-2">Qty</th>
              <th className="text-right py-2 md:py-4 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {formData.products.map((p, i) => (
              <tr key={i} className="group">
                <td className="py-3 md:py-5 pr-2 md:pr-4 text-xs md:text-sm font-semibold text-slate-700 break-words max-w-[150px] md:max-w-[200px] px-2">
                  {p.name || 'Untitled Product/Service'}
                </td>
                <td className="py-3 md:py-5 text-xs md:text-sm text-right text-slate-500 tabular-nums px-2">
                  {formatCurrency(p.rate)}
                </td>
                <td className="py-3 md:py-5 text-xs md:text-sm text-right text-slate-500 tabular-nums px-2">
                  {p.quantity}
                </td>
                <td className="py-3 md:py-5 text-xs md:text-sm text-right font-bold text-slate-800 tabular-nums px-2">
                  {formatCurrency(p.rate * p.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="flex flex-col items-end pt-4 md:pt-6 border-t border-slate-100">
        <div className="w-full max-w-xs space-y-2 md:space-y-3">
          <div className="flex justify-between text-xs md:text-sm text-slate-500">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-700">{formatCurrency(totals.subtotal)}</span>
          </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-xs md:text-sm text-slate-500">
                <span>Discount</span>
                <span className="font-semibold text-red-600">-{formatCurrency(totals.discount)}</span>
              </div>
            )}
          <div className={`flex justify-between text-lg md:text-xl lg:text-2xl font-black pt-3 md:pt-4 border-t-2 mt-1 md:mt-2 ${isKachaBill ? 'text-amber-600 border-amber-50' : 'text-slate-900 border-slate-900'}`}>
            <span className="mr-2 md:mr-4">Total</span>
            <span className="break-all">{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 md:mt-12 lg:mt-16 pt-4 md:pt-6 lg:pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="min-w-0">
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Notes & Terms</p>
          <p className="text-xs md:text-sm text-slate-600 italic whitespace-pre-wrap break-words leading-relaxed">
            {formData.notes || (isKachaBill ? 'Proforma only.' : 'Thank you!')}
          </p>
          
          {/* Bank details moved here or kept in its own conditional block */}
          {companyDetails.bankName && !isKachaBill && (
            <div className="mt-4 md:mt-6 min-w-0 bg-slate-50 p-3 md:p-4 rounded-lg md:rounded-xl">
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Bank Transfer Details</p>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <span className="text-slate-500">Bank:</span>
                <span className="font-bold text-slate-700 break-words">{companyDetails.bankName}</span>
                <span className="text-slate-500">Account:</span>
                <span className="font-bold text-slate-700 break-all">{companyDetails.accountNumber}</span>
                <span className="text-slate-500">IFSC:</span>
                <span className="font-bold text-slate-700 break-all">{companyDetails.IFSC}</span>
              </div>
            </div>
          )}
        </div>

        {/* NEW: SIGNATURE & STAMP SECTION */}
        <div className="flex flex-col items-center md:items-end justify-end mt-4 md:mt-0">
          <div className="relative flex flex-col items-center min-w-[120px] md:min-w-[150px]">
            {/* Stamp (usually behind or next to signature) */}
            {companyDetails.companyStamp && (
              <img 
                src={companyDetails.companyStamp} 
                alt="Company Stamp" 
                className="absolute -top-8 md:-top-12 opacity-70 w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none" 
              />
            )}
            
            {/* Signature */}
            {companyDetails.companySignature ? (
              <img 
                src={companyDetails.companySignature} 
                alt="Authorized Signature" 
                className="h-12 md:h-16 w-auto object-contain z-10" 
              />
            ) : (
              <div className="h-12 md:h-16"></div> // Spacer if no signature
            )}
            
            <div className="mt-2 border-t border-slate-300 w-full pt-2 text-center">
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Authorized Signatory
              </p>
              <p className="text-xs font-bold text-slate-800">
                For {companyDetails.companyName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillPreview;