import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';
import { TimePeriod } from '../../types';
import { BUSINESS_PERFORMANCE_DATA } from '../../data/mockData';

interface BusinessPerformanceChartProps {
  selectedPeriod: TimePeriod;
  onPeriodChange?: (period: TimePeriod) => void;
}

type MetricType = 'revenue' | 'orders' | 'aov';

export const BusinessPerformanceChart: React.FC<BusinessPerformanceChartProps> = ({
  selectedPeriod,
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('revenue');

  const data = BUSINESS_PERFORMANCE_DATA[selectedPeriod] || BUSINESS_PERFORMANCE_DATA['30 days'];

  // Metric formatting configurations with warm clay-focused palette
  const metricConfigs = {
    revenue: {
      label: 'Revenue',
      color: '#C86D51',
      gradientId: 'perfRevenueGradient',
      formatY: (val: number) => `₹${(val / 1000).toFixed(0)}k`,
      formatVal: (val: number) => `₹${val.toLocaleString('en-IN')}`,
      total: data.reduce((acc, curr) => acc + curr.revenue, 0),
      totalFormatted: `₹${(data.reduce((acc, curr) => acc + curr.revenue, 0) / 100000).toFixed(2)}L`,
    },
    orders: {
      label: 'Orders',
      color: '#3D7A5A',
      gradientId: 'perfOrdersGradient',
      formatY: (val: number) => `${val}`,
      formatVal: (val: number) => `${val.toLocaleString()} orders`,
      total: data.reduce((acc, curr) => acc + curr.orders, 0),
      totalFormatted: `${data.reduce((acc, curr) => acc + curr.orders, 0).toLocaleString()} orders`,
    },
    aov: {
      label: 'Avg. Order Value',
      color: '#C4842E',
      gradientId: 'perfAovGradient',
      formatY: (val: number) => `₹${val}`,
      formatVal: (val: number) => `₹${val.toLocaleString('en-IN')}`,
      total: Math.round(data.reduce((acc, curr) => acc + curr.aov, 0) / data.length),
      totalFormatted: `₹${Math.round(data.reduce((acc, curr) => acc + curr.aov, 0) / data.length)} avg`,
    },
  };

  const currentCfg = metricConfigs[activeMetric];

  return (
    <div
      id="business-performance-card"
      className="p-5 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      {/* Header with Title and Metric Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EBE1]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#232220] tracking-tight">
              Business Performance & Demand Velocity
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6649] bg-[#EDF5F0] px-2 py-0.5 rounded-full border border-[#D7E9DE]">
              <TrendingUp className="w-3 h-3" />
              +12.4% vs baseline
            </span>
          </div>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Omnichannel fulfillment, checkout revenue, and conversion trends across regional nodes
          </p>
        </div>

        {/* Metric Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F4F0E8] rounded-lg self-start sm:self-auto border border-[#EBE4D8]">
          {(['revenue', 'orders', 'aov'] as MetricType[]).map((metric) => (
            <button
              key={metric}
              id={`toggle-metric-${metric}`}
              onClick={() => setActiveMetric(metric)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeMetric === metric
                  ? 'bg-white text-[#232220] shadow-2xs font-semibold'
                  : 'text-[#6A665E] hover:text-[#232220]'
              }`}
            >
              {metric === 'revenue' && 'Revenue'}
              {metric === 'orders' && 'Orders'}
              {metric === 'aov' && 'AOV'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Chart Area */}
      <div className="pt-4 h-[270px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={currentCfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentCfg.color} stopOpacity={0.16} />
                <stop offset="95%" stopColor={currentCfg.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE6DC" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#969085', fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#969085', fontSize: 11 }}
              tickFormatter={currentCfg.formatY}
              dx={-4}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="bg-[#232220] text-[#FBF9F5] text-xs rounded-xl p-3 shadow-xl border border-[#3A3835] pointer-events-none min-w-[150px]">
                      <div className="text-[11px] text-[#A8A49C] font-medium pb-1.5 border-b border-[#3A3835]">
                        {label}
                      </div>
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#A8A49C]">Revenue:</span>
                          <span className="font-semibold text-white">
                            ₹{pt.revenue.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#A8A49C]">Orders:</span>
                          <span className="font-medium text-[#EBE6DC]">
                            {pt.orders.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#A8A49C]">AOV:</span>
                          <span className="font-medium text-[#EBE6DC]">
                            ₹{pt.aov}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={currentCfg.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${currentCfg.gradientId})`}
              activeDot={{
                r: 5,
                fill: currentCfg.color,
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Mini Highlight */}
      <div className="mt-3 pt-3 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentCfg.color }} />
            <span className="text-[#7A756D] font-medium">Period Total:</span>
            <span className="font-semibold text-[#232220] font-tabular-nums">
              {currentCfg.totalFormatted}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[#7A756D]">
            <span>Peak Velocity:</span>
            <span className="font-medium text-[#232220]">Aug 21 (Today)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[#5A554D] bg-[#F7F4EE] px-2.5 py-1 rounded-lg text-[11px] border border-[#EBE5DC]">
          <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
          <span>Demand velocity is outperforming Q3 baseline by +14.2% in Pune node</span>
        </div>
      </div>
    </div>
  );
};
