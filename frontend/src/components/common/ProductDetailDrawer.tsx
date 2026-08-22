import React from 'react';
import {
  X,
  Package,
  TrendingUp,
  Building2,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Truck,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductDetailDrawer: React.FC = () => {
  const {
    activeProductDetail,
    setActiveProductDetail,
    setActivePOModalProduct,
    setCurrentPage,
    applyPreset,
    orders,
    suppliers,
  } = useApp();

  if (!activeProductDetail) return null;

  const product = activeProductDetail;
  const relatedOrders = orders.filter(
    (o) => o.productName.toLowerCase() === product.name.toLowerCase()
  );
  const primarySupObj = suppliers.find((s) => s.name === product.primarySupplier) || suppliers[0];

  const getRiskBadge = (risk: string) => {
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
    <div
      id="product-drawer-backdrop"
      className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-50 flex justify-end animate-in fade-in duration-150"
      onClick={() => setActiveProductDetail(null)}
    >
      <div
        id="product-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-[#E0E2DC] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[#EAEAE6] flex items-center justify-between bg-[#FAF9F7]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0F5B5C]/10 text-[#0F5B5C] flex items-center justify-center font-bold text-xs">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#71746E] font-bold">
                    {product.sku}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRiskBadge(
                      product.risk
                    )}`}
                  >
                    {product.risk} Risk
                  </span>
                </div>
                <h2 className="text-sm font-bold text-[#1C1D1F] mt-0.5">
                  {product.name}
                </h2>
              </div>
            </div>

            <button
              onClick={() => setActiveProductDetail(null)}
              className="p-1.5 text-[#888B84] hover:text-[#1C1D1F] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-6">
            {/* AI Strategic Recommendation Box */}
            <div className="p-4 bg-[#0F5B5C]/5 border border-[#0F5B5C]/20 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F5B5C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  NEXUS Prescriptive Guidance
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#0F5B5C]">
                  {product.recommendedPurchaseQty > 0 ? `PO Target: ${product.recommendedPurchaseQty} units` : 'Buffer Optimal'}
                </span>
              </div>
              <p className="text-xs text-[#1C1D1F] leading-relaxed">
                {product.risk === 'Critical'
                  ? `Order ${product.recommendedPurchaseQty} units immediately from ${product.primarySupplier} to maintain a 14-day safety buffer before current stock exhausts in ${product.daysCover} days.`
                  : product.risk === 'Overstock'
                  ? `Current inventory exceeds 45-day consumption velocity. Pause next purchase cycle to avoid ₹64,000 capital lockup.`
                  : `Velocity is steady (+${product.trend}%). Safety stock levels are nominal across ${product.warehouse} Hub.`}
              </p>
              {product.recommendedPurchaseQty > 0 && (
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => {
                      setActiveProductDetail(null);
                      setActivePOModalProduct(product);
                    }}
                    className="w-full py-1.5 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Draft Purchase Order</span>
                  </button>
                </div>
              )}
            </div>

            {/* Inventory Status Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71746E] mb-2.5">
                Inventory Positions & Runway
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-white border border-[#E5E6E0] rounded-lg">
                  <span className="text-[11px] text-[#71746E] block">On-Hand Stock</span>
                  <span className="text-base font-bold font-mono text-[#1C1D1F]">
                    {product.currentStock.toLocaleString()} units
                  </span>
                  <span className="text-[10px] text-[#71746E] block mt-0.5">
                    {product.warehouse} Hub
                  </span>
                </div>

                <div className="p-3 bg-white border border-[#E5E6E0] rounded-lg">
                  <span className="text-[11px] text-[#71746E] block">Days of Runway</span>
                  <span
                    className={`text-base font-bold font-mono ${
                      product.daysCover < 8
                        ? 'text-[#BE123C]'
                        : product.daysCover < 15
                        ? 'text-[#B45309]'
                        : 'text-[#15803D]'
                    }`}
                  >
                    {product.daysCover} days
                  </span>
                  <span className="text-[10px] text-[#71746E] block mt-0.5">
                    Lead time: {product.supplierLeadTimeDays}d
                  </span>
                </div>

                <div className="p-3 bg-white border border-[#E5E6E0] rounded-lg">
                  <span className="text-[11px] text-[#71746E] block">Safety Stock Threshold</span>
                  <span className="text-base font-bold font-mono text-[#1C1D1F]">
                    {product.safetyStock} units
                  </span>
                  <span className="text-[10px] text-[#71746E] block mt-0.5">
                    Reorder at {product.reorderPoint} units
                  </span>
                </div>

                <div className="p-3 bg-white border border-[#E5E6E0] rounded-lg">
                  <span className="text-[11px] text-[#71746E] block">Forecast 30D Velocity</span>
                  <span className="text-base font-bold font-mono text-[#0F5B5C]">
                    {product.forecastDemand.toLocaleString()} units
                  </span>
                  <span className="text-[10px] text-[#15803D] font-semibold block mt-0.5">
                    +{product.trend}% growth rate
                  </span>
                </div>
              </div>
            </div>

            {/* Supplier & Economics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71746E] mb-2.5">
                Primary Supplier & Economics
              </h4>
              <div className="p-3.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#71746E]">Preferred Supplier:</span>
                  <span className="font-semibold text-[#1C1D1F]">{product.primarySupplier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#71746E]">Contract Unit Cost:</span>
                  <span className="font-mono font-semibold text-[#1C1D1F]">₹{product.unitCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#71746E]">Retail Benchmark Price:</span>
                  <span className="font-mono font-semibold text-[#1C1D1F]">₹{product.sellingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#71746E]">SLA On-Time Reliability:</span>
                  <span className="font-mono font-semibold text-[#0F5B5C]">{primarySupObj.reliabilityRate}%</span>
                </div>
              </div>
            </div>

            {/* Recent Orders in Flight */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71746E] mb-2.5">
                Orders In Flight ({relatedOrders.length})
              </h4>
              {relatedOrders.length > 0 ? (
                <div className="space-y-2">
                  {relatedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 bg-white border border-[#E5E6E0] rounded-lg flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-[#1C1D1F]">
                          {ord.orderNumber}
                        </div>
                        <div className="text-[11px] text-[#71746E] mt-0.5">
                          {ord.quantity} units · ETA {ord.expectedDelivery}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          ord.status === 'Delayed'
                            ? 'bg-[#BE123C]/10 text-[#BE123C]'
                            : ord.status === 'In Transit'
                            ? 'bg-[#0F5B5C]/10 text-[#0F5B5C]'
                            : 'bg-[#15803D]/10 text-[#15803D]'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] text-xs text-[#71746E] text-center">
                  No active POs in flight for this SKU.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EAEAE6] bg-[#FAF9F7] flex items-center gap-2.5">
          <button
            onClick={() => {
              setActiveProductDetail(null);
              applyPreset('Demand Spike');
              setCurrentPage('simulator');
            }}
            className="flex-1 py-2 text-xs font-semibold text-[#555850] hover:text-[#1C1D1F] border border-[#D5D7D2] bg-white rounded-md transition-colors flex items-center justify-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F5B5C]" />
            <span>Simulate Risk</span>
          </button>

          <button
            onClick={() => {
              setActiveProductDetail(null);
              setCurrentPage('demand-forecast');
            }}
            className="flex-1 py-2 text-xs font-semibold text-white bg-[#1C1D1F] hover:bg-[#2C2E33] rounded-md transition-colors flex items-center justify-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Open Forecast</span>
          </button>
        </div>
      </div>
    </div>
  );
};
