import React from 'react';
import {
  Filter,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TimePeriod, WarehouseLocation } from '../types';
import { KPI_METRICS_DATA } from '../data/mockData';
import { KPICard } from '../components/dashboard/KPICard';
import { BusinessPerformanceChart } from '../components/dashboard/BusinessPerformanceChart';
import { DemandForecastChart } from '../components/dashboard/DemandForecastChart';
import { InventoryHealthChart } from '../components/dashboard/InventoryHealthChart';
import { FulfillmentPerformanceCard } from '../components/dashboard/FulfillmentPerformanceCard';
import { TopProductsCard } from '../components/dashboard/TopProductsCard';
import { SupplierPerformanceCard } from '../components/dashboard/SupplierPerformanceCard';
import { NeedsAttentionCard } from '../components/dashboard/NeedsAttentionCard';
import { AIInsightsCard } from '../components/dashboard/AIInsightsCard';
import { AIDecisionCenterCard } from '../components/dashboard/AIDecisionCenterCard';

const TIME_PERIODS: TimePeriod[] = ['Today', '7 days', '30 days', '90 days'];
const CATEGORIES = [
  'All categories',
  'Audio & Wearables',
  'Connectivity',
  'Ergonomics & Desk',
  'Charging & Power',
];
const WAREHOUSES: WarehouseLocation[] = ['All', 'Pune', 'Mumbai', 'Delhi'];

