import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ProductSearchInput
 * - Shows a live-filter dropdown of inventory items as the user types.
 * - When the user selects an item, calls onSelectProduct(item) so the parent
 *   can auto-fill name, rate, and inventoryItemId.
 * - When the typed text (≥2 chars) has no inventory match, shows an inline
 *   notification with a CTA to navigate to the Inventory page.
 */
const ProductSearchInput = ({
  value,
  onChangeText,
  onSelectProduct,
  inventoryItems = [],
  isKachaBill = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const trimmedValue = value.trim();
  const filtered = trimmedValue
    ? inventoryItems.filter((item) =>
        item.name.toLowerCase().includes(trimmedValue.toLowerCase())
      )
    : [];

  // Show "not in inventory" hint only after user has typed ≥2 chars with no match
  const noMatch = trimmedValue.length >= 2 && filtered.length === 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    onChangeText(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = (item) => {
    onSelectProduct(item);
    setShowDropdown(false);
  };

  const focusRingClass = isKachaBill
    ? 'focus:ring-amber-500 focus:border-amber-500'
    : 'focus:ring-blue-500 focus:border-blue-500';

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 ${focusRingClass} outline-none text-sm`}
        placeholder="Search product from inventory..."
        value={value}
        onChange={handleChange}
        onFocus={() => trimmedValue && setShowDropdown(true)}
        autoComplete="off"
      />

      {/* ---- Dropdown ---- */}
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.map((item) => (
            <li key={`${item.id}-${item.warehouseId || "na"}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-2 text-sm border-b border-gray-100 last:border-0"
              >
                {/* Left: name + warehouse */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate">{item.name}</p>
                  {item.warehouseName && (
                    <p className="text-[10px] text-gray-400 truncate">🏭 {item.warehouseName}</p>
                  )}
                </div>
                {/* Right: price + stock */}
                <div className="text-right shrink-0">
                  {item.price > 0 && (
                    <p className="text-xs text-green-600 font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
                  )}
                  {item.stock > 0 && (
                    <p className="text-[10px] text-gray-400">{item.stock} in stock</p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ---- Not in inventory notification ---- */}
      {noMatch && (
        <div className="mt-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-2">
          <p className="text-xs text-amber-700 truncate min-w-0">
            <span className="font-semibold">"{value}"</span> not found in inventory
          </p>
          <button
            type="button"
            onClick={() =>
              navigate('/inventory/finished', {
                state: {
                  openAddProduct: true,
                  prefilledProductName: trimmedValue,
                },
              })
            }
            className="shrink-0 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap"
          >
            + Add to Inventory
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSearchInput;
