import React, { useState, useEffect, useMemo, useCallback } from "react";
import inventoryAPI from "./api";
import { toast } from "sonner";
import { useInventoryContext } from "./InventoryContext";

export default function WarehousesPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [creatingWarehouse, setCreatingWarehouse] = useState(false);
  const { inventoryPageState } = useInventoryContext();
  const { warehouseSearch, setWarehouseRefresh } = inventoryPageState;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await inventoryAPI.getWarehouseStockSummary();
      setSections(Array.isArray(res?.data?.sections) ? res.data.sections : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load warehouses and stock");
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Register refresh function with context
  useEffect(() => {
    setWarehouseRefresh(() => load);
  }, [load, setWarehouseRefresh]);

  const handleCreateWarehouse = async () => {
    if (creatingWarehouse) return;
    if (!newWarehouseName.trim()) {
      toast.error("Warehouse name is required");
      return;
    }

    setCreatingWarehouse(true);
    try {
      const res = await inventoryAPI.addWarehouse({ name: newWarehouseName.trim() });
      const createdWarehouse = res?.data;
      toast.success(
        createdWarehouse?.name
          ? `Warehouse "${createdWarehouse.name}" created`
          : "Warehouse created successfully",
      );
      setShowAddModal(false);
      setNewWarehouseName("");
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create warehouse");
    } finally {
      setCreatingWarehouse(false);
    }
  };

  const filteredSections = useMemo(() => {
    const q = warehouseSearch.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((s) => {
      if (s.name.toLowerCase().includes(q)) return true;
      if ((s.location || "").toLowerCase().includes(q)) return true;
      return s.lines.some(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.kind || "").toLowerCase().includes(q),
      );
    });
  }, [sections, warehouseSearch]);

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 px-2">
        <p className="text-sm text-gray-600 max-w-3xl">
          <span className="font-medium text-gray-700">On hand</span> is total stock in the bin.
          <span className="font-medium text-amber-800"> Reserved</span> is tied to open kaccha bills;
          <span className="font-medium text-gray-700"> available</span> is free to sell or ship.
        </p>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
        >
          + Add Warehouse
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500 text-sm">
          Loading warehouses…
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-500 text-sm">
          {warehouseSearch.trim()
            ? "No matching warehouses or products for this search."
            : sections.length === 0
              ? "No warehouse stock to show yet. Add warehouses and stock products with a quantity to see balances per location."
              : "No matching warehouses or products for this search."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSections.map((section) => {
            const lineCount = section.lines.length;
            const totalUnits = section.lines.reduce(
              (acc, l) => acc + (Number(l.quantity) || 0),
              0,
            );
            const totalReserved = section.lines.reduce(
              (acc, l) => acc + (Number(l.reservedQuantity) || 0),
              0,
            );
            return (
              <div
                key={String(section.key)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {section.name}
                    </h2>
                    {section.location ? (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {section.location}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="font-semibold text-gray-800">{lineCount}</span>{" "}
                      SKU{lineCount === 1 ? "" : "s"}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
                      <span className="font-semibold">{totalUnits.toLocaleString("en-IN")}</span>{" "}
                      on hand
                    </span>
                    {totalReserved > 0 ? (
                      <span
                        className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900"
                        title="Quantity reserved for kaccha (draft) bills"
                      >
                        <span className="font-semibold">{totalReserved.toLocaleString("en-IN")}</span>{" "}
                        reserved
                      </span>
                    ) : null}
                  </div>
                </div>

                {lineCount === 0 ? (
                  <div className="px-4 md:px-6 py-8 text-sm text-gray-400 text-center">
                    No products stored in this warehouse yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-100 bg-gray-50/80">
                          <th className="px-4 md:px-6 py-3 font-semibold">Type</th>
                          <th className="px-4 md:px-6 py-3 font-semibold">Product</th>
                          <th className="px-4 md:px-6 py-3 font-semibold">Unit</th>
                          <th className="px-4 md:px-6 py-3 font-semibold text-right">On hand</th>
                          <th className="px-4 md:px-6 py-3 font-semibold text-right text-amber-800/90">Reserved</th>
                          <th className="px-4 md:px-6 py-3 font-semibold text-right">Available</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.lines.map((line) => (
                          <tr
                            key={`${section.key}-${String(line.itemId)}-${line.kind}`}
                            className="border-b border-gray-50 hover:bg-gray-50/50"
                          >
                            <td className="px-4 md:px-6 py-3">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                  line.kind === "Finished"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-900"
                                }`}
                              >
                                {line.kind}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-3 font-medium text-gray-800">
                              {line.name}
                            </td>
                            <td className="px-4 md:px-6 py-3 text-gray-600">
                              {line.unit}
                            </td>
                            <td className="px-4 md:px-6 py-3 text-right font-mono font-semibold text-gray-900">
                              {(Number(line.quantity) || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 md:px-6 py-3 text-right font-mono">
                              {(Number(line.reservedQuantity) || 0) > 0 ? (
                                <span
                                  className="font-semibold text-amber-800"
                                  title="Reserved for kaccha bills"
                                >
                                  {(Number(line.reservedQuantity) || 0).toLocaleString("en-IN")}
                                </span>
                              ) : (
                                <span className="text-gray-400">0</span>
                              )}
                            </td>
                            <td className="px-4 md:px-6 py-3 text-right font-mono text-gray-800">
                              {(Number(line.availableQuantity) || 0).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Add Warehouse</h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setNewWarehouseName("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Warehouse Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter warehouse name"
                  value={newWarehouseName}
                  onChange={(e) => setNewWarehouseName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateWarehouse()}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setNewWarehouseName("");
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateWarehouse}
                disabled={creatingWarehouse || !newWarehouseName.trim()}
                className={`px-5 py-2 rounded-lg text-sm font-semibold text-white transition ${
                  creatingWarehouse || !newWarehouseName.trim()
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {creatingWarehouse ? "Adding…" : "Add Warehouse"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
