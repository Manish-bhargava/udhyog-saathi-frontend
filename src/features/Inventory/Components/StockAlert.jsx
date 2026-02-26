// import React from 'react';

// const LOW_STOCK_THRESHOLD = 100;

// export default function StockAlert({ stock }) {
//   const isLowStock = stock <= LOW_STOCK_THRESHOLD;

//   return (
//     <div
//       className={`mt-4 text-xs p-3 rounded-lg ${
//         isLowStock
//           ? "bg-red-50 text-red-600"
//           : "bg-green-50 text-green-600"
//       }`}
//     >
//       <strong>
//         {isLowStock ? "Low Stock Alert" : "Stock Level Healthy"}
//       </strong>
//       <br />
//       {isLowStock
//         ? "Please consider restocking this product."
//         : "No immediate action required."}
//     </div>
//   );
// }


// StockAlert.jsx (unchanged, but included for completeness)
import React from 'react';

const LOW_STOCK_THRESHOLD = 100;

export default function StockAlert({ stock }) {
  const isLowStock = stock <= LOW_STOCK_THRESHOLD;

  return (
    <div
      className={`mt-4 text-xs p-3 rounded-lg ${
        isLowStock
          ? "bg-red-50 text-red-600"
          : "bg-green-50 text-green-600"
      }`}
    >
      <strong>
        {isLowStock ? "Low Stock Alert" : "Stock Level Healthy"}
      </strong>
      <br />
      {isLowStock
        ? "Please consider restocking this product."
        : "No immediate action required."}
    </div>
  );
}