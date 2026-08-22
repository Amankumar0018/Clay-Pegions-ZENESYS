import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { SUPPLIER_PERFORMANCE_SUMMARY } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const SupplierPerformanceCard: React.FC = () => {
  const { suppliers, setActiveSupplierDetail, setCurrentPage } = useApp();

  const handleSupplierClick = (supplierCode: string) => {
    const fullSup = suppliers.find(
      (s) => s.code.toLowerCase() === supplierCode.toLowerCase() || s.name.includes(supplierCode)
    );
    if (fullSup) {
      setActiveSupplierDetail(fullSup);
    }
  };

  return (
    <div
      id="supplier-performance-card"
      className="p-5 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
        <div>
          <h3 className="text-sm font-semibold text-[#232220]">
            Supplier Reliability & Lead Time Index
          </h3>
          <p className="text-xs text-[#7A756D] mt-0.5">
            4 Tier-1 contract manufacturers & logistics partners monitored
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('procurement')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A74E35] transition-colors"
        >
          <span>Procurement</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Supplier Grid / List */}
      <div className="py-2 space-y-2.5">
        {SUPPLIER_PERFORMANCE_SUMMARY.map((sup) => (
          <div
            key={sup.id}
            onClick={() => handleSupplierClick(sup.code)}
            className="group cursor-pointer p-3 rounded-lg border border-[#ECE5DA] bg-[#FAF8F5]/80 hover:bg-[#F5F1EA] hover:border-[#DDD6CA] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2DDD3] flex items-center justify-center text-xs font-bold text-[#232220]">
                {sup.code.replace('Supplier ', '')}
              </div>
              <div>
                <div className="text-xs font-semibold text-[#232220] group-hover:text-[#C86D51] transition-colors">
                  {sup.name}
                </div>
                <div className="text-[11px] text-[#7A756D]">
                  {sup.code} &bull; {sup.activeOrders} active purchase orders
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] text-[#8A8479] block">On-Time</span>
                <span className="font-bold text-[#232220] font-tabular-nums">
                  {sup.onTimeRate}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A8479] block">Lead Time</span>
                <span className="font-bold text-[#232220] font-tabular-nums">
                  {sup.leadTimeReliability}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A8479] block">Quality</span>
                <span className="font-bold text-[#232220] font-tabular-nums">
                  {sup.qualityScore}%
                </span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    sup.riskLevel === 'Low'
                      ? 'bg-[#EDF5F0] text-[#2D6649]'
                      : sup.riskLevel === 'Medium'
                      ? 'bg-[#FDF6EC] text-[#9A6218]'
                      : 'bg-[#FDF2F0] text-[#9E3529]'
                  }`}
                >
                  {sup.riskLevel} Risk
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer advice */}
      <div className="mt-1 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] text-[#7A756D]">
        <div className="flex items-center gap-1 text-[#9A6218]">
          <AlertTriangle className="w-3 h-3" />
          <span>Supplier B shows 4-day average lead time drift this month</span>
        </div>
        <span className="text-[#8A8479]">Click for scorecard</span>
      </div>
    </div>
  );
};
