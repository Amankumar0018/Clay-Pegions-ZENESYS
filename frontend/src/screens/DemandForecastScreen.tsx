import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  ShoppingBag,
  Info,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HISTORICAL_AND_FORECAST_DATA } from '../data/mockData';

export const DemandForecastScreen: React.FC = () => {
  const {
    products,
    selectedWarehouse,
    setSelectedWarehouse,
    setActivePOModalProduct,
    setCurrentPage,
  } = useApp();

  const [selectedProductName, setSelectedProductName] = useState('Wireless Earbuds');
  const [horizon, setHorizon] = useState<'7D' | '30D' | '90D'>('7D');

  const selectedProduct =
    products.find((p) => p.name === selectedProductName) || products[0];

  const chartDataSet =
    HISTORICAL_AND_FORECAST_DATA[selectedProductName as keyof typeof HISTORICAL_AND_FORECAST_DATA]?.[horizon] ||
    HISTORICAL_AND_FORECAST_DATA['Wireless Earbuds'][horizon];

  return (
    <div id="demand-forecast-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
            Demand Forecast
          </h1>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            See what&apos;s likely to move before you commit inventory.
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-1.5 bg-[#F4F4F1] p-1 rounded-lg border border-[#E0E2DC]">
          <span className="text-[11px] font-semibold text-[#71746E] px-2">Horizon:</span>
          {(['7D', '30D', '90D'] as const).map((h) => (
            <button
              key={h}
              id={`horizon-btn-${h}`}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                horizon === h
                  ? 'bg-white text-[#0F5B5C] shadow-2xs'
                  : 'text-[#5C5F58] hover:text-[#1C1D1F]'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bars: Product Selector & Warehouse Scope */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-[#E0E2DC]">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-[#555850]">Product:</label>
          <div className="flex flex-wrap gap-1.5">
            {products.slice(0, 5).map((p) => (
              <button
                key={p.id}
                id={`forecast-product-${p.id}`}
                onClick={() => setSelectedProductName(p.name)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all font-medium border ${
                  selectedProductName === p.name
                    ? 'border-[#0F5B5C] bg-[#0F5B5C]/10 text-[#0F5B5C] font-semibold'
                    : 'border-[#E0E2DC] bg-[#FAF9F7] text-[#4A4D46] hover:bg-[#F2F2EC]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#71746E]">
          <span>Confidence:</span>
          <span className="font-mono font-bold text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded">
            91.4% (Ensemble ARIMA + LSTM)
          </span>
        </div>
      </div>

      {/* Main Multi-Line Interactive Chart with Confidence Bands */}
      <div className="p-5 bg-white rounded-xl border border-[#E0E2DC] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#1C1D1F]">
              {selectedProductName} — Daily Sales & Projected Demand Velocity
            </h3>
            <p className="text-xs text-[#71746E] mt-0.5">
              Historical actuals, predictive trajectory, and 95% Bayesian confidence band.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#1C1D1F]"></span>
              <span className="text-[#555850]">Historical Sales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#0F5B5C] border-t border-dashed"></span>
              <span className="text-[#0F5B5C] font-medium">NEXUS Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#0F5B5C]/15 rounded-xs"></span>
              <span className="text-[#71746E]">Confidence Range</span>
            </div>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartDataSet}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEDE8" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#888B84"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E5E6E0' }}
              />
              <YAxis
                stroke="#888B84"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E5E6E0' }}
                unit="u"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E0E2DC',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [
                  val !== null ? `${val} units` : 'N/A',
                  '',
                ]}
              />

              {/* Confidence interval band */}
              <Area
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="#0F5B5C"
                fillOpacity={0.12}
                name="Upper Bound (95%)"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="#FFFFFF"
                fillOpacity={1}
                name="Lower Bound"
              />

              {/* Baseline reference */}
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#C0C2BA"
                strokeDasharray="4 4"
                dot={false}
                name="Historical Baseline"
              />

              {/* Historical actuals */}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="#1C1D1F"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#1C1D1F' }}
                activeDot={{ r: 5 }}
                name="Historical Sales"
              />

              {/* Forecast curve */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#0F5B5C"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 3.5, fill: '#0F5B5C' }}
                activeDot={{ r: 6 }}
                name="Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Strip (Current Stock, Forecast Demand, Safety Stock, Lead Time, Risk, Recommended PO) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white rounded-lg border border-[#E0E2DC]">
          <span className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider block">
            Current Stock
          </span>
          <span className="text-lg font-bold font-mono text-[#1C1D1F] mt-0.5 block">
            {selectedProduct.currentStock.toLocaleString()} units
          </span>
          <span className="text-[10px] text-[#71746E]">
            {selectedProduct.daysCover} days cover
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-[#E0E2DC]">
          <span className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider block">
            Forecast Demand
          </span>
          <span className="text-lg font-bold font-mono text-[#1C1D1F] mt-0.5 block">
            {selectedProduct.forecastDemand.toLocaleString()} units
          </span>
          <span className="text-[10px] text-[#0F5B5C] font-semibold">
            +{selectedProduct.trend}% velocity
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-[#E0E2DC]">
          <span className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider block">
            Safety Stock
          </span>
          <span className="text-lg font-bold font-mono text-[#1C1D1F] mt-0.5 block">
            {selectedProduct.safetyStock} units
          </span>
          <span className="text-[10px] text-[#71746E]">Statutory threshold</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-[#E0E2DC]">
          <span className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider block">
            Supplier Lead Time
          </span>
          <span className="text-lg font-bold font-mono text-[#1C1D1F] mt-0.5 block">
            {selectedProduct.supplierLeadTimeDays} days
          </span>
          <span className="text-[10px] text-[#71746E]">Primary SLA</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-[#E0E2DC]">
          <span className="text-[11px] font-medium text-[#71746E] uppercase tracking-wider block">
            Stockout Risk
          </span>
          <span
            className={`text-lg font-bold font-mono mt-0.5 block ${
              selectedProduct.risk === 'Critical'
                ? 'text-[#BE123C]'
                : selectedProduct.risk === 'High'
                ? 'text-[#B45309]'
                : 'text-[#15803D]'
            }`}
          >
            {selectedProduct.risk}
          </span>
          <span className="text-[10px] text-[#71746E]">Depletion in {selectedProduct.daysCover}d</span>
        </div>

        <div className="p-3.5 bg-[#0F5B5C]/5 rounded-lg border border-[#0F5B5C]/30 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#0F5B5C] uppercase tracking-wider block">
              Recommended PO
            </span>
            <span className="text-lg font-bold font-mono text-[#0F5B5C] mt-0.5 block">
              {selectedProduct.recommendedPurchaseQty > 0
                ? `${selectedProduct.recommendedPurchaseQty.toLocaleString()} units`
                : '0 (Overstock)'}
            </span>
          </div>
          {selectedProduct.recommendedPurchaseQty > 0 && (
            <button
              onClick={() => setActivePOModalProduct(selectedProduct)}
              className="mt-2 w-full py-1 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-[11px] font-semibold rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>Draft PO</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* "Why this forecast?" Explanatory Section */}
      <section className="p-5 bg-white rounded-xl border border-[#E0E2DC] space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#0F5B5C]" />
          <h3 className="text-sm font-bold text-[#1C1D1F]">
            Why this forecast?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#4A4D46] pt-1">
          <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] space-y-1">
            <p className="font-semibold text-[#1C1D1F]">1. Sales Acceleration</p>
            <p className="text-[11px] leading-relaxed">
              Sales have steadily increased over the last 3 weeks (+24.5% velocity). Regional demand is trending above the historical seasonal baseline.
            </p>
          </div>

          <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] space-y-1">
            <p className="font-semibold text-[#1C1D1F]">2. Inventory Horizon Gap</p>
            <p className="text-[11px] leading-relaxed">
              Current inventory ({selectedProduct.currentStock} units) will deplete below safety stock in 6.2 days, shorter than the supplier lead time (7 days).
            </p>
          </div>

          <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] space-y-1">
            <p className="font-semibold text-[#1C1D1F]">3. Model Validation</p>
            <p className="text-[11px] leading-relaxed">
              Forecast confidence: <strong>91.4%</strong>. Model WAPE is currently 9.4%, outperforming standard moving average baselines by 42%.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setCurrentPage('simulator')}
            className="text-xs font-semibold text-[#0F5B5C] hover:text-[#0c4a4b] inline-flex items-center gap-1 transition-colors"
          >
            <span>Test stress scenario in What-If Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
