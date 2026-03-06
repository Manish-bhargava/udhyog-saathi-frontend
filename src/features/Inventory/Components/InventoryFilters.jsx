// import React from 'react';

// const InventoryFilters = ({
//   search,
//   setSearch,
//   sort,
//   setSort,
//   category,
//   setCategory,
//   status,
//   setStatus,
//   onClear,
// }) => {
//   return (
//     <div className="bg-blue-100 rounded-xl p-5 space-y-4">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h3 className="font-semibold text-sm">Advanced Searching Mechanism</h3>
//         <button
//           onClick={onClear}
//           className="text-xs text-blue-600 font-medium hover:underline"
//         >
//           CLEAR ALL FILTERS
//         </button>
//       </div>

//       {/* Search */}
//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search by name, SKU, or category..."
//         className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Filters */}
//       <div className="grid grid-cols-3 gap-3">
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           className="px-1 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
//         >
//           <option value="newest">Newest First</option>
//           <option value="oldest">Oldest First</option>
//           <option value="priceHigh">Price: High to Low</option>
//           <option value="priceLow">Price: Low to High</option>
//         </select>

//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="px-1 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
//         >
//           <option value="all">Category: All</option>
//           <option value="Electronics">Electronics</option>
//           <option value="Accessories">Accessories</option>
//         </select>

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
//         >
//           <option value="all">Status: All</option>
//           <option value="In Stock">In Stock</option>
//           <option value="Out of Stock">Out of Stock</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default InventoryFilters;

// InventoryFilters.jsx
import React from 'react';

const InventoryFilters = ({
  search,
  setSearch,
  sort,
  setSort,
  category,
  setCategory,
  status,
  setStatus,
  onClear,
}) => {
  return (
    <div className="bg-blue-50 rounded-xl p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Advanced Searching</h3>
        <button
          onClick={onClear}
          className="text-xs text-blue-600 font-medium hover:underline"
        >
          CLEAR ALL
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, SKU, or category..."
        className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
      </div>
    </div>
  );
};

export default InventoryFilters;