import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Boxes,
  Truck,
  Building2,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AlertItem } from '../types';

export const AlertsScreen: React.FC = () => {
  const {
    alerts,
    markAlertRead,
    markAllAlertsRead,
    setCurrentPage,
    setActivePOModalProduct,
    products,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Inventory', 'Demand', 'Supplier', 'Fulfillment'];

  const filteredAlerts = alerts.filter(
    (a) => activeCategory === 'All' || a.category === activeCategory
  );

  const handleAlertAction = (alert: AlertItem) => {
    markAlertRead(alert.id);
    if (alert.targetPage) {
      setCurrentPage(alert.targetPage);
    }
  };

  return (
    <div id="alerts-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
            Alerts
          </h1>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            Important changes that need a decision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAlertsRead}
            className="px-3 py-1.5 bg-white hover:bg-[#F4F4F1] border border-[#D5D7D2] text-[#555850] text-xs font-semibold rounded-md transition-colors"
          >
            Mark All as Acknowledged
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[#1C1D1F] text-white shadow-2xs'
                : 'bg-white border border-[#E0E2DC] text-[#555850] hover:bg-[#F6F6F2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Chronological Alert Feed */}
      <div className="bg-white rounded-xl border border-[#E0E2DC] overflow-hidden shadow-2xs divide-y divide-[#F0F0EB]">
        {filteredAlerts.map((alt) => {
          const getCategoryIcon = () => {
            switch (alt.category) {
              case 'Inventory':
                return <Boxes className="w-4 h-4 text-[#B45309]" />;
              case 'Demand':
                return <TrendingUp className="w-4 h-4 text-[#0F5B5C]" />;
              case 'Supplier':
                return <Building2 className="w-4 h-4 text-[#BE123C]" />;
              case 'Fulfillment':
              default:
                return <Truck className="w-4 h-4 text-[#1C1D1F]" />;
            }
          };

          return (
            <div
              key={alt.id}
              id={`alert-feed-item-${alt.id}`}
              className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !alt.isRead ? 'bg-[#FAF9F6]' : 'hover:bg-[#FAF9F7]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#F2F2EC] flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon()}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-[#71746E]">
                      {alt.time}
                    </span>
                    <span className="text-xs font-bold text-[#1C1D1F]">
                      {alt.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#EAEBE5] text-[#555850]">
                      {alt.productOrEntity}
                    </span>
                    {!alt.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#BE123C]" />
                    )}
                  </div>
                  <p className="text-xs text-[#555850] max-w-2xl leading-relaxed">
                    {alt.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
                {alt.actionLabel && (
                  <button
                    onClick={() => handleAlertAction(alt)}
                    className="px-3 py-1.5 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                  >
                    <span>{alt.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {!alt.isRead && (
                  <button
                    onClick={() => markAlertRead(alt.id)}
                    className="px-2.5 py-1.5 text-xs text-[#71746E] hover:text-[#1C1D1F] rounded"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
