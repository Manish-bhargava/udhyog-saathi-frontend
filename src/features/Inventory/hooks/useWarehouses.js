import { useState, useEffect, useCallback } from 'react';
import inventoryAPI from '../api';

/**
 * useWarehouses
 * Returns the list of warehouses and a `createWarehouse(name)` action.
 * On success, createWarehouse appends the new warehouse to the list and
 * returns it so callers can pre-select it.
 */
export function useWarehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inventoryAPI
      .getWarehouses()
      .then((res) => setWarehouses(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {}) // silently fail – the selector still renders without data
      .finally(() => setLoading(false));
  }, []);

  const createWarehouse = useCallback(async (name) => {
    const res = await inventoryAPI.addWarehouse({ name: name.trim() });
    const newWh = res?.data;
    if (!newWh?._id) throw new Error('Invalid warehouse response from server');
    setWarehouses((prev) => [...prev, newWh]);
    return newWh; // caller can use newWh._id to pre-select
  }, []);

  return { warehouses, loading, createWarehouse };
}
