import React, { useState } from 'react';
import { toast } from 'sonner';
import { useWarehouses } from '../hooks/useWarehouses';

/**
 * WarehouseSelector
 * Renders a warehouse <select> with a "+ New" button that expands into an
 * inline mini-form so the user can create a warehouse without leaving the page.
 *
 * Props:
 *   value        – currently selected warehouseId (string)
 *   onChange(id) – called when selection changes
 */
const WarehouseSelector = ({ value, onChange }) => {
  const { warehouses, loading, createWarehouse } = useWarehouses();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const wh = await createWarehouse(newName);
      toast.success(`Warehouse "${wh.name}" created`);
      onChange(wh._id);        // auto-select the new warehouse
      setShowCreate(false);
      setNewName('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create warehouse');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-2">
      {!showCreate ? (
        <div className="flex gap-2">
          <select
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={loading}
          >
            <option value="">
              {loading ? 'Loading warehouses…' : 'Select warehouse (optional)'}
            </option>
            {warehouses.map((wh) => (
              <option key={wh._id} value={wh._id}>
                {wh.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-600 transition-colors whitespace-nowrap"
            title="Create new warehouse"
          >
            + New
          </button>
        </div>
      ) : (
        /* ---- Inline create form ---- */
        <div className="flex gap-2">
          <input
            type="text"
            autoFocus
            placeholder="Warehouse name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="flex-1 border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className={`px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
              creating || !newName.trim()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {creating ? '…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => { setShowCreate(false); setNewName(''); }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default WarehouseSelector;
