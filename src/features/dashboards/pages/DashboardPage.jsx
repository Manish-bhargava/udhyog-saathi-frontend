import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
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
  Pencil
} from 'lucide-react';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

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
import billAPI from '../../bills/api';
import inventoryAPI from '../../Inventory/api';
import BillForm from '../../bills/components/BillForm';
import BillPreview from '../../bills/components/BillPreview';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UdhyogDashboard() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); 
  const [viewMode, setViewMode] = useState('table');   
  const [dashboardSection, setDashboardSection] = useState('billing');
  const outletContext = useOutletContext() || {};
  const globalSearch = outletContext.dashboardSearch || '';
  const [inventoryFilter, setInventoryFilter] = useState('all');
  const [inventoryMode, setInventoryMode] = useState('table');
  const [profileData, setProfileData] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventorySummary, setInventorySummary] = useState({
    totalItems: 0,
    totalUnits: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    categoryBreakdown: [],
    lowStockItems: [],
  });
  
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertingBill, setConvertingBill] = useState(null);
  const [conversionData, setConversionData] = useState({
    clientAddress: '',
    clientGst: '',
    gstPercentage: 18
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);
  const [editingBillType, setEditingBillType] = useState('kaccha');
  const [showEditValidation, setShowEditValidation] = useState(false);
  const [editFormData, setEditFormData] = useState({
    buyer: { clientName: '', clientAddress: '', clientGst: '' },
    products: [{ name: '', rate: 0, quantity: 1 }],
    invoiceDate: '',
    gstPercentage: 18,
    discount: 0,
    notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setInventoryLoading(true);
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

      const [finishedResult, rawResult] = await Promise.allSettled([
        inventoryAPI.getFinishedItems(),
        inventoryAPI.getRawItems(),
      ]);

      const normalizeItems = (result) => {
        if (result.status !== 'fulfilled') return [];
        const payload = result.value;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload)) return payload;
        return [];
      };

      const allInventoryItems = [
        ...normalizeItems(finishedResult).map((item) => ({ ...item, _inventoryType: 'finished' })),
        ...normalizeItems(rawResult).map((item) => ({ ...item, _inventoryType: 'raw' })),
      ];

      const normalizedInventoryItems = allInventoryItems.map((item) => {
        const qty = Number(item.availableQuantity ?? item.quantity ?? item.reorderLevel ?? 0) || 0;
        const reorderLevel = Number(item.reorderLevel) || 0;
        const status = qty <= 0 ? 'out' : (reorderLevel > 0 && qty <= reorderLevel ? 'low' : 'healthy');
        return {
          id: item._id || item.id || `${item.name || 'item'}-${item._inventoryType || 'general'}`,
          name: item.name || 'Unnamed Item',
          qty,
          reorderLevel,
          unit: item.unit || '-',
          status,
          type: item._inventoryType === 'finished' ? 'Finished' : 'Raw',
          updatedAt: item.updatedAt || item.createdAt || null,
        };
      });

      const summary = allInventoryItems.reduce(
        (acc, item) => {
          const qty = Number(item.availableQuantity ?? item.quantity ?? item.reorderLevel ?? 0) || 0;
          const reorderLevel = Number(item.reorderLevel) || 0;
          const isOut = qty <= 0;
          const isLow = !isOut && reorderLevel > 0 && qty <= reorderLevel;
          const category = item.unit || 'Uncategorized';

          acc.totalItems += 1;
          acc.totalUnits += qty;
          if (isOut) acc.outOfStock += 1;
          else if (isLow) acc.lowStock += 1;
          else acc.inStock += 1;

          acc.categoryMap.set(category, (acc.categoryMap.get(category) || 0) + qty);
          if (isLow || isOut) {
            acc.lowStockItems.push({
              id: item._id || item.id || `${item.name}-${category}`,
              name: item.name || 'Unnamed Item',
              qty,
              reorderLevel,
              category,
            });
          }
          return acc;
        },
        {
          totalItems: 0,
          totalUnits: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
          categoryMap: new Map(),
          lowStockItems: [],
        },
      );

      const categoryBreakdown = Array.from(summary.categoryMap.entries())
        .map(([name, units]) => ({ name, units }))
        .sort((a, b) => b.units - a.units)
        .slice(0, 6);

      const lowStockItems = summary.lowStockItems
        .sort((a, b) => a.qty - b.qty)
        .slice(0, 5);

      setInventorySummary({
        totalItems: summary.totalItems,
        totalUnits: summary.totalUnits,
        inStock: summary.inStock,
        lowStock: summary.lowStock,
        outOfStock: summary.outOfStock,
        categoryBreakdown,
        lowStockItems,
      });
      setInventoryItems(normalizedInventoryItems);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const formatLargeNumber = (num) => {
    if (num === undefined || num === null) return '₹0';
    const number = Number(num);
    if (isNaN(number)) return '₹0';
    if (number >= 10000000) return `₹${(number / 10000000).toFixed(2)}Cr`;
    else if (number >= 100000) return `₹${(number / 100000).toFixed(2)}L`;
    else if (number >= 1000) return `₹${(number / 1000).toFixed(2)}K`;
    return `₹${number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  const editTotals = useMemo(() => {
    const subtotal = editFormData.products.reduce((s, p) => s + (p.rate * p.quantity), 0);
    const discountAmount = Number(editFormData.discount) || 0;
    const gstRate = Number(editFormData.gstPercentage) || 0;
    const gst = editingBillType === 'pakka' ? ((subtotal - discountAmount) * gstRate) / 100 : 0;
    return {
      subtotal,
      discount: discountAmount,
      grandTotal: Math.max(0, subtotal + gst - discountAmount)
    };
  }, [editFormData, editingBillType]);

  const stats = useMemo(() => {
    const totalRev = bills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
    const totalGst = bills.reduce((sum, b) => sum + (b.taxAmount || 0), 0);
    const totalDiscount = bills.reduce((sum, b) => sum + (b.discount || 0), 0);
    const totalProducts = bills.reduce((sum, b) => {
      return sum + (b.products?.reduce((pSum, p) => pSum + (p.quantity || 0), 0) || 0);
    }, 0);

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

  const filteredInventoryItems = useMemo(() => {
    if (inventoryFilter === 'all') return inventoryItems;
    return inventoryItems.filter((item) => item.status === inventoryFilter);
  }, [inventoryItems, inventoryFilter]);

  const normalizedSearch = globalSearch.trim().toLowerCase();

  const visibleBills = useMemo(() => {
    if (!normalizedSearch) return bills;
    return bills.filter((bill) => {
      const searchable = [
        formatInvoiceId(bill.invoiceNumber),
        bill.buyer?.clientName,
        bill.buyer?.clientAddress,
        bill.buyer?.clientGst,
        bill.billType,
        formatDate(bill.invoiceDate || bill.createdAt),
        ...(bill.products?.map((p) => p.name) || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(normalizedSearch);
    });
  }, [bills, normalizedSearch]);

  const visibleInventoryItems = useMemo(() => {
    if (!normalizedSearch) return filteredInventoryItems;
    return filteredInventoryItems.filter((item) => {
      const searchable = [
        item.name,
        item.type,
        item.unit,
        item.status,
        String(item.qty),
        String(item.reorderLevel),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(normalizedSearch);
    });
  }, [filteredInventoryItems, normalizedSearch]);

  const filteredInventorySummary = useMemo(() => {
    return visibleInventoryItems.reduce(
      (acc, item) => {
        acc.total += 1;
        if (item.status === 'healthy') acc.healthy += 1;
        else if (item.status === 'low') acc.low += 1;
        else acc.out += 1;
        return acc;
      },
      { total: 0, healthy: 0, low: 0, out: 0 },
    );
  }, [visibleInventoryItems]);

  const inventoryTypeSplit = useMemo(() => {
    return visibleInventoryItems.reduce(
      (acc, item) => {
        if (item.type === 'Finished') acc.finished += 1;
        else acc.raw += 1;
        return acc;
      },
      { finished: 0, raw: 0 },
    );
  }, [visibleInventoryItems]);

  const filteredLowStockItems = useMemo(() => {
    return visibleInventoryItems
      .filter((item) => item.status === 'low' || item.status === 'out')
      .sort((a, b) => a.qty - b.qty)
      .slice(0, 5);
  }, [visibleInventoryItems]);

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
        toast.success("Bill deleted successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error deleting bill");
    }
  };

  const handleConvert = (bill) => {
    setConvertingBill(bill);
    setConversionData({
      clientAddress: bill.buyer?.clientAddress || '',
      clientGst: bill.buyer?.clientGst || '',
      gstPercentage: 18
    });
    setIsConvertModalOpen(true);
  };

  const processConversion = async () => {
    try {
      setLoading(true);
      const result = await billAPI.convertKachaToPakka(convertingBill._id, conversionData);
      if (result.success) {
        await fetchData(); 
        setIsConvertModalOpen(false);
        setConvertingBill(null);
        setMobileActionsOpen(null);
        toast.success("Successfully converted to Pakka Bill!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error converting bill");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bill) => {
    setEditingBillId(bill._id);
    setEditingBillType(bill.billType === 'pakka' ? 'pakka' : 'kaccha');
    setShowEditValidation(false);
    setEditFormData({
      buyer: { 
        clientName: bill.buyer?.clientName || '', 
        clientAddress: bill.buyer?.clientAddress || '', 
        clientGst: bill.buyer?.clientGst || '' 
      },
      products: bill.products?.map(p => ({ 
        name: p.name, rate: p.rate, quantity: p.quantity 
      })) || [{ name: '', rate: 0, quantity: 1 }],
      invoiceDate: bill.invoiceDate ? new Date(bill.invoiceDate).toISOString().slice(0, 10) : '',
      gstPercentage: Number.isFinite(Number(bill.gstPercentage)) ? Number(bill.gstPercentage) : 18,
      discount: bill.discount || 0, // Just load the value as-is
      notes: bill.notes || ''       // Capture existing notes
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSave = async () => {
    setShowEditValidation(true);
    const invalidProducts = editFormData.products.some(
      (p) => !p.name?.trim() || !(Number(p.rate) > 0) || !(Number(p.quantity) > 0),
    );
    const missingBuyer =
      !editFormData.buyer?.clientName?.trim() ||
      (editingBillType === 'pakka' &&
        (!editFormData.buyer?.clientAddress?.trim() || !editFormData.buyer?.clientGst?.trim()));

    if (missingBuyer || invalidProducts) {
      toast.error('Please fill all required fields before saving.');
      return;
    }

    try {
      setLoading(true);
      const { invoiceDate, gstPercentage, ...restEditFormData } = editFormData;
      const sanitizedData = {
        ...restEditFormData,
        discount: Number(editFormData.discount) || 0, // Ensure numeric amount
        notes: editFormData.notes || "",             // Ensure notes are sent
        ...(editingBillType === 'pakka' ? { gstPercentage: Number(gstPercentage) || 0 } : {}),
        products: editFormData.products.map(p => ({
          ...p,
          rate: Number(p.rate),
          quantity: Number(p.quantity)
        })),
        ...(invoiceDate ? { requestedInvoiceDate: invoiceDate } : {})
      };

      const result = await billAPI.updateBill(editingBillId, sanitizedData);
      if (result.success) {
        await fetchData();
        setIsEditModalOpen(false);
        setShowEditValidation(false);
        setMobileActionsOpen(null);
        toast.success("Bill updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update bill");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (bill) => {
    try {
      setDownloading(bill.invoiceNumber);
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm'; 
      tempDiv.style.padding = '20px';
      tempDiv.style.background = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      const invoiceContent = generateInvoiceContent(bill);
      tempDiv.innerHTML = invoiceContent;
      document.body.appendChild(tempDiv);
      
      const images = tempDiv.getElementsByTagName('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
      });
      await Promise.all(imagePromises);
      
      const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Invoice_${formatInvoiceId(bill.invoiceNumber)}.pdf`);
      document.body.removeChild(tempDiv);
      setMobileActionsOpen(null);
      toast.success("PDF Downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF.");
    } finally {
      setDownloading(null);
    }
  };

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
        <div style="display: flex; flex-direction: column; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; gap: 24px;">
            <div style="flex: 1;">
              <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 24px; color: ${bill.billType === 'kaccha' ? '#d97706' : '#1e293b'};">
                ${bill.billType === 'kaccha' ? 'Proforma Invoice' : 'Tax Invoice'}
              </h1>
              <div style="display: flex; flex-wrap: wrap; gap: 24px;">
                <div><p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Invoice Number</p><p style="color: #1e293b; font-weight: 600; font-size: 18px;">${invoiceId}</p></div>
                <div><p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Date of Issue</p><p style="color: #1e293b; font-weight: 600; font-size: 18px;">${date}</p></div>
              </div>
            </div>
            ${companyLogo ? `<div style="flex-shrink: 0;"><img src="${companyLogo}" style="max-height: 80px; max-width: 200px; object-fit: contain;" /></div>` : ''}
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px;">
          <div>
            <h3 style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Billed To</h3>
            <p style="font-weight: bold; color: #1e293b; font-size: 20px; margin-bottom: 8px;">${clientName}</p>
            <p style="color: #64748b; font-size: 14px; white-space: pre-wrap; margin-bottom: 16px;">${clientAddress || 'No address provided'}</p>
            ${bill.billType !== 'kaccha' && clientGst ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><p style="font-size: 14px; font-weight: 500; color: #334155;">GSTIN: ${clientGst}</p></div>` : ''}
          </div>
          <div>
            <h3 style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">From</h3>
            <p style="font-weight: bold; color: #1e293b; font-size: 20px; margin-bottom: 8px;">${companyName}</p>
            <p style="color: #64748b; font-size: 14px; white-space: pre-wrap; margin-bottom: 16px;">${companyAddress || 'No address provided'}</p>
            ${companyEmail ? `<p style="color: #64748b; font-size: 14px;">${companyEmail}</p>` : ''}
            ${companyGst && bill.billType !== 'kaccha' ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 8px;"><p style="font-size: 14px; font-weight: 500; color: #334155;">GSTIN: ${companyGst}</p></div>` : ''}
          </div>
        </div>
        <div style="margin-bottom: 32px; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead><tr style="background: #f8fafc;"><th style="text-align: left; padding: 16px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Description</th><th style="text-align: right; padding: 16px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Rate</th><th style="text-align: right; padding: 16px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th><th style="text-align: right; padding: 16px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th></tr></thead>
            <tbody>${bill.products?.map(p => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 16px; font-weight: 500; color: #1e293b; min-width: 200px;">${p.name || 'Untitled'}${p.description ? `<p style="font-size: 14px; color: #64748b; margin-top: 4px;">${p.description}</p>` : ''}</td><td style="padding: 16px; text-align: right;">${formatCurrency(p.rate)}</td><td style="padding: 16px; text-align: right;">${p.quantity}</td><td style="padding: 16px; text-align: right; font-weight: bold; font-family: monospace;">${formatCurrency(p.amount || (p.rate * p.quantity))}</td></tr>`).join('')}</tbody>
          </table>
        </div>
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 100%; max-width: 400px;">
            <div style="display: flex; justify-content: space-between; color: #64748b;"><span>Subtotal</span><span style="font-weight: 500;">${formatCurrency(bill.subTotal)}</span></div>
            ${bill.discount > 0 ? `<div style="display: flex; justify-content: space-between; color: #64748b;"><span>Discount</span><span style="color: #ef4444; font-weight: 500;">- ${formatCurrency(bill.discount)}</span></div>` : ''}
            ${bill.billType !== 'kaccha' && bill.taxAmount > 0 ? `<div style="display: flex; justify-content: space-between; color: #64748b;"><span>Tax Rate</span><span>${bill.gstPercentage}%</span></div><div style="display: flex; justify-content: space-between; color: #64748b;"><span>Tax Amount</span><span style="font-weight: 500;">+ ${formatCurrency(bill.taxAmount)}</span></div>` : ''}
            <div style="padding-top: 16px; border-top: 1px solid #cbd5e1; margin-top: 16px;"><div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 20px; font-weight: bold; color: ${bill.billType === 'kaccha' ? '#d97706' : '#1e293b'};">${bill.billType === 'kaccha' ? 'Total Amount' : 'Invoice Total'}</span><span style="font-size: 36px; font-weight: bold; color: ${bill.billType === 'kaccha' ? '#d97706' : '#1e293b'};">${formatCurrency(bill.grandTotal)}</span></div></div>
          </div>
        </div>
        <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <div>
              ${bill.notes ? `<div style=\"margin-bottom: 24px;\"><p style=\"font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;\">Notes</p><p style=\"color: #64748b; font-size: 14px; white-space: pre-wrap;\">${bill.notes}</p></div>` : ''}
              ${bankDetails?.bankName && bill.billType !== 'kaccha' ? `<div><p style=\"font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;\">Bank Details</p><div style=\"background: #f8fafc; padding: 16px; border-radius: 8px;\"><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;\"><span style=\"color: #64748b;\">Bank:</span><span style=\"font-weight: 500; color: #334155;\">${bankDetails.bankName}</span><span style=\"color: #64748b;\">Account:</span><span style=\"font-weight: 500; color: #334155;\">${bankDetails.accountNumber}</span><span style=\"color: #64748b;\">IFSC:</span><span style=\"font-weight: 500; color: #334155;\">${bankDetails.IFSC}</span></div></div></div>` : ''}
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <div style="position: relative; margin-bottom: 24px;">${companyStamp ? `<img src="${companyStamp}" style="position: absolute; top: -32px; opacity: 0.7; width: 80px; height: 80px; object-fit: contain;" />` : ''}${companySignature ? `<img src="${companySignature}" style="height: 64px; width: auto; object-fit: contain;" />` : ''}</div>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #cbd5e1; text-align: center;"><p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Authorized Signatory</p><p style="font-size: 14px; font-weight: 500; color: #334155; margin-top: 4px;">For ${companyName}</p></div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const inventoryPercent = (value, total) => Math.round((value / Math.max(total, 1)) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-2.5 md:p-4 font-sans text-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 md:mb-5 gap-2 md:gap-3">
        <div className="w-full md:max-w-xl">
          <p className="text-slate-500 text-sm md:text-lg">Overview of your business performance.</p>
        </div>
        <button onClick={() => window.location.href = '/bills/pakka'} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 md:px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg transition active:scale-95 w-full md:w-auto justify-center"><FileText size={18} /><span>New Bill</span></button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mb-4 md:mb-5">
        <StatCard label="Total Revenue" value={formatLargeNumber(stats.revenue)} fullValue={formatCurrency(stats.revenue)} icon={<TrendingUp className="w-4 h-4 md:w-5 md:h-5" />} color="blue" />
        <StatCard label="GST Collected" value={formatLargeNumber(stats.gst)} fullValue={formatCurrency(stats.gst)} icon={<FileText className="w-4 h-4 md:w-5 md:h-5" />} color="green" />
        <StatCard label="Discounts" value={formatLargeNumber(stats.discount)} fullValue={formatCurrency(stats.discount)} icon={<AlertCircle className="w-4 h-4 md:w-5 md:h-5" />} color="yellow" />
        <StatCard label="Products Sold" value={formatCompactNumber(stats.products)} fullValue={stats.products.toLocaleString('en-IN')} icon={<CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />} color="purple" />
      </div>

      <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-fit mb-3 md:mb-4">
        <button
          onClick={() => setDashboardSection('billing')}
          className={`flex-1 md:flex-none px-3 md:px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            dashboardSection === 'billing' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Billing View
        </button>
        <button
          onClick={() => setDashboardSection('inventory')}
          className={`flex-1 md:flex-none px-3 md:px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            dashboardSection === 'inventory' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Inventory View
        </button>
      </div>

      {dashboardSection === 'inventory' && (
      <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 md:mb-4 gap-2.5 md:gap-3">
        <div className="w-full md:w-auto">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Inventory Filter</label>
          <select
            value={inventoryFilter}
            onChange={(e) => setInventoryFilter(e.target.value)}
            className="w-full md:min-w-[190px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Items</option>
            <option value="healthy">Healthy Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-auto">
          <button onClick={() => setInventoryMode('table')} className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-5 py-2 rounded-lg text-sm font-medium transition-all ${inventoryMode === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutList className="w-4 h-4 md:w-5 md:h-5" /> <span>Table</span></button>
          <button onClick={() => setInventoryMode('analytics')} className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-5 py-2 rounded-lg text-sm font-medium transition-all ${inventoryMode === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}><BarChart3 className="w-4 h-4 md:w-5 md:h-5" /> <span>Analytics</span></button>
        </div>
      </div>

      {inventoryMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {inventoryLoading ? (
            <div className="p-6 text-center text-slate-400">Loading inventory...</div>
          ) : visibleInventoryItems.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No inventory items match your search.</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse min-w-[768px]">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Unit</th>
                      <th className="py-3 px-4 text-right">Available Qty</th>
                      <th className="py-3 px-4 text-right">Reorder Level</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleInventoryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                        <td className="py-3 px-4 text-slate-600">{item.type}</td>
                        <td className="py-3 px-4 text-slate-600">{item.unit}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-800">{formatCompactNumber(item.qty)}</td>
                        <td className="py-3 px-4 text-right text-slate-600">{item.reorderLevel > 0 ? formatCompactNumber(item.reorderLevel) : '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${item.status === 'healthy' ? 'bg-green-100 text-green-700' : item.status === 'low' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                            {item.status === 'healthy' ? 'Healthy' : item.status === 'low' ? 'Low' : 'Out'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden p-3 space-y-3">
                {visibleInventoryItems.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-800 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{item.type} · {item.unit}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${item.status === 'healthy' ? 'bg-green-100 text-green-700' : item.status === 'low' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><div className="text-xs text-slate-500">Available Qty</div><div className="font-bold text-slate-800">{formatCompactNumber(item.qty)}</div></div>
                      <div className="text-right"><div className="text-xs text-slate-500">Reorder Level</div><div className="font-medium text-slate-700">{item.reorderLevel > 0 ? formatCompactNumber(item.reorderLevel) : '-'}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Stock Health</h3>
            <div className="space-y-4">
              {[
                { label: 'Healthy', value: inventorySummary.inStock, color: 'bg-green-500' },
                { label: 'Low Stock', value: inventorySummary.lowStock, color: 'bg-amber-500' },
                { label: 'Out of Stock', value: inventorySummary.outOfStock, color: 'bg-red-500' },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{row.label}</span>
                    <span className="text-slate-500">{row.value} ({inventoryPercent(row.value, inventorySummary.totalItems)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className={`${row.color} h-3 rounded-full transition-all duration-500`} style={{ width: `${inventoryPercent(row.value, inventorySummary.totalItems)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Inventory Type Distribution</h3>
            <div className="flex items-center justify-center h-44 md:h-56">
              <div className="w-full max-w-xs space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2"><span className="font-medium text-slate-700">Finished</span><span className="font-semibold text-slate-800">{inventoryTypeSplit.finished}</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${inventoryPercent(inventoryTypeSplit.finished, filteredInventorySummary.total)}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2"><span className="font-medium text-slate-700">Raw</span><span className="font-semibold text-slate-800">{inventoryTypeSplit.raw}</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-slate-500 h-3 rounded-full transition-all duration-500" style={{ width: `${inventoryPercent(inventoryTypeSplit.raw, filteredInventorySummary.total)}%` }} /></div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between font-bold text-slate-800"><span>Total Items</span><span>{filteredInventorySummary.total}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Attention Needed Items</h3>
            {filteredLowStockItems.length === 0 ? (
              <p className="text-slate-500 text-sm">All tracked inventory is in healthy range for this filter.</p>
            ) : (
              <div className="space-y-2.5">
                {filteredLowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${item.qty <= 0 ? 'bg-red-50 border-red-200 text-red-500' : 'bg-amber-50 border-amber-200 text-amber-500'}`}>
                        <AlertCircle size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>{item.unit}</span>
                          {item.reorderLevel > 0 && <span>Reorder at {item.reorderLevel}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className={`font-bold ${item.qty <= 0 ? 'text-red-600' : 'text-amber-600'}`}>{item.qty}</p>
                      <p className="text-xs text-slate-500">Available</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </>
      )}

      {dashboardSection === 'billing' && (
      <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 md:mb-4 gap-2.5 md:gap-3">
        <div className="w-full md:w-auto">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bill Filter</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:min-w-[190px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Bills</option>
            <option value="kaccha">Kaccha Bills</option>
            <option value="pakka">Pakka Bills</option>
          </select>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-auto">
          <button onClick={() => setViewMode('table')} className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-5 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutList className="w-4 h-4 md:w-5 md:h-5" /> <span>Table</span></button>
          <button onClick={() => setViewMode('analytics')} className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-5 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}><BarChart3 className="w-4 h-4 md:w-5 md:h-5" /> <span>Analytics</span></button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading invoices...</div>
          ) : visibleBills.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No bills match your search.</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse min-w-[768px]">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Invoice ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleBills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-800">{formatInvoiceId(bill.invoiceNumber)}</td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{formatDate(bill.invoiceDate || bill.createdAt)}</td>
                        <td className="py-3 px-4"><div className="font-medium text-slate-800 truncate max-w-[180px]">{bill.buyer?.clientName || 'N/A'}</div></td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${bill.billType === 'kaccha' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{bill.billType}</span></td>
                        <td className="py-3 px-4 text-right font-bold text-slate-800">{formatLargeNumber(bill.grandTotal)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {bill.billType === 'kaccha' && (
                              <>
                                <button onClick={() => handleEdit(bill)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit" aria-label={`Edit bill ${formatInvoiceId(bill.invoiceNumber)}`}><Pencil size={16} /></button>
                                <button onClick={() => handleConvert(bill)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Convert" aria-label={`Convert bill ${formatInvoiceId(bill.invoiceNumber)} to pakka`}><RefreshCw size={16} /></button>
                              </>
                            )}
                            <button onClick={() => handleView(bill)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View" aria-label={`View bill ${formatInvoiceId(bill.invoiceNumber)}`}><Eye size={16} /></button>
                            <button onClick={() => handleDownloadPDF(bill)} disabled={downloading === bill.invoiceNumber} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" aria-label={`Download bill ${formatInvoiceId(bill.invoiceNumber)}`}>{downloading === bill.invoiceNumber ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}</button>
                            <button onClick={() => handleDelete(bill.invoiceNumber)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Delete bill ${formatInvoiceId(bill.invoiceNumber)}`}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden p-3 space-y-3">
                {visibleBills.map((bill) => (
                  <div key={bill._id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 flex-1"><div className="font-semibold text-slate-800 truncate">{bill.buyer?.clientName || 'N/A'}</div><div className="text-xs text-slate-500 mt-1">{formatDate(bill.invoiceDate || bill.createdAt)}</div></div>
                      <div className="flex items-center gap-2"><span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${bill.billType === 'kaccha' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{bill.billType}</span><button onClick={() => setMobileActionsOpen(mobileActionsOpen === bill._id ? null : bill._id)} className="p-1 text-slate-500" aria-label={`Toggle actions for bill ${formatInvoiceId(bill.invoiceNumber)}`}><MoreVertical size={16} /></button></div>
                    </div>
                    <div className="flex justify-between items-center text-sm"><div><div className="text-xs text-slate-500">Invoice ID</div><div className="font-medium text-slate-600">{formatInvoiceId(bill.invoiceNumber)}</div></div><div className="text-right"><div className="text-xs text-slate-500">Amount</div><div className="font-bold text-slate-800">{formatLargeNumber(bill.grandTotal)}</div></div></div>
                    {mobileActionsOpen === bill._id && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                        {bill.billType === 'kaccha' && (
                          <>
                            <button onClick={() => handleEdit(bill)} className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1"><Pencil size={14} /> Edit</button>
                            <button onClick={() => handleConvert(bill)} className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1"><RefreshCw size={14} /> Convert</button>
                          </>
                        )}
                        <button onClick={() => handleView(bill)} className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1"><Eye size={14} /> View</button>
                        <button onClick={() => handleDownloadPDF(bill)} disabled={downloading === bill.invoiceNumber} className="flex-1 px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1">{downloading === bill.invoiceNumber ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />} Download</button>
                        <button onClick={() => handleDelete(bill.invoiceNumber)} className="flex-1 px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg flex items-center justify-center gap-1"><Trash2 size={14} /> Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Revenue Trend</h3>
                <div className="h-56 md:h-64 w-full">
                  {stats.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => formatLargeNumber(value)} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [formatCurrency(value), 'Revenue']} />
                        <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : <div className="h-full flex items-center justify-center text-slate-400">Not enough data</div>}
                </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Bill Type Distribution</h3>
                <div className="flex items-center justify-center h-44 md:h-56"><div className="w-full max-w-xs space-y-5">
                    <div><div className="flex justify-between text-sm mb-2"><span className="font-medium text-slate-700">Pakka Bills</span><span>{formatLargeNumber(stats.typeSplit.pakka)}</span></div><div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(stats.typeSplit.pakka / (stats.revenue || 1)) * 100}%` }}></div></div></div>
                    <div><div className="flex justify-between text-sm mb-2"><span className="font-medium text-slate-700">Kaccha Bills</span><span>{formatLargeNumber(stats.typeSplit.kaccha)}</span></div><div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-orange-400 h-3 rounded-full transition-all duration-500" style={{ width: `${(stats.typeSplit.kaccha / (stats.revenue || 1)) * 100}%` }}></div></div></div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between font-bold text-slate-800"><span>Total Revenue</span><span>{formatLargeNumber(stats.revenue)}</span></div>
                </div></div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Top Recent Transactions</h3>
                <div className="space-y-2.5">
                    {visibleBills.slice(0, 5).map(bill => (
                        <div key={bill._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2.5"><div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-400"><ArrowUpRight size={16} /></div><div className="min-w-0 flex-1"><p className="font-bold text-slate-800 truncate">{bill.buyer?.clientName || 'N/A'}</p><div className="flex items-center gap-2 mt-1 text-xs text-slate-500"><span>{formatDate(bill.invoiceDate || bill.createdAt)}</span><span className={`px-2 py-0.5 rounded-full ${bill.billType === 'kaccha' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{bill.billType}</span></div></div></div>
                            <div className="text-right flex-shrink-0 ml-4"><p className="font-bold text-slate-900">{formatLargeNumber(bill.grandTotal)}</p><p className="text-xs text-slate-500">{bill.products?.length || 0} Items</p></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
      </>
      )}

      {/* VIEW MODAL */}
      {isModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl shadow-2xl rounded-xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                <h2 className="font-bold text-slate-800 text-lg">Invoice Preview</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b border-slate-200">
                <div className="min-w-0 flex-1">
                  <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${selectedBill.billType === 'kaccha' ? 'text-amber-600' : 'text-slate-900'}`}>{selectedBill.billType === 'kaccha' ? 'Proforma Invoice' : 'Tax Invoice'}</h1>
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Invoice Number</p><p className="text-slate-800 font-semibold text-lg">{formatInvoiceId(selectedBill.invoiceNumber)}</p></div>
                    <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Issue</p><p className="text-slate-800 font-semibold text-lg">{formatDate(selectedBill.invoiceDate || selectedBill.createdAt)}</p></div>
                  </div>
                </div>
                {profileData?.company?.companyLogo && (<div className="flex-shrink-0"><img src={profileData.company.companyLogo} className="max-h-20 w-auto object-contain" /></div>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Billed To</h3><p className="font-bold text-slate-900 text-xl mb-2">{selectedBill.buyer?.clientName || 'N/A'}</p><p className="text-slate-600 text-sm whitespace-pre-wrap mb-4">{selectedBill.buyer?.clientAddress || 'No address provided'}</p>{selectedBill.billType !== 'kaccha' && selectedBill.buyer?.clientGst && (<div className="bg-slate-50 p-3 rounded-lg"><p className="text-sm font-medium text-slate-700">GSTIN: {selectedBill.buyer.clientGst}</p></div>)}</div>
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">From</h3><p className="font-bold text-slate-900 text-xl mb-2">{profileData?.company?.companyName || 'Your Company'}</p><p className="text-slate-600 text-sm whitespace-pre-wrap mb-4">{profileData?.company?.companyAddress || 'No address provided'}</p>{profileData?.company?.companyEmail && (<p className="text-slate-600 text-sm">{profileData.company.companyEmail}</p>)}{profileData?.company?.GST && selectedBill.billType !== 'kaccha' && (<div className="bg-slate-50 p-3 rounded-lg mt-2"><p className="text-sm font-medium text-slate-700">GSTIN: {profileData.company.GST}</p></div>)}</div>
              </div>
              <div className="overflow-x-auto mb-8"><table className="w-full border-collapse"><thead><tr className="bg-slate-50"><th className="text-left p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Description</th><th className="text-right p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Rate</th><th className="text-right p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Qty</th><th className="text-right p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th></tr></thead><tbody>{selectedBill.products?.map((p, i) => (<tr key={i} className="border-b border-slate-100"><td className="p-4 font-medium text-slate-800 min-w-[200px]">{p.name || 'Untitled Product/Service'}{p.description && (<p className="text-sm text-slate-500 mt-1">{p.description}</p>)}</td><td className="p-4 text-right font-mono text-slate-700">{formatCurrency(p.rate)}</td><td className="p-4 text-right font-mono text-slate-700">{p.quantity}</td><td className="p-4 text-right font-bold text-slate-900 font-mono">{formatCurrency(p.amount || (p.rate * p.quantity))}</td></tr>))}</tbody></table></div>
              <div className="flex justify-end"><div className="w-full max-w-md space-y-3"><div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-medium">{formatCurrency(selectedBill.subTotal)}</span></div>{selectedBill.discount > 0 && (<div className="flex justify-between text-slate-600"><span>Discount</span><span className="text-red-500 font-medium">- {formatCurrency(selectedBill.discount)}</span></div>)}{selectedBill.billType !== 'kaccha' && selectedBill.taxAmount > 0 && (<><div className="flex justify-between text-slate-600"><span>Tax Rate</span><span>{selectedBill.gstPercentage}%</span></div><div className="flex justify-between text-slate-600"><span>Tax Amount</span><span className="font-medium">+ {formatCurrency(selectedBill.taxAmount)}</span></div></>)}<div className="pt-4 border-t border-slate-300"><div className="flex justify-between items-center"><span className={`text-xl font-bold ${selectedBill.billType === 'kaccha' ? 'text-amber-600' : 'text-slate-900'}`}>{selectedBill.billType === 'kaccha' ? 'Total Amount' : 'Invoice Total'}</span><span className={`text-2xl md:text-3xl font-bold ${selectedBill.billType === 'kaccha' ? 'text-amber-600' : 'text-slate-900'}`}>{formatCurrency(selectedBill.grandTotal)}</span></div></div></div></div>
              <div className="mt-12 pt-8 border-t border-slate-200"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div>{selectedBill.notes && (<div className="mb-6"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</p><p className="text-slate-600 text-sm whitespace-pre-wrap">{selectedBill.notes}</p></div>)}{profileData?.bankDetails?.bankName && selectedBill.billType !== 'kaccha' && (<div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bank Details</p><div className="bg-slate-50 p-4 rounded-lg"><div className="grid grid-cols-2 gap-2 text-sm"><span className="text-slate-500">Bank:</span><span className="font-medium text-slate-800">{profileData.bankDetails.bankName}</span><span className="text-slate-500">Account:</span><span className="font-medium text-slate-800">{profileData.bankDetails.accountNumber}</span><span className="text-slate-500">IFSC:</span><span className="font-medium text-slate-800">{profileData.bankDetails.IFSC}</span></div></div></div>)}</div><div className="flex flex-col items-end"><div className="relative">{profileData?.company?.companyStamp && (<img src={profileData.company.companyStamp} className="absolute -top-8 opacity-70 w-20 h-20 object-contain" />)}{profileData?.company?.companySignature && (<img src={profileData.company.companySignature} className="h-16 w-auto object-contain" />)}</div><div className="mt-6 border-t border-slate-300 pt-4 text-center"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authorized Signatory</p><p className="text-sm font-medium text-slate-800 mt-1">For {profileData?.company?.companyName || "Your Company"}</p></div></div></div></div>
            </div>
          </div>
        </div>
      )}

      {/* CONVERSION MODAL */}
      {isConvertModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md md:max-w-lg rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
            <div className="p-4 md:p-6 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg"><RefreshCw size={20} className="text-indigo-600" /></div>
                <div><h3 className="text-lg md:text-xl font-bold text-gray-900">Convert to Pakka Bill</h3><p className="text-xs md:text-sm text-gray-500">Update client details for {convertingBill?.buyer?.clientName}</p></div>
              </div>
              <button onClick={() => setIsConvertModalOpen(false)} className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Address <span className="text-red-500">*</span></label><textarea className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" rows="3" placeholder="Enter complete address..." value={conversionData.clientAddress} onChange={(e) => setConversionData({...conversionData, clientAddress: e.target.value})} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">GSTIN <span className="text-red-500">*</span></label><input type="text" className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={conversionData.clientGst} onChange={(e) => setConversionData({...conversionData, clientGst: e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">GST Rate</label><select className="w-full p-3 border rounded-lg text-sm bg-white" value={conversionData.gstPercentage} onChange={(e) => setConversionData({...conversionData, gstPercentage: Number(e.target.value)})}>{[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}% GST</option>)}</select></div>
              </div>
            </div>
            <div className="p-4 md:p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3"><button onClick={() => setIsConvertModalOpen(false)} className="w-full sm:flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium">Cancel</button><button onClick={processConversion} disabled={!conversionData.clientAddress.trim() || !conversionData.clientGst.trim()} className="w-full sm:flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg disabled:opacity-50 transition-all">Convert to Pakka Bill</button></div>
          </div>
        </div>
      )}

      {/* EDIT MODAL - FIXED VARIABLES */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-0 md:p-4 overflow-hidden">
          <div className="bg-white w-full h-full md:w-full md:max-w-6xl md:h-[95vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            <div className="p-4 md:p-6 bg-white border-b flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 md:p-3 rounded-lg"><Pencil size={24} className="text-amber-600" /></div>
                <div><h2 className="text-lg md:text-2xl font-bold text-gray-900">Edit {editingBillType === 'pakka' ? 'Pakka' : 'Kacha'} Bill</h2><p className="text-xs md:text-sm text-gray-500 mt-1">Modify details and preview in real-time</p></div>
              </div>
              <div className="flex items-center gap-2"><button onClick={() => { setIsEditModalOpen(false); setShowEditValidation(false); }} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button onClick={handleUpdateSave} className="px-4 md:px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg shadow-lg active:scale-95 transition-all">Save Changes</button></div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className="w-full md:w-1/2 overflow-y-auto p-4 md:p-6 border-b md:border-r border-gray-200">
                <div className="max-w-2xl mx-auto"><h3 className="text-base font-bold text-gray-900 mb-6">Client & Product Information</h3><BillForm formData={editFormData} setFormData={setEditFormData} isKachaBill={editingBillType !== 'pakka'} showValidation={showEditValidation} /></div>
              </div>

              <div className="hidden md:block w-1/2 overflow-y-auto bg-gray-50 p-6">
                <div className="sticky top-0 bg-gray-50 pb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Live Preview</h3>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2"><div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div><span className="text-xs font-medium text-amber-700">Live Preview - Changes auto-update</span></div>
                    <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto">
                      <BillPreview 
                        formData={editFormData} 
                        totals={editTotals} 
                        isKachaBill={editingBillType !== 'pakka'}
                        companyDetails={{
                          companyName: profileData?.company?.companyName,
                          companyAddress: profileData?.company?.companyAddress,
                          companyEmail: profileData?.company?.companyEmail,
                          companyLogo: profileData?.company?.companyLogo,
                          companyStamp: profileData?.company?.companyStamp,
                          companySignature: profileData?.company?.companySignature,
                          GST: profileData?.company?.GST,
                          bankName: profileData?.bankDetails?.bankName,
                          accountNumber: profileData?.bankDetails?.accountNumber,
                          IFSC: profileData?.bankDetails?.IFSC,
                        }} 
                      />
                    </div>
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

function StatCard({ label, value, fullValue, icon, color }) {
  const colors = { blue: "text-blue-600 bg-blue-50", green: "text-green-600 bg-green-50", yellow: "text-yellow-600 bg-yellow-50", purple: "text-purple-600 bg-purple-50" };
  return (
    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start"><div className="min-w-0"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">{label}</p><h3 className="text-lg md:text-xl font-bold text-slate-800 truncate" title={fullValue || value}>{value}</h3>{fullValue && fullValue !== value && <p className="text-[11px] text-slate-400 mt-1 truncate">{fullValue}</p>}</div><div className={`p-1.5 md:p-2 rounded-lg ${colors[color]} flex-shrink-0 ml-2`}>{icon}</div></div>
    </div>
  );
}
