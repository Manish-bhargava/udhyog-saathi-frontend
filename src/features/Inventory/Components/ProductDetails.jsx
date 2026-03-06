// import React from 'react';
// import StockAlert from './Stockalert';
// export default function ProductDetails({ product }) {
//     if (!product) {
//       return (
//         <div className="bg-white rounded-xl p-6 text-center text-gray-400">
//           Select a product to view details
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white rounded-xl p-5 shadow-sm">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="font-semibold">Product Details</h3>
//           <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
//             ID: {product.id}
//           </span>
//         </div>

//         <img
//           src={product.image}
//           alt={product.name}
//           className="rounded-lg mb-4"
//         />

//         <h4 className="font-semibold">{product.name}</h4>
//         <p className="text-xs text-gray-500 mb-4">
//           {product.category} · {product.updatedAt}
//         </p>

//         <div className="flex items-center gap-4 mb-4">
//           <div className="bg-gray-50 rounded-lg p-3 text-center flex-1">
//             <p className="text-xs text-gray-500">Current Stock</p>
//             <p className="font-bold text-lg">
//               {product.stock} Units
//             </p>
//           </div>

//           <button className="border px-4 py-2 rounded-lg text-sm">
//             Edit Product
//           </button>
//         </div>

//         <div className="grid grid-cols-2 gap-3 text-sm">
//           <p><b>SKU:</b> {product.sku}</p>
//           <p><b>Brand:</b> {product.brand}</p>
//           <p><b>Location:</b> {product.location}</p>
//           <p><b>Weight:</b> {product.weight}</p>
//         </div>
//         <StockAlert stock={product.stock} />
//       </div>
//     );
//   }

import React, { useState } from "react";
import StockAlert from "./Stockalert";
import CreateProductModal from "./CreateProductModal";
import inventoryAPI from "../api";
import { toast } from "sonner";

export default function ProductDetails({
  product,
  onDeleteSuccess,
  onUpdateSuccess,
}) {
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await inventoryAPI.deleteFinishedItem(product.id);

      toast.success("Product deleted successfully");

      // refresh inventory list in parent component
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    }
  };

  if (!product) {
    return (
      <div className="bg-white rounded-xl p-6 text-center text-gray-400">
        Select a product to view details
      </div>
    );
  }
  return (
    <>
      {/* Product Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Product Details</h3>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            ID: {product.id}
          </span>
        </div>

        <img
          src={product.image}
          alt={product.name}
          className="rounded-lg mb-4"
        />

        <h4 className="font-semibold">{product.name}</h4>
        <p className="text-xs text-gray-500 mb-4">
          {product.category} · {product.updatedAt}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center flex-1">
            <p className="text-xs text-gray-500">Current Stock</p>
            <p className="font-bold text-lg">{product.stock} Units</p>
          </div>

          {/* EDIT */}
          <button
            onClick={() => setOpenEdit(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            Edit Product
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mt-4">
          <p>
            <b>Brand:</b> {product.brand}
          </p>
          <p>
            <b>Location:</b> {product.location}
          </p>
          <p>
            <b>Weight:</b> {product.weight}
          </p>
        </div>
        <StockAlert stock={product.stock} />

        {/* delete button */}
        <div className="flex items-center pt-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            delete
          </button>
        </div>
      </div>

      {/* CREATE MODAL */}
      {openEdit && (
        <CreateProductModal
          product={product}
          onClose={() => setOpenEdit(false)} // ✅ CLOSE
          onSuccess={() => {
            setOpenEdit(false);
            onUpdateSuccess?.();
          }}
        />
      )}
    </>
  );
}
