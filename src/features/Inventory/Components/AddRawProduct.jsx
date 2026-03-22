import React, { useState } from "react";
import inventoryAPI from "../api";
import { toast } from "sonner";
import ImageUploadField from "./ImageUploadField";
import WarehouseSelector from "./WarehouseSelector";

export default function AddRawProduct({ onClose, onAdd, title = "Add Raw Material" }) {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    brand: "",
    sellingPrice: "",
    costPrice: "",
    quantity: "",
    reorderLevel: "",
    weight: "",
    warehouseId: "",
    status: "In Stock",
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.unit.trim()) {
      toast.error("Name and Unit are required");
      return;
    }
    setSubmitting(true);
    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("unit", form.unit.trim());
    if (form.sellingPrice) payload.append("sellingPrice", form.sellingPrice);
    if (form.costPrice)    payload.append("costPrice",    form.costPrice);
    if (form.quantity)     payload.append("quantity",     form.quantity);
    if (form.reorderLevel) payload.append("reorderLevel", form.reorderLevel);
    payload.append("canBeSold", form.status === "In Stock");
    payload.append("canBePurchased", false);
    payload.append("canBeManufactured", false);
    if (form.brand)       payload.append("brand",       form.brand.trim());
    if (form.weight)      payload.append("weight",      form.weight);
    if (form.warehouseId) payload.append("warehouseId", form.warehouseId);
    if (imageFile)        payload.append("productImg",  imageFile);

    try {
      const res = await inventoryAPI.addRawItem(payload);
      toast.success("Raw material added successfully");
      // inventoryAPI returns { success, message, data }, so pass the created item to parent
      onAdd?.(res?.data ?? res);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add raw material");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Product Image</label>
            <ImageUploadField onFileSelect={setImageFile} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Material name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Unit <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. KG, Litres"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.unit} onChange={(e) => set('unit', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Purchase Price (₹)</label>
              <input type="number" min="0" placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Selling Price (₹)</label>
              <input type="number" min="0" placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.sellingPrice} onChange={(e) => set('sellingPrice', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Current Stock (Qty)</label>
              <input type="number" min="0" placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Reorder Level</label>
              <input type="number" min="0" placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.reorderLevel} onChange={(e) => set('reorderLevel', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Warehouse</label>
            <WarehouseSelector value={form.warehouseId} onChange={(id) => set('warehouseId', id)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Brand / Supplier</label>
              <input type="text" placeholder="Brand or supplier"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.brand} onChange={(e) => set('brand', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Weight</label>
              <input type="number" min="0" placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.weight} onChange={(e) => set('weight', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.status} onChange={(e) => set('status', e.target.value)}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className={`px-5 py-2 rounded-lg text-sm font-semibold text-white transition ${
              submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
            {submitting ? 'Adding…' : 'Add Raw Material'}
          </button>
        </div>
      </div>
    </div>
  );
}
