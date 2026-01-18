

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BillList from '../components/BillList';
import billAPI from '../api';

const AllBillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pakka, kacha] = await Promise.all([
          billAPI.getBillsByType('pakka'),
          billAPI.getBillsByType('kaccha')
        ]);
        const combined = [
          ...(pakka.data || []).map(b => ({ ...b, type: 'pakka' })),
          ...(kacha.data || []).map(b => ({ ...b, type: 'kacha' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBills(combined);
      } catch (err) { 
        console.error("Error loading bills:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchAll();
  }, []);

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const searchStr = searchTerm.toLowerCase();
      const dateStr = new Date(bill.createdAt).toLocaleDateString().toLowerCase();
      
      const matchesFilter = activeFilter === 'all' || bill.type === activeFilter;
      
      const matchesSearch = 
        bill.invoiceNumber?.toLowerCase().includes(searchStr) ||
        bill.buyer?.clientName?.toLowerCase().includes(searchStr) ||
        bill.grandTotal?.toString().includes(searchStr) ||
        dateStr.includes(searchStr);

      return matchesFilter && matchesSearch;
    });
  }, [bills, searchTerm, activeFilter]);

  const stats = {
    pakkaCount: bills.filter(b => b.type === 'pakka').length,
    kachaPending: bills.filter(b => b.type === 'kacha').length,
    revenue: bills.reduce((acc, b) => acc + (b.grandTotal || 0), 0)
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Billing Dashboard</h1>
          <p className="text-gray-600">Manage and track all your invoices in one place</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/bills/kacha')}
            className="px-5 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Kacha Bill
          </button>
          <button
            onClick={() => navigate('/bills/pakka')}
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pakka Bill
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Finalized Pakka Bills</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pakkaCount}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Ready for tax filing</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Kacha Drafts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.kachaPending}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Pending conversion to Pakka</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Sum of all finalized invoices</div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">All Invoices</h3>
            <p className="text-sm text-gray-500">Search and filter your billing history</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Filter Buttons */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {[
                { value: 'all', label: 'All', color: 'gray' },
                { value: 'pakka', label: 'Pakka', color: 'green' },
                { value: 'kacha', label: 'Kacha', color: 'amber' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === filter.value
                      ? `bg-white text-${filter.color}-600 shadow-sm`
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by client name, invoice #, amount, or date..."
            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredBills.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{bills.length}</span> invoices
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sorted by most recent
          </div>
        </div>
      </div>

      {/* Bills List */}
      <BillList bills={filteredBills} loading={loading} />
      
      {/* Quick Tips */}
      {!loading && bills.length === 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Getting Started</h4>
              <p className="text-blue-700 text-sm">
                Create your first invoice! Use <span className="font-medium">Kacha Bill</span> for quick estimates or 
                <span className="font-medium"> Pakka Bill</span> for GST-compliant invoices. All your invoices will appear here for easy tracking.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBillsPage;