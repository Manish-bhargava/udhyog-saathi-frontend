import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import inventoryAPI from './api';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [warehouse, setWarehouse] = useState('all');
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [isRaw, setIsRaw] = useState(false);
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [warehouseRefresh, setWarehouseRefresh] = useState(null);

  // Fetch warehouses on mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setWarehousesLoading(true);
        const res = await inventoryAPI.getWarehouseStockSummary();
        const sections = Array.isArray(res?.data?.sections) ? res.data.sections : [];
        setWarehouses(sections);
      } catch (error) {
        console.error('Failed to load warehouses:', error);
        setWarehouses([]);
      } finally {
        setWarehousesLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setSort('newest');
    setCategory('all');
    setStatus('all');
    setWarehouse('all');
    setWarehouseSearch('');
  }, []);

  const inventoryPageState = {
    search,
    setSearch,
    sort,
    setSort,
    category,
    setCategory,
    status,
    setStatus,
    warehouse,
    setWarehouse,
    warehouses,
    warehousesLoading,
    isRaw,
    setIsRaw,
    warehouseSearch,
    setWarehouseSearch,
    warehouseRefresh,
    setWarehouseRefresh,
    clearFilters,
  };

  return (
    <InventoryContext.Provider value={{ inventoryPageState }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error(
      'useInventoryContext must be used within an InventoryProvider'
    );
  }
  return context;
};
