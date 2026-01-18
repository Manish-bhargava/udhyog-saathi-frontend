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
  ArrowUpRight
} from 'lucide-react';

export default function UdhyogDashboard() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); 
  const [viewMode, setViewMode] = useState('table');   
  
  // Modal State
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. API FETCHING ---
  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 
        if (!token) return;

        // Fetching all bills
        const response = await fetch('http://localhost:3000/api/v1/bill/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        const result = await response.json();

        if (result.success) {
          let data = result.data || [];
          // Client-side filtering
          if (filterType !== 'all') {
            data = data.filter(bill => bill.billType === filterType);
          }
          setBills(data);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your business performance.</p>
        </div>
        <button 
            onClick={() => window.location.href = '/create/pakka'}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg transition active:scale-95"
        >
          <FileText size={18} /> New Bill
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} icon={<TrendingUp size={20} />} color="blue" />
        <StatCard label="GST Collected" value={`₹${stats.gst.toLocaleString('en-IN')}`} icon={<FileText size={20} />} color="green" />
        <StatCard label="Discounts" value={`₹${stats.discount.toLocaleString('en-IN')}`} icon={<AlertCircle size={20} />} color="yellow" />
        <StatCard label="Products Sold" value={stats.products} icon={<CheckCircle2 size={20} />} color="purple" />
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
          {['all', 'kaccha', 'pakka'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filterType === type ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
          <button onClick={() => setViewMode('table')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutList size={18} /> Table
          </button>
          <button onClick={() => setViewMode('analytics')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <BarChart3 size={18} /> Analytics
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {viewMode === 'table' ? (
        // TABLE VIEW
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
             <div className="p-12 text-center text-slate-400">Loading invoices...</div>
          ) : bills.length === 0 ? (
             <div className="p-12 text-center text-slate-500">No bills found.</div>
          ) : (
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
          )}
        </div>
      ) : (
        // ANALYTICS VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CHART 1: REVENUE TREND (Custom SVG/Flex) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue vs Date</h3>
                <div className="h-64 flex items-end justify-between space-x-2 px-2">
                    {stats.chartData.length > 0 ? stats.chartData.map((d, i) => {
                        const maxVal = Math.max(...stats.chartData.map(i => i.amount)) || 1;
                        const height = (d.amount / maxVal) * 100; // Percentage height
                        return (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full bg-blue-100 rounded-t-sm hover:bg-blue-200 transition-all" style={{ height: `${height}%`, minHeight: '4px' }}>
                                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                        ₹{d.amount}
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm h-full opacity-80"></div>
                                </div>
                                <span className="text-xs text-slate-500 mt-2 rotate-0 truncate w-full text-center">{d.date}</span>
                            </div>
                        )
                    }) : <p className="text-center w-full text-slate-400">Not enough data for chart</p>}
                </div>
            </div>

            {/* CHART 2: BILL TYPE RATIO */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-800 mb-6">Pakka vs Kaccha (Revenue)</h3>
                 <div className="flex items-center justify-center h-64">
                    <div className="w-full max-w-xs space-y-4">
                        {/* Pakka Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">Pakka Bills</span>
                                <span className="text-slate-500">₹{stats.typeSplit.pakka.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(stats.typeSplit.pakka / (stats.revenue || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                         {/* Kaccha Bar */}
                         <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">Kaccha Bills</span>
                                <span className="text-slate-500">₹{stats.typeSplit.kaccha.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3">
                                <div className="bg-orange-400 h-3 rounded-full" style={{ width: `${(stats.typeSplit.kaccha / (stats.revenue || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* LIST: TOP RECENT TRANSACTIONS */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Top Recent Transactions</h3>
                <div className="space-y-3">
                    {bills.slice(0, 3).map(bill => (
                        <div key={bill._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-md border border-slate-200 text-slate-400">
                                    <ArrowUpRight size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{bill.buyer?.clientName}</p>
                                    <p className="text-xs text-slate-500">{formatDate(bill.invoiceDate)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-900">₹{bill.grandTotal?.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">{bill.products?.length} Items</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* --- INVOICE VIEW MODAL (Responsive & Clean) --- */}
      {isModalOpen && selectedBill && (
        // Overlay: Fixed to screen, centers content
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:p-0 print:bg-white print:block">
          
          {/* Container: Max Height 90vh, Flex Col for scrolling, Hidden scrollbar on print */}
          <div className="bg-white w-full max-w-3xl shadow-2xl rounded-lg flex flex-col max-h-[90vh] print:shadow-none print:w-full print:max-w-none print:max-h-none print:h-auto">
            
            {/* 1. FIXED HEADER (Controls) - Hidden on print */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 rounded-t-lg shrink-0 print:hidden">
                <h2 className="font-bold text-slate-700">Invoice Preview</h2>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm text-slate-700 hover:bg-slate-100">
                        <Printer size={16} /> Print
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded transition">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* 2. SCROLLABLE BODY */}
            <div className="overflow-y-auto p-8 print:p-0 print:overflow-visible">
              
              {/* INVOICE HEADER AREA */}
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-6">Invoice</h1>
                    <div className="flex gap-12">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Invoice Number</p>
                            <p className="text-slate-800 font-medium">{formatInvoiceId(selectedBill.invoiceNumber)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Issue</p>
                            <p className="text-slate-800 font-medium">{formatDate(selectedBill.invoiceDate)}</p>
                        </div>
                    </div>
                 </div>
                 
                 {/* CONDITIONAL LOGO */}
                 <div className="text-right">
                    {selectedBill.sellerDetails?.companyLogo ? (
                        <img 
                            src={selectedBill.sellerDetails.companyLogo} 
                            alt="Logo" 
                            className="h-16 w-auto object-contain ml-auto mb-2" 
                        />
                    ) : (
                        // Placeholder only if needed, or empty div to maintain spacing
                        <div className="h-4"></div> 
                    )}
                 </div>
              </div>

              {/* ADDRESS COLUMNS */}
              <div className="flex flex-col md:flex-row gap-12 mb-8">
                {/* Billed To */}
                <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</h3>
                    <p className="font-bold text-slate-800 text-lg">{selectedBill.buyer?.clientName}</p>
                    
                    {selectedBill.buyer?.clientAddress && (
                         <p className="text-slate-500 text-sm mt-1 whitespace-pre-line leading-relaxed">
                            {selectedBill.buyer.clientAddress}
                        </p>
                    )}

                    {selectedBill.buyer?.clientGst && (
                        <p className="text-slate-500 text-sm mt-2">GSTIN: {selectedBill.buyer.clientGst}</p>
                    )}
                </div>

                {/* From (Seller) */}
                <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">From</h3>
                    <p className="font-bold text-slate-800 text-lg">
                        {selectedBill.sellerDetails?.companyName || "Your Company"}
                    </p>
                    {selectedBill.sellerDetails?.companyAddress && (
                        <p className="text-slate-500 text-sm mt-1 whitespace-pre-line leading-relaxed">
                            {selectedBill.sellerDetails.companyAddress}
                        </p>
                    )}
                     {selectedBill.sellerDetails?.companyEmail && (
                        <p className="text-slate-500 text-sm mt-1">
                            {selectedBill.sellerDetails.companyEmail}
                        </p>
                    )}
                </div>
              </div>

              {/* PRODUCT TABLE */}
              <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-slate-100">
                        <th className="text-left py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                        <th className="text-right py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Cost</th>
                        <th className="text-right py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Qty</th>
                        <th className="text-right py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {selectedBill.products?.map((item, idx) => (
                        <tr key={idx}>
                            <td className="py-4 text-sm font-medium text-slate-700">{item.name}</td>
                            <td className="py-4 text-sm text-right text-slate-500">₹{item.rate}</td>
                            <td className="py-4 text-sm text-right text-slate-500">{item.quantity}</td>
                            <td className="py-4 text-sm text-right font-bold text-slate-700">₹{item.amount}</td>
                        </tr>
                    ))}
                </tbody>
              </table>

              {/* TOTALS SECTION */}
              <div className="flex justify-end border-t border-slate-100 pt-6">
                <div className="w-full max-w-xs space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{selectedBill.subTotal}</span>
                    </div>
                    
                    {/* Only show discount if > 0 */}
                    {selectedBill.discount > 0 && (
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Discount</span>
                            <span className="text-red-500">- ₹{selectedBill.discount}</span>
                        </div>
                    )}

                    {/* Only show Tax if > 0 */}
                    {selectedBill.taxAmount > 0 && (
                        <>
                             <div className="flex justify-between text-sm text-slate-600">
                                <span>Tax Rate</span>
                                <span>{selectedBill.gstPercentage}%</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Tax Amount</span>
                                <span>+ ₹{selectedBill.taxAmount}</span>
                            </div>
                        </>
                    )}
                    
                    <div className="flex justify-between text-xl font-bold text-slate-800 border-t border-slate-200 pt-4 mt-2">
                        <span>Invoice Total</span>
                        <span>₹{selectedBill.grandTotal}</span>
                    </div>
                </div>
              </div>
              
              {/* CONDITIONAL FOOTER: BANK DETAILS */}
              {/* Only render if Bank Name exists */}
              {selectedBill.sellerDetails?.bankName && (
                  <div className="mt-12 pt-6 border-t border-slate-100 text-xs text-slate-500">
                      <p className="font-bold mb-2 uppercase tracking-wider text-slate-400">Bank Details</p>
                      <div className="grid grid-cols-2 max-w-sm gap-y-1">
                          <span>Bank Name:</span>
                          <span className="font-medium text-slate-700">{selectedBill.sellerDetails.bankName}</span>
                          
                          {selectedBill.sellerDetails.accountNumber && (
                              <>
                                <span>Account No:</span>
                                <span className="font-medium text-slate-700">{selectedBill.sellerDetails.accountNumber}</span>
                              </>
                          )}
                          
                          {selectedBill.sellerDetails.IFSC && (
                              <>
                                <span>IFSC Code:</span>
                                <span className="font-medium text-slate-700">{selectedBill.sellerDetails.IFSC}</span>
                              </>
                          )}
                      </div>
                  </div>
              )}

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
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}