// src/features/bills/hooks/useKachaBillForm.js
import { useState, useCallback, useEffect } from 'react';
import { usePermissions } from '../../auth/hooks/usePermissions';

export const useKachaBillForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const { canPerformAction } = usePermissions();

  const validateField = (name, value) => {
    if (!canPerformAction()) {
      return 'Complete onboarding to edit';
    }
    
    switch (name) {
      case 'clientName':
        return value.trim() === '' ? 'Client name is required' : '';
      // No GST validation for Kacha Bills
      default:
        return '';
    }
  };

  const updateForm = useCallback((section, data) => {
    if (!canPerformAction()) return;
    
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, [canPerformAction]);

  const updateBuyer = useCallback((data) => {
    if (!canPerformAction()) return;
    updateForm('buyer', data);
  }, [updateForm, canPerformAction]);

  const updateProduct = useCallback((index, data) => {
    if (!canPerformAction()) return;
    
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        ...data,
        amount: (data.rate || updatedProducts[index].rate) * (data.quantity || updatedProducts[index].quantity)
      };
      return { ...prev, products: updatedProducts };
    });
  }, [canPerformAction]);

  const addProduct = useCallback(() => {
    if (!canPerformAction()) return;
    
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        { name: '', rate: 0, quantity: 1, amount: 0 }
      ]
    }));
  }, [canPerformAction]);

  const removeProduct = useCallback((index) => {
    if (!canPerformAction()) return;
    
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  }, [canPerformAction]);

  const validateForm = useCallback(() => {
    if (!canPerformAction()) {
      return false;
    }
    
    const newErrors = {};
    
    // Validate buyer (no GST required for Kacha)
    if (!formData.buyer.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    
    // Validate products
    formData.products.forEach((product, index) => {
      if (!product.name.trim()) {
        newErrors[`productName_${index}`] = 'Product name is required';
      }
      if (product.rate <= 0) {
        newErrors[`productRate_${index}`] = 'Rate must be greater than 0';
      }
      if (product.quantity <= 0) {
        newErrors[`productQuantity_${index}`] = 'Quantity must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, canPerformAction]);

  const calculateTotals = useCallback(() => {
    const subtotal = formData.products.reduce((sum, product) => sum + (product.rate * product.quantity), 0);
    const discountAmount = formData.discount;
    const grandTotal = subtotal - discountAmount;

    return {
      subtotal,
      discount: discountAmount,
      discountPercentage: subtotal > 0 ? (discountAmount / subtotal) * 100 : 0,
      grandTotal
      // No GST for Kacha Bills
    };
  }, [formData]);

  const resetForm = useCallback(() => {
    if (!canPerformAction()) return;
    
    setFormData(initialData);
    setErrors({});
  }, [initialData, canPerformAction]);

  return {
    formData,
    errors,
    updateBuyer,
    updateProduct,
    addProduct,
    removeProduct,
    validateForm,
    calculateTotals,
    resetForm,
    setFormData
  };
};