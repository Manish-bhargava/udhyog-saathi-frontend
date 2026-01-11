// src/features/bills/pages/AllBillsPage.jsx
import React, { useState, useEffect } from 'react';
import BillList from '../components/BillList';
import billAPI from '../api';
import { useNavigate } from 'react-router-dom';

const AllBillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      const response = await billAPI.getBillsByType('pakka');
      if (response.success) {
        // Transform API response to match our expected format
        const transformedBills = response.data?.map(bill => ({
          id: bill._id,
          invoiceNumber: bill.invoiceNumber || `INV-${bill._id?.slice(-6)}`,
          buyer: bill.buyer || { clientName: 'Unknown' },
          type: bill.type || 'pakka',
          totalAmount: bill.totalAmount || 0,
          status: bill.status || 'draft',
          createdAt: bill.createdAt,
          date: bill.date || bill.createdAt
        })) || [];
        setBills(transformedBills);
      } else {
        setBills([]); // Empty array if no data
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load bills. Please try again.');
      // Set mock data for development/demo
      setBills(getMockBills());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mock data for development
  const getMockBills = () => {
    return [
      {
        id: '1',
        invoiceNumber: 'INV-001',
        buyer: { clientName: 'ABC Enterprises', clientGst: '27ABCDE1234F1Z5' },
        type: 'pakka',
        totalAmount: 11800,
        status: 'paid',
        createdAt: '2024-01-15',
        date: '2024-01-15'
      },
      {
        id: '2',
        invoiceNumber: 'INV-002',
        buyer: { clientName: 'XYZ Corporation', clientGst: '29FGHIJ5678K9L0' },
        type: 'pakka',
        totalAmount: 23600,
        status: 'pending',
        createdAt: '2024-01-16',
        date: '2024-01-16'
      },
      {
        id: '3',
        invoiceNumber: 'INV-003',
        buyer: { clientName: 'Global Traders', clientGst: '24MNOPQ9012R3S4' },
        type: 'pakka',
        totalAmount: 17700,
        status: 'paid',
        createdAt: '2024-01-17',
        date: '2024-01-17'
      },
      {
        id: '4',
        invoiceNumber: 'INV-004',
        buyer: { clientName: 'Tech Solutions Ltd' },
        type: 'kacha',
        totalAmount: 5900,
        status: 'draft',
        createdAt: '2024-01-18',
        date: '2024-01-18'
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Bills</h1>
          <p className="text-gray-600 mt-1">View and manage all your bills</p>
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

      <BillList bills={bills} loading={loading} />

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