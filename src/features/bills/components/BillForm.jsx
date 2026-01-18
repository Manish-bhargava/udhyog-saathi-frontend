// src/features/bills/components/BillForm.jsx
import React from 'react';
import { usePermissions } from '../../auth/hooks/usePermissions';

const BillForm = ({ 
  formData, 
  errors, 
  onUpdateBuyer, 
  onUpdateProduct, 
  onAddProduct, 
  onRemoveProduct,
  gstPercentage,
  discount,
  onUpdateGst,
  onUpdateDiscount,
  companyDetails,
  isCompanyLocked,
  onUpdateCompany,
  isKachaBill = false // NEW: Flag to identify Kacha Bills

}) => {
  const { getButtonProps, getFieldProps } = usePermissions();

  return (
    <div className="space-y-6">
      {/* Company Details Section - Updated for Kacha Bills */}
      {!isCompanyLocked && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={companyDetails.companyName || ''}
                onChange={(e) => onUpdateCompany({ companyName: e.target.value })}
                {...getFieldProps({
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  placeholder: "Enter company name"
                })}
              />
            </div>
            
            {/* Hide GST field for Kacha Bills */}
            {!isKachaBill && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company GST
                </label>
                <input
                  type="text"
                  value={companyDetails.GST || ''}
                  onChange={(e) => onUpdateCompany({ GST: e.target.value.toUpperCase() })}
                  {...getFieldProps({
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    placeholder: "Enter GST number"
                  })}
                />
              </div>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Address
              </label>
              <textarea
                value={companyDetails.companyAddress || ''}
                onChange={(e) => onUpdateCompany({ companyAddress: e.target.value })}
                {...getFieldProps({
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  rows: "2",
                  placeholder: "Enter company address"
                })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Buyer Details Section - Updated for Kacha Bills */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Buyer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name *
            </label>
            <input
              type="text"
              value={formData.buyer.clientName}
              onChange={(e) => onUpdateBuyer({ clientName: e.target.value })}
              {...getFieldProps({
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.clientName ? 'border-red-500' : 'border-gray-300'
                }`,
                placeholder: "Enter client name"
              })}
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
            )}
          </div>
          
          {/* Hide GST field for Kacha Bills */}
          {!isKachaBill && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client GST
              </label>
              <input
                type="text"
                value={formData.buyer.clientGst || ''}
                onChange={(e) => onUpdateBuyer({ clientGst: e.target.value.toUpperCase() })}
                {...getFieldProps({
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.clientGst ? 'border-red-500' : 'border-gray-300'
                  }`,
                  placeholder: "Enter GST number"
                })}
              />
              {errors.clientGst && (
                <p className="mt-1 text-sm text-red-600">{errors.clientGst}</p>
              )}
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Address
            </label>
            <textarea
              value={formData.buyer.clientAddress || ''}
              onChange={(e) => onUpdateBuyer({ clientAddress: e.target.value })}
              {...getFieldProps({
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                rows: "3",
                placeholder: "Enter client address"
              })}
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Products</h3>
          <button
            {...getButtonProps(onAddProduct, {
              className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
              onDisabledClick: () => {
                // This will be triggered when onboarding is not complete
              }
            })}
          >
            + Add Product
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.products.map((product, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 bg-gray-50 rounded-lg">
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => onUpdateProduct(index, { name: e.target.value })}
                  {...getFieldProps({
                    className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`productName_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`,
                    placeholder: "Enter product name"
                  })}
                />
                {errors[`productName_${index}`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`productName_${index}`]}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate (₹) *
                </label>
                <input
                  type="number"
                  value={product.rate}
                  onChange={(e) => onUpdateProduct(index, { rate: parseFloat(e.target.value) || 0 })}
                  {...getFieldProps({
                    className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`productRate_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`,
                    min: "0",
                    step: "0.01"
                  })}
                />
                {errors[`productRate_${index}`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`productRate_${index}`]}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => onUpdateProduct(index, { quantity: parseInt(e.target.value) || 1 })}
                  {...getFieldProps({
                    className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`productQuantity_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`,
                    min: "1"
                  })}
                />
                {errors[`productQuantity_${index}`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`productQuantity_${index}`]}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                  {(product.rate * product.quantity).toFixed(2)}
                </div>
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                {formData.products.length > 1 && (
                  <button
                    onClick={() => onRemoveProduct(index)}
                    {...getButtonProps(() => onRemoveProduct(index), {
                      className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                      title: "Remove product"
                    })}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax and Discount Section - Hide GST for Kacha Bills */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isKachaBill ? 'Discount' : 'Tax & Discount'}
        </h3>
        <div className={`grid gap-6 ${isKachaBill ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {/* Hide GST Section for Kacha Bills */}
          {!isKachaBill && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Percentage (%)
              </label>
              <select
                value={gstPercentage || 0}
                onChange={(e) => onUpdateGst(parseInt(e.target.value))}
                {...getFieldProps({
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                })}
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (₹)
            </label>
            <input
              type="number"
              value={discount || 0}
              onChange={(e) => onUpdateDiscount(parseFloat(e.target.value) || 0)}
              {...getFieldProps({
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                min: "0",
                step: "0.01",
                placeholder: "Enter discount amount"
              })}
            />
            {discount > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                Discount percentage: {((discount / formData.products.reduce((sum, p) => sum + (p.rate * p.quantity), 0)) * 100 || 0).toFixed(2)}%
              </p>
            )}
          </div>
        </div>
        {isKachaBill && (
          <p className="mt-2 text-xs text-yellow-600">
            Note: GST calculation is not available for Kacha Bills. Convert to Pakka Bill for GST invoice.
          </p>
        )}
      </div>
    </div>
  );
};

export default BillForm;