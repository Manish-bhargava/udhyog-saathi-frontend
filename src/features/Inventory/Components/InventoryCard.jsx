// import React from 'react';

// const InventoryCard = ({ product, onClick, isSelected }) => {
//   if (!product) return null;
  
//   return (
//     <div
//       onClick={onClick}
//       className={`bg-white rounded-xl border p-7 cursor-pointer transition
//         ${
//           isSelected
//             ? "border-blue-600 ring-2 ring-blue-200"
//             : "border-blue-200 hover:shadow-md"
//         }
//       `}
//     >
//       <div className="text-xs text-green-600 font-medium mb-2">
//         {product.status || 'Unknown'}
//       </div>

//       <img src={product.image || ''} alt={product.name || 'Product'} className="rounded-lg mb-3 w-full h-32 object-cover" />

//       <p className="text-xs text-gray-400">{product.sku}</p>
//       <h4 className="font-semibold text-sm mb-1">{product.name}</h4>

//       <p className="text-xs text-gray-500">Retail Price</p>
//       <p className="font-bold text-blue-600 mb-2">₹{product.price}</p>

//       <div className="text-xs text-gray-500 mb-1">CAPACITY</div>
//       <div className="w-full bg-gray-200 rounded-full h-1">
//         <div
//           className="bg-blue-500 h-1 rounded-full"
//           style={{ width: `${product.capacity}%` }}
//         />
//         <p style={{ fontSize: '10px', fontWeight: 'bold', color: 'gray' , paddingTop: '10px' }}>Quantity : {product.stock}</p>
//       </div>
//     </div>
//   );
// };

// export default InventoryCard;



// InventoryCard.jsx
import React from 'react';

const InventoryCard = ({ product, onClick, isSelected }) => {
  if (!product) return null;

  const stock = Math.max(Number(product.stock) || 0, 0);
  const reorderLevel = Math.max(Number(product.reorderLevel) || 0, 0);
  const explicitCapacity = Number(product.capacity);
  const hasExplicitCapacity = Number.isFinite(explicitCapacity) && explicitCapacity > 0;
  const estimatedMaxStock = Math.max(
    Number(product.maxStock) || 0,
    reorderLevel > 0 ? reorderLevel * 2 : 0,
    stock,
    1,
  );
  const capacity = Math.min(
    100,
    Math.max(
      0,
      hasExplicitCapacity ? explicitCapacity : (stock / estimatedMaxStock) * 100,
    ),
  );
  const isOutOfStock = stock <= 0 || product.status === 'Out of Stock';

  // Determine theme based on capacity percentage
  let themeClass = '';
  if (isOutOfStock || capacity < 25) {
    themeClass = 'border-red-300 hover:border-red-500';
  } else if (capacity < 50) {
    themeClass = 'border-yellow-300 hover:border-yellow-500';
  } else {
    themeClass = 'border-green-300 hover:border-green-500';
  }

  // Override with selected state
  const borderClass = isOutOfStock
    ? isSelected
      ? 'border border-red-500 ring-2 ring-red-200'
      : 'border border-red-500 hover:border-red-600'
    : isSelected
      ? 'border border-blue-600 ring-2 ring-blue-200'
      : `border ${themeClass}`;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg ${borderClass}`}
    >
      <div className={`text-xs font-medium mb-2 ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
        {product.status || 'Unknown'}
      </div>

      {product.image ? (
        <img
          src={product.image}
          alt={product.name || 'Product'}
          className="rounded-lg mb-3 w-full h-32 object-cover"
        />
      ) : (
        <div className="rounded-lg mb-3 w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
          No Image
        </div>
      )}

      <p className="text-xs text-gray-400">{product.sku}</p>
      <h4 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h4>

      <p className="text-xs text-gray-500">Retail Price</p>
      <p className="font-bold text-blue-600 mb-2">₹{product.price}</p>

      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Quantity</p>
        <p className="text-2xl font-extrabold leading-tight text-blue-700">{stock}</p>
      </div>
    </div>
  );
};

export default InventoryCard;
