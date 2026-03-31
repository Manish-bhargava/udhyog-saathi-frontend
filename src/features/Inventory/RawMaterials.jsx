import React, { useState, useMemo, useEffect } from "react";
import Rawproductdetails from "./Components/Rawproductdetails";
import RawInventorygrid from "./Components/RawInventorygrid";
import AddRawProduct from "./Components/AddRawProduct";
import inventoryAPI from "./api";
import { toast } from "sonner";
import { useInventoryContext } from "./InventoryContext";

export default function RawMaterials({ variant = "raw" }) {
  const { inventoryPageState } = useInventoryContext();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const isRaw = variant === "raw"; 
  const pageTitle = isRaw
    ? "Raw Materials Inventory"
    : "Finished Products Inventory";

  const addButtonLabel = isRaw
    ? "+ Add Raw Material"
    : "+ Add Product";

  const mapItemToProduct = (item) => {
    // Ensure quantity defaults to a number, not undefined
    const qty = item.availableQuantity ?? item.quantity ?? item.reorderLevel ?? 0;
    const numQty = Number(qty) || 0;
    const reorderLevel = Number(item.reorderLevel) || 0;
    
    return {
      id: item._id,
      name: item.name,
      category: item.unit,
      price: item.sellingPrice ?? 0,
      // backend `getRaw` enriches items with: quantity, reservedQuantity, availableQuantity
      // show availableQuantity as "Current Stock" (fallback to quantity)
      stock: numQty,
      reorderLevel,
      maxStock: Number(item.maxStock) || (reorderLevel > 0 ? reorderLevel * 2 : 0),
      status: numQty > 0 ? "In Stock" : "Out of Stock",
      image: item.imageUrl || "",
      sku: item.sku || "",
      brand: item.brand || "",
      location: item.location || "",
      weight: item.weight || "",
      // Try warehouse.key first (warehouse section key), then warehouseId, then warehouse._id
      warehouseId: item.warehouse?.key || item.warehouseId || item.warehouse?._id || null,
      warehouseName: item.warehouseName || item.warehouse?.name || "",
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt).toLocaleString()
        : "",
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setApiUnavailable(false);

      const res = await inventoryAPI.getRawItems();

      // Backend may return either:
      // - { success: true, data: [...] } (current implementation)
      // - [...] (older/simple implementation)
      const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];

      const mapped = items.map(mapItemToProduct);

      setProducts(mapped);
      setSelectedProduct(mapped[0] || null);

    } catch (error) {
      const status = error?.response?.status;
      // 404 means the backend route doesn't exist yet
      if (status === 404 || !error?.response) {
        setApiUnavailable(true);
      } else {
        toast.error(error?.response?.data?.message || "Failed to load inventory items");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (inventoryPageState.search) {
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(inventoryPageState.search.toLowerCase()) ||
          p.sku?.toLowerCase().includes(inventoryPageState.search.toLowerCase()) ||
          p.category?.toLowerCase().includes(inventoryPageState.search.toLowerCase())
      );
    }

    if (inventoryPageState.category !== "all") {
      data = data.filter((p) => p.category === inventoryPageState.category);
    }

    if (inventoryPageState.status !== "all") {
      data = data.filter((p) => p.status === inventoryPageState.status);
    }

    if (inventoryPageState.warehouse !== "all") {
      data = data.filter((p) => p.warehouseId === inventoryPageState.warehouse);
    }

    if (inventoryPageState.sort === "priceHigh") {
      data.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (inventoryPageState.sort === "priceLow") {
      data.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (inventoryPageState.sort === "newest") {
      data.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return data;

  }, [products, inventoryPageState.search, inventoryPageState.sort, inventoryPageState.category, inventoryPageState.status, inventoryPageState.warehouse]);

  const handleAddProduct = async (createdItem) => {
    // Immediately construct the product from createdItem to show it right away
    if (createdItem) {
      const tempProduct = mapItemToProduct(createdItem);
      setProducts((prev) => [tempProduct, ...prev]);
      setSelectedProduct(tempProduct);
    }
    
    setShowAddModal(false);
    
    // Then fetch fresh data to ensure all quantities are properly calculated
    try {
      const res = await inventoryAPI.getRawItems();
      const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      const mapped = items.map(mapItemToProduct);
      setProducts(mapped);
      
      // Keep the newly created product selected
      const createdId = createdItem?._id || createdItem?.id;
      if (createdId) {
        const updatedProduct = mapped.find((p) => p.id === createdId);
        if (updatedProduct) {
          setSelectedProduct(updatedProduct);
        }
      }
    } catch (error) {
      console.error("Failed to refresh inventory after add:", error);
      // If refresh fails, we already have the temp product displayed
    }
  };

  const hasProducts = products.length > 0;

  if (apiUnavailable) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md text-center">
          <div className="text-4xl mb-3">🚧</div>
          <h2 className="text-lg font-bold text-yellow-800 mb-2">Raw Materials — Coming Soon</h2>
          <p className="text-sm text-yellow-700">
            The Raw Materials feature is not yet available on the connected backend.
            Please ensure your backend supports <code className="bg-yellow-100 px-1 rounded text-xs">/inventory/stock/raw</code> routes.
          </p>
        </div>
      </div>
    );
  }

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
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          {addButtonLabel}
        </button>

        {showAddModal && (
          <AddRawProduct
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddProduct}
            title={isRaw ? "Add Raw Material" : "Add Finished Product"}
          />
        )}
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

        <div className="w-full lg:w-[38%] flex flex-col gap-6">

          <Rawproductdetails
            product={selectedProduct}
            onDeleteSuccess={fetchProducts}
            onUpdateSuccess={fetchProducts}
            title={isRaw ? "Raw Material Details" : "Product Details"}
          />

        </div>

        <div className="flex-1">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {pageTitle}
            </h1>

            <button
              onClick={() => setShowAddModal(true)}
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
            <RawInventorygrid
              products={filteredProducts}
              onSelectProduct={setSelectedProduct}
              selectedId={selectedProduct?.id}
            />
          )}

        </div>
      </div>

      {showAddModal && (
        <AddRawProduct
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
          title={isRaw ? "Add Raw Material" : "Add Finished Product"}
        />
      )}
    </div>
  );
}
