import React, { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Boxes, PackageCheck, Building2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    orders,
    suppliers,
    setCurrentPage,
    setActiveOrderDetail,
    setActiveSupplierDetail,
    setActivePOModalProduct,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      o.productName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      id="search-palette-backdrop"
      className="fixed inset-0 bg-black/35 backdrop-blur-2xs z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="search-palette-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E0E2DC] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[#EAEAE6] h-14 gap-3">
          <Search className="w-4 h-4 text-[#888B84]" />
          <input
            autoFocus
            type="text"
            placeholder="Type to search products, orders, suppliers, or workflows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-[#1C1D1F] placeholder:text-[#888B84] focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#888B84] hover:text-[#1C1D1F]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] bg-[#F4F4F1] border border-[#D5D7D2] rounded px-1.5 py-0.5 font-mono text-[#71746E]">
            ESC to close
          </span>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions / Shortcuts if no query */}
          {!query && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#888B84] uppercase tracking-wider px-2">
                Quick Navigation
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setCurrentPage('command-center');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[#333] hover:bg-[#F4F4F1] transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#0F5B5C]" />
                  <span>Executive Command Center</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('simulator');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[#333] hover:bg-[#F4F4F1] transition-colors"
                >
                  <Boxes className="w-3.5 h-3.5 text-[#0F5B5C]" />
                  <span>What-If Scenario Simulator</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('procurement');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[#333] hover:bg-[#F4F4F1] transition-colors"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-[#0F5B5C]" />
                  <span>Smart Procurement Workspace</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('ai-assistant');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[#333] hover:bg-[#F4F4F1] transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#0F5B5C]" />
                  <span>Ask NEXUS Assistant</span>
                </button>
              </div>
            </div>
          )}

          {/* Products Results */}
          {filteredProducts.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[#888B84] uppercase tracking-wider px-2 mb-1.5">
                Products & Inventory ({filteredProducts.length})
              </p>
              <div className="space-y-1">
                {filteredProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentPage('inventory');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F4F4F1] cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Boxes className="w-4 h-4 text-[#71746E]" />
                      <div>
                        <div className="text-xs font-semibold text-[#1C1D1F] flex items-center gap-2">
                          {p.name}
                          <span className="font-mono text-[10px] text-[#888B84]">
                            {p.sku}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#71746E]">
                          Stock: {p.currentStock} units · {p.daysCover} days cover · Hub: {p.warehouse}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          p.risk === 'Critical'
                            ? 'bg-[#BE123C]/10 text-[#BE123C]'
                            : p.risk === 'High'
                            ? 'bg-[#B45309]/10 text-[#B45309]'
                            : 'bg-[#15803D]/10 text-[#15803D]'
                        }`}
                      >
                        {p.risk}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#888B84] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Results */}
          {filteredOrders.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[#888B84] uppercase tracking-wider px-2 mb-1.5">
                Orders ({filteredOrders.length})
              </p>
              <div className="space-y-1">
                {filteredOrders.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setActiveOrderDetail(o);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F4F4F1] cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <PackageCheck className="w-4 h-4 text-[#71746E]" />
                      <div>
                        <div className="text-xs font-semibold text-[#1C1D1F]">
                          Order {o.orderNumber} — {o.productName} ({o.quantity} units)
                        </div>
                        <div className="text-[11px] text-[#71746E]">
                          {o.supplierName} · Expected: {o.expectedDelivery}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        o.status === 'Delayed'
                          ? 'bg-[#BE123C]/10 text-[#BE123C]'
                          : o.status === 'In Transit'
                          ? 'bg-[#0F5B5C]/10 text-[#0F5B5C]'
                          : 'bg-[#EDEDE8] text-[#555]'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suppliers Results */}
          {filteredSuppliers.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[#888B84] uppercase tracking-wider px-2 mb-1.5">
                Suppliers ({filteredSuppliers.length})
              </p>
              <div className="space-y-1">
                {filteredSuppliers.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSupplierDetail(s);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F4F4F1] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-[#71746E]" />
                      <div>
                        <div className="text-xs font-semibold text-[#1C1D1F]">{s.name}</div>
                        <div className="text-[11px] text-[#71746E]">
                          Lead time: {s.leadTimeDays}d · Reliability: {s.reliabilityRate}% · Accuracy: {s.orderAccuracyRate}%
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-[#1C1D1F]">
                      ₹{s.unitPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query &&
            filteredProducts.length === 0 &&
            filteredOrders.length === 0 &&
            filteredSuppliers.length === 0 && (
              <div className="py-8 text-center text-xs text-[#71746E]">
                No records matching &quot;{query}&quot;. Try searching for &quot;Wireless Earbuds&quot; or &quot;Supplier A&quot;.
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
