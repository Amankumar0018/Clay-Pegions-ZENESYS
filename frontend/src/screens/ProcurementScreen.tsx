import React, { useState } from 'react';
import {
  ShoppingBag,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Info,
  Clock,
  Check,
  Edit3,
  XCircle,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPLIERS } from '../data/mockData';

interface ProcurementRecommendation {
  id: string;
  productName: string;
  sku: string;
  supplierName: string;
  supplierCode: string;
  quantity: number;
  expectedArrival: string;
  unitCost: number;
  totalCost: number;
  reason: string;
  aiExplanation: string;
  status: 'Pending' | 'Approved' | 'Dismissed';
}

export const ProcurementScreen: React.FC = () => {
  const {
    products,
    setActivePOModalProduct,
    setActiveSupplierDetail,
    setActiveProductDetail,
    createPurchaseOrder,
    addToast,
  } = useApp();

  const [recommendations, setRecommendations] = useState<ProcurementRecommendation[]>([
    {
      id: 'rec-1',
      productName: 'Wireless Earbuds',
      sku: 'SKU-WE-1029',
      supplierName: 'Apex Components Ltd',
      supplierCode: 'Supplier A',
      quantity: 1510,
      expectedArrival: 'Aug 28, 2026',
      unitCost: 1240,
      totalCost: 1872400,
      reason: 'Stockout projected in 6.2 days. High regional demand (+24.5%).',
      aiExplanation: 'Order 1,510 units now to maintain a 14-day safety buffer before Pune Hub exhausts.',
      status: 'Pending',
    },
    {
      id: 'rec-2',
      productName: 'Smart Watch Series 4',
      sku: 'SKU-SW-4011',
      supplierName: 'Crestline Logistics & Supply',
      supplierCode: 'Supplier C',
      quantity: 820,
      expectedArrival: 'Aug 26, 2026',
      unitCost: 2150,
      totalCost: 1763000,
      reason: 'Supplier B port delay (+4 days). Switch to Supplier C to protect 83 customer orders.',
      aiExplanation: 'Order 820 units via Supplier C to bypass port customs congestion and maintain 18-day runway.',
      status: 'Pending',
    },
    {
      id: 'rec-3',
      productName: 'Fast Charging Dock 65W',
      sku: 'SKU-CD-6502',
      supplierName: 'Apex Components Ltd',
      supplierCode: 'Supplier A',
      quantity: 450,
      expectedArrival: 'Aug 29, 2026',
      unitCost: 890,
      totalCost: 400500,
      reason: 'Reaching reorder threshold (380 units remaining in Mumbai DC).',
      aiExplanation: 'Order 450 units now to lock in volume Tier 1 pricing and align with standard 6-day lead time.',
      status: 'Pending',
    },
  ]);

  const [activeTabProduct, setActiveTabProduct] = useState('Wireless Earbuds');
  const selectedProduct =
    products.find((p) => p.name === activeTabProduct) || products[0];

  const handleApproveRec = (rec: ProcurementRecommendation) => {
    createPurchaseOrder(rec.productName, rec.supplierName, rec.quantity, 'Pune');
    setRecommendations((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'Approved' } : r))
    );
  };

  const handleDismissRec = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'Dismissed' } : r))
    );
    addToast('Recommendation Dismissed', 'Procurement recommendation archived.', 'info');
  };

  return (
    <div id="procurement-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
            Procurement
          </h1>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            Turn demand signals and supplier intelligence into proactive purchasing decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePOModalProduct(selectedProduct)}
            className="px-4 py-2 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Generate Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Recommended Purchases Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0F5B5C] text-white">
                Action Ledger
              </span>
              <h2 className="text-base font-bold text-[#1C1D1F]">
                Recommended purchases
              </h2>
            </div>
            <p className="text-xs text-[#71746E] mt-0.5">
              Prescriptive purchase orders ready for 1-click approval based on current runway and lead times.
            </p>
          </div>
          <span className="text-xs font-mono text-[#0F5B5C] font-semibold">
            {recommendations.filter((r) => r.status === 'Pending').length} pending actions
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              id={`rec-card-${rec.id}`}
              className={`p-5 bg-white rounded-xl border transition-all space-y-4 ${
                rec.status === 'Approved'
                  ? 'border-[#15803D]/40 bg-[#15803D]/2 opacity-75'
                  : rec.status === 'Dismissed'
                  ? 'border-[#E0E2DC] opacity-50'
                  : 'border-[#E0E2DC] hover:border-[#CCD0C7] shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F0EB] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold bg-[#FAF9F5] text-[#1C1D1F] px-2 py-0.5 rounded border border-[#E5E6E0]">
                    {rec.sku}
                  </span>
                  <h3 className="text-sm font-bold text-[#1C1D1F]">
                    {rec.productName}
                  </h3>
                  <span className="text-xs text-[#71746E]">
                    via <strong>{rec.supplierName}</strong> ({rec.supplierCode})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-[#71746E]">Expected Arrival:</span>
                  <span className="font-semibold text-[#1C1D1F] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0F5B5C]" />
                    {rec.expectedArrival}
                  </span>
                </div>
              </div>

              {/* Data & Financial Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6]">
                  <span className="text-[11px] text-[#71746E] block">Recommended Quantity</span>
                  <span className="font-mono font-bold text-sm text-[#0F5B5C] mt-0.5 block">
                    {rec.quantity.toLocaleString()} units
                  </span>
                </div>

                <div className="p-2.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6]">
                  <span className="text-[11px] text-[#71746E] block">Estimated Total Cost</span>
                  <span className="font-mono font-bold text-sm text-[#1C1D1F] mt-0.5 block">
                    ₹{(rec.totalCost / 100000).toFixed(2)}L
                  </span>
                  <span className="text-[10px] text-[#71746E]">₹{rec.unitCost}/unit</span>
                </div>

                <div className="p-2.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6] sm:col-span-2">
                  <span className="text-[11px] text-[#71746E] block">Operational Reason</span>
                  <span className="text-[#1C1D1F] font-medium mt-0.5 block text-[11px] leading-tight">
                    {rec.reason}
                  </span>
                </div>
              </div>

              {/* AI Explanation Callout */}
              <div className="p-3 bg-[#0F5B5C]/5 rounded-lg border border-[#0F5B5C]/20 flex items-start gap-2.5 text-xs text-[#1C1D1F]">
                <Info className="w-4 h-4 text-[#0F5B5C] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>AI Explanation:</strong> &ldquo;{rec.aiExplanation}&rdquo;
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#71746E]">
                  Status: <strong className={rec.status === 'Approved' ? 'text-[#15803D]' : 'text-[#1C1D1F]'}>{rec.status}</strong>
                </span>

                {rec.status === 'Pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismissRec(rec.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[#71746E] hover:text-[#1C1D1F] rounded transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        const targetProd = products.find((p) => p.name === rec.productName) || products[0];
                        setActivePOModalProduct(targetProd);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-[#F4F4F1] border border-[#D5D7D2] text-[#1C1D1F] text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#71746E]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleApproveRec(rec)}
                      className="px-4 py-1.5 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                ) : rec.status === 'Approved' ? (
                  <span className="text-xs font-semibold text-[#15803D] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Purchase Order Dispatched</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#888B84]">Dismissed from active queue</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supplier Multi-Criteria Evaluation Matrix */}
      <section className="p-6 bg-white rounded-xl border border-[#E0E2DC] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#1C1D1F]">
              Supplier Multi-Criteria Evaluation
            </h3>
            <p className="text-xs text-[#71746E] mt-0.5">
              Ranked on total landed cost, SLA delivery reliability, lead time risk, and order accuracy.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F8F5] border-b border-[#EAEAE6] text-[#71746E] font-semibold">
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Lead Time</th>
                <th className="py-3 px-4 text-right">Reliability</th>
                <th className="py-3 px-4 text-right">Order Accuracy</th>
                <th className="py-3 px-4 text-center">Recommendation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EB]">
              {SUPPLIERS.map((sup) => (
                <tr
                  key={sup.id}
                  id={`supplier-comparison-row-${sup.id}`}
                  className={`hover:bg-[#FAF9F7] transition-colors ${
                    sup.status === 'Recommended' ? 'bg-[#0F5B5C]/3' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1C1D1F]">{sup.name}</div>
                    <div className="text-[10px] text-[#71746E]">{sup.location}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#1C1D1F]">
                    ₹{sup.unitPrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#555850]">
                    {sup.leadTimeDays} days
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#0F5B5C]">
                    {sup.reliabilityRate}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#15803D]">
                    {sup.orderAccuracyRate}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
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
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setActiveSupplierDetail(sup)}
                      className="px-2.5 py-1 text-xs text-[#555850] hover:text-[#1C1D1F] hover:bg-[#F4F4F1] rounded transition-colors"
                    >
                      Scorecard
                    </button>
                    <button
                      onClick={() => setActivePOModalProduct(selectedProduct)}
                      className="px-3 py-1 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white rounded text-xs font-semibold transition-colors"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explainability Callout */}
        <div className="p-4 bg-[#F8F8F5] rounded-lg border border-[#E5E6E0] space-y-2 text-xs text-[#4A4D46]">
          <div className="font-semibold text-[#1C1D1F] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0F5B5C]" />
            <span>Why Supplier A is Ranked #1 for {selectedProduct.name}</span>
          </div>
          <p className="leading-relaxed">
            &ldquo;Supplier A offers the best balance of price (₹1,240), lead time (6 days) and historical reliability (94% on-time, 96% accuracy). While Supplier B offers a lower unit price (₹1,190), their current 4-day port transit bottleneck elevates stockout exposure.&rdquo;
          </p>
        </div>
      </section>
    </div>
  );
};
