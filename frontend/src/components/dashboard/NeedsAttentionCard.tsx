import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NeedsAttentionCard: React.FC = () => {
  const {
    attentionItems,
    setActiveProductDetail,
    setActivePOModalProduct,
    simulateProductRisk,
    products,
    setCurrentPage,
  } = useApp();

  const handleInspect = (productName: string) => {
    const prod = products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );
    if (prod) {
      setActiveProductDetail(prod);
    }
  };

  const handleCreatePO = (productName: string) => {
    const prod = products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );
    if (prod) {
      setActivePOModalProduct(prod);
    }
  };

  return (
    <div
      id="needs-attention-panel"
      className="p-5 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#BA4336] animate-pulse" />
          <h2 className="text-base font-semibold text-[#232220] tracking-tight">
            Needs Immediate Operational Attention
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FDF2F0] text-[#9E3529] border border-[#F8D4CE]">
            {attentionItems.length} Action Items
          </span>
        </div>

        <button
          onClick={() => setCurrentPage('alerts')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A74E35] transition-colors"
        >
          <span>All Alerts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Priority Issues List */}
      <div className="py-3 space-y-3">
        {attentionItems.map((item) => {
          const isCritical = item.severity === 'Critical';
          const isStockout = item.type === 'STOCKOUT_RISK';
          const isSupplierDelay = item.type === 'SUPPLIER_DELAY';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border transition-all ${
                isCritical
                  ? 'bg-[#FDF6F5] border-[#F2D1CC] hover:border-[#E8B8B0]'
                  : item.severity === 'Warning'
                  ? 'bg-[#FDF9F2] border-[#F4E3C8] hover:border-[#E9D0A8]'
                  : 'bg-[#FAF8F5] border-[#EBE4D8] hover:border-[#DDD6CA]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-[#FBE2DE] text-[#8F2B1F]'
                          : 'bg-[#F9EBD3] text-[#865313]'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <h4 className="text-xs font-bold text-[#232220]">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-[#7A756D] font-medium">
                      &bull; {item.productName}
                    </span>
                  </div>

                  <p className="text-xs text-[#5A554D] leading-relaxed">
                    {item.issue}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    <div className="flex items-center gap-1 text-[#2D6649] font-medium">
                      <Sparkles className="w-3 h-3 text-[#C86D51]" />
                      <span>{item.recommendedAction}</span>
                    </div>
                    {item.revenueProtected > 0 && (
                      <span className="text-[#8A8479] font-tabular-nums">
                        Revenue protected: ₹{(item.revenueProtected / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleInspect(item.productName)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-[#DDD6CA] text-[#3D3A34] hover:bg-[#FAF8F5] transition-colors shadow-2xs"
                  >
                    Inspect
                  </button>

                  {isStockout && (
                    <button
                      onClick={() => handleCreatePO(item.productName)}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#C86D51] text-white hover:bg-[#A74E35] transition-colors shadow-2xs inline-flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Order {item.recommendedQty}</span>
                    </button>
                  )}

                  {isSupplierDelay && (
                    <button
                      onClick={() => simulateProductRisk(item.productName, 35)}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#232220] text-[#FBF9F5] hover:bg-[#383531] transition-colors shadow-2xs inline-flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-[#E8B86D]" />
                      <span>Simulate Delay</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#7A756D]">
        <span>Autonomous recommendations backed by confidence thresholds</span>
        <button
          onClick={() => simulateProductRisk('Smart Watch Series 4', 40)}
          className="text-[#C86D51] font-medium hover:underline text-[11px]"
        >
          Run Full Disruption Stress-Test &rarr;
        </button>
      </div>
    </div>
  );
};
