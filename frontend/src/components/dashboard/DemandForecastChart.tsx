import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowRight } from 'lucide-react';
import { DEMAND_VS_FORECAST_DASHBOARD_DATA } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const DemandForecastChart: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div
      id="demand-forecast-card"
      className="p-5 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#232220]">
              Demand vs. AI Forecast Corridor
            </h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F7EBE8] text-[#933F24] border border-[#ECD1C8]">
              95% Confidence Band
            </span>
          </div>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Aggregated units across top moving catalog items (Historical actuals vs forward projection)
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('demand-forecast')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A74E35] transition-colors"
        >
          <span>Deep Dive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chart */}
      <div className="pt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DEMAND_VS_FORECAST_DASHBOARD_DATA}
            margin={{ top: 10, right: 12, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C86D51" stopOpacity={0.14} />
                <stop offset="95%" stopColor="#C86D51" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE6DC" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#969085', fontSize: 10 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#969085', fontSize: 10 }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="bg-[#232220] text-[#FBF9F5] text-xs rounded-xl p-3 shadow-xl border border-[#3A3835] pointer-events-none min-w-[170px]">
                      <div className="text-[11px] text-[#A8A49C] font-medium pb-1.5 border-b border-[#3A3835]">
                        {label}
                      </div>
                      <div className="pt-2 space-y-1">
                        {pt.actualDemand !== null && (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[#A8A49C]">Actual Units:</span>
                            <span className="font-semibold text-white">
                              {pt.actualDemand} units
                            </span>
                          </div>
                        )}
                        {pt.forecastDemand !== null && (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[#E8A593]">AI Forecast:</span>
                            <span className="font-semibold text-[#F7D3C8]">
                              {pt.forecastDemand} units
                            </span>
                          </div>
                        )}
                        {pt.lowerConfidence !== null && (
                          <div className="flex items-center justify-between gap-3 text-[10px] text-[#969085]">
                            <span>Confidence:</span>
                            <span>{pt.lowerConfidence} – {pt.upperConfidence}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Confidence Band */}
            <Area
              type="monotone"
              dataKey="upperConfidence"
              stroke="transparent"
              fill="url(#confidenceBand)"
              fillOpacity={1}
            />
            {/* Actual History Line */}
            <Line
              type="monotone"
              dataKey="actualDemand"
              stroke="#232220"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#232220' }}
              activeDot={{ r: 5, fill: '#232220' }}
            />
            {/* Forecast Projection Line */}
            <Line
              type="monotone"
              dataKey="forecastDemand"
              stroke="#C86D51"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#C86D51' }}
              activeDot={{ r: 5, fill: '#C86D51' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Note */}
      <div className="mt-2 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#232220]" />
            <span className="text-[#6A665E] text-[11px]">Actual Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#C86D51] border-b border-dashed border-[#C86D51]" />
            <span className="text-[#6A665E] text-[11px]">AI Model Projection</span>
          </div>
        </div>
        <span className="text-[11px] text-[#8A8479] font-mono">
          WAPE: 10.3% (High Reliability)
        </span>
      </div>
    </div>
  );
};
