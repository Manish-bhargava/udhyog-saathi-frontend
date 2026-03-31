import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const BillPageContext = createContext();

export const BillPageProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('form');
  const [submitting, setSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Refs to store the form data and handlers from the active page
  const formDataRef = useRef(null);
  const setFormDataRef = useRef(null);
  const handleSaveRef = useRef(null);

  const onSetActiveTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const onClear = useCallback(() => {
    if (setFormDataRef.current) {
      setFormDataRef.current((prevData) => {
        // Determine bill type based on context
        const isBillTypePakka = prevData?.gstPercentage !== undefined;
        
        if (isBillTypePakka) {
          return {
            buyer: { clientName: "", clientAddress: "", clientGst: "" },
            products: [{ name: "", rate: 0, quantity: 1, inventoryItemId: null, warehouseId: null }],
            gstPercentage: 18,
            discount: 0,
            notes: "",
          };
        } else {
          return {
            buyer: { clientName: "", clientAddress: "", clientGst: "" },
            products: [{ name: "", rate: 0, quantity: 1, inventoryItemId: null, warehouseId: null }],
            discount: 0,
            notes: "",
          };
        }
      });
    }
  }, []);

  const onSave = useCallback(async () => {
    if (handleSaveRef.current) {
      await handleSaveRef.current();
    }
  }, []);

  const billPageState = {
    activeTab,
    setActiveTab,
    onSetActiveTab,
    submitting,
    setSubmitting,
    isFormValid,
    setIsFormValid,
    onClear,
    onSave,
  };

  // Functions to register the form and handlers from the page
  const registerFormHandlers = useCallback((formData, setFormData, handleSave) => {
    formDataRef.current = formData;
    setFormDataRef.current = setFormData;
    handleSaveRef.current = handleSave;
  }, []);

  return (
    <BillPageContext.Provider value={{ billPageState, registerFormHandlers }}>
      {children}
    </BillPageContext.Provider>
  );
};

export const useBillPageContext = () => {
  const context = useContext(BillPageContext);
  if (!context) {
    throw new Error(
      'useBillPageContext must be used within a BillPageProvider'
    );
  }
  return context;
};
