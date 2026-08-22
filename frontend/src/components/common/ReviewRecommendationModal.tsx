import React from 'react';
import { X, CheckCircle2, ShieldAlert, ArrowRight, TrendingUp, Boxes, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttentionItem } from '../../types';

export const ReviewRecommendationModal: React.FC = () => {
  const {
    activeRecommendationModal,
    setActiveRecommendationModal,
    setActivePOModalProduct,
    products,
    setCurrentPage,
    addToast,
  } = useApp();

  if (!activeRecommendationModal) return null;

  const matchedProduct = products.find((p) =>
    p.name.toLowerCase().includes(activeRecommendationModal.productName.toLowerCase())
  ) || products[0];

  const handleAction = () => {
    if (activeRecommendationModal.number === '01') {
      // Open PO Modal
      setActiveRecommendationModal(null);
      setActivePOModalProduct(matchedProduct);
    } else if (activeRecommendationModal.number === '02') {
      // Go to suppliers
      setActiveRecommendationModal(null);
      setCurrentPage('suppliers');
      addToast('Supplier Comparison Loaded', 'Reviewing alternative suppliers for Smart Watch Series 4.', 'info');
    } else {
      // Reduce purchase
      setActiveRecommendationModal(null);
      addToast('Purchase Plan Updated', 'Bluetooth Speaker procurement reduced by 450 units. ₹72,000 capital conserved.', 'success');
    }
  };

  return (
    <div
      id="review-recommendation-backdrop"
      className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={() => setActiveRecommendationModal(null)}
    >
      <div
        id="review-recommendation-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#E0E2DC] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAEAE6] flex items-center justify-between bg-[#FAF9F7]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-[#1C1D1F] text-white px-2 py-0.5 rounded">
              DECISION #{activeRecommendationModal.number}
            </span>
            <h2 className="text-sm font-bold text-[#1C1D1F]">
              Recommendation Review
            </h2>
          </div>
          <button
            onClick={() => setActiveRecommendationModal(null)}
            className="p-1 text-[#888B84] hover:text-[#1C1D1F] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div>
            <div className="text-xs font-semibold text-[#0F5B5C] uppercase tracking-wider">
              {activeRecommendationModal.category}
            </div>
            <h3 className="text-lg font-bold text-[#1C1D1F] mt-0.5">
              {activeRecommendationModal.productName}
            </h3>
            <p className="text-xs text-[#BE123C] font-semibold mt-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              {activeRecommendationModal.issue}
            </p>
          </div>

          {/* Key Evidence & Data Points */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#F8F8F5] rounded-lg border border-[#E5E6E0] text-xs">
            <div>
              <span className="text-[11px] text-[#71746E] block">Current Stock</span>
              <span className="font-mono font-bold text-sm text-[#1C1D1F]">
                {activeRecommendationModal.currentInventory} units
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#71746E] block">Forecast Demand</span>
              <span className="font-mono font-bold text-sm text-[#1C1D1F]">
                {activeRecommendationModal.forecastDemand} units
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#71746E] block">Revenue Protected</span>
              <span className="font-mono font-bold text-sm text-[#15803D]">
                ₹{activeRecommendationModal.revenueProtected.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Explainability Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1C1D1F] uppercase tracking-wider text-[11px]">
              Why NEXUS Recommends This Decision
            </h4>
            <div className="text-xs text-[#4A4D46] space-y-2 leading-relaxed bg-white border border-[#EDEDE8] p-3.5 rounded-lg">
              <p>
                • <strong>Runway Analysis:</strong> Depletion rate is currently tracking at ~103 units/day. Without replenishment, stockout is mathematically certain in <strong>6.2 days</strong>.
              </p>
              <p>
                • <strong>Lead Time Constraint:</strong> Primary supplier requires <strong>7 days lead time</strong>. Every day of procurement delay directly results in lost revenue.
              </p>
              <p>
                • <strong>Safety Stock Buffer:</strong> Recommendation includes 300 units statutory buffer to handle peak demand variances.
              </p>
            </div>
          </div>

          {/* Action Plan */}
          <div className="p-3.5 bg-[#0F5B5C]/5 border border-[#0F5B5C]/20 rounded-lg">
            <div className="text-[11px] font-bold text-[#0F5B5C] uppercase tracking-wider">
              Recommended Action Plan
            </div>
            <p className="text-xs font-semibold text-[#1C1D1F] mt-1">
              {activeRecommendationModal.recommendedAction}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EAEAE6]">
            <button
              onClick={() => setActiveRecommendationModal(null)}
              className="px-4 py-2 text-xs font-medium text-[#71746E] hover:text-[#1C1D1F]"
            >
              Dismiss
            </button>
            <button
              id="execute-modal-recommendation-btn"
              onClick={handleAction}
              className="px-4 py-2 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Accept & Proceed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
