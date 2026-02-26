// import React from 'react';
// import InventoryCard from "./InventoryCard";

// const InventoryGrid = ({ products, onSelectProduct, selectedId }) => {
//     if (!products || !Array.isArray(products) || products.length === 0) {
//         return (
//             <div className="text-center py-8 text-gray-500">
//                 <p>No products found</p>
//             </div>
//         );
//     }
    
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
//             {products.map((product) => (
//               <InventoryCard
//                 key={product.id}
//                 product={product}
//                 isSelected={product.id === selectedId}
//                 onClick={() => onSelectProduct(product)}
//               />
//             ))}
//         </div>
//     )
// }

// export default InventoryGrid;


// InventoryGrid.jsx (minor improvement: added gap and responsive columns)
import React from 'react';
import InventoryCard from "./InventoryCard";

const InventoryGrid = ({ products, onSelectProduct, selectedId }) => {
    if (!products || !Array.isArray(products) || products.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No products found</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {products.map((product) => (
              <InventoryCard
                key={product.id}
                product={product}
                isSelected={product.id === selectedId}
                onClick={() => onSelectProduct(product)}
              />
            ))}
        </div>
    )
}

export default InventoryGrid;