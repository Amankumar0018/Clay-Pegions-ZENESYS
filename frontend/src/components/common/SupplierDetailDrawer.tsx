import React from 'react';
import { X, Building2, CheckCircle2, ShieldCheck, Mail, MapPin, Package, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupplierDetailDrawer: React.FC = () => {
  const {
    activeSupplierDetail,
    setActiveSupplierDetail,
    setActivePOModalProduct,
    products,
  } = useApp();

  if (!activeSupplierDetail) return null;

  return (
    <div
      id="supplier-drawer-backdrop"
      className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-50 flex justify-end animate-in fade-in duration-150"
      onClick={() => setActiveSupplierDetail(null)}
    >
      <div
        id="supplier-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E0E2DC] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[#EAEAE6] flex items-center justify-between bg-[#FAF9F7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#0F5B5C]/10 text-[#0F5B5C] flex items-center justify-center font-bold text-xs">
                {activeSupplierDetail.code}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1C1D1F]">
                  {activeSupplierDetail.name}
                </h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.2 rounded-full inline-block mt-0.5 ${
                    activeSupplierDetail.status === 'Recommended'
                      ? 'bg-[#0F5B5C] text-white'
                      : activeSupplierDetail.status === 'High reliability'
                      ? 'bg-[#15803D]/10 text-[#15803D]'
                      : 'bg-[#EDEDE8] text-[#555]'
                  }`}
                >
                  {activeSupplierDetail.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveSupplierDetail(null)}
              className="p-1.5 text-[#888B84] hover:text-[#1C1D1F] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Rationale Quote */}
            <div className="p-3.5 bg-[#F6F6F2] rounded-lg border border-[#E4E5DF] text-xs text-[#4A4D46] leading-relaxed">
              <p className="font-semibold text-[#1C1D1F] mb-1">Performance Rationale:</p>
              &quot;{activeSupplierDetail.explanation}&quot;
            </div>

            {/* SLA Metrics Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71746E] mb-2.5">
                Performance Scorecard
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-white border border-[#E5E6E0] rounded-lg">
                  <span className="text-[11px] text-[#71746E] block">On-Time Delivery</span>
                  <span className="text-base font-bold font-mono text-[#0F5B5C]">
                    {activeSupplierDetail.onTimeDeliveryRate}%
                  </span>
                  <div className="w-full bg-[#EAEAE6] h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#0F5B5C] h-full"
                      style={{ width: `${activeSupplierDetail.onTimeDeliveryRate}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#E5E6E0] rounded-lg">
                  <span className="text-[11px] text-[#71746E] block">Order Accuracy</span>
                  <span className="text-base font-bold font-mono text-[#15803D]">
                    {activeSupplierDetail.orderAccuracyRate}%
                  </span>
                  <div className="w-full bg-[#EAEAE6] h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#15803D] h-full"
                      style={{ width: `${activeSupplierDetail.orderAccuracyRate}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#E5E6E0] rounded-lg">
                  <span className="text-[11px] text-[#71746E] block">Average Lead Time</span>
                  <span className="text-base font-bold font-mono text-[#1C1D1F]">
                    {activeSupplierDetail.leadTimeDays} days
                  </span>
                  <span className="text-[10px] text-[#888B84] block mt-0.5">SLA Guaranteed</span>
                </div>

                <div className="p-3 bg-white border border-[#E5E6E0] rounded-lg">
                  <span className="text-[11px] text-[#71746E] block">Benchmark Unit Cost</span>
                  <span className="text-base font-bold font-mono text-[#1C1D1F]">
                    ₹{activeSupplierDetail.unitPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#888B84] block mt-0.5">Volume Tier 1</span>
                </div>
              </div>
            </div>

            {/* Vendor Details */}
            <div className="space-y-2 text-xs border-t border-[#EAEAE6] pt-4">
              <div className="flex items-center gap-2 text-[#60635C]">
                <MapPin className="w-3.5 h-3.5 text-[#888B84]" />
                <span>{activeSupplierDetail.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[#60635C]">
                <Mail className="w-3.5 h-3.5 text-[#888B84]" />
                <span className="font-mono text-[11px]">{activeSupplierDetail.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-[#60635C]">
                <Package className="w-3.5 h-3.5 text-[#888B84]" />
                <span>Active Purchase Orders: <strong>{activeSupplierDetail.activeOrdersCount}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAEAE6] bg-[#FAF9F7]">
          <button
            onClick={() => {
              setActiveSupplierDetail(null);
              setActivePOModalProduct(products[0]);
            }}
            className="w-full py-2 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Create PO with {activeSupplierDetail.code}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
