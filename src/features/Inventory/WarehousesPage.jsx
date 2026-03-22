import React, { useState, useEffect, useMemo, useCallback } from "react";
import inventoryAPI from "./api";
import { toast } from "sonner";

export default function WarehousesPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
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
  }, [sections, search]);

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Warehouses &amp; stock</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              <span className="font-medium text-gray-700">On hand</span> is total stock in the bin.
              <span className="font-medium text-amber-800"> Reserved</span> is tied to open kaccha bills;
              <span className="font-medium text-gray-700"> available</span> is free to sell or ship.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="shrink-0 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search warehouse, location, or product..."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500 text-sm">
          Loading warehouses…
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-500 text-sm">
          {search.trim()
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
                              {(Number(line.availableQuantity) ?? 0).toLocaleString("en-IN")}
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
    </div>
  );
}