export const CommandCenterScreen: React.FC = () => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    selectedCategory,
    setSelectedCategory,
    selectedWarehouse,
    setSelectedWarehouse,
    setCurrentPage,
    addToast,
  } = useApp();

  const handleRefresh = () => {
    addToast('Signals Synchronized', 'Telemetry refreshed across Pune, Mumbai, and Delhi regional nodes.', 'info');
  };

  return (
    <div id="analytics-dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Operational Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#232220]">
              Operations & Demand Command Center
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF5F0] text-[#2D6649] border border-[#D7E9DE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D7A5A] animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#7A756D] mt-0.5">
            Real-time supply chain observability, predictive inventory velocity & fulfillment SLA tracking
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            id="refresh-signals-btn"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DDD6CA] text-xs font-medium text-[#3D3A34] hover:bg-[#FAF8F5] transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#7A756D]" />
            <span>Sync Network</span>
          </button>
          <button
            id="quick-simulate-btn"
            onClick={() => setCurrentPage('simulator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C86D51] text-xs font-medium text-white hover:bg-[#A74E35] transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Scenario Simulator</span>
          </button>
        </div>
      </div>

      {/* Hero AI Decision Center Section */}
      <section id="ai-decision-center-hero-section">
        <AIDecisionCenterCard />
      </section>

      {/* Global Filter Bar */}
      <div
        id="dashboard-filter-bar"
        className="p-3 rounded-xl bg-white border border-[#EBE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Time Period Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#F4F0E8] rounded-lg border border-[#EBE4D8]">
            {TIME_PERIODS.map((period) => (
              <button
                key={period}
                id={`filter-period-${period.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedPeriod(period)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedPeriod === period
                    ? 'bg-white text-[#232220] shadow-2xs font-semibold'
                    : 'text-[#6A665E] hover:text-[#232220]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#8A8479]" />
            <select
              id="filter-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAF8F5] border border-[#DDD6CA] text-[#232220] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C86D51]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Regional Warehouse Hub Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#8A8479]" />
            <select
              id="filter-warehouse-select"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value as WarehouseLocation)}
              className="bg-[#FAF8F5] border border-[#DDD6CA] text-[#232220] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C86D51]"
            >
              {WAREHOUSES.map((wh) => (
                <option key={wh} value={wh}>
                  {wh === 'All' ? 'All Hubs (Pune, Mumbai, Delhi)' : `${wh} Hub`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-[11px] text-[#8A8479] font-mono flex items-center gap-2">
          <span>Telemetry updated 2m ago</span>
          <span className="text-[#DDD6CA]">&bull;</span>
          <span className="text-[#5A554D] font-medium">INR (₹) Standard</span>
        </div>
      </div>

      {/* Row 1: Smart KPI Row (5 Compact Cards with Sparklines) */}
      <section id="smart-kpi-row" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard
          id="kpi-revenue"
          title="Total Revenue"
          value={KPI_METRICS_DATA.revenue.current}
          changePct={KPI_METRICS_DATA.revenue.changePct}
          isPositive={KPI_METRICS_DATA.revenue.isPositive}
          comparisonText={KPI_METRICS_DATA.revenue.comparisonText}
          sparklineData={KPI_METRICS_DATA.revenue.sparkline}
          accentColor="#C86D51"
        />

        <KPICard
          id="kpi-orders"
          title="Orders Processed"
          value={KPI_METRICS_DATA.orders.current}
          changePct={KPI_METRICS_DATA.orders.changePct}
          isPositive={KPI_METRICS_DATA.orders.isPositive}
          comparisonText={KPI_METRICS_DATA.orders.comparisonText}
          sparklineData={KPI_METRICS_DATA.orders.sparkline}
          accentColor="#3D7A5A"
          onClick={() => setCurrentPage('orders')}
        />

        <KPICard
          id="kpi-inventory-health"
          title="Inventory Health"
          value={KPI_METRICS_DATA.inventoryHealth.current}
          changePct={KPI_METRICS_DATA.inventoryHealth.changePct}
          isPositive={KPI_METRICS_DATA.inventoryHealth.isPositive}
          comparisonText={KPI_METRICS_DATA.inventoryHealth.comparisonText}
          sparklineData={KPI_METRICS_DATA.inventoryHealth.sparkline}
          accentColor="#C86D51"
          onClick={() => setCurrentPage('inventory')}
        />

        <KPICard
          id="kpi-fulfillment"
          title="Fulfillment Rate"
          value={KPI_METRICS_DATA.fulfillment.current}
          changePct={KPI_METRICS_DATA.fulfillment.changePct}
          isPositive={KPI_METRICS_DATA.fulfillment.isPositive}
          comparisonText={KPI_METRICS_DATA.fulfillment.comparisonText}
          sparklineData={KPI_METRICS_DATA.fulfillment.sparkline}
          accentColor="#3D7A5A"
          onClick={() => setCurrentPage('fulfillment')}
        />

        <KPICard
          id="kpi-forecast-accuracy"
          title="Forecast Accuracy"
          value={KPI_METRICS_DATA.forecastAccuracy.current}
          changePct={KPI_METRICS_DATA.forecastAccuracy.changePct}
          isPositive={KPI_METRICS_DATA.forecastAccuracy.isPositive}
          comparisonText={KPI_METRICS_DATA.forecastAccuracy.comparisonText}
          sparklineData={KPI_METRICS_DATA.forecastAccuracy.sparkline}
          accentColor="#C4842E"
          onClick={() => setCurrentPage('demand-forecast')}
        />
      </section>

      {/* Row 2: Primary Visual Core (Business Performance Chart + Needs Attention Panel) */}
      <section id="core-performance-row" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <BusinessPerformanceChart
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
        <div className="lg:col-span-1">
          <NeedsAttentionCard />
        </div>
      </section>

      {/* Row 3: Secondary Analytics Grid (Demand vs Forecast + Inventory Health + Fulfillment SLA) */}
      <section id="secondary-analytics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DemandForecastChart />
        <InventoryHealthChart />
        <FulfillmentPerformanceCard />
      </section>

      {/* Row 4: Operational Deep Dive (Top Products Velocity + Supplier Scorecards) */}
      <section id="operational-deepdive-row" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopProductsCard />
        <SupplierPerformanceCard />
      </section>

      {/* Row 5: Proactive AI Intelligence Banner */}
      <section id="proactive-intelligence-section">
        <AIInsightsCard />
      </section>
    </div>
  );
};
