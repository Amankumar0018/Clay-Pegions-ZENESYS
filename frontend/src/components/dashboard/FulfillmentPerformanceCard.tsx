import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { FULFILLMENT_PERFORMANCE_METRICS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const FulfillmentPerformanceCard: React.FC = () => {
  const { setCurrentPage, expediteOrder, orders, addToast } = useApp();

  const delayedOrders = orders.filter((o) => o.status === 'Delayed');

  return (
    <div
      id="fulfillment-performance-card"
      className="p-5 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#232220]">
              Fulfillment & SLA Health
            </h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EDF5F0] text-[#2D6649] border border-[#D7E9DE]">
              96.4% On-Time
            </span>
          </div>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Real-time tracking of 1,284 dispatches via BlueDart, Delhivery & Bluedart Air
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('fulfillment')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A74E35] transition-colors"
        >
          <span>All Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SLA Metric Pillars */}
      <div className="grid grid-cols-3 gap-2.5 py-3">
        <div className="p-2.5 rounded-lg bg-[#EDF5F0] border border-[#D7E9DE] text-center">
          <div className="flex items-center justify-center gap-1 text-[#2D6649] mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">On-Time</span>
          </div>
          <div className="text-base font-bold text-[#232220] font-tabular-nums">
            96.4%
          </div>
          <div className="text-[10px] text-[#7A756D]">1,238 orders</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#FDF6EC] border border-[#F5E2C4] text-center">
          <div className="flex items-center justify-center gap-1 text-[#9A6218] mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Processing</span>
          </div>
          <div className="text-base font-bold text-[#232220] font-tabular-nums">
            1.4%
          </div>
          <div className="text-[10px] text-[#7A756D]">18 orders</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#FDF2F0] border border-[#F8D4CE] text-center">
          <div className="flex items-center justify-center gap-1 text-[#9E3529] mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Delayed</span>
          </div>
          <div className="text-base font-bold text-[#232220] font-tabular-nums">
            2.2%
          </div>
          <div className="text-[10px] text-[#7A756D]">28 orders</div>
        </div>
      </div>

      {/* Weekly Delivery Reliability Trend */}
      <div className="h-20 w-full pt-1">
        <div className="flex items-center justify-between text-[11px] text-[#8A8479] mb-1.5 px-0.5">
          <span>7-Day Reliability Curve (%)</span>
          <span>Weekly Target: &ge;95.0%</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={FULFILLMENT_PERFORMANCE_METRICS.dailySeries}
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#969085', fontSize: 10 }}
            />
            <YAxis
              domain={[90, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#969085', fontSize: 9 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="bg-[#232220] text-[#FBF9F5] text-xs rounded-lg p-2 shadow-lg border border-[#3A3835]">
                      <div className="font-semibold text-[11px]">{label}</div>
                      <div className="text-[#8AD1A6] text-[11px] mt-0.5">
                        On-Time: {pt.onTime}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="onTime" fill="#C86D51" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Actionable Delayed Orders notification */}
      <div className="mt-2 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[#7A756D] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BA4336] flex-shrink-0 animate-pulse" />
          <span className="truncate">
            {delayedOrders.length} orders need rerouting or carrier expedite
          </span>
        </div>

        {delayedOrders.length > 0 && (
          <button
            onClick={() => {
              expediteOrder(delayedOrders[0].id);
              addToast('Order Expedited', `Carrier re-routed to Express Air for Order #${delayedOrders[0].orderNumber}`, 'success');
            }}
            className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#232220] text-[#FBF9F5] text-[11px] font-medium hover:bg-[#383531] transition-colors"
          >
            <Zap className="w-3 h-3 text-[#E8B86D]" />
            <span>Expedite #{delayedOrders[0].orderNumber.slice(-4)}</span>
          </button>
        )}
      </div>
    </div>
  );
};
