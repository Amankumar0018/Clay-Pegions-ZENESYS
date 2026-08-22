import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { TOP_PRODUCTS_PERFORMANCE } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const TopProductsCard: React.FC = () => {
  const { products, setActiveProductDetail, setCurrentPage } = useApp();

  const handleProductClick = (productName: string) => {
    const fullProd = products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );
    if (fullProd) {
      setActiveProductDetail(fullProd);
    }
  };

  const maxRevenue = Math.max(...TOP_PRODUCTS_PERFORMANCE.map((p) => p.revenue));

  return (
    <div
      id="top-products-card"
      className="p-5 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
        <div>
          <h3 className="text-sm font-semibold text-[#232220]">
            Top Product Velocity & Contribution
          </h3>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Ranked by total realized revenue and fulfillment momentum
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('inventory')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A74E35] transition-colors"
        >
          <span>All Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product List with Horizontal Contribution Bars */}
      <div className="py-2 space-y-3.5">
        {TOP_PRODUCTS_PERFORMANCE.map((item, index) => {
          const barWidthPct = Math.round((item.revenue / maxRevenue) * 100);
          return (
            <div
              key={item.id}
              onClick={() => handleProductClick(item.name)}
              className="group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-[#FAF8F5] transition-all"
            >
              {/* Product Header */}
              <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 text-center text-xs font-semibold text-[#969085] font-mono">
                    0{index + 1}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-[#232220] group-hover:text-[#C86D51] transition-colors truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#8A8479] font-mono ml-2">
                      {item.sku}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[#7A756D] text-[11px]">
                    {item.unitsSold.toLocaleString()} sold
                  </span>
                  <span className="font-bold text-[#232220] font-tabular-nums">
                    {item.revenueFormatted}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.growthPct >= 0
                        ? 'bg-[#EDF5F0] text-[#2D6649]'
                        : 'bg-[#FDF2F0] text-[#9E3529]'
                    }`}
                  >
                    {item.growthPct >= 0 ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {item.growthPct >= 0 ? `+${item.growthPct}%` : `${item.growthPct}%`}
                  </span>
                </div>
              </div>

              {/* Progress Relative Bar */}
              <div className="w-full bg-[#EFEBE3] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-[#C86D51]"
                  style={{ width: `${barWidthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-1 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] text-[#7A756D]">
        <span>Click any row to open full telemetry & forecast drawer</span>
        <span className="font-medium text-[#232220]">82.4% Pareto share</span>
      </div>
    </div>
  );
};
