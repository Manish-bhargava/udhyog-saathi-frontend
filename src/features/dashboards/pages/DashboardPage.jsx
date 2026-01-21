import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, 
  Trash2, 
  RefreshCw, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  BarChart3,
  LayoutList,
  X,
  Printer,
  Download,
  ArrowUpRight,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { profileAPI } from '../../profiles/api';

export default function UdhyogDashboard() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); 
  const [viewMode, setViewMode] = useState('table');   
  const [profileData, setProfileData] = useState(null);
  
  // Modal State
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(null);

  // --- 1. API FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 
        if (!token) return;

        // Fetch Bills and Profile in parallel
        const [billRes, profileRes] = await Promise.all([
          fetch('http://localhost:3000/api/v1/bill/all', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          profileAPI.getProfile() // Using your existing profile API helper
        ]);

        const billResult = await billRes.json();
        
        if (billResult.success) {
          let data = billResult.data || [];
          if (filterType !== 'all') {
            data = data.filter(bill => bill.billType === filterType);
          }
          setBills(data);
        }

        if (profileRes.success) {
          setProfileData(profileRes.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterType]);

  // --- 2. STATS & ANALYTICS CALCULATION ---
  const stats = useMemo(() => {
    const totalRev = bills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
    const totalGst = bills.reduce((sum, b) => sum + (b.taxAmount || 0), 0);
    const totalDiscount = bills.reduce((sum, b) => sum + (b.discount || 0), 0);
    const totalProducts = bills.reduce((sum, b) => sum + (b.products?.reduce((pSum, p) => pSum + p.quantity, 0) || 0), 0);

    // Chart Data logic: Group Revenue by Date
    const revenueByDate = {};
    bills.forEach(bill => {
      const date = new Date(bill.invoiceDate || bill.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      revenueByDate[date] = (revenueByDate[date] || 0) + bill.grandTotal;
    });

    // Type Split logic: Pakka vs Kaccha
    const typeSplit = { pakka: 0, kaccha: 0 };
    bills.forEach(bill => {
       if(bill.billType === 'pakka') typeSplit.pakka += bill.grandTotal;
       else typeSplit.kaccha += bill.grandTotal;
    });

    return { 
      revenue: totalRev, 
      gst: totalGst, 
      discount: totalDiscount, 
      products: totalProducts,
      // Convert to array and take last 7 days
      chartData: Object.entries(revenueByDate).map(([date, amount]) => ({ date, amount })).slice(-7),
      typeSplit
    };
  }, [bills]);

  // --- 3. HANDLERS ---
  const handleView = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handleDelete = async (invoiceNumber) => {
    if (!window.confirm(`Delete Bill ${formatInvoiceId(invoiceNumber)}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/bill/delete/${invoiceNumber}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setBills(prev => prev.filter(b => b.invoiceNumber !== invoiceNumber));
        setMobileActionsOpen(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error deleting bill");
    }
  };

  const handleConvert = (id) => {
    if (!window.confirm("Convert to Pakka Bill?")) return;
    alert("Convert feature coming soon!");
    setMobileActionsOpen(null);
  };

  const formatInvoiceId = (id) => {
    if (!id) return "INV-000";
    return id.toString().startsWith('INV') ? id : `INV-${id}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-xs md:text-sm">Overview of your business performance.</p>
        </div>
        <button 
            onClick={() => window.location.href = '/bills/pakka'}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium shadow-lg transition active:scale-95"
        >
          <FileText size={16} className="md:size-[18px]" /> 
          <span className="hidden sm:inline">New Bill</span>
          <span className="inline sm:hidden">+ Bill</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
        <StatCard label="Total Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} icon={<TrendingUp size={16} className="md:size-[20px]" />} color="blue" />
        <StatCard label="GST Collected" value={`₹${stats.gst.toLocaleString('en-IN')}`} icon={<FileText size={16} className="md:size-[20px]" />} color="green" />
        <StatCard label="Discounts" value={`₹${stats.discount.toLocaleString('en-IN')}`} icon={<AlertCircle size={16} className="md:size-[20px]" />} color="yellow" />
        <StatCard label="Products Sold" value={stats.products} icon={<CheckCircle2 size={16} className="md:size-[20px]" />} color="purple" />
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-auto">
          {['all', 'kaccha', 'pakka'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 md:flex-none px-3 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium capitalize transition-all ${
                filterType === type ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-auto">
          <button onClick={() => setViewMode('table')} className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutList size={14} className="md:size-[18px]" /> 
            <span className="hidden sm:inline">Table</span>
            <span className="inline sm:hidden">List</span>
          </button>
          <button onClick={() => setViewMode('analytics')} className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${viewMode === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <BarChart3 size={14} className="md:size-[18px]" /> 
            <span className="hidden sm:inline">Analytics</span>
            <span className="inline sm:hidden">Stats</span>
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {viewMode === 'table' ? (
        // TABLE VIEW
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
             <div className="p-8 md:p-12 text-center text-slate-400">Loading invoices...</div>
          ) : bills.length === 0 ? (
             <div className="p-8 md:p-12 text-center text-slate-500">No bills found.</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-6">Invoice ID</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Client</th>
                      <th className="py-4 px-6">Type</th>
                      <th className="py-4 px-6 text-right">Amount</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-600">
                            {formatInvoiceId(bill.invoiceNumber)}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                            {formatDate(bill.invoiceDate || bill.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                            <div className="font-medium text-slate-800">{bill.buyer?.clientName}</div>
                            <div className="text-xs text-slate-400">{bill.buyer?.clientAddress || ""}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${
                            bill.billType === 'kaccha' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {bill.billType}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-800">
                          ₹{bill.grandTotal?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {bill.billType === 'kaccha' && (
                              <button onClick={() => handleConvert(bill._id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded" title="Convert">
                                <RefreshCw size={16} />
                              </button>
                            )}
                            <button onClick={() => handleView(bill)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleDelete(bill.invoiceNumber)} className="p-2 text-red-500 hover:bg-red-50 rounded" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-3 space-y-3">
                {bills.map((bill) => (
                  <div key={bill._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{bill.buyer?.clientName}</div>
                        <div className="text-xs text-slate-500 mt-1">{formatDate(bill.invoiceDate || bill.createdAt)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${
                          bill.billType === 'kaccha' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {bill.billType === 'kaccha' ? 'Kacha' : 'Pakka'}
                        </span>
                        <button 
                          onClick={() => setMobileActionsOpen(mobileActionsOpen === bill._id ? null : bill._id)}
                          className="p-1 text-slate-500 hover:text-slate-700"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500">Invoice ID</div>
                        <div className="font-medium text-slate-600 text-sm">{formatInvoiceId(bill.invoiceNumber)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Amount</div>
                        <div className="font-bold text-slate-800">₹{bill.grandTotal?.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    {/* Mobile Actions Dropdown */}
                    {mobileActionsOpen === bill._id && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex gap-2">
                          {bill.billType === 'kaccha' && (
                            <button 
                              onClick={() => handleConvert(bill._id)}
                              className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1"
                            >
                              <RefreshCw size={12} />
                              Convert
                            </button>
                          )}
                          <button 
                            onClick={() => handleView(bill)}
                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1"
                          >
                            <Eye size={12} />
                            View
                          </button>
                          <button 
                            onClick={() => handleDelete(bill.invoiceNumber)}
                            className="flex-1 px-3 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        // ANALYTICS VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* CHART 1: REVENUE TREND (Custom SVG/Flex) */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-6">Revenue vs Date</h3>
                <div className="h-48 md:h-64 flex items-end justify-between space-x-1 md:space-x-2 px-1 md:px-2">
                    {stats.chartData.length > 0 ? stats.chartData.map((d, i) => {
                        const maxVal = Math.max(...stats.chartData.map(i => i.amount)) || 1;
                        const height = (d.amount / maxVal) * 100; // Percentage height
                        return (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full bg-blue-100 rounded-t-sm hover:bg-blue-200 transition-all" style={{ height: `${height}%`, minHeight: '4px' }}>
                                     <div className="opacity-0 group-hover:opacity-100 absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] md:text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                        ₹{d.amount}
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm h-full opacity-80"></div>
                                </div>
                                <span className="text-[10px] md:text-xs text-slate-500 mt-2 rotate-0 truncate w-full text-center">{d.date}</span>
                            </div>
                        )
                    }) : <p className="text-center w-full text-slate-400 text-sm">Not enough data for chart</p>}
                </div>
            </div>

            {/* CHART 2: BILL TYPE RATIO */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-6">Pakka vs Kaccha (Revenue)</h3>
                 <div className="flex items-center justify-center h-48 md:h-64">
                    <div className="w-full max-w-xs space-y-3 md:space-y-4">
                        {/* Pakka Bar */}
                        <div>
                            <div className="flex justify-between text-xs md:text-sm mb-1">
                                <span className="font-medium text-slate-700">Pakka Bills</span>
                                <span className="text-slate-500">₹{stats.typeSplit.pakka.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 md:h-3">
                                <div className="bg-green-500 h-2 md:h-3 rounded-full" style={{ width: `${(stats.typeSplit.pakka / (stats.revenue || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                         {/* Kaccha Bar */}
                         <div>
                            <div className="flex justify-between text-xs md:text-sm mb-1">
                                <span className="font-medium text-slate-700">Kaccha Bills</span>
                                <span className="text-slate-500">₹{stats.typeSplit.kaccha.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 md:h-3">
                                <div className="bg-orange-400 h-2 md:h-3 rounded-full" style={{ width: `${(stats.typeSplit.kaccha / (stats.revenue || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* LIST: TOP RECENT TRANSACTIONS */}
             <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4">Top Recent Transactions</h3>
                <div className="space-y-2 md:space-y-3">
                    {bills.slice(0, 3).map(bill => (
                        <div key={bill._id} className="flex items-center justify-between p-2 md:p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="bg-white p-1.5 md:p-2 rounded-md border border-slate-200 text-slate-400">
                                    <ArrowUpRight size={14} className="md:size-[18px]" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm md:text-base">{bill.buyer?.clientName}</p>
                                    <p className="text-xs text-slate-500">{formatDate(bill.invoiceDate)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-900 text-sm md:text-base">₹{bill.grandTotal?.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">{bill.products?.length} Items</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}


      {/* --- INVOICE VIEW MODAL (Updated for Profile Data) --- */}
      {isModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-sm print:p-0 print:bg-white print:block">
          <div className="bg-white w-full max-w-3xl shadow-2xl rounded-lg flex flex-col max-h-[90vh] print:shadow-none print:w-full print:max-w-none print:max-h-none print:h-auto overflow-hidden">
            
            {/* FIXED HEADER */}
            <div className="flex justify-between items-center p-3 md:p-4 border-b border-slate-100 bg-slate-50 shrink-0 print:hidden">
                <h2 className="font-bold text-slate-700 text-sm md:text-base">Invoice Preview</h2>
                <div className="flex gap-1 md:gap-2">
                    <button onClick={() => window.print()} className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-white border border-slate-300 rounded text-xs md:text-sm text-slate-700 hover:bg-slate-100">
                        <Printer size={14} className="md:size-[16px]" /> 
                        <span className="hidden sm:inline">Print</span>
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 md:p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded transition">
                        <X size={16} className="md:size-[20px]" />
                    </button>
                </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="overflow-y-auto p-4 md:p-6 lg:p-8 print:p-0 print:overflow-visible bg-white">
              
              {/* INVOICE HEADER AREA */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-10">
                <div>
                  <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 md:mb-6 ${selectedBill.billType === 'kaccha' ? 'text-amber-600' : 'text-slate-800'}`}>
                    {selectedBill.billType === 'kaccha' ? 'Proforma Invoice' : 'Invoice'}
                  </h1>
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-12">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Invoice Number</p>
                      <p className="text-slate-800 font-medium text-sm md:text-base">{formatInvoiceId(selectedBill.invoiceNumber)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Issue</p>
                      <p className="text-slate-800 font-medium text-sm md:text-base">{formatDate(selectedBill.invoiceDate || selectedBill.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                {/* SELLER LOGO (From Profile) */}
                <div className="text-right mt-4 md:mt-0">
                  {profileData?.company?.companyLogo ? (
                    <img 
                      src={profileData.company.companyLogo} 
                      alt="Logo" 
                      className="h-12 md:h-16 w-auto object-contain ml-auto mb-2" 
                    />
                  ) : (
                    profileData?.company?.companyName && (
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl flex items-center justify-center ml-auto mb-2 ${selectedBill.billType === 'kaccha' ? 'bg-amber-50' : 'bg-slate-50'}`}>
                        <span className={`text-xl md:text-2xl font-bold ${selectedBill.billType === 'kaccha' ? 'text-amber-600' : 'text-slate-600'}`}>
                          {profileData.company.companyName.charAt(0)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ADDRESS COLUMNS */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-6 md:mb-10">
                {/* Billed To (From Bill Data) */}
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 md:mb-3">Billed To</h3>
                  <p className="font-bold text-slate-800 text-base md:text-lg">{selectedBill.buyer?.clientName}</p>
                  <p className="text-slate-500 text-xs md:text-sm mt-1 whitespace-pre-line leading-relaxed">
                    {selectedBill.buyer?.clientAddress}
                  </p>
                  {selectedBill.billType !== 'kaccha' && selectedBill.buyer?.clientGst && (
                    <p className="text-slate-500 text-xs md:text-sm mt-2">GSTIN: {selectedBill.buyer.clientGst}</p>
                  )}
                </div>

                {/* From Seller (From Profile Data) */}
                <div className="flex-1 mt-4 md:mt-0">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 md:mb-3">From</h3>
                  <p className="font-bold text-slate-800 text-base md:text-lg">
                    {profileData?.company?.companyName || "Your Company"}
                  </p>
                  <p className="text-slate-500 text-xs md:text-sm mt-1 whitespace-pre-line leading-relaxed">
                    {profileData?.company?.companyAddress}
                  </p>
                  {profileData?.company?.companyEmail && (
                    <p className="text-slate-500 text-xs md:text-sm mt-1">{profileData.company.companyEmail}</p>
                  )}
                  {profileData?.company?.GST && selectedBill.billType !== 'kaccha' && (
                    <p className="text-slate-500 text-xs md:text-sm mt-1">GST: {profileData.company.GST}</p>
                  )}
                </div>
              </div>

              {/* PRODUCT TABLE & TOTALS */}
              <div className="flex-1 overflow-x-auto -mx-2 md:mx-0">
                <table className="w-full mb-6 md:mb-8">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className="text-left py-2 md:py-3 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Description</th>
                      <th className="text-right py-2 md:py-3 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Unit Cost</th>
                      <th className="text-right py-2 md:py-3 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Qty</th>
                      <th className="text-right py-2 md:py-3 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedBill.products?.map((p, i) => (
                      <tr key={i}>
                        <td className="py-3 md:py-4 text-xs md:text-sm font-medium text-slate-700 px-2">{p.name}</td>
                        <td className="py-3 md:py-4 text-xs md:text-sm text-right text-slate-500 px-2">{formatCurrency(p.rate)}</td>
                        <td className="py-3 md:py-4 text-xs md:text-sm text-right text-slate-500 px-2">{p.quantity}</td>
                        <td className="py-3 md:py-4 text-xs md:text-sm text-right font-bold text-slate-700 px-2">{formatCurrency(p.amount || (p.rate * p.quantity))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTALS */}
              <div className="flex justify-end border-t border-slate-100 pt-4 md:pt-6">
                <div className="w-full max-w-xs space-y-2 md:space-y-3">
                  <div className="flex justify-between text-xs md:text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(selectedBill.subTotal)}</span>
                  </div>
                  {selectedBill.discount > 0 && (
                    <div className="flex justify-between text-xs md:text-sm text-slate-600">
                      <span>Discount</span>
                      <span className="text-red-500">- {formatCurrency(selectedBill.discount)}</span>
                    </div>
                  )}
                  {selectedBill.billType !== 'kaccha' && selectedBill.taxAmount > 0 && (
                    <>
                      <div className="flex justify-between text-xs md:text-sm text-slate-600">
                        <span>Tax Rate</span>
                        <span>{selectedBill.gstPercentage}%</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm text-slate-600">
                        <span>Tax Amount</span>
                        <span>+ {formatCurrency(selectedBill.taxAmount)}</span>
                      </div>
                    </>
                  )}
                  <div className={`flex justify-between text-lg md:text-xl font-bold border-t border-slate-200 pt-3 md:pt-4 mt-1 md:mt-2 ${selectedBill.billType === 'kaccha' ? 'text-amber-700' : 'text-slate-800'}`}>
                    <span>{selectedBill.billType === 'kaccha' ? 'Total Amount' : 'Invoice Total'}</span>
                    <span>{formatCurrency(selectedBill.grandTotal)}</span>
                  </div>
                </div>
              </div>
              
              {/* FOOTER (From Profile Data) */}
              <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Updated condition: Check for bank details AND ensure it is NOT a kacha bill */}
                  {profileData?.bankDetails?.bankName && selectedBill.billType !== 'kaccha' && (
                    <div className="text-xs text-slate-500">
                      <p className="font-bold mb-2 uppercase tracking-wider text-slate-400">Bank Details</p>
                      <div className="grid grid-cols-2 max-w-sm gap-y-1">
                        <span>Bank Name:</span>
                        <span className="font-medium text-slate-700">{profileData.bankDetails.bankName}</span>
                        <span>Account No:</span>
                        <span className="font-medium text-slate-700">{profileData.bankDetails.accountNumber}</span>
                        <span>IFSC Code:</span>
                        <span className="font-medium text-slate-700">{profileData.bankDetails.IFSC}</span>
                      </div>
                    </div>
                  )}
                  {/* NEW: SIGNATURE & STAMP SECTION */}
                  <div className="flex flex-col items-center md:items-end justify-end mt-4 md:mt-0">
                    <div className="relative flex flex-col items-center min-w-[120px] md:min-w-[150px]">
                      {/* Stamp (usually behind or next to signature) */}
                      {profileData?.company?.companyStamp && (
                        <img 
                          src={profileData.company.companyStamp} 
                          alt="Company Stamp" 
                          className="absolute -top-8 md:-top-12 opacity-70 w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none" 
                        />
                      )}
                      
                      {/* Signature */}
                      {profileData?.company?.companySignature ? (
                        <img 
                          src={profileData.company.companySignature} 
                          alt="Authorized Signature" 
                          className="h-12 md:h-16 w-auto object-contain z-10" 
                        />
                      ) : (
                        <div className="h-12 md:h-16"></div> // Spacer if no signature
                      )}
                      
                      <div className="mt-2 border-t border-slate-300 w-full pt-2 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Authorized Signatory
                        </p>
                        <p className="text-xs font-bold text-slate-800">
                          For {profileData?.company?.companyName}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-4 md:mt-0">
                    <p className="font-bold mb-2 uppercase tracking-wider text-slate-400">Notes & Terms</p>
                    <p className="text-slate-600 italic whitespace-pre-wrap">
                        {selectedBill.notes || (selectedBill.billType === 'kaccha' ? 'Proforma invoice.' : 'Thank you!')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Card Helper
function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    purple: "text-purple-600 bg-purple-50",
  };
  return (
    <div className="bg-white p-3 md:p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-1.5 md:p-2 lg:p-2.5 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}