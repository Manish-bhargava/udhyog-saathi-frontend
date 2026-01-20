import React from 'react';

const BillPreview = ({ formData, totals, companyDetails, isKachaBill = false }) => {
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formattedDate = new Date().toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });

  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

  return (
    <div className="bg-white w-full shadow-2xl rounded-lg flex flex-col p-6 md:p-10 print:shadow-none print:p-0 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 border-b pb-8 border-slate-100">
        <div className="min-w-0 flex-1">
          <h1 className={`text-4xl font-bold tracking-tight mb-6 break-words ${isKachaBill ? 'text-amber-600' : 'text-slate-800'}`}>
            {isKachaBill ? 'Proforma Invoice' : 'Invoice'}
          </h1>
          <div className="flex flex-wrap gap-8">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Number</p>
              <p className="text-slate-800 font-semibold break-all">{invoiceNumber}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Issue</p>
              <p className="text-slate-800 font-semibold">{formattedDate}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 self-center md:self-start">
          {companyDetails.companyLogo ? (
            <img src={companyDetails.companyLogo} alt="Logo" className="max-h-20 w-auto object-contain" />
          ) : (
            companyDetails.companyName && (
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isKachaBill ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                <span className="text-2xl font-black">{companyDetails.companyName?.charAt(0)}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* ADDRESSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <div className="min-w-0">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</h3>
          <p className="font-bold text-slate-800 text-xl break-words leading-tight mb-2">
            {formData.buyer.clientName}
          </p>
          <p className="text-slate-500 text-sm whitespace-pre-wrap break-words leading-relaxed">
            {formData.buyer.clientAddress}
          </p>
          {!isKachaBill && formData.buyer.clientGst && (
            <p className="text-slate-600 text-xs mt-3 font-medium bg-slate-50 inline-block px-2 py-1 rounded">
              GSTIN: {formData.buyer.clientGst}
            </p>
          )}
        </div>

        <div className="min-w-0 md:text-right">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 md:ml-auto">From</h3>
          <p className="font-bold text-slate-800 text-xl break-words leading-tight mb-2">
            {companyDetails.companyName}
          </p>
          <p className="text-slate-500 text-sm whitespace-pre-wrap break-words leading-relaxed">
            {companyDetails.companyAddress}
          </p>
          {companyDetails.GST && !isKachaBill && (
             <p className="text-slate-600 text-xs mt-3 font-medium bg-slate-50 inline-block px-2 py-1 rounded">
              GST: {companyDetails.GST}
            </p>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="text-left py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-1/2">Description</th>
              <th className="text-right py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate</th>
              <th className="text-right py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">Qty</th>
              <th className="text-right py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {formData.products.map((p, i) => (
              <tr key={i} className="group">
                <td className="py-5 pr-4 text-sm font-semibold text-slate-700 break-words max-w-[200px]">
                  {p.name || 'Untitled Product/Service'}
                </td>
                <td className="py-5 text-sm text-right text-slate-500 tabular-nums">
                  {formatCurrency(p.rate)}
                </td>
                <td className="py-5 text-sm text-right text-slate-500 tabular-nums">
                  {p.quantity}
                </td>
                <td className="py-5 text-sm text-right font-bold text-slate-800 tabular-nums">
                  {formatCurrency(p.rate * p.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="flex flex-col items-end pt-6 border-t border-slate-100">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-700">{formatCurrency(totals.subtotal)}</span>
          </div>
          {/* ... other total rows ... */}
          <div className={`flex justify-between text-2xl font-black pt-4 border-t-2 mt-2 ${isKachaBill ? 'text-amber-600 border-amber-50' : 'text-slate-900 border-slate-900'}`}>
            <span className="mr-4">Total</span>
            <span className="break-all">{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Notes & Terms</p>
          <p className="text-sm text-slate-600 italic whitespace-pre-wrap break-words leading-relaxed">
            {formData.notes || (isKachaBill ? 'Proforma only.' : 'Thank you!')}
          </p>
          
          {/* Bank details moved here or kept in its own conditional block */}
          {companyDetails.bankName && !isKachaBill && (
            <div className="mt-6 min-w-0 bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bank Transfer Details</p>
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
        <div className="flex flex-col items-center md:items-end justify-end">
          <div className="relative flex flex-col items-center min-w-[150px]">
            {/* Stamp (usually behind or next to signature) */}
            {companyDetails.companyStamp && (
              <img 
                src={companyDetails.companyStamp} 
                alt="Company Stamp" 
                className="absolute -top-12 opacity-70 w-24 h-24 object-contain pointer-events-none" 
              />
            )}
            
            {/* Signature */}
            {companyDetails.companySignature ? (
              <img 
                src={companyDetails.companySignature} 
                alt="Authorized Signature" 
                className="h-16 w-auto object-contain z-10" 
              />
            ) : (
              <div className="h-16"></div> // Spacer if no signature
            )}
            
            <div className="mt-2 border-t border-slate-300 w-full pt-2 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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