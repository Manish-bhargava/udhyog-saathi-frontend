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

export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    status: "In Stock",
  });

  const handleSubmit = () => {
    if (!form.name || !form.sku) return;

    onAdd({
      id: Date.now(),
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      capacity: Math.floor(Math.random() * 60) + 20, // random capacity for demo
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3", // placeholder
      brand: "Generic",
      location: "Warehouse A",
      weight: "1.5kg",
      updatedAt: "Just now",
    });
  };

  const fields = [
    { key: "name", label: "Name", type: "text" },
    { key: "sku", label: "SKU", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "price", label: "Price (₹)", type: "number" },
    { key: "stock", label: "Stock", type: "number" },
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