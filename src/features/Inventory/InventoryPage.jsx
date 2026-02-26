// import React, { useState, useMemo } from "react";
// import InventoryFilters from "./Components/InventoryFilters";
// import ProductDetails from "./Components/ProductDetails";
// import InventoryGrid from "./Components/InventoryGrid";
// import { products as initialProducts } from "./Data/product";

// export default function InventoryPage() {
//   // ✅ PRODUCTS STATE (mutable)
//   const [products, setProducts] = useState(
//     Array.isArray(initialProducts) ? initialProducts : []
//   );

//   const [selectedProduct, setSelectedProduct] = useState(
//     initialProducts?.[0] || null
//   );

//   // ✅ ADD PRODUCT MODAL STATE
//   const [showAddModal, setShowAddModal] = useState(false);

//   // FILTER STATES
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [category, setCategory] = useState("all");
//   const [status, setStatus] = useState("all");

//   // CLEAR FILTERS
//   const clearFilters = () => {
//     setSearch("");
//     setSort("newest");
//     setCategory("all");
//     setStatus("all");
//   };

//   // FILTER LOGIC
//   const filteredProducts = useMemo(() => {
//     let data = [...products];

//     if (search) {
//       data = data.filter(
//         (p) =>
//           p.name?.toLowerCase().includes(search.toLowerCase()) ||
//           p.sku?.toLowerCase().includes(search.toLowerCase()) ||
//           p.category?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (category !== "all") {
//       data = data.filter((p) => p.category === category);
//     }

//     if (status !== "all") {
//       data = data.filter((p) => p.status === status);
//     }

//     if (sort === "priceHigh") {
//       data.sort((a, b) => (b.price || 0) - (a.price || 0));
//     } else if (sort === "priceLow") {
//       data.sort((a, b) => (a.price || 0) - (b.price || 0));
//     }

//     return data;
//   }, [products, search, sort, category, status]);

//   // ✅ ADD PRODUCT HANDLER
//   const handleAddProduct = (newProduct) => {
//     setProducts((prev) => [newProduct, ...prev]);
//     setSelectedProduct(newProduct);
//     setShowAddModal(false);
//   };

//   return (
//     <div className="w-full p-4 md:p-6">
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* LEFT */}
//         <div className="w-full lg:w-[38%] flex flex-col gap-6">
//           <InventoryFilters
//             search={search}
//             setSearch={setSearch}
//             sort={sort}
//             setSort={setSort}
//             category={category}
//             setCategory={setCategory}
//             status={status}
//             setStatus={setStatus}
//             onClear={clearFilters}
//           />

//           <ProductDetails product={selectedProduct} />
//         </div>

//         {/* RIGHT */}
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-bold">Your Inventory</h1>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               + Add New Product
//             </button>
//           </div>

//           <InventoryGrid
//             products={filteredProducts}
//             onSelectProduct={setSelectedProduct}
//             selectedId={selectedProduct?.id}
//           />
//         </div>
//       </div>

//       {/* ADD PRODUCT MODAL */}
//       {showAddModal && (
//         <AddProductModal
//           onClose={() => setShowAddModal(false)}
//           onAdd={handleAddProduct}
//         />
//       )}
//     </div>
//   );
// }


// InventoryPage.jsx
import React, { useState, useMemo } from "react";
import InventoryFilters from "./Components/InventoryFilters";
import ProductDetails from "./Components/ProductDetails";
import InventoryGrid from "./Components/InventoryGrid";
import AddProductModal from "./Components/AddProductModal"; // make sure path matches
import { products as initialProducts } from "./Data/product";

export default function InventoryPage() {
  // ✅ PRODUCTS STATE (mutable)
  const [products, setProducts] = useState(
    Array.isArray(initialProducts) ? initialProducts : []
  );

  const [selectedProduct, setSelectedProduct] = useState(
    products?.[0] || null
  );

  // ✅ ADD PRODUCT MODAL STATE
  const [showAddModal, setShowAddModal] = useState(false);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setCategory("all");
    setStatus("all");
  };

  // FILTER LOGIC
  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (search) {
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.sku?.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      data = data.filter((p) => p.category === category);
    }

    if (status !== "all") {
      data = data.filter((p) => p.status === status);
    }

    if (sort === "priceHigh") {
      data.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "priceLow") {
      data.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "newest") {
      data.sort((a, b) => (b.id || 0) - (a.id || 0)); // assuming id can be compared
    }
    // 'oldest' is default (no sort)

    return data;
  }, [products, search, sort, category, status]);

  // ✅ ADD PRODUCT HANDLER
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setSelectedProduct(newProduct);
    setShowAddModal(false);
  };

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT */}
        <div className="w-full lg:w-[38%] flex flex-col gap-6">
          <InventoryFilters
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            onClear={clearFilters}
          />

          <ProductDetails product={selectedProduct} />
        </div>

        {/* RIGHT */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Your Inventory</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              + Add Product
            </button>
          </div>

          <InventoryGrid
            products={filteredProducts}
            onSelectProduct={setSelectedProduct}
            selectedId={selectedProduct?.id}
          />
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}
    </div>
  );
}