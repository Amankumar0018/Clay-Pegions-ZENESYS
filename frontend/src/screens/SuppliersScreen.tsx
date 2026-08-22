import React from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  PhoneCall,
  Mail,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPLIERS } from '../data/mockData';

export const SuppliersScreen: React.FC = () => {
  const {
    setActiveSupplierDetail,
    setActivePOModalProduct,
    products,
  } = useApp();

  return (
    <div id="suppliers-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
            Suppliers
          </h1>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            Compare vendors using performance, cost and reliability.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#71746E]">
          <span>4 Active Master Service Agreements</span>
        </div>
      </div>

      {/* Supplier Ranking Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPLIERS.map((sup, idx) => (
          <div
            key={sup.id}
            id={`supplier-card-${sup.id}`}
            className="p-5 bg-white rounded-xl border border-[#E0E2DC] hover:border-[#CCD0C7] shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0F5B5C]/10 text-[#0F5B5C] flex items-center justify-center font-bold text-xs">
                    {sup.code}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1D1F]">
                      {sup.name}
                    </h3>
                    <p className="text-[11px] text-[#71746E]">{sup.location}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    sup.status === 'Recommended'
                      ? 'bg-[#0F5B5C] text-white'
                      : sup.status === 'High reliability'
                      ? 'bg-[#15803D]/10 text-[#15803D]'
                      : sup.status === 'Alternative'
                      ? 'bg-[#B45309]/10 text-[#B45309]'
                      : 'bg-[#EDEDE8] text-[#555]'
                  }`}
                >
                  {sup.status}
                </span>
              </div>

              {/* Focus Products */}
              <div className="mt-3 text-xs text-[#555850]">
                <strong>Primary Categories:</strong> {sup.productFocus}
              </div>

              {/* Rationale Snippet */}
              <div className="mt-2.5 p-2.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6] text-xs text-[#4A4D46] leading-relaxed italic">
                &quot;{sup.explanation}&quot;
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 mt-4 text-center border-t border-[#F0F0EB] pt-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#71746E] block">On-Time</span>
                  <span className="font-mono font-bold text-sm text-[#0F5B5C] mt-0.5 block">
                    {sup.onTimeDeliveryRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#71746E] block">Lead Time</span>
                  <span className="font-mono font-bold text-sm text-[#1C1D1F] mt-0.5 block">
                    {sup.leadTimeDays}d
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#71746E] block">Accuracy</span>
                  <span className="font-mono font-bold text-sm text-[#15803D] mt-0.5 block">
                    {sup.orderAccuracyRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#71746E] block">Unit Price</span>
                  <span className="font-mono font-bold text-sm text-[#1C1D1F] mt-0.5 block">
                    ₹{sup.unitPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F0F0EB] gap-2">
              <span className="text-[11px] text-[#71746E]">
                {sup.activeOrdersCount} active orders in flight
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSupplierDetail(sup)}
                  className="px-3 py-1.5 text-xs text-[#555850] hover:text-[#1C1D1F] hover:bg-[#F4F4F1] rounded font-medium transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setActivePOModalProduct(products[0]);
                  }}
                  className="px-3 py-1.5 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                >
                  <span>Draft PO</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
