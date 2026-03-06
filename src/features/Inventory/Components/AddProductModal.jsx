// import React from 'react';
// import { useState } from "react";

// export default function AddProductModal({ onClose, onAdd }) {
//   const [form, setForm] = useState({
//     name: "",
//     sku: "",
//     category: "",
//     price: "",
//     stock: "",
//     status: "In Stock",
//   });

//   const handleSubmit = () => {
//     if (!form.name || !form.sku) return;

//     onAdd({
//       id: Date.now(),
//       ...form,
//       price: Number(form.price),
//       stock: Number(form.stock),
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
//         <h2 className="text-lg font-bold">Add New Product</h2>

//         {["name", "sku", "category", "price", "stock"].map((field) => (
//           <input
//             key={field}
//             placeholder={field.toUpperCase()}
//             className="w-full border rounded-lg px-3 py-2"
//             value={form[field]}
//             onChange={(e) =>
//               setForm({ ...form, [field]: e.target.value })
//             }
//           />
//         ))}

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white"
//           >
//             Add Product
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// AddProductModal.jsx
import React, { useState } from "react";
import inventoryAPI from "../api";
import { toast } from "sonner";
export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    brand: "",
    price: "",
    stock: "",
    weight: "",
    status: "In Stock",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async () => {
    if (!form.name || !form.category) {
      toast.error("Name and Category are required");
      return;
    }

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("unit", form.category.trim());
    payload.append("sellingPrice", form.price || 0);
    payload.append("reorderLevel", form.stock || 0);
    payload.append("canBeSold", form.status === "In Stock");
    payload.append("canBePurchased", false);
    payload.append("canBeManufactured", false);
    payload.append("brand", form.brand?.trim() || "");
    payload.append("location", form.location?.trim() || "");
    payload.append("weight", form.weight?.toString().trim() || "");
    if (imageFile) {
      payload.append("productImg", imageFile);
    }

    try {
      const res = await inventoryAPI.addFinishedItem(payload);
      toast.success("Product added successfully");
      onAdd?.(res);
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add product"
      );
    }
  };

  const fields = [
    { key: "name", label: "Name", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "brand", label: "Brand", type: "text" },
    { key: "price", label: "Price (₹)", type: "number" },
    { key: "stock", label: "Stock", type: "number" },
    { key: "weight", label: "Weight", type: "number" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
        <h2 className="text-lg font-bold">Add New Product</h2>

        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {label}
            </label>
            <input
              type={type}
              placeholder={label}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) =>
              setImageFile(e.target.files && e.target.files[0]
                ? e.target.files[0]
                : null)
            }
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}