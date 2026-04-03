import React, { useState, useEffect } from 'react';
import inventoryAPI from '../../Inventory/api';
import ProductSearchInput from './ProductSearchInput';

const BillForm = ({ formData, setFormData, isKachaBill = false, showValidation = false }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await inventoryAPI.getFinishedItems();
        const items = Array.isArray(res?.data) ? res.data : [];
        setInventoryItems(
          items.map((item) => ({
            id: item._id,
            inventoryItemId: item._id,
            name: item.name,
            price: item.sellingPrice ?? 0,
            stock:
              item.availableQuantity ??
              item.quantity ??
              item.reorderLevel ??
              0,
            warehouseId: item.warehouseId || item.warehouse?._id || null,
            warehouseName: item.warehouseName || item.warehouse?.name || '',
          })),
        );
      } catch {
        // silently fail – the text field still works without inventory data
      }
    };
    fetchInventory();
  }, []);

  useEffect(() => {
    const loadWh = async () => {
      try {
        const res = await inventoryAPI.getWarehouses();
        setWarehouses(Array.isArray(res?.data) ? res.data : []);
      } catch {
        setWarehouses([]);
      }
    };
    loadWh();
  }, []);

  const updateBuyer = (field, value) => {
    setFormData({ ...formData, buyer: { ...formData.buyer, [field]: value } });
  };

  const updateInvoiceDate = (value) => {
    setFormData({ ...formData, invoiceDate: value || '' });
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;
    // If the user manually edits the name, unlink the inventory item
    if (field === 'name') {
      newProducts[index].inventoryItemId = null;
      newProducts[index].warehouseId = null;
    }
    setFormData({ ...formData, products: newProducts });
  };

  // Called when user picks a product from the inventory dropdown
  const selectInventoryProduct = (index, item) => {
    const newProducts = [...formData.products];
    newProducts[index] = {
      ...newProducts[index],
      name: item.name,
      rate: item.price,
      inventoryItemId: item.inventoryItemId || item.id,
      warehouseId: item.warehouseId || null,
    };
    setFormData({ ...formData, products: newProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', rate: 0, quantity: 1, inventoryItemId: null, warehouseId: null }],
    });
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index);
      setFormData({ ...formData, products: newProducts });
    }
  };

  const clientNameError = showValidation && !formData.buyer.clientName?.trim();
  const clientGstError = showValidation && !isKachaBill && !formData.buyer.clientGst?.trim();
  const clientAddressError = showValidation && !isKachaBill && !formData.buyer.clientAddress?.trim();

  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      {/* Buyer Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-6">
          <div className={`p-2 rounded-lg flex-shrink-0 ${isKachaBill ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} mr-3`}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">Buyer Details</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium text-gray-700">Bill Date</label>
            <input
              type="date"
              value={formData.invoiceDate || ''}
              onChange={(e) => updateInvoiceDate(e.target.value)}
              className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm ${
                isKachaBill
                  ? 'focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                  : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            <p className="text-[11px] text-gray-500">
              If left empty, today&apos;s date will be used while saving.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center">
              Client Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input 
              type="text"
              value={formData.buyer.clientName}
              onChange={(e) => updateBuyer('clientName', e.target.value)}
              className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                clientNameError ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Enter client name"
            />
            {clientNameError && (
              <p className="text-xs text-red-600">Client name is required.</p>
            )}
          </div>
          
          {!isKachaBill && (
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-700">
                Client GST <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={formData.buyer.clientGst}
                onChange={(e) => updateBuyer('clientGst', e.target.value.toUpperCase())}
                className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                  clientGstError ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="GSTIN number"
              />
              {clientGstError && (
                <p className="text-xs text-red-600">Client GST is required for Pakka bill.</p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium text-gray-700">
              Client Address {!isKachaBill && <span className="text-red-500">*</span>}
            </label>
            <textarea 
              value={formData.buyer.clientAddress}
              onChange={(e) => updateBuyer('clientAddress', e.target.value)}
              className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[80px] md:min-h-[100px] text-sm ${
                clientAddressError ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Complete address with city and state"
            />
            {clientAddressError && (
              <p className="text-xs text-red-600">Client address is required for Pakka bill.</p>
            )}
          </div>
        </div>
      </div>

      {/* Products Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
          <div className="flex items-center min-w-0">
            <div className={`p-2 rounded-lg flex-shrink-0 ${isKachaBill ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} mr-3`}>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">Products & Services</h3>
          </div>
          <button
            onClick={addProduct}
            className="flex-shrink-0 px-3 md:px-4 py-2 bg-blue-600 text-white text-xs md:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs md:text-sm">Add Item</span>
          </button>
        </div>
        
        <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4">
          <div className="col-span-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
            Description <span className="text-red-500">*</span>
          </div>
          <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Warehouse</div>
          <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">
            Rate <span className="text-red-500">*</span>
          </div>
          <div className="col-span-1 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">
            Qty <span className="text-red-500">*</span>
          </div>
          <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Amount</div>
          <div className="col-span-1"></div>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          {formData.products.map((p, i) => (
            <div key={i} className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-3 items-center p-3 md:p-4 bg-gray-50 rounded-lg border hover:bg-white transition-colors ${
              showValidation && (!p.name?.trim() || !(Number(p.rate) > 0) || !(Number(p.quantity) > 0))
                ? 'border-red-300'
                : 'border-gray-200'
            }`}>
              <div className="col-span-1 md:col-span-4 min-w-0">
                <label className="md:hidden text-xs font-bold text-gray-600 uppercase mb-1 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <ProductSearchInput
                  value={p.name}
                  onChangeText={(val) => updateProduct(i, 'name', val)}
                  onSelectProduct={(item) => selectInventoryProduct(i, item)}
                  inventoryItems={inventoryItems}
                  isKachaBill={isKachaBill}
                />
                {showValidation && !p.name?.trim() && (
                  <p className="text-[11px] text-red-600 mt-1">Description is required.</p>
                )}
              </div>

              <div className="col-span-1 md:col-span-2 min-w-0">
                <label className="md:hidden text-xs font-bold text-gray-600 uppercase mb-1 block">Warehouse</label>
                <select
                  value={p.warehouseId || ''}
                  onChange={(e) =>
                    updateProduct(i, 'warehouseId', e.target.value || null)
                  }
                  className={`w-full px-2 py-2 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 outline-none ${
                    isKachaBill
                      ? 'focus:ring-amber-500 focus:border-amber-500'
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <option value="">Default (auto)</option>
                  {warehouses.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Rate Input with Placeholder Logic */}
              <div className="col-span-1 md:col-span-2 min-w-0">
                <label className="md:hidden text-xs font-bold text-gray-600 uppercase mb-1 block">
                  Rate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm font-medium">₹</span>
                  <input
                    className={`w-full pl-8 pr-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-right text-sm md:text-base font-semibold text-gray-800 tracking-tight ${
                      showValidation && !(Number(p.rate) > 0) ? 'border-red-400' : 'border-gray-300'
                    }`}
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0"
                    value={p.rate === 0 ? '' : p.rate}
                    onChange={(e) => updateProduct(i, 'rate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  />
                </div>
                {showValidation && !(Number(p.rate) > 0) && (
                  <p className="text-[11px] text-red-600 mt-1">Rate must be greater than 0.</p>
                )}
              </div>
              
              {/* Quantity Input with Placeholder Logic */}
              <div className="col-span-1 md:col-span-1 min-w-0">
                <label className="md:hidden text-xs font-bold text-gray-600 uppercase mb-1 block">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-right text-sm md:text-base font-semibold text-gray-800 tracking-tight ${
                    showValidation && !(Number(p.quantity) > 0) ? 'border-red-400' : 'border-gray-300'
                  }`}
                  type="number"
                  min="0"
                  placeholder="1"
                  value={p.quantity === 0 ? '' : p.quantity}
                  onChange={(e) => updateProduct(i, 'quantity', e.target.value === '' ? 0 : parseInt(e.target.value))}
                />
                {showValidation && !(Number(p.quantity) > 0) && (
                  <p className="text-[11px] text-red-600 mt-1">Qty must be greater than 0.</p>
                )}
              </div>
              
              <div className="col-span-1 md:col-span-2 text-right">
                <label className="md:hidden text-xs font-bold text-gray-600 uppercase mb-1 block">Amount</label>
                <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs md:text-sm font-bold text-blue-800 truncate font-mono">
                  ₹{((p.rate || 0) * (p.quantity || 0)).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
              
              <div className="col-span-1 flex justify-end md:justify-center pt-2 md:pt-0">
                {formData.products.length > 1 && (
                  <button
                    onClick={() => removeProduct(i)}
                    className="p-1.5 md:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label={`Remove item ${i + 1}`}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax & Discount Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-6">
          <div className={`p-2 rounded-lg ${isKachaBill ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} mr-3`}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800">
            {isKachaBill ? 'Discount' : 'Tax & Discount'}
          </h3>
        </div>
        
        <div className={`grid gap-4 md:gap-6 ${isKachaBill ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {!isKachaBill && (
            <div className="space-y-2 md:space-y-3">
              <label className="text-xs md:text-sm font-medium text-gray-700">GST Percentage</label>
              <select
                value={formData.gstPercentage}
                onChange={(e) => setFormData({...formData, gstPercentage: parseInt(e.target.value)})}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none text-sm"
              >
                <option value="0">0% - No GST</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          )}
          
          <div className="space-y-2 md:space-y-3">
            <label className="text-xs md:text-sm font-medium text-gray-700">Discount Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={formData.discount === 0 ? '' : formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-800 font-medium text-sm text-right pr-4 pl-10"
                min="0"
                step="any"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-6">
          <div className="p-2 rounded-lg bg-gray-50 text-gray-600 mr-3">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Additional Notes</h3>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs md:text-sm font-medium text-gray-700">Terms / Notes to Display on Bill</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none text-sm"
            rows="3"
            placeholder="Add specific terms, conditions, or a thank you note..."
          />
        </div>
      </div>
    </div>
  );
};

export default BillForm;
