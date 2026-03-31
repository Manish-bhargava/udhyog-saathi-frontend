import React from 'react';

const RawInventoryCard = ({ product, onClick, isSelected }) => {
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

      <img
        src={product.image || ''}
        alt={product.name || 'Product'}
        className="rounded-lg mb-3 w-full h-32 object-cover"
      />

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

export default RawInventoryCard;
