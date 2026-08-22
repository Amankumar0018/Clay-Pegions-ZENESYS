import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { INVENTORY_HEALTH_DISTRIBUTION } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const InventoryHealthChart: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div
      id="inventory-health-card"
      className="p-5 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
        <div>
          <h3 className="text-sm font-semibold text-[#232220]">
            Inventory Health Distribution
          </h3>
          <p className="text-xs text-[#7A756D] mt-0.5">
            4,800 total units monitored across Pune, Mumbai & Delhi hubs
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('inventory')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A74E35] transition-colors"
        >
          <span>Inventory View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Donut + Breakdown */}
      <div className="py-3 flex flex-col sm:flex-row items-center gap-6">
        {/* Donut Chart with Center Metric */}
        <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={INVENTORY_HEALTH_DISTRIBUTION}
                dataKey="units"
                nameKey="status"
                innerRadius={46}
                outerRadius={64}
                paddingAngle={3}
                stroke="none"
              >
                {INVENTORY_HEALTH_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#232220] text-[#FBF9F5] text-xs rounded-xl p-2.5 shadow-xl border border-[#3A3835] pointer-events-none">
                        <div className="font-semibold text-white">{data.status}</div>
                        <div className="text-[#D8D2C6] mt-1">
                          {data.units.toLocaleString()} units ({data.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl font-bold text-[#232220] font-tabular-nums">91%</span>
            <span className="text-[10px] text-[#8A8479] font-medium">Health Index</span>
          </div>
        </div>

        {/* Legend / Status Breakdown List */}
        <div className="flex-1 w-full space-y-2">
          {INVENTORY_HEALTH_DISTRIBUTION.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F5F1EA] border border-[#ECE5DA] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="text-xs font-medium text-[#232220]">
                    {item.status}
                  </div>
                  <div className="text-[11px] text-[#7A756D]">
                    {item.skusCount} active SKUs
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-[#232220] font-tabular-nums">
                  {item.percentage}%
                </div>
                <div className="text-[11px] text-[#7A756D] font-tabular-nums">
                  {item.units.toLocaleString()} units
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer warning */}
      <div className="mt-1 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#7A756D]">
        <div className="flex items-center gap-1.5 text-[#9A6218] font-medium text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>2 SKUs below safety stock threshold (&lt;4 days cover)</span>
        </div>
        <span className="text-[11px] font-mono text-[#8A8479]">
          Valuation: ₹48.2L
        </span>
      </div>
    </div>
  );
};
