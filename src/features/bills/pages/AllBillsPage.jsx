import React, { useState, useEffect } from 'react';
import BillList from '../components/BillList';
import billAPI from '../api';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../profile/context/ProfileContext';
import { useAuth } from '../../auth/context/AuthContext';

const AllBillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const navigate = useNavigate();
  
  // Get profile data
  const { profile, loading: profileLoading } = useProfile();
  const { user } = useAuth();

  const fetchBills = async () => {
    try {
      const response = await billAPI.getBillsByType('pakka');
      if (response.success) {
        // Transform API response to match our expected format with correct amount fields
        const transformedBills = response.data?.map(bill => {
          // Calculate totals from backend data
          const products = bill.products || [];
          const subtotal = products.reduce((sum, product) => {
            const amount = (product.rate || 0) * (product.quantity || 0);
            return sum + amount;
          }, 0);
          
          const gstAmount = bill.gstAmount || (subtotal * (bill.gstPercentage || 0)) / 100;
          const discount = bill.discount || 0;
          const grandTotal = bill.totalAmount || (subtotal + gstAmount - discount);
          
          return {
            id: bill._id,
            invoiceNumber: bill.invoiceNumber || `INV-${bill._id?.slice(-6)}`,
            buyer: bill.buyer || { clientName: 'Unknown' },
            type: bill.type || 'pakka',
            products: products,
            gstPercentage: bill.gstPercentage || 0,
            discount: discount,
            subtotal: subtotal,
            gstAmount: gstAmount,
            totalAmount: grandTotal,
            status: bill.status || 'draft',
            createdAt: bill.createdAt,
            date: bill.date || bill.createdAt
          };
        }) || [];
        setBills(transformedBills);
      } else {
        setBills([]); // Empty array if no data
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load bills. Please try again.');
      // Set mock data for development/demo with correct amounts
      setBills(getMockBills());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mock data for development with correct amounts
  const getMockBills = () => {
    return [
      {
        id: '1',
        invoiceNumber: 'INV-001',
        buyer: { clientName: 'ABC Enterprises', clientGst: '27ABCDE1234F1Z5', clientAddress: '123 Street, City' },
        type: 'pakka',
        products: [
          { name: 'Product A', rate: 1000, quantity: 5, amount: 5000 },
          { name: 'Product B', rate: 2000, quantity: 3, amount: 6000 }
        ],
        gstPercentage: 18,
        discount: 800,
        subtotal: 11000,
        gstAmount: 1980,
        totalAmount: 12180,
        status: 'paid',
        createdAt: '2024-01-15',
        date: '2024-01-15'
      },
      {
        id: '2',
        invoiceNumber: 'INV-002',
        buyer: { clientName: 'XYZ Corporation', clientGst: '29FGHIJ5678K9L0', clientAddress: '456 Avenue, Town' },
        type: 'pakka',
        products: [
          { name: 'Product C', rate: 1500, quantity: 4, amount: 6000 },
          { name: 'Product D', rate: 2500, quantity: 2, amount: 5000 },
          { name: 'Product E', rate: 1200, quantity: 3, amount: 3600 }
        ],
        gstPercentage: 18,
        discount: 1460,
        subtotal: 14600,
        gstAmount: 2628,
        totalAmount: 15768,
        status: 'pending',
        createdAt: '2024-01-16',
        date: '2024-01-16'
      },
      {
        id: '3',
        invoiceNumber: 'INV-003',
        buyer: { clientName: 'Global Traders', clientGst: '24MNOPQ9012R3S4', clientAddress: '789 Road, Village' },
        type: 'pakka',
        products: [
          { name: 'Product F', rate: 3000, quantity: 3, amount: 9000 },
          { name: 'Product G', rate: 1800, quantity: 4, amount: 7200 }
        ],
        gstPercentage: 18,
        discount: 1620,
        subtotal: 16200,
        gstAmount: 2916,
        totalAmount: 17496,
        status: 'paid',
        createdAt: '2024-01-17',
        date: '2024-01-17'
      }
    ];
  };

  useEffect(() => {
    fetchBills();

    // Listen for bill creation events
    const handleBillCreated = () => {
      console.log('Bill created event received, refreshing bills list...');
      fetchBills();
    };

    window.addEventListener('billCreated', handleBillCreated);

    return () => {
      window.removeEventListener('billCreated', handleBillCreated);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBills();
  };

  const handleCreateNewBill = () => {
    navigate('/bills/pakka');
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowBillModal(true);
  };

  const handleDownloadBill = (bill) => {
    // Create printable window for the selected bill
    const printWindow = window.open('', '_blank');
    
    const products = bill.products || [];
    const subtotal = bill.subtotal || 0;
    const gstAmount = bill.gstAmount || 0;
    const discount = bill.discount || 0;
    const grandTotal = bill.totalAmount || 0;
    const gstPercentage = bill.gstPercentage || 0;
    
    // Get user's full name
    const userName = `${profile.personal.firstName || ''} ${profile.personal.lastName || ''}`.trim() || user?.name || 'User';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${bill.invoiceNumber || `INV-${bill.id}`}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .company-details, .client-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .totals { float: right; margin-top: 20px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; }
            .company-header { text-align: right; }
            .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; }
            .signature-line { width: 200px; border-top: 1px solid #000; margin: 10px auto; }
            .company-stamp { text-align: center; margin-top: 20px; }
            .stamp-img { max-width: 150px; max-height: 150px; }
            .invoice-title { text-align: center; margin-bottom: 30px; }
            .invoice-title h1 { color: #1e40af; font-size: 28px; }
            .bank-details { background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 30px; }
            .bank-details h4 { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <div class="company-details">
                <h2>${profile.company.companyName || 'Your Company Name'}</h2>
                <p>${profile.company.companyAddress || 'Company Address'}</p>
                <p>Email: ${profile.company.companyEmail || profile.personal.email || 'Email not set'}</p>
                <p>Phone: ${profile.company.companyPhone || 'Phone not set'}</p>
                <p>GST: ${profile.company.GST || 'GST not set'}</p>
              </div>
            </div>
            <div class="company-header">
              <div class="invoice-title">
                <h1>TAX INVOICE</h1>
              </div>
              <div>
                <p><strong>Invoice #:</strong> ${bill.invoiceNumber || `INV-${bill.id}`}</p>
                <p><strong>Date:</strong> ${new Date(bill.date || bill.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div class="client-details">
            <h3>Bill To:</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px;">
              <p><strong>${bill.buyer?.clientName || 'Client Name'}</strong><br>
              ${bill.buyer?.clientAddress || 'Address not provided'}<br>
              ${bill.buyer?.clientGst ? `GST: ${bill.buyer.clientGst}` : ''}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr style="background-color: #1e40af; color: white;">
                <th>#</th>
                <th>Description</th>
                <th>Rate (₹)</th>
                <th>Qty</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${products.map((p, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${p.name || 'Product'}</td>
                  <td>${(p.rate || 0).toFixed(2)}</td>
                  <td>${p.quantity || 0}</td>
                  <td>${((p.rate || 0) * (p.quantity || 0)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
            <p><strong>GST (${gstPercentage}%):</strong> ₹${gstAmount.toFixed(2)}</p>
            ${discount > 0 ? `<p><strong>Discount:</strong> -₹${discount.toFixed(2)}</p>` : ''}
            <p style="font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px;">
              <strong>Grand Total:</strong> ₹${grandTotal.toFixed(2)}
            </p>
          </div>
          
          ${profile.bank.bankName && profile.bank.accountNumber ? `
            <div class="bank-details">
              <h4>Bank Details:</h4>
              <p><strong>Bank Name:</strong> ${profile.bank.bankName}</p>
              <p><strong>Account Number:</strong> ${profile.bank.accountNumber}</p>
              <p><strong>IFSC Code:</strong> ${profile.bank.IFSC}</p>
              <p><strong>Branch:</strong> ${profile.bank.branchName}</p>
            </div>
          ` : ''}
          
          <div class="signature-section">
            <div class="signature-box">
              <p>For ${profile.company.companyName || 'Your Company'}</p>
              <div class="signature-line"></div>
              <p>Authorized Signatory</p>
            </div>
            <div class="signature-box">
              <p>Received By</p>
              <div class="signature-line"></div>
              <p>Client Signature</p>
            </div>
          </div>
          
          ${profile.company.companyStamp ? `
            <div class="company-stamp">
              <p>Company Stamp:</p>
              <img src="${profile.company.companyStamp}" alt="Company Stamp" class="stamp-img">
            </div>
          ` : ''}
          
          <div class="footer">
            <p><strong>Payment Terms:</strong> Net 30 days</p>
            <p><strong>Notes:</strong> ${profile.company.companyDescription || 'Thank you for your business!'}</p>
            <p style="margin-top: 20px; font-style: italic; color: #666;">
              This is a computer generated invoice. No signature required.
            </p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Helper function to get company initials for logo
  const getCompanyInitials = () => {
    if (!profile.company.companyName) return 'C';
    return profile.company.companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user's full name
  const getUserFullName = () => {
    return `${profile.personal.firstName || ''} ${profile.personal.lastName || ''}`.trim() || user?.name || 'User';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Bills</h1>
          <p className="text-gray-600 mt-1">View and manage all your bills</p>
          {profile.company.companyName && (
            <p className="text-sm text-blue-600 mt-1">
              Company: {profile.company.companyName}
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg 
              className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleCreateNewBill}
          >
            Create New Bill
          </button>
        </div>
      </div>

      {error && !bills.length && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <BillList 
        bills={bills} 
        loading={loading} 
        onViewBill={handleViewBill}
        onDownloadBill={handleDownloadBill}
      />

      {/* Bill Preview Modal */}
      {showBillModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Bill Preview - {selectedBill.invoiceNumber}
              </h3>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">TAX INVOICE</h2>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">Invoice #: {selectedBill.invoiceNumber}</div>
                      <div className="text-sm text-gray-600">Date: {new Date(selectedBill.date || selectedBill.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-blue-600">{getCompanyInitials()}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800">{profile.company.companyName || 'Your Company'}</div>
                  </div>
                </div>

                {/* Company and Buyer Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">From:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800">{profile.company.companyName}</div>
                      <div className="text-sm text-gray-600 mt-1">{profile.company.companyAddress}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Email: {profile.company.companyEmail || profile.personal.email}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Phone: {profile.company.companyPhone}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        GST: {profile.company.GST}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800">
                        {selectedBill.buyer?.clientName}
                      </div>
                      {selectedBill.buyer?.clientAddress && (
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedBill.buyer.clientAddress}
                        </div>
                      )}
                      {selectedBill.buyer?.clientGst && (
                        <div className="text-sm text-gray-600 mt-1">
                          GST: {selectedBill.buyer.clientGst}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Rate (₹)</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Qty</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.products?.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                          <td className="border border-gray-300 px-4 py-2">{product.name || 'Product'}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{(product.rate || 0).toFixed(2)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{product.quantity || 0}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{((product.rate || 0) * (product.quantity || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{selectedBill.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">GST ({selectedBill.gstPercentage || 0}%):</span>
                      <span className="font-medium">₹{selectedBill.gstAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                    {selectedBill.discount > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-red-600">-₹{selectedBill.discount?.toFixed(2) || '0.00'}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-t border-gray-300 mt-2 pt-2">
                      <span className="text-lg font-bold text-gray-800">Grand Total:</span>
                      <span className="text-lg font-bold text-gray-800">₹{selectedBill.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Details Section */}
                {profile.bank.bankName && profile.bank.accountNumber && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Bank Details:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bank Name:</span>
                        <span className="font-medium ml-2">{profile.bank.bankName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium ml-2">{profile.bank.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">IFSC Code:</span>
                        <span className="font-medium ml-2">{profile.bank.IFSC}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Branch:</span>
                        <span className="font-medium ml-2">{profile.bank.branchName}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Signature Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="font-medium text-gray-700">For {profile.company.companyName || 'Your Company'}</p>
                      <div className="w-48 border-t border-gray-400 mt-4 mb-2 mx-auto"></div>
                      <p className="text-sm text-gray-600">Authorized Signatory</p>
                      <p className="text-sm text-gray-500">({getUserFullName()})</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-700">Received By</p>
                      <div className="w-48 border-t border-gray-400 mt-4 mb-2 mx-auto"></div>
                      <p className="text-sm text-gray-600">Client Signature</p>
                    </div>
                  </div>
                </div>

                {/* Company Stamp if available */}
                {profile.company.companyStamp && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Company Stamp:</p>
                    <img 
                      src={profile.company.companyStamp} 
                      alt="Company Stamp" 
                      className="h-24 w-24 object-contain mx-auto"
                    />
                  </div>
                )}

                {/* Footer Notes */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium mb-1">Payment Terms:</div>
                      <div>Net 30 days</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Notes:</div>
                      <div>{profile.company.companyDescription || 'Thank you for your business!'}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 italic">
                    This is a computer generated invoice. No signature required.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowBillModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadBill(selectedBill)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download/Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Bills</div>
          <div className="text-2xl font-bold text-gray-800">{bills.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Pakka Bills</div>
          <div className="text-2xl font-bold text-green-600">
            {bills.filter(b => b.type === 'pakka').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Amount</div>
          <div className="text-2xl font-bold text-blue-600">
            ₹{bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Paid Bills</div>
          <div className="text-2xl font-bold text-purple-600">
            {bills.filter(b => b.status === 'paid').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBillsPage;