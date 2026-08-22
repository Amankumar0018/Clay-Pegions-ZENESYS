import React from 'react';
import { X, CheckCircle2, Clock, Truck, ShieldAlert, ArrowRight, CornerDownRight, PlaneTakeoff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderDetailDrawer: React.FC = () => {
  const {
    activeOrderDetail,
    setActiveOrderDetail,
    expediteOrder,
    rerouteOrder,
  } = useApp();

  if (!activeOrderDetail) return null;

  const lifecycleStages = [
    { key: 'created', label: 'Created', completed: activeOrderDetail.lifecycle.created },
    { key: 'processing', label: 'Processing', completed: activeOrderDetail.lifecycle.processing },
    { key: 'shipped', label: 'Shipped', completed: activeOrderDetail.lifecycle.shipped },
    { key: 'inTransit', label: 'In Transit', completed: activeOrderDetail.lifecycle.inTransit },
    { key: 'delivered', label: 'Delivered', completed: activeOrderDetail.lifecycle.delivered },
  ];

  return (
    <div
      id="order-drawer-backdrop"
      className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-50 flex justify-end animate-in fade-in duration-150"
      onClick={() => setActiveOrderDetail(null)}
    >
      <div
        id="order-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E0E2DC] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[#EAEAE6] flex items-center justify-between bg-[#FAF9F7]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#1C1D1F]">
                  ORDER {activeOrderDetail.orderNumber}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    activeOrderDetail.status === 'Delayed'
                      ? 'bg-[#BE123C]/10 text-[#BE123C]'
                      : activeOrderDetail.status === 'In Transit'
                      ? 'bg-[#0F5B5C]/10 text-[#0F5B5C]'
                      : activeOrderDetail.status === 'Delivered'
                      ? 'bg-[#15803D]/10 text-[#15803D]'
                      : 'bg-[#EDEDE8] text-[#555]'
                  }`}
                >
                  {activeOrderDetail.status}
                </span>
              </div>
              <p className="text-xs text-[#71746E] mt-0.5">
                Created {activeOrderDetail.createdDate}
              </p>
            </div>
            <button
              onClick={() => setActiveOrderDetail(null)}
              className="p-1.5 text-[#888B84] hover:text-[#1C1D1F] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-6">
            {/* Product & Qty Summary */}
            <div className="p-3.5 bg-[#F6F6F2] rounded-lg border border-[#E4E5DF]">
              <div className="text-xs font-semibold text-[#1C1D1F]">
                {activeOrderDetail.productName}
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-[#555850]">
                <span>Quantity: <strong>{activeOrderDetail.quantity} units</strong></span>
                <span>Total Value: <strong className="font-mono text-[#1C1D1F]">₹{activeOrderDetail.totalValue.toLocaleString()}</strong></span>
              </div>
              <div className="flex justify-between items-center mt-1 text-[11px] text-[#71746E]">
                <span>Supplier: {activeOrderDetail.supplierName}</span>
                <span>Destination: {activeOrderDetail.warehouse} Hub</span>
              </div>
            </div>

            {/* Lifecycle Stages */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71746E] mb-3">
                Lifecycle Progression
              </h4>
              <div className="relative pl-6 space-y-4 border-l-2 border-[#E5E6E0] ml-2">
                {lifecycleStages.map((stage) => (
                  <div key={stage.key} className="relative">
                    <div
                      className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        stage.completed
                          ? 'bg-[#0F5B5C] border-[#0F5B5C] text-white'
                          : 'bg-white border-[#D5D7D2] text-transparent'
                      }`}
                    >
                      {stage.completed && <CheckCircle2 className="w-2.5 h-2.5" />}
                    </div>
                    <p className={`text-xs font-semibold ${stage.completed ? 'text-[#1C1D1F]' : 'text-[#888B84]'}`}>
                      {stage.label}
                    </p>
                    <p className="text-[10px] text-[#888B84]">
                      {stage.completed ? 'Stage verified and logged' : 'Pending prior phase signoff'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics & Tracking */}
            <div className="p-3.5 bg-white border border-[#E0E2DC] rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#71746E]">
                <span>Carrier:</span>
                <span className="font-semibold text-[#1C1D1F]">{activeOrderDetail.carrier}</span>
              </div>
              <div className="flex justify-between items-center text-[#71746E]">
                <span>Tracking Number:</span>
                <span className="font-mono text-[#0F5B5C] font-semibold">{activeOrderDetail.trackingNumber}</span>
              </div>
              <div className="flex justify-between items-center text-[#71746E]">
                <span>Expected Arrival:</span>
                <span className="font-semibold text-[#1C1D1F]">{activeOrderDetail.expectedDelivery}</span>
              </div>
            </div>

            {/* Delay Alert if any */}
            {activeOrderDetail.status === 'Delayed' && (
              <div className="p-3.5 bg-[#BE123C]/5 border border-[#BE123C]/20 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#BE123C]">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Fulfillment Delay Detected</span>
                </div>
                <p className="text-xs text-[#555850] leading-relaxed">
                  {activeOrderDetail.delayReason}
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => expediteOrder(activeOrderDetail.id)}
                    className="w-full py-1.5 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PlaneTakeoff className="w-3.5 h-3.5" />
                    <span>Expedite via Air Express</span>
                  </button>
                  <button
                    onClick={() => rerouteOrder(activeOrderDetail.id, 'Supplier C (Crestline Logistics)')}
                    className="w-full py-1.5 bg-white hover:bg-[#F6F6F2] border border-[#D5D7D2] text-xs font-semibold text-[#1C1D1F] rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CornerDownRight className="w-3.5 h-3.5 text-[#0F5B5C]" />
                    <span>Reroute Lot to Supplier C</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAEAE6] bg-[#FAF9F7]">
          <button
            onClick={() => setActiveOrderDetail(null)}
            className="w-full py-2 text-xs font-semibold text-[#555850] hover:text-[#1C1D1F] border border-[#D5D7D2] bg-white rounded-md transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
