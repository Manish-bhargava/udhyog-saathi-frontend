import React, { useState } from "react";
import inventoryAPI from "../api";
import { toast } from "sonner";
export default function CreateProductModal({
  product = {},
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    name: product.name || "",
    unit: product.unit || product.category || "",
    costPrice: product.costPrice ?? "",
    sellingPrice: product.sellingPrice ?? "",
    reorderLevel: product.reorderLevel ?? product.stock ?? 0,
    canBeSold: product.canBeSold ?? true,
    canBePurchased: product.canBePurchased ?? false,
    canBeManufactured: product.canBeManufactured ?? false,
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async () => {
    if (!form.name || !form.unit) {
      toast.error("Name and Unit are required");
      return;
    }

    const productId = product?._id || product?.id;

    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    try {
      if (imageFile) {
        const payload = new FormData();
        payload.append("name", form.name.trim());
        payload.append("unit", form.unit.trim());
        if (form.costPrice !== "") payload.append("costPrice", form.costPrice);
        if (form.sellingPrice !== "") payload.append("sellingPrice", form.sellingPrice);
        payload.append("reorderLevel", form.reorderLevel);
        payload.append("canBeSold", form.canBeSold);
        payload.append("canBePurchased", form.canBePurchased);
        payload.append("canBeManufactured", form.canBeManufactured);
        payload.append("productImg", imageFile);
        await inventoryAPI.updateFinishedItem(productId, payload);
      } else {
        const payload = {
          name: form.name.trim(),
          unit: form.unit.trim(),
          costPrice: form.costPrice !== "" ? Number(form.costPrice) : undefined,
          sellingPrice:
            form.sellingPrice !== "" ? Number(form.sellingPrice) : undefined,
          reorderLevel: Number(form.reorderLevel),
          canBeSold: form.canBeSold,
          canBePurchased: form.canBePurchased,
          canBeManufactured: form.canBeManufactured,
        };
        await inventoryAPI.updateFinishedItem(productId, payload);
      }

      toast.success("Product updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
        <h2 className="text-lg font-bold">Edit Product</h2>

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Unit"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />

        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Cost Price"
          value={form.costPrice}
          onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
        />

        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
        />

        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Reorder Level"
          value={form.reorderLevel}
          onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
        />

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) =>
              setImageFile(e.target.files?.[0] ? e.target.files[0] : null)
            }
          />
          {product.image && !imageFile && (
            <p className="text-xs text-gray-500 mt-1">Current image is set. Choose a file to replace it.</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.canBeSold}
            onChange={(e) => setForm({ ...form, canBeSold: e.target.checked })}
          />
          Can be Sold
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.canBePurchased}
            onChange={(e) =>
              setForm({ ...form, canBePurchased: e.target.checked })
            }
          />
          Can be Purchased
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.canBeManufactured}
            onChange={(e) =>
              setForm({ ...form, canBeManufactured: e.target.checked })
            }
          />
          Can be Manufactured
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
