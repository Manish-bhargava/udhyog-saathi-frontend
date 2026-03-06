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

  const capacity = product.capacity || 0;

  // Determine theme based on capacity percentage
  let themeClass = '';
  let progressColor = '';
  if (capacity < 25) {
    themeClass = 'border-red-300 hover:border-red-500';
    progressColor = 'bg-red-500';
  } else if (capacity < 50) {
    themeClass = 'border-yellow-300 hover:border-yellow-500';
    progressColor = 'bg-yellow-500';
  } else {
    themeClass = 'border-green-300 hover:border-green-500';
    progressColor = 'bg-green-500';
  }

  // Override with selected state
  const borderClass = isSelected
    ? 'border-blue-600 ring-2 ring-blue-200'
    : `border ${themeClass}`;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg ${borderClass}`}
    >
      <div className="text-xs text-green-600 font-medium mb-2">
        {product.status || 'Unknown'}
      </div>

      <img
        src={product.image || ''}
        alt={product.name || 'Product'}
        className="rounded-lg mb-3 w-full h-32 object-cover"
      />

      <p className="text-xs text-gray-400">{product.sku}</p>
      <h4 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h4>

      <p className="text-xs text-gray-500">Retail Price</p>
      <p className="font-bold text-blue-600 mb-2">₹{product.price}</p>

      <div className="text-xs text-gray-500 mb-1">CAPACITY</div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`${progressColor} h-1.5 rounded-full`}
          style={{ width: `${Math.min(capacity, 100)}%` }}
        />
      </div>
      <p className="text-xs font-medium text-gray-600 mt-2">Quantity: {product.stock}</p>
    </div>
  );
};

export default InventoryCard;