import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIInsightsCard: React.FC = () => {
  const { setCurrentPage, simulateProductRisk, setActivePOModalProduct, products, addToast } = useApp();

  const handleApplySwitch = () => {
    addToast('Allocation Optimized', '120 units re-routed to Crestline Logistics (Supplier C) with 4-day faster ETA.', 'success');
  };

  const handleCreateSmartWatchPO = () => {
    const watch = products.find((p) => p.name.includes('Smart Watch'));
    if (watch) {
      setActivePOModalProduct(watch);
    }
  };

  return (
    <div
      id="ai-insights-panel"
      className="p-5 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] relative overflow-hidden"
    >
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#C86D51]" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F7EBE8] border border-[#ECD1C8] flex items-center justify-center text-[#C86D51]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#232220]">
              Proactive AI Intelligence & Optimization
            </h3>
            <p className="text-xs text-[#7A756D]">
              Pattern recognition across 12,400 multi-node demand signals
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('simulator')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A74E35] transition-colors"
        >
          <span>What-If Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Insight Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3">
        {/* Insight 1 */}
        <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#ECE5DA] hover:border-[#DDD6CA] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#C86D51] mb-1.5">
              <span className="uppercase tracking-wider">Demand Acceleration</span>
              <span className="text-[#8A8479] font-normal">Pune Hub</span>
            </div>
            <p className="text-xs text-[#4A463F] leading-relaxed">
              <strong className="text-[#232220]">Wireless Earbuds</strong> demand in Pune is outpacing regional projections by <strong>+28%</strong>. Existing stock covers only 5.2 days.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-[#EBE4D8] flex items-center justify-between">
            <span className="text-[11px] text-[#7A756D] font-medium">Protect ₹3.77L rev</span>
            <button
              onClick={() => simulateProductRisk('Wireless Earbuds', 30)}
              className="text-xs font-semibold text-[#C86D51] hover:text-[#A74E35] inline-flex items-center gap-1"
            >
              <span>Test Shock</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#ECE5DA] hover:border-[#DDD6CA] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#9A6218] mb-1.5">
              <span className="uppercase tracking-wider">Supplier Transit Drift</span>
              <span className="text-[#8A8479] font-normal">Bharat Precision</span>
            </div>
            <p className="text-xs text-[#4A463F] leading-relaxed">
              Supplier B average lead time drifted to <strong>14 days</strong> (+4 days). Split order with <strong>Crestline</strong> to ensure ETA of Aug 26.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-[#EBE4D8] flex items-center justify-between">
            <span className="text-[11px] text-[#7A756D] font-medium">Save 4 days</span>
            <button
              onClick={handleApplySwitch}
              className="text-xs font-semibold text-[#9A6218] hover:text-[#7A4B0E] inline-flex items-center gap-1"
            >
              <span>Re-allocate</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#ECE5DA] hover:border-[#DDD6CA] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#2D6649] mb-1.5">
              <span className="uppercase tracking-wider">Capital Reallocation</span>
              <span className="text-[#8A8479] font-normal">Buffer Optimization</span>
            </div>
            <p className="text-xs text-[#4A463F] leading-relaxed">
              Reallocating ₹4.8L tied in slow-moving <strong className="text-[#232220]">Bluetooth Speaker</strong> buffer to <strong className="text-[#232220]">Smart Watch</strong> orders yields +18.4% ROI.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-[#EBE4D8] flex items-center justify-between">
            <span className="text-[11px] text-[#7A756D] font-medium">+18.4% ROI</span>
            <button
              onClick={handleCreateSmartWatchPO}
              className="text-xs font-semibold text-[#2D6649] hover:text-[#1E4D35] inline-flex items-center gap-1"
            >
              <span>Order Watch</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
