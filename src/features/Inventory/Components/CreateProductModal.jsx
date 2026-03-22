import React, { useState } from "react";
import inventoryAPI from "../api";
import { toast } from "sonner";
import ImageUploadField from "./ImageUploadField";
import WarehouseSelector from "./WarehouseSelector";

export default function CreateProductModal({ product = {}, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: product.name || "",
    unit: product.unit || product.category || "",
    costPrice: product.costPrice ?? "",
    sellingPrice: product.sellingPrice ?? product.price ?? "",
    reorderLevel: product.reorderLevel ?? product.stock ?? "",
    warehouseId: product.warehouseId || "",
    canBeSold: product.canBeSold ?? true,
    canBePurchased: product.canBePurchased ?? false,
    canBeManufactured: product.canBeManufactured ?? false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.unit.trim()) {
      toast.error("Name and Unit are required");
      return;
    }
    const productId = product?._id || product?.id;
    if (!productId) { toast.error("Product ID is missing"); return; }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("unit", form.unit.trim());
      if (form.costPrice !== "")    payload.append("costPrice",    form.costPrice);
      if (form.sellingPrice !== "") payload.append("sellingPrice", form.sellingPrice);
      if (form.reorderLevel !== "") payload.append("reorderLevel", form.reorderLevel);
      if (form.warehouseId)         payload.append("warehouseId",  form.warehouseId);
      payload.append("canBeSold",         form.canBeSold);
      payload.append("canBePurchased",    form.canBePurchased);
      payload.append("canBeManufactured", form.canBeManufactured);
      if (imageFile) payload.append("productImg", imageFile);

      await inventoryAPI.updateFinishedItem(productId, payload);
      toast.success("Product updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Product</h2>
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
            <ImageUploadField
              currentImageUrl={product.image || null}
              onFileSelect={setImageFile}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Product name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Unit <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. KG, Pieces"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.unit} onChange={(e) => set('unit', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Selling Price (₹)</label>
              <input type="number" min="0" placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.sellingPrice} onChange={(e) => set('sellingPrice', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cost Price (₹)</label>
              <input type="number" min="0" placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reorder Level</label>
            <input type="number" min="0" placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.reorderLevel} onChange={(e) => set('reorderLevel', e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Warehouse</label>
            <WarehouseSelector value={form.warehouseId} onChange={(id) => set('warehouseId', id)} />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {[['canBeSold','Can be Sold'],['canBePurchased','Can be Purchased'],['canBeManufactured','Can be Manufactured']].map(([key,label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="rounded" />
                {label}
              </label>
            ))}
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
            {submitting ? 'Saving…' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
