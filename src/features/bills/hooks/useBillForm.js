// src/features/bills/hooks/useBillForm.js
import { useState, useCallback, useEffect } from 'react';

export const useBillForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'clientName':
        return value.trim() === '' ? 'Client name is required' : '';
      case 'clientGst':
        return value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value) 
          ? 'Invalid GST format' 
          : '';
      default:
        return '';
    }
  };

  const updateForm = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  const updateBuyer = useCallback((data) => {
    updateForm('buyer', data);
  }, [updateForm]);

  const updateProduct = useCallback((index, data) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        ...data,
        amount: (data.rate || updatedProducts[index].rate) * (data.quantity || updatedProducts[index].quantity)
      };
      return { ...prev, products: updatedProducts };
    });
  }, []);

  const addProduct = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        { name: '', rate: 0, quantity: 1, amount: 0 }
      ]
    }));
  }, []);

  const removeProduct = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Validate buyer
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
  }, [formData]);

  const calculateTotals = useCallback(() => {
    const subtotal = formData.products.reduce((sum, product) => sum + (product.rate * product.quantity), 0);
    const gstAmount = (subtotal * formData.gstPercentage) / 100;
    
    // Calculate discount percentage based on subtotal
    const discountPercentage = subtotal > 0 ? (formData.discount / subtotal) * 100 : 0;
    const discountAmount = formData.discount;
    const totalAfterDiscount = subtotal - discountAmount;
    const grandTotal = totalAfterDiscount + gstAmount;

    return {
      subtotal,
      gstAmount,
      discount: discountAmount,
      discountPercentage,
      grandTotal
    };
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

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