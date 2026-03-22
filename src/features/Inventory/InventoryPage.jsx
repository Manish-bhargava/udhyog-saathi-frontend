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
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductDetails from "./Components/ProductDetails";
import InventoryGrid from "./Components/InventoryGrid";
import AddProductModal from "./Components/AddProductModal"; // make sure path matches
import AddRawProduct from "./Components/AddRawProduct";
import Rawproductdetails from "./Components/Rawproductdetails";
import inventoryAPI from "./api";
import { toast } from "sonner";

export default function InventoryPage({ variant = "finished" }) {
  const location = useLocation();
  const navigate = useNavigate();
  // ✅ PRODUCTS STATE (mutable)
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(
    products?.[0] || null,
  );

  // ✅ ADD PRODUCT MODAL STATE
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalInitialName, setAddModalInitialName] = useState("");

  const [loading, setLoading] = useState(false);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const isRaw = variant === "raw";
  const pageTitle = isRaw ? "Raw Materials Inventory" : "Finished Products Inventory";
  const addButtonLabel = isRaw ? "+ Add Raw Material" : "+ Add Product";

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setCategory("all");
    setStatus("all");
  };

  const mapItemToProduct = (item) => ({
    id: item._id,
    name: item.name,
    category: item.unit,
    price: item.sellingPrice ?? 0,
    stock: item.quantity ?? item.reorderLevel ?? 0,
    capacity: 60,
    status: item.isActive ? "In Stock" : "Out of Stock",
    image: item.imageUrl || "",
    sku: item.sku || "",
    brand: item.brand || "",
    location: item.location || "",
    weight: item.weight || "",
    warehouseId: item.warehouseId || item.warehouse?._id || null,
    warehouseName: item.warehouseName || item.warehouse?.name || "",
    updatedAt: item.updatedAt
      ? new Date(item.updatedAt).toLocaleString()
      : "",
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = isRaw
        ? await inventoryAPI.getRawItems()
        : await inventoryAPI.getFinishedItems();
      const items = Array.isArray(res?.data) ? res.data : [];
      const mapped = items.map(mapItemToProduct);
      setProducts(mapped);
      setSelectedProduct(mapped[0] || null);
    } catch (error) {
      console.error("Failed to load inventory", error);
      toast.error(
        error?.response?.data?.message || "Failed to load inventory items",
      );
    } finally {
      setLoading(false);
    }
  }, [isRaw]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open add-product modal from bills (kaccha/pakka) when product is not in inventory
  useEffect(() => {
    if (isRaw) return;
    const st = location.state;
    if (st?.openAddProduct) {
      setShowAddModal(true);
      setAddModalInitialName(
        typeof st.prefilledProductName === "string"
          ? st.prefilledProductName.trim()
          : "",
      );
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, isRaw, location.pathname, navigate]);

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddModalInitialName("");
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
  const handleAddProduct = (createdItem) => {
    if (createdItem && typeof createdItem === "object") {
      const mapped = mapItemToProduct(createdItem);
      setProducts((prev) => [mapped, ...prev]);
      setSelectedProduct(mapped);
    } else {
      fetchProducts();
    }
    closeAddModal();
  };

  const hasProducts = products.length > 0;

  if (!loading && !hasProducts) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          {pageTitle}
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
          Start by adding your first {isRaw ? "raw material" : "finished product"} to keep track of your stock.
        </p>
        <button
          onClick={() => {
            setAddModalInitialName("");
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          {addButtonLabel}
        </button>

        {showAddModal &&
          (isRaw ? (
            <AddRawProduct
              onClose={closeAddModal}
              onAdd={handleAddProduct}
              title="Add Raw Material"
            />
          ) : (
            <AddProductModal
              onClose={closeAddModal}
              onAdd={handleAddProduct}
              title="Add Finished Product"
              initialName={addModalInitialName}
            />
          ))}
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Top search + filters bar - full width */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${isRaw ? "raw materials" : "products"} by name, SKU, or category...`}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Advanced Searching</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="priceLow">Price: Low to High</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="all">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 font-medium hover:underline ml-auto"
          >
            CLEAR ALL
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT */}
        <div className="w-full lg:w-[38%] flex flex-col gap-6">
          {isRaw ? (
            <Rawproductdetails
              product={selectedProduct}
              onDeleteSuccess={fetchProducts}
              onUpdateSuccess={fetchProducts}
              title="Raw Material Details"
            />
          ) : (
            <ProductDetails
              product={selectedProduct}
              onDeleteSuccess={fetchProducts}
              onUpdateSuccess={fetchProducts}
              title="Product Details"
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {pageTitle}
            </h1>
            <button
              onClick={() => {
                setAddModalInitialName("");
                setShowAddModal(true);
              }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              {addButtonLabel}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              Loading inventory...
            </div>
          ) : (
            <InventoryGrid
              products={filteredProducts}
              onSelectProduct={setSelectedProduct}
              selectedId={selectedProduct?.id}
            />
          )}
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        isRaw ? (
          <AddRawProduct
            onClose={closeAddModal}
            onAdd={handleAddProduct}
            title="Add Raw Material"
          />
        ) : (
          <AddProductModal
            onClose={closeAddModal}
            onAdd={handleAddProduct}
            title="Add Finished Product"
            initialName={addModalInitialName}
          />
        )
      )}
    </div>
  );
}