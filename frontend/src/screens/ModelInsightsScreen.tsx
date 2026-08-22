import React from 'react';
import {
  TrendingUp,
  Cpu,
  BarChart3,
  CheckCircle2,
  Info,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ModelInsightsScreen: React.FC = () => {
  const { appName } = useApp();

  return (
    <div id="model-insights-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
            Forecast Performance & Model Insights
          </h1>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            How machine learning models validate demand and reduce stockout risk.
          </p>
        </div>

        <span className="text-[11px] font-mono text-[#71746E] bg-[#F4F4F1] px-2.5 py-1 rounded border border-[#E0E2DC]">
          Validation Run #2026.08.B (Simulated)
        </span>
      </div>

      {/* Model Benchmark Hero Card */}
      <div className="p-6 bg-white rounded-xl border border-[#E0E2DC] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0EB] pb-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#0F5B5C]">
              Ensemble Model Evaluation
            </div>
            <h2 className="text-base font-bold text-[#1C1D1F] mt-0.5">
              Weighted Absolute Percentage Error (WAPE) Benchmark
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#15803D] bg-[#15803D]/10 px-2.5 py-1 rounded">
            +42.0% Accuracy Lift
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#0F5B5C]/5 rounded-xl border border-[#0F5B5C]/20">
            <span className="text-xs font-semibold text-[#0F5B5C] uppercase tracking-wider block">
              {appName} Model WAPE
            </span>
            <span className="text-3xl font-mono font-bold text-[#0F5B5C] mt-1 block">
              9.4%
            </span>
            <span className="text-[11px] text-[#555850] mt-1 block">
              Ensemble ARIMA + Temporal Fusion Transformer
            </span>
          </div>

          <div className="p-4 bg-[#F8F8F5] rounded-xl border border-[#EAEAE6]">
            <span className="text-xs font-semibold text-[#71746E] uppercase tracking-wider block">
              Industry Baseline WAPE
            </span>
            <span className="text-3xl font-mono font-bold text-[#71746E] mt-1 block">
              16.2%
            </span>
            <span className="text-[11px] text-[#71746E] mt-1 block">
              Standard 30-day trailing moving average
            </span>
          </div>

          <div className="p-4 bg-[#15803D]/5 rounded-xl border border-[#15803D]/20">
            <span className="text-xs font-semibold text-[#15803D] uppercase tracking-wider block">
              Net Capital Protected
            </span>
            <span className="text-3xl font-mono font-bold text-[#15803D] mt-1 block">
              ₹4.82L
            </span>
            <span className="text-[11px] text-[#15803D] font-medium mt-1 block">
              Reduced stockout loss + zero dead-stock writeoffs
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6] flex items-start gap-2.5 text-xs text-[#4A4D46]">
          <Info className="w-4 h-4 text-[#0F5B5C] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Benchmark Notice:</strong> Metrics reflect a backtested cross-validation run on historical SKU velocity (Pune, Mumbai, Delhi). Synthetic test distributions validate robustness against holiday spikes and port disruptions.
          </p>
        </div>
      </div>

      {/* Feature Weights & Category Accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Feature Importance Weights */}
        <div className="p-5 bg-white rounded-xl border border-[#E0E2DC] shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1C1D1F]">
              Feature Importance & Drivers
            </h3>
            <p className="text-xs text-[#71746E] mt-0.5">
              Weight distribution in the multi-signal predictive engine.
            </p>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Recent 14-Day Velocity Spike</span>
                <span className="font-mono text-[#0F5B5C]">38%</span>
              </div>
              <div className="w-full h-2 bg-[#F0F0EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#0F5B5C] rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Regional Seasonality & Day-of-Week</span>
                <span className="font-mono text-[#0F5B5C]">22%</span>
              </div>
              <div className="w-full h-2 bg-[#F0F0EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#0F5B5C] rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Supplier Lead Time Variance</span>
                <span className="font-mono text-[#0F5B5C]">18%</span>
              </div>
              <div className="w-full h-2 bg-[#F0F0EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#0F5B5C] rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Marketing & Promotional Signals</span>
                <span className="font-mono text-[#0F5B5C]">12%</span>
              </div>
              <div className="w-full h-2 bg-[#F0F0EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#0F5B5C] rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Macro Port & Transit Friction</span>
                <span className="font-mono text-[#0F5B5C]">10%</span>
              </div>
              <div className="w-full h-2 bg-[#F0F0EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#0F5B5C] rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Category Accuracy Table */}
        <div className="p-5 bg-white rounded-xl border border-[#E0E2DC] shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1C1D1F]">
              Category Performance Matrix
            </h3>
            <p className="text-xs text-[#71746E] mt-0.5">
              Accuracy and variance breakdown by SKU category.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F8F5] border-b border-[#EAEAE6] text-[#71746E] font-semibold">
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Model Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Error (WAPE)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0EB]">
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-semibold text-[#1C1D1F]">Audio & Wearables</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#15803D]">94.2%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#555850]">5.8%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-semibold text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded">High Confidence</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-semibold text-[#1C1D1F]">Smart Gadgets</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#15803D]">91.8%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#555850]">8.2%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-semibold text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded">High Confidence</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-semibold text-[#1C1D1F]">Computer Accessories</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#0F5B5C]">88.5%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#555850]">11.5%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-semibold text-[#0F5B5C] bg-[#0F5B5C]/10 px-2 py-0.5 rounded">Standard</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-semibold text-[#1C1D1F]">Power & Cables</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#15803D]">96.1%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#555850]">3.9%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-semibold text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded">Optimal</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
