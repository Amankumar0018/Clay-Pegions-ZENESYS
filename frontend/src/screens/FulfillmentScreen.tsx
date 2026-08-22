import React from 'react';
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlaneTakeoff,
  CornerDownRight,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FulfillmentScreen: React.FC = () => {
  const {
    orders,
    setActiveOrderDetail,
    expediteOrder,
    rerouteOrder,
  } = useApp();

  const delayedOrders = orders.filter((o) => o.status === 'Delayed');

  return (
    <div id="fulfillment-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
            Fulfillment
          </h1>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            See where orders are slowing down.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#71746E]">
          <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
          <span>Carrier GPS feeds active</span>
        </div>
      </div>

      {/* Fulfillment Overview Metrics (4 Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-xl border border-[#E0E2DC]">
          <div className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider">
            Orders in Transit
          </div>
          <div className="text-xl font-bold font-mono text-[#0F5B5C] mt-1">
            124
          </div>
          <div className="text-[11px] text-[#71746E] mt-0.5">
            Across 14 route vectors
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E0E2DC]">
          <div className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider">
            Delayed Orders
          </div>
          <div className="text-xl font-bold font-mono text-[#BE123C] mt-1">
            12
          </div>
          <div className="text-[11px] text-[#BE123C] font-medium mt-0.5">
            +3.2 days avg delay
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E0E2DC]">
          <div className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider">
            SLA at Risk
          </div>
          <div className="text-xl font-bold font-mono text-[#B45309] mt-1">
            8
          </div>
          <div className="text-[11px] text-[#71746E] mt-0.5">
            Breach within 48 hours
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E0E2DC]">
          <div className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider">
            Network On-Time Rate
          </div>
          <div className="text-xl font-bold font-mono text-[#15803D] mt-1">
            94.2%
          </div>
          <div className="text-[11px] text-[#15803D] font-medium mt-0.5">
            ↑ 1.4% vs last cycle
          </div>
        </div>
      </div>

      {/* Visual Fulfillment Timeline & Bottlenecks */}
      <div className="p-5 bg-white rounded-xl border border-[#E0E2DC] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#1C1D1F]">
              Fulfillment Pipeline & Stage Latency
            </h3>
            <p className="text-xs text-[#71746E] mt-0.5">
              Live volume progression and average cycle duration by milestone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {/* Stage 1: Order Created */}
          <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] relative">
            <div className="text-[10px] font-semibold text-[#888B84] uppercase">Stage 01</div>
            <div className="text-xs font-bold text-[#1C1D1F] mt-1">Order Created</div>
            <div className="text-lg font-mono font-bold text-[#1C1D1F] mt-1">18</div>
            <div className="text-[10px] text-[#71746E] mt-0.5">Avg: 0.4 days</div>
            <div className="mt-2 text-[10px] text-[#15803D] font-medium">Normal flow</div>
          </div>

          {/* Stage 2: Processing */}
          <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6]">
            <div className="text-[10px] font-semibold text-[#888B84] uppercase">Stage 02</div>
            <div className="text-xs font-bold text-[#1C1D1F] mt-1">Processing</div>
            <div className="text-lg font-mono font-bold text-[#1C1D1F] mt-1">26</div>
            <div className="text-[10px] text-[#71746E] mt-0.5">Avg: 1.2 days</div>
            <div className="mt-2 text-[10px] text-[#15803D] font-medium">Normal flow</div>
          </div>

          {/* Stage 3: Shipped (Bottleneck!) */}
          <div className="p-3 bg-[#BE123C]/5 rounded-lg border-2 border-[#BE123C]/30 relative">
            <div className="text-[10px] font-bold text-[#BE123C] uppercase flex justify-between items-center">
              <span>Stage 03</span>
              <span className="text-[9px] bg-[#BE123C] text-white px-1.5 rounded">Delay Hub</span>
            </div>
            <div className="text-xs font-bold text-[#1C1D1F] mt-1">Shipped & Customs</div>
            <div className="text-lg font-mono font-bold text-[#BE123C] mt-1">42</div>
            <div className="text-[10px] text-[#71746E] mt-0.5">Avg: 3.8 days (+1.8d)</div>
            <div className="mt-2 text-[10px] text-[#BE123C] font-semibold">JNPT Terminal Hold</div>
          </div>

          {/* Stage 4: In Transit */}
          <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6]">
            <div className="text-[10px] font-semibold text-[#888B84] uppercase">Stage 04</div>
            <div className="text-xs font-bold text-[#1C1D1F] mt-1">In Transit</div>
            <div className="text-lg font-mono font-bold text-[#0F5B5C] mt-1">82</div>
            <div className="text-[10px] text-[#71746E] mt-0.5">Avg: 2.1 days</div>
            <div className="mt-2 text-[10px] text-[#15803D] font-medium">Air & Express on SLA</div>
          </div>

          {/* Stage 5: Delivered */}
          <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6]">
            <div className="text-[10px] font-semibold text-[#888B84] uppercase">Stage 05</div>
            <div className="text-xs font-bold text-[#1C1D1F] mt-1">Delivered (MTD)</div>
            <div className="text-lg font-mono font-bold text-[#15803D] mt-1">418</div>
            <div className="text-[10px] text-[#71746E] mt-0.5">99.1% POD accuracy</div>
            <div className="mt-2 text-[10px] text-[#15803D] font-medium">Clear</div>
          </div>
        </div>
      </div>

      {/* Delayed Shipments Resolution Desk */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1C1D1F]">Delayed shipments</h2>
            <p className="text-xs text-[#71746E] mt-0.5">
              Consignments requiring immediate intervention or carrier escalation.
            </p>
          </div>
          <span className="text-xs font-mono text-[#BE123C] font-semibold">
            {delayedOrders.length} active delays flagged
          </span>
        </div>

        <div className="space-y-3">
          {delayedOrders.map((ord) => (
            <div
              key={ord.id}
              id={`delayed-shipment-${ord.id}`}
              className="p-4 bg-white rounded-xl border border-[#E0E2DC] hover:border-[#CCD0C7] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F0EB] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs bg-[#BE123C]/10 text-[#BE123C] px-2 py-0.5 rounded">
                    {ord.orderNumber}
                  </span>
                  <span className="text-xs font-bold text-[#1C1D1F]">
                    {ord.productName} ({ord.quantity} units)
                  </span>
                  <span className="text-[11px] text-[#71746E]">
                    · {ord.warehouse} Hub
                  </span>
                </div>
                <div className="text-xs text-[#71746E]">
                  Carrier: <strong>{ord.carrier}</strong> ({ord.trackingNumber})
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-[#71746E] block">Reported Reason</span>
                  <span className="text-[#BE123C] font-medium mt-0.5 block">
                    {ord.delayReason}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#71746E] block">Customer Impact</span>
                  <span className="text-[#1C1D1F] mt-0.5 block font-medium">
                    {ord.productName.includes('Smart Watch') ? '37 customer orders delayed' : '14 distribution slots queued'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#71746E] block">Recommended Action</span>
                  <span className="text-[#0F5B5C] font-semibold mt-0.5 block">
                    {ord.mitigationSuggestion || 'Expedite dispatch with priority air partner'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => setActiveOrderDetail(ord)}
                  className="px-3 py-1.5 text-xs text-[#555850] hover:text-[#1C1D1F] hover:bg-[#F4F4F1] rounded transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => expediteOrder(ord.id)}
                  className="px-3 py-1.5 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                >
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                  <span>Expedite Shipment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
