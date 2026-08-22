import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskLevel, ProductInventory } from '../types';

export const InventoryScreen: React.FC = () => {
  const {
    products,
    selectedWarehouse,
    setSelectedWarehouse,
    setActivePOModalProduct,
    setActiveProductDetail,
    setCurrentPage,
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [selectedProductRow, setSelectedProductRow] = useState<ProductInventory | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesWarehouse =
      selectedWarehouse === 'All' || p.warehouse === selectedWarehouse;
    const matchesSearch =
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesRisk = riskFilter === 'All' || p.risk === riskFilter;
    return matchesWarehouse && matchesSearch && matchesRisk;
  });

  return (
    <div id="inventory-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
            Inventory
          </h1>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            Know what you have, what you need, and what is becoming a problem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePOModalProduct(products[0])}
            className="px-3.5 py-1.5 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Inventory Health Overview (4 Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-xl border border-[#E0E2DC]">
          <div className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider">
            Total Inventory Value
          </div>
          <div className="text-xl font-bold font-mono text-[#1C1D1F] mt-1">
            ₹18.37L
          </div>
          <div className="text-[11px] text-[#71746E] mt-0.5">
            18,840 units across 3 DCs
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E0E2DC]">
          <div className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider">
            Low Stock SKUs
          </div>
          <div className="text-xl font-bold font-mono text-[#B45309] mt-1">
            12
          </div>
          <div className="text-[11px] text-[#71746E] mt-0.5">
            Nearing reorder threshold
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E0E2DC]">
          <div className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider">
            Critical Stockout Risk
          </div>
          <div className="text-xl font-bold font-mono text-[#BE123C] mt-1">
            4
          </div>
          <div className="text-[11px] text-[#BE123C] font-medium mt-0.5">
            &lt; 7 days runway
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E0E2DC]">
          <div className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider">
            Overstock Positions
          </div>
          <div className="text-xl font-bold font-mono text-[#71746E] mt-1">
            7
          </div>
          <div className="text-[11px] text-[#71746E] mt-0.5">
            &gt; 45 days capital lockup
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#E0E2DC]">
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#888B84]" />
          <input
            type="text"
            placeholder="Filter by product name, SKU or category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs bg-transparent border-none text-[#1C1D1F] placeholder:text-[#888B84] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-medium text-[#71746E]">Risk:</span>
          {['All', 'Critical', 'High', 'Watch', 'Healthy', 'Overstock'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                riskFilter === lvl
                  ? 'bg-[#1C1D1F] text-white'
                  : 'bg-[#F4F4F1] text-[#555850] hover:bg-[#EAEAE6]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="bg-white rounded-xl border border-[#E0E2DC] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F8F5] border-b border-[#EAEAE6] text-[#71746E] font-semibold">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Warehouse</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Forecast Demand</th>
                <th className="py-3 px-4 text-right">Days Cover</th>
                <th className="py-3 px-4 text-right">Reorder Point</th>
                <th className="py-3 px-4 text-center">Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EB]">
              {filteredProducts.map((p) => {
                const getRiskBadge = (risk: RiskLevel) => {
                  switch (risk) {
                    case 'Critical':
                      return 'bg-[#BE123C]/10 text-[#BE123C] border-[#BE123C]/20';
                    case 'High':
                      return 'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/20';
                    case 'Watch':
                      return 'bg-[#D97706]/10 text-[#B45309] border-[#D97706]/20';
                    case 'Overstock':
                      return 'bg-[#4B5563]/10 text-[#4B5563] border-[#4B5563]/20';
                    case 'Healthy':
                    default:
                      return 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20';
                  }
                };

                return (
                  <tr
                    key={p.id}
                    id={`inventory-row-${p.id}`}
                    onClick={() => setActiveProductDetail(p)}
                    className="hover:bg-[#FAF9F7] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1C1D1F]">{p.name}</div>
                      <div className="text-[10px] font-mono text-[#888B84]">
                        {p.sku} · {p.category}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#555850]">
                      <span className="px-2 py-0.5 rounded bg-[#F4F4F1] text-[11px] font-medium">
                        {p.warehouse} Hub
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#1C1D1F]">
                      {p.currentStock.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#555850]">
                      {p.forecastDemand.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      <span
                        className={
                          p.daysCover < 8
                            ? 'text-[#BE123C]'
                            : p.daysCover < 15
                            ? 'text-[#B45309]'
                            : 'text-[#1C1D1F]'
                        }
                      >
                        {p.daysCover}d
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#71746E]">
                      {p.reorderPoint}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRiskBadge(
                          p.risk
                        )}`}
                      >
                        {p.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {p.recommendedPurchaseQty > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePOModalProduct(p);
                          }}
                          className="px-2.5 py-1 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Reorder</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : p.risk === 'Overstock' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPage('demand-forecast');
                          }}
                          className="px-2.5 py-1 bg-[#F4F4F1] hover:bg-[#EAEAE6] text-[#555850] rounded text-[11px] font-medium transition-colors"
                        >
                          Rebalance
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#71746E]">Optimal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
