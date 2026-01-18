

import React from 'react';

const BillList = ({ bills, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading billing history...</p>
      </div>
    );
  }

  if (!bills.length) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No bills created yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">Start by creating your first Pakka or Kacha bill to see them appear here.</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice #</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bills.map((bill) => (
              <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${bill.type === 'pakka' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{bill.invoiceNumber}</div>
                      <div className="text-xs text-gray-500">#ID-{bill._id?.slice(-6)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{bill.buyer?.clientName || 'N/A'}</div>
                  {bill.buyer?.clientGst && (
                    <div className="text-xs text-gray-500 truncate max-w-[180px]">{bill.buyer.clientGst}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(bill.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(bill.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    bill.type === 'pakka' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {bill.type === 'pakka' ? (
                      <>
                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Pakka
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Kacha
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-base font-bold text-gray-900">{formatCurrency(bill.grandTotal)}</div>
                  <div className="text-xs text-gray-500">Total with tax</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{bills.length}</span> bill{bills.length !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-gray-500">
            Sorted by: <span className="font-medium">Most recent first</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillList;