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
  MoreVertical
} from 'lucide-react';

// --- ADDED PDF IMPORTS ---
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// --- 1. ADDED RECHARTS IMPORTS ---
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { profileAPI } from '../../profiles/api';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [downloading, setDownloading] = useState(null);

  // --- 1. API FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 
        if (!token) return;

        const [billRes, profileRes] = await Promise.all([
          fetch(`${BASE_URL}/bill/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          profileAPI.getProfile()
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

  // --- 2. FORMATTING HELPERS ---
  const formatLargeNumber = (num) => {
    if (num === undefined || num === null) return '₹0';
    
    const number = Number(num);
    if (isNaN(number)) return '₹0';
    
    if (number >= 10000000) { 
      return `₹${(number / 10000000).toFixed(2)}Cr`;
    } else if (number >= 100000) { 
      return `₹${(number / 100000).toFixed(2)}L`;
    } else if (number >= 1000) { 
      return `₹${(number / 1000).toFixed(2)}K`;
    }
    
    return `₹${number.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatCompactNumber = (num) => {
    if (num === undefined || num === null) return '0';
    const number = Number(num);
    if (isNaN(number)) return '0';
    
    if (number >= 10000000) return `${(number / 10000000).toFixed(1)}Cr`;
    else if (number >= 100000) return `${(number / 100000).toFixed(1)}L`;
    else if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    
    return number.toLocaleString('en-IN');
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0.00';
    const num = Number(amount);
    if (isNaN(num)) return '₹0.00';
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // --- 3. STATS & ANALYTICS CALCULATION ---
  const stats = useMemo(() => {
    const totalRev = bills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
    const totalGst = bills.reduce((sum, b) => sum + (b.taxAmount || 0), 0);
    const totalDiscount = bills.reduce((sum, b) => sum + (b.discount || 0), 0);
    const totalProducts = bills.reduce((sum, b) => {
      return sum + (b.products?.reduce((pSum, p) => pSum + (p.quantity || 0), 0) || 0);
    }, 0);

    // Chart Data logic
    const revenueByDate = {};
    bills.forEach(bill => {
      const date = new Date(bill.invoiceDate || bill.createdAt).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
      });
      revenueByDate[date] = (revenueByDate[date] || 0) + (bill.grandTotal || 0);
    });

    const typeSplit = { pakka: 0, kaccha: 0 };
    bills.forEach(bill => {
      const amount = bill.grandTotal || 0;
      if (bill.billType === 'pakka') typeSplit.pakka += amount;
      else if (bill.billType === 'kaccha') typeSplit.kaccha += amount;
    });

    return { 
      revenue: totalRev, 
      gst: totalGst, 
      discount: totalDiscount, 
      products: totalProducts,
      chartData: Object.entries(revenueByDate)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => {
            const dateA = new Date(a.date + ` ${new Date().getFullYear()}`);
            const dateB = new Date(b.date + ` ${new Date().getFullYear()}`);
            return dateA - dateB;
        })
        .slice(-7),
      typeSplit
    };
  }, [bills]);

  // --- 4. HANDLERS ---
  const handleView = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handleDelete = async (invoiceNumber) => {
    if (!window.confirm(`Delete Bill ${formatInvoiceId(invoiceNumber)}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/bill/delete/${invoiceNumber}`, {
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

  // --- UPDATED: PDF DOWNLOAD HANDLER (Using jsPDF) ---
  const handleDownloadPDF = async (bill) => {
    try {
      setDownloading(bill.invoiceNumber);
      
      // Create a temporary div for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.padding = '20px';
      tempDiv.style.background = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Generate invoice content using the exact same template as view modal
      const invoiceContent = generateInvoiceContent(bill);
      tempDiv.innerHTML = invoiceContent;
      document.body.appendChild(tempDiv);
      
      // Wait for images to load
      const images = tempDiv.getElementsByTagName('img');
      const imagePromises = [];
      for (let img of images) {
        if (!img.complete) {
          const promise = new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if image fails
          });
          imagePromises.push(promise);
        }
      }
      
      await Promise.all(imagePromises);
      
      // Generate PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`Invoice_${formatInvoiceId(bill.invoiceNumber)}.pdf`);
      
      // Cleanup
      document.body.removeChild(tempDiv);
      setMobileActionsOpen(null);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  // Helper function to generate invoice content for PDF (EXACT SAME AS VIEW MODAL)
  const generateInvoiceContent = (bill) => {
    const invoiceId = formatInvoiceId(bill.invoiceNumber);
    const date = formatDate(bill.invoiceDate || bill.createdAt);
    const clientName = bill.buyer?.clientName || 'N/A';
    const clientAddress = bill.buyer?.clientAddress || '';
    const clientGst = bill.buyer?.clientGst || '';
    const companyName = profileData?.company?.companyName || 'Your Company';
    const companyAddress = profileData?.company?.companyAddress || '';
    const companyEmail = profileData?.company?.companyEmail || '';
    const companyGst = profileData?.company?.GST || '';
    const companyLogo = profileData?.company?.companyLogo || '';
    const companyStamp = profileData?.company?.companyStamp || '';
    const companySignature = profileData?.company?.companySignature || '';
    const bankDetails = profileData?.bankDetails || null;
    
    return `
      <div style="max-width: 800px; margin: 0 auto; padding: 32px; background: white; font-family: Arial, sans-serif; color: #334155;">
        <!-- Header with Title and Logo -->
        <div style="display: flex; flex-direction: column; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; gap: 24px;">
            <div style="flex: 1;">
              <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 24px; color: ${bill.billType === 'kaccha' ? '#d97706' : '#1e293b'};">
                ${bill.billType === 'kaccha' ? 'Proforma Invoice' : 'Tax Invoice'}
              </h1>
              <div style="display: flex; flex-wrap: wrap; gap: 24px;">
                <div>
                  <p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Invoice Number</p>
                  <p style="color: #1e293b; font-weight: 600; font-size: 18px;">${invoiceId}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Date of Issue</p>
                  <p style="color: #1e293b; font-weight: 600; font-size: 18px;">${date}</p>
                </div>
              </div>
            </div>
            ${companyLogo ? `
              <div style="flex-shrink: 0;">
                <img src="${companyLogo}" alt="Company Logo" style="max-height: 80px; max-width: 200px; object-fit: contain;" />
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Billed To and From Sections -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px;">
          <!-- Billed To -->
          <div>
            <h3 style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Billed To</h3>
            <p style="font-weight: bold; color: #1e293b; font-size: 20px; margin-bottom: 8px;">${clientName}</p>
            <p style="color: #64748b; font-size: 14px; white-space: pre-wrap; margin-bottom: 16px;">${clientAddress || 'No address provided'}</p>
            ${bill.billType !== 'kaccha' && clientGst ? `
              <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
                <p style="font-size: 14px; font-weight: 500; color: #334155;">GSTIN: ${clientGst}</p>
              </div>
            ` : ''}
          </div>
          
          <!-- From -->
          <div>
            <h3 style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">From</h3>
            <p style="font-weight: bold; color: #1e293b; font-size: 20px; margin-bottom: 8px;">${companyName}</p>
            <p style="color: #64748b; font-size: 14px; white-space: pre-wrap; margin-bottom: 16px;">${companyAddress || 'No address provided'}</p>
            ${companyEmail ? `<p style="color: #64748b; font-size: 14px;">${companyEmail}</p>` : ''}
            ${companyGst && bill.billType !== 'kaccha' ? `
              <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 8px;">
                <p style="font-size: 14px; font-weight: 500; color: #334155;">GSTIN: ${companyGst}</p>
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Products Table -->
        <div style="margin-bottom: 32px; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="text-align: left; padding: 16px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Description</th>
                <th style="text-align: right; padding: 16px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Rate</th>
                <th style="text-align: right; padding: 16px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                <th style="text-align: right; padding: 16px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bill.products?.map((p, i) => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 16px; font-weight: 500; color: #1e293b; min-width: 200px;">
                    ${p.name || 'Untitled Product/Service'}
                    ${p.description ? `
                      <p style="font-size: 14px; color: #64748b; margin-top: 4px;">${p.description}</p>
                    ` : ''}
                  </td>
                  <td style="padding: 16px; text-align: right; font-family: monospace; color: #334155;">${formatCurrency(p.rate)}</td>
                  <td style="padding: 16px; text-align: right; font-family: monospace; color: #334155;">${p.quantity}</td>
                  <td style="padding: 16px; text-align: right; font-weight: bold; color: #1e293b; font-family: monospace;">${formatCurrency(p.amount || (p.rate * p.quantity))}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- Totals Section -->
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 100%; max-width: 400px; space-y: 12px;">
            <div style="display: flex; justify-content: space-between; color: #64748b;">
              <span>Subtotal</span>
              <span style="font-weight: 500;">${formatCurrency(bill.subTotal)}</span>
            </div>
            ${bill.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: #64748b;">
                <span>Discount</span>
                <span style="color: #ef4444; font-weight: 500;">- ${formatCurrency(bill.discount)}</span>
              </div>
            ` : ''}
            ${bill.billType !== 'kaccha' && bill.taxAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: #64748b;">
                <span>Tax Rate</span>
                <span>${bill.gstPercentage}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; color: #64748b;">
                <span>Tax Amount</span>
                <span style="font-weight: 500;">+ ${formatCurrency(bill.taxAmount)}</span>
              </div>
            ` : ''}
            <div style="padding-top: 16px; border-top: 1px solid #cbd5e1; margin-top: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 20px; font-weight: bold; color: ${bill.billType === 'kaccha' ? '#d97706' : '#1e293b'};">${bill.billType === 'kaccha' ? 'Total Amount' : 'Invoice Total'}</span>
                <span style="font-size: 36px; font-weight: bold; color: ${bill.billType === 'kaccha' ? '#d97706' : '#1e293b'};">${formatCurrency(bill.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notes and Signature Section -->
        <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <!-- Left Column: Notes and Bank Details -->
            <div>
              ${bill.notes ? `
                <div style="margin-bottom: 24px;">
                  <p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Notes</p>
                  <p style="color: #64748b; font-size: 14px; white-space: pre-wrap;">${bill.notes}</p>
                </div>
              ` : ''}
              
              ${bankDetails?.bankName && bill.billType !== 'kaccha' ? `
                <div>
                  <p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Bank Details</p>
                  <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
                      <span style="color: #64748b;">Bank:</span>
                      <span style="font-weight: 500; color: #334155;">${bankDetails.bankName}</span>
                      <span style="color: #64748b;">Account:</span>
                      <span style="font-weight: 500; color: #334155;">${bankDetails.accountNumber}</span>
                      <span style="color: #64748b;">IFSC:</span>
                      <span style="font-weight: 500; color: #334155;">${bankDetails.IFSC}</span>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
            
            <!-- Right Column: Signature and Stamp -->
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <div style="position: relative; margin-bottom: 24px;">
                ${companyStamp ? `
                  <img src="${companyStamp}" alt="Company Stamp" style="position: absolute; top: -32px; opacity: 0.7; width: 80px; height: 80px; object-fit: contain;" />
                ` : ''}
                ${companySignature ? `
                  <img src="${companySignature}" alt="Signature" style="height: 64px; width: auto; object-fit: contain;" />
                ` : ''}
              </div>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #cbd5e1; text-align: center;">
                <p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Authorized Signatory</p>
                <p style="font-size: 14px; font-weight: 500; color: #334155; margin-top: 4px;">For ${companyName}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>Thank you for your business!</p>
          <p style="margin-top: 4px;">Invoice generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    `;
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

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-3 md:gap-4">
        <div>
          <p className="text-slate-500 text-sm md:text-xl">Overview of your business performance.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/bills/pakka'}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 md:px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg transition active:scale-95 w-full md:w-auto justify-center"
        >
          <FileText size={18} />
          <span>New Bill</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard label="Total Revenue" value={formatLargeNumber(stats.revenue)} fullValue={formatCurrency(stats.revenue)} icon={<TrendingUp className="w-4 h-4 md:w-5 md:h-5" />} color="blue" />
        <StatCard label="GST Collected" value={formatLargeNumber(stats.gst)} fullValue={formatCurrency(stats.gst)} icon={<FileText className="w-4 h-4 md:w-5 md:h-5" />} color="green" />
        <StatCard label="Discounts" value={formatLargeNumber(stats.discount)} fullValue={formatCurrency(stats.discount)} icon={<AlertCircle className="w-4 h-4 md:w-5 md:h-5" />} color="yellow" />
        <StatCard label="Products Sold" value={formatCompactNumber(stats.products)} fullValue={stats.products.toLocaleString('en-IN')} icon={<CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />} color="purple" />
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-auto">
          {['all', 'kaccha', 'pakka'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 md:flex-none px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filterType === type ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-auto">
          <button onClick={() => setViewMode('table')} className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutList className="w-4 h-4 md:w-5 md:h-5" /> <span>Table</span>
          </button>
          <button onClick={() => setViewMode('analytics')} className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5" /> <span>Analytics</span>
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
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse min-w-[768px]">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-6 min-w-[120px]">Invoice ID</th>
                      <th className="py-4 px-6 min-w-[100px]">Date</th>
                      <th className="py-4 px-6 min-w-[180px]">Client</th>
                      <th className="py-4 px-6 min-w-[90px]">Type</th>
                      <th className="py-4 px-6 min-w-[120px] text-right">Amount</th>
                      <th className="py-4 px-6 min-w-[160px] text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-800 truncate max-w-[120px]" title={formatInvoiceId(bill.invoiceNumber)}>
                          {formatInvoiceId(bill.invoiceNumber)}
                        </td>
                        <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                          {formatDate(bill.invoiceDate || bill.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-slate-800 truncate max-w-[180px]" title={bill.buyer?.clientName}>
                            {bill.buyer?.clientName || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[180px]" title={bill.buyer?.clientAddress}>
                            {bill.buyer?.clientAddress || ""}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            bill.billType === 'kaccha' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {bill.billType}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="font-bold text-slate-800 text-sm" title={formatCurrency(bill.grandTotal)}>
                            {formatLargeNumber(bill.grandTotal)}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{bill.products?.length || 0} items</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            {bill.billType === 'kaccha' && (
                              <button onClick={() => handleConvert(bill._id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Convert">
                                <RefreshCw size={16} />
                              </button>
                            )}
                            <button onClick={() => handleView(bill)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleDownloadPDF(bill)} 
                              disabled={downloading === bill.invoiceNumber}
                              className={`p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors ${downloading === bill.invoiceNumber ? 'opacity-50 cursor-not-allowed' : ''}`} 
                              title="Download PDF"
                            >
                              {downloading === bill.invoiceNumber ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <Download size={16} />
                              )}
                            </button>
                            <button onClick={() => handleDelete(bill.invoiceNumber)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-800 truncate" title={bill.buyer?.clientName}>
                          {bill.buyer?.clientName || 'N/A'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {formatDate(bill.invoiceDate || bill.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          bill.billType === 'kaccha' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {bill.billType === 'kaccha' ? 'Kacha' : 'Pakka'}
                        </span>
                        <button onClick={() => setMobileActionsOpen(mobileActionsOpen === bill._id ? null : bill._id)} className="p-1 text-slate-500 hover:text-slate-700">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500">Invoice ID</div>
                        <div className="font-medium text-slate-600 text-sm truncate max-w-[120px]" title={formatInvoiceId(bill.invoiceNumber)}>
                          {formatInvoiceId(bill.invoiceNumber)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Amount</div>
                        <div className="font-bold text-slate-800 text-sm" title={formatCurrency(bill.grandTotal)}>
                          {formatLargeNumber(bill.grandTotal)}
                        </div>
                      </div>
                    </div>

                    {mobileActionsOpen === bill._id && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap gap-2">
                          {bill.billType === 'kaccha' && (
                            <button onClick={() => handleConvert(bill._id)} className="flex-1 min-w-[100px] px-3 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1">
                              <RefreshCw size={14} /> Convert
                            </button>
                          )}
                          <button onClick={() => handleView(bill)} className="flex-1 min-w-[100px] px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1">
                            <Eye size={14} /> View
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(bill)} 
                            disabled={downloading === bill.invoiceNumber}
                            className={`flex-1 min-w-[100px] px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1 ${downloading === bill.invoiceNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {downloading === bill.invoiceNumber ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <Download size={14} />
                            )} Download
                          </button>
                          <button onClick={() => handleDelete(bill.invoiceNumber)} className="flex-1 min-w-[100px] px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1">
                            <Trash2 size={14} /> Delete
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
            
            {/* CHART 1: REVENUE TREND (UPDATED TO RECHARTS) */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-6">Revenue Trend</h3>
                <div className="h-64 md:h-80 w-full">
                  {stats.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={stats.chartData}
                        margin={{ top: 5, right: 20, bottom: 5, left: -20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          tickFormatter={(value) => formatLargeNumber(value)} 
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value) => [formatCurrency(value), 'Revenue']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#4f46e5" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      Not enough data to display chart
                    </div>
                  )}
                </div>
            </div>

            {/* CHART 2: BILL TYPE RATIO */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-6">Bill Type Distribution</h3>
                <div className="flex items-center justify-center h-48 md:h-64">
                    <div className="w-full max-w-xs space-y-4 md:space-y-6">
                        {/* Pakka Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-700">Pakka Bills</span>
                                <span className="text-slate-500" title={formatCurrency(stats.typeSplit.pakka)}>
                                    {formatLargeNumber(stats.typeSplit.pakka)}
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(stats.typeSplit.pakka / (stats.revenue || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        {/* Kaccha Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-700">Kaccha Bills</span>
                                <span className="text-slate-500" title={formatCurrency(stats.typeSplit.kaccha)}>
                                    {formatLargeNumber(stats.typeSplit.kaccha)}
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3">
                                <div className="bg-orange-400 h-3 rounded-full transition-all duration-500" style={{ width: `${(stats.typeSplit.kaccha / (stats.revenue || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        {/* Summary */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-slate-800">Total Revenue</span>
                                <span className="font-bold text-slate-800" title={formatCurrency(stats.revenue)}>
                                    {formatLargeNumber(stats.revenue)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIST: TOP RECENT TRANSACTIONS */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4">Top Recent Transactions</h3>
                <div className="space-y-2 md:space-y-3">
                    {bills.slice(0, 5).map(bill => (
                        <div key={bill._id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-400 flex-shrink-0">
                                    <ArrowUpRight size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-slate-800 truncate" title={bill.buyer?.clientName}>
                                        {bill.buyer?.clientName || 'N/A'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-slate-500">{formatDate(bill.invoiceDate)}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            bill.billType === 'kaccha' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {bill.billType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <p className="font-bold text-slate-900 text-sm md:text-base" title={formatCurrency(bill.grandTotal)}>
                                    {formatLargeNumber(bill.grandTotal)}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {bill.products?.length || 0} Items
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* MODAL (EXACT TEMPLATE THAT PDF USES) */}
      {isModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl shadow-2xl rounded-xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* FIXED HEADER */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                <h2 className="font-bold text-slate-800 text-lg">Invoice Preview</h2>
                <div className="flex gap-2">
                    {/* <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm text-slate-700 transition-colors">
                        <Printer size={16} /> <span>Print</span>
                    </button> */}
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>
            {/* SCROLLABLE BODY */}
            <div className="overflow-y-auto p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b border-slate-200">
                <div className="min-w-0 flex-1">
                  <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${selectedBill.billType === 'kaccha' ? 'text-amber-600' : 'text-slate-900'}`}>
                    {selectedBill.billType === 'kaccha' ? 'Proforma Invoice' : 'Tax Invoice'}
                  </h1>
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Invoice Number</p><p className="text-slate-800 font-semibold text-lg">{formatInvoiceId(selectedBill.invoiceNumber)}</p></div>
                    <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Issue</p><p className="text-slate-800 font-semibold text-lg">{formatDate(selectedBill.invoiceDate || selectedBill.createdAt)}</p></div>
                  </div>
                </div>
                {profileData?.company?.companyLogo && (<div className="flex-shrink-0"><img src={profileData.company.companyLogo} alt="Company Logo" className="max-h-20 w-auto object-contain" /></div>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Billed To</h3><p className="font-bold text-slate-900 text-xl mb-2">{selectedBill.buyer?.clientName || 'N/A'}</p><p className="text-slate-600 text-sm whitespace-pre-wrap mb-4">{selectedBill.buyer?.clientAddress || 'No address provided'}</p>{selectedBill.billType !== 'kaccha' && selectedBill.buyer?.clientGst && (<div className="bg-slate-50 p-3 rounded-lg"><p className="text-sm font-medium text-slate-700">GSTIN: {selectedBill.buyer.clientGst}</p></div>)}</div>
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">From</h3><p className="font-bold text-slate-900 text-xl mb-2">{profileData?.company?.companyName || 'Your Company'}</p><p className="text-slate-600 text-sm whitespace-pre-wrap mb-4">{profileData?.company?.companyAddress || 'No address provided'}</p>{profileData?.company?.companyEmail && (<p className="text-slate-600 text-sm">{profileData.company.companyEmail}</p>)}{profileData?.company?.GST && selectedBill.billType !== 'kaccha' && (<div className="bg-slate-50 p-3 rounded-lg mt-2"><p className="text-sm font-medium text-slate-700">GSTIN: {profileData.company.GST}</p></div>)}</div>
              </div>
              <div className="overflow-x-auto mb-8"><table className="w-full border-collapse"><thead><tr className="bg-slate-50"><th className="text-left p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Description</th><th className="text-right p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Rate</th><th className="text-right p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Qty</th><th className="text-right p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th></tr></thead><tbody>{selectedBill.products?.map((p, i) => (<tr key={i} className="border-b border-slate-100"><td className="p-4 font-medium text-slate-800 min-w-[200px]">{p.name || 'Untitled Product/Service'}{p.description && (<p className="text-sm text-slate-500 mt-1">{p.description}</p>)}</td><td className="p-4 text-right font-mono text-slate-700">{formatCurrency(p.rate)}</td><td className="p-4 text-right font-mono text-slate-700">{p.quantity}</td><td className="p-4 text-right font-bold text-slate-900 font-mono">{formatCurrency(p.amount || (p.rate * p.quantity))}</td></tr>))}</tbody></table></div>
              <div className="flex justify-end"><div className="w-full max-w-md space-y-3"><div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-medium">{formatCurrency(selectedBill.subTotal)}</span></div>{selectedBill.discount > 0 && (<div className="flex justify-between text-slate-600"><span>Discount</span><span className="text-red-500 font-medium">- {formatCurrency(selectedBill.discount)}</span></div>)}{selectedBill.billType !== 'kaccha' && selectedBill.taxAmount > 0 && (<><div className="flex justify-between text-slate-600"><span>Tax Rate</span><span>{selectedBill.gstPercentage}%</span></div><div className="flex justify-between text-slate-600"><span>Tax Amount</span><span className="font-medium">+ {formatCurrency(selectedBill.taxAmount)}</span></div></>)}<div className="pt-4 border-t border-slate-300"><div className="flex justify-between items-center"><span className={`text-xl font-bold ${selectedBill.billType === 'kaccha' ? 'text-amber-600' : 'text-slate-900'}`}>{selectedBill.billType === 'kaccha' ? 'Total Amount' : 'Invoice Total'}</span><span className={`text-2xl md:text-3xl font-bold ${selectedBill.billType === 'kaccha' ? 'text-amber-600' : 'text-slate-900'}`}>{formatCurrency(selectedBill.grandTotal)}</span></div></div></div></div>
              <div className="mt-12 pt-8 border-t border-slate-200"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div>{selectedBill.notes && (<div className="mb-6"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</p><p className="text-slate-600 text-sm whitespace-pre-wrap">{selectedBill.notes}</p></div>)}{profileData?.bankDetails?.bankName && selectedBill.billType !== 'kaccha' && (<div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bank Details</p><div className="bg-slate-50 p-4 rounded-lg"><div className="grid grid-cols-2 gap-2 text-sm"><span className="text-slate-500">Bank:</span><span className="font-medium text-slate-800">{profileData.bankDetails.bankName}</span><span className="text-slate-500">Account:</span><span className="font-medium text-slate-800">{profileData.bankDetails.accountNumber}</span><span className="text-slate-500">IFSC:</span><span className="font-medium text-slate-800">{profileData.bankDetails.IFSC}</span></div></div></div>)}</div><div className="flex flex-col items-end"><div className="relative">{profileData?.company?.companyStamp && (<img src={profileData.company.companyStamp} alt="Company Stamp" className="absolute -top-8 opacity-70 w-20 h-20 object-contain" />)}{profileData?.company?.companySignature && (<img src={profileData.company.companySignature} alt="Signature" className="h-16 w-auto object-contain" />)}</div><div className="mt-6 border-t border-slate-300 pt-4 text-center"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authorized Signatory</p><p className="text-sm font-medium text-slate-800 mt-1">For {profileData?.company?.companyName || "Your Company"}</p></div></div></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Stats Card Component with hover for full value
function StatCard({ label, value, fullValue, icon, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    purple: "text-purple-600 bg-purple-50",
  };
  
  return (
    <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">
            {label}
          </p>
          <h3 
            className="text-xl md:text-2xl font-bold text-slate-800 truncate" 
            title={fullValue || value}
          >
            {value}
          </h3>
          {fullValue && fullValue !== value && (
            <p className="text-xs text-slate-400 mt-1 truncate" title={fullValue}>
              {fullValue}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${colors[color]} flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </div>
  );
}