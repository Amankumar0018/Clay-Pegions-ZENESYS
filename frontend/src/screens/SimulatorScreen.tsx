import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Boxes,
  Truck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SimulatorScreen: React.FC = () => {
  const {
    simParams,
    setSimParams,
    simResult,
    applyPreset,
    executeMitigation,
  } = useApp();

  const [isSimulating, setIsSimulating] = useState(false);

  const presets = [
    'Normal',
    'Demand Spike',
    'Supplier Delay',
    'Peak Season',
    'Warehouse Disruption',
  ];

  const handleRunScenario = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div id="simulator-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
              What happens if?
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0F5B5C] text-white">
              Stress Tester
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            Test a decision before it becomes a problem.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-[#71746E] mr-1">Presets:</span>
          {presets.map((pr) => (
            <button
              key={pr}
              id={`preset-btn-${pr.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => applyPreset(pr)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                simParams.presetName === pr
                  ? 'bg-[#1C1D1F] text-white shadow-2xs'
                  : 'bg-white border border-[#E0E2DC] text-[#555850] hover:bg-[#F6F6F2]'
              }`}
            >
              {pr}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="p-5 bg-white rounded-xl border border-[#E0E2DC] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1D1F]">
            Scenario Stress Parameters
          </h2>
          <button
            onClick={() => applyPreset('Normal')}
            className="text-xs text-[#71746E] hover:text-[#1C1D1F] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-1">
          {/* Demand Surge */}
          <div className="p-3.5 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1C1D1F]">Demand Change</span>
              <span className="font-mono font-bold text-[#0F5B5C]">
                {simParams.demandChangePct >= 0 ? `+${simParams.demandChangePct}%` : `${simParams.demandChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="80"
              step="5"
              value={simParams.demandChangePct}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  demandChangePct: Number(e.target.value),
                  presetName: 'Custom',
                }))
              }
              className="w-full accent-[#0F5B5C] cursor-pointer"
            />
            <p className="text-[10px] text-[#71746E]">Consumer sales velocity shift</p>
          </div>

          {/* Supplier Lead Time Delta */}
          <div className="p-3.5 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1C1D1F]">Supplier Delay</span>
              <span className="font-mono font-bold text-[#BE123C]">
                +{simParams.supplierLeadTimeDeltaDays} days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="1"
              value={simParams.supplierLeadTimeDeltaDays}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  supplierLeadTimeDeltaDays: Number(e.target.value),
                  presetName: 'Custom',
                }))
              }
              className="w-full accent-[#0F5B5C] cursor-pointer"
            />
            <p className="text-[10px] text-[#71746E]">Upstream fabrication latency</p>
          </div>

          {/* Warehouse Capacity Util */}
          <div className="p-3.5 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1C1D1F]">DC Capacity</span>
              <span className="font-mono font-bold text-[#1C1D1F]">
                {simParams.warehouseCapacityPct}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="5"
              value={simParams.warehouseCapacityPct}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  warehouseCapacityPct: Number(e.target.value),
                  presetName: 'Custom',
                }))
              }
              className="w-full accent-[#0F5B5C] cursor-pointer"
            />
            <p className="text-[10px] text-[#71746E]">Available pallet storage ceiling</p>
          </div>

          {/* Logistics Delay */}
          <div className="p-3.5 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1C1D1F]">Transit Hold</span>
              <span className="font-mono font-bold text-[#B45309]">
                +{simParams.logisticsDelayDays} days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={simParams.logisticsDelayDays}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  logisticsDelayDays: Number(e.target.value),
                  presetName: 'Custom',
                }))
              }
              className="w-full accent-[#0F5B5C] cursor-pointer"
            />
            <p className="text-[10px] text-[#71746E]">Port & highway transit friction</p>
          </div>

          {/* Supplier Availability */}
          <div className="p-3.5 bg-[#F8F8F5] rounded-lg border border-[#EAEAE6] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1C1D1F]">Vendor Fill Rate</span>
              <span className="font-mono font-bold text-[#15803D]">
                {simParams.supplierAvailabilityPct}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={simParams.supplierAvailabilityPct}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  supplierAvailabilityPct: Number(e.target.value),
                  presetName: 'Custom',
                }))
              }
              className="w-full accent-[#0F5B5C] cursor-pointer"
            />
            <p className="text-[10px] text-[#71746E]">Lot yield fulfillment rate</p>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            id="run-scenario-btn"
            onClick={handleRunScenario}
            className="px-4 py-2 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Run scenario</span>
          </button>
        </div>
      </div>

      {/* Impact Assessment: CURRENT vs SIMULATED Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Current Baseline Card */}
        <div className="p-5 bg-white rounded-xl border border-[#E0E2DC] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0F0EB] pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71746E]">
                Baseline State
              </span>
              <h3 className="text-base font-bold text-[#1C1D1F]">CURRENT</h3>
            </div>
            <span className="text-xs text-[#15803D] font-semibold bg-[#15803D]/10 px-2 py-0.5 rounded">
              Operating Baseline
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-[#FAF9F7] rounded-lg">
              <span className="text-[#71746E]">Stockout Risk</span>
              <span className="font-mono font-bold text-sm text-[#1C1D1F]">
                {simResult.current.stockoutRiskPct}%
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#FAF9F7] rounded-lg">
              <span className="text-[#71746E]">Orders at Risk</span>
              <span className="font-mono font-bold text-sm text-[#1C1D1F]">
                {simResult.current.ordersAtRisk} orders
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#FAF9F7] rounded-lg">
              <span className="text-[#71746E]">Revenue Exposure</span>
              <span className="font-mono font-bold text-sm text-[#1C1D1F]">
                ₹{(simResult.current.revenueExposureInr / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        </div>

        {/* Simulated Impact Card */}
        <div className="p-5 bg-white rounded-xl border-2 border-[#BE123C]/30 shadow-2xs space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#F0F0EB] pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BE123C]">
                Stress Scenario ({simParams.presetName})
              </span>
              <h3 className="text-base font-bold text-[#BE123C]">SIMULATED</h3>
            </div>
            <span className="text-xs text-[#BE123C] font-semibold bg-[#BE123C]/10 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Elevated Vulnerability
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-[#BE123C]/5 rounded-lg">
              <span className="text-[#555850]">Stockout Risk</span>
              <div className="text-right">
                <span className="font-mono font-bold text-base text-[#BE123C]">
                  {simResult.simulated.stockoutRiskPct}%
                </span>
                <span className="text-[10px] text-[#BE123C] block">
                  +{simResult.simulated.stockoutRiskPct - simResult.current.stockoutRiskPct}% jump
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#BE123C]/5 rounded-lg">
              <span className="text-[#555850]">Orders at Risk</span>
              <div className="text-right">
                <span className="font-mono font-bold text-base text-[#BE123C]">
                  {simResult.simulated.ordersAtRisk} orders
                </span>
                <span className="text-[10px] text-[#BE123C] block">
                  +{simResult.simulated.ordersAtRisk - simResult.current.ordersAtRisk} delayed
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#BE123C]/5 rounded-lg">
              <span className="text-[#555850]">Revenue Exposure</span>
              <div className="text-right">
                <span className="font-mono font-bold text-base text-[#BE123C]">
                  ₹{(simResult.simulated.revenueExposureInr / 100000).toFixed(2)}L
                </span>
                <span className="text-[10px] text-[#BE123C] block">
                  Critical exposure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Proactive Mitigation Strategy (The Solution) */}
      <section className="p-6 bg-white rounded-xl border-2 border-[#0F5B5C]/30 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0F5B5C] text-white">
                Proactive Mitigation Strategy
              </span>
            </div>
            <h3 className="text-base font-bold text-[#1C1D1F] mt-1">
              Recommended Response Plan
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#71746E] block">Potential Loss Avoided</span>
            <span className="text-xl font-bold font-mono text-[#15803D]">
              ₹{(simResult.recommendedResponse.potentialLossAvoidedInr / 100000).toFixed(2)}L
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Transfer */}
          <div className="p-3.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6] space-y-1.5">
            <div className="font-bold text-[#1C1D1F] flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-[#0F5B5C]" />
              <span>Inter-Warehouse Balancing</span>
            </div>
            <ul className="space-y-1 text-[#555850]">
              {simResult.recommendedResponse.transfers.map((t, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#0F5B5C] font-bold">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supplier Reallocation */}
          <div className="p-3.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6] space-y-1.5">
            <div className="font-bold text-[#1C1D1F] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#0F5B5C]" />
              <span>Supplier Reallocation</span>
            </div>
            <ul className="space-y-1 text-[#555850]">
              {simResult.recommendedResponse.supplierSwitches.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#0F5B5C] font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prioritization */}
          <div className="p-3.5 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6] space-y-1.5">
            <div className="font-bold text-[#1C1D1F] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Order Queue Protection</span>
            </div>
            <ul className="space-y-1 text-[#555850]">
              {simResult.recommendedResponse.priorityOrders.map((o, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#15803D] font-bold">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F0F0EB]">
          <p className="text-xs text-[#71746E]">
            Applying mitigation locks in stock transfers and reroutes pending order dispatches.
          </p>
          <button
            id="execute-mitigation-plan-btn"
            onClick={executeMitigation}
            className="px-4 py-2 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Execute Mitigation Strategy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
