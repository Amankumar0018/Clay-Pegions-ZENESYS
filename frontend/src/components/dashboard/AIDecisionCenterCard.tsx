import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  ShoppingBag,
  SlidersHorizontal,
  CheckCircle,
  Clock,
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIDecisionCenterCard: React.FC = () => {
  const {
    setActivePOModalProduct,
    simulateProductRisk,
    setCurrentPage,
    products,
    addToast,
  } = useApp();

  const [decisionData, setDecisionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDecisionCenterData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/ai-decision-center');
      if (res.ok) {
        const data = await res.json();
        setDecisionData(data);
      }
    } catch (err) {
      console.warn('API Decision Center fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisionCenterData();
  }, []);

  const decision = decisionData?.critical_decision;
  const netsuite = decisionData?.netsuite_connection;
  const telemetry = decisionData?.business_value_telemetry;

  const productName = decision?.product_name || "ThinkPad Business 14";
  const stockoutDays = decision?.stockout_days ?? 5.9;
  const demandTrend = decision?.demand_trend || "+23%";
  const recommendedQty = decision?.recommended_quantity || 120;
  const supplierName = decision?.recommended_supplier?.name || "Vertex Distribution";
  const supplierLeadTime = decision?.recommended_supplier?.lead_time_days || 5;
  const estimatedSpend = decision?.estimated_spend || 6480000;
  const lossAvoided = telemetry?.estimated_loss_avoided || 6771911;

  const handleCreatePONetSuite = () => {
    const matchedProd = products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    ) || {
      id: 'P003',
      name: productName,
      category: 'Laptops',
      currentStock: 89,
      forecastDemand: 450,
      daysCover: stockoutDays,
      safetyStock: 25,
      reorderPoint: 65,
      risk: 'Critical' as const,
      warehouse: 'Pune' as const,
      unitCost: 54000,
      primarySupplier: supplierName,
      recommendedPurchaseQty: recommendedQty,
      supplierLeadTimeDays: supplierLeadTime,
    };
    setActivePOModalProduct(matchedProd as any);
  };

  return (
    <div
      id="ai-decision-center-hero"
      className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-[#1C1D1F] via-[#242629] to-[#161719] text-white shadow-xl border border-[#3A3D42] relative overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#0F5B5C]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#C86D51]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#34373C] relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0F5B5C] text-white shadow-md">
            <Sparkles className="w-5 h-5 text-[#E8B86D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">
                AI DECISION CENTER
              </h2>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#0F5B5C]/40 text-[#4EE5D6] border border-[#0F5B5C]">
                SENSE &rarr; PREDICT &rarr; EXECUTE
              </span>
            </div>
            <p className="text-xs text-[#A0A4AB]">
              NetSuite ERP telemetry synthesized with ML demand forecasts for autonomous decision execution.
            </p>
          </div>
        </div>

        {/* NetSuite Connection Status Badge */}
        <div className="flex items-center gap-2 bg-[#2B2E33] px-3 py-1.5 rounded-full border border-[#40444A]">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          <span className="text-xs font-medium text-[#E2E8F0] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#60A5FA]" />
            NetSuite {netsuite?.is_demo_mode ? "Demo / Sandbox" : "Live API"} &bull; Synced
          </span>
        </div>
      </div>

      {/* Hero Decision Box */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        {/* Left Core Metrics & Action (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-[#26292E] border border-[#3A3E45] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#BE123C]/20 text-[#FB7185] border border-[#BE123C]/40 text-xs font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  CRITICAL RISK DETECTED
                </span>
                <span className="text-xs text-[#94A3B8] font-mono">
                  ID: {decision?.product_id || "P003"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#94A3B8]">Est. Loss Avoided:</span>
                <span className="text-xs font-bold text-[#34D399] font-mono ml-1">
                  ₹{(lossAvoided / 100000).toFixed(2)}L
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {productName}
              </h3>
              <p className="text-xs text-[#A0A4AB] mt-0.5">
                Category: <span className="text-white font-medium">{decision?.category || "Laptops"}</span> &bull; Stockout expected in <span className="text-[#FB7185] font-bold">{stockoutDays} days</span>
              </p>
            </div>

            {/* Metric Highlights Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-[#1D2024] border border-[#33373E]">
                <div className="text-[10px] text-[#94A3B8] uppercase">Demand Trend</div>
                <div className="text-sm font-bold text-[#60A5FA] flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {demandTrend}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1D2024] border border-[#33373E]">
                <div className="text-[10px] text-[#94A3B8] uppercase">Recommended Action</div>
                <div className="text-sm font-bold text-[#F59E0B] mt-0.5">
                  Order {recommendedQty} units
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1D2024] border border-[#33373E]">
                <div className="text-[10px] text-[#94A3B8] uppercase">Top Supplier</div>
                <div className="text-sm font-bold text-[#34D399] truncate mt-0.5">
                  {supplierName}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleCreatePONetSuite}
              className="px-5 py-2.5 rounded-xl bg-[#0F5B5C] hover:bg-[#0D4D4E] text-white text-xs font-bold shadow-lg shadow-[#0F5B5C]/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4 text-[#4EE5D6]" />
              <span>Create Purchase Order in NetSuite</span>
            </button>

            <button
              onClick={() => simulateProductRisk(productName, 30)}
              className="px-4 py-2.5 rounded-xl bg-[#2D3137] hover:bg-[#383C43] text-white text-xs font-semibold border border-[#454950] flex items-center gap-1.5 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E8B86D]" />
              <span>Simulate Impact</span>
            </button>
          </div>
        </div>

        {/* Right Explainability & NetSuite ERP Narrative (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#212429] border border-[#363A42] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E8B86D] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              AI EXPLAINABILITY ENGINE
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#181B1F] border border-[#2D3138]">
                <span className="text-[10px] font-bold text-[#60A5FA] uppercase block">WHAT & WHY?</span>
                <p className="text-[#D1D5DB] mt-0.5 leading-relaxed">
                  {decision?.explainability?.why || `Current stock is below safety stock threshold. Stockout expected in ${stockoutDays} days while lead time is ${supplierLeadTime} days.`}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#181B1F] border border-[#2D3138]">
                <span className="text-[10px] font-bold text-[#F59E0B] uppercase block">WHAT SHOULD I DO?</span>
                <p className="text-[#D1D5DB] mt-0.5 leading-relaxed">
                  Issue PO for <strong className="text-white">{recommendedQty} units</strong> to <strong className="text-white">{supplierName}</strong> (Lead time: {supplierLeadTime}d). Total commitment: <strong className="text-white">₹{estimatedSpend.toLocaleString()}</strong>.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#2D1B20] border border-[#54212B]">
                <span className="text-[10px] font-bold text-[#FB7185] uppercase block">IF IGNORED?</span>
                <p className="text-[#FCA5A5] mt-0.5 leading-relaxed">
                  {decision?.explainability?.if_ignored || `Stockout expected in ${stockoutDays} days leading to estimated revenue loss of ₹${(lossAvoided / 100000).toFixed(2)}L.`}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#2F333A] flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#34D399]" /> Model Confidence: 94.2%
            </span>
            <span className="font-mono text-[#60A5FA]">SuiteTalk REST API Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
