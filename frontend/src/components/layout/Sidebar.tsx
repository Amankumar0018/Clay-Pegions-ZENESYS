import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Boxes,
  ShoppingBag,
  SlidersHorizontal,
  PackageCheck,
  Truck,
  Building2,
  Sparkles,
  BellRing,
  LineChart,
  Settings,
  ShieldCheck,
  CheckSquare,
  Calendar,
  FileText,
  Files,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  isSpecial?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, unreadAlertsCount, tasks } = useApp();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const navigationSections: NavSection[] = [
    {
      title: 'Assistant & Daily',
      items: [
        {
          id: 'ai-assistant',
          label: 'Ask Miley',
          icon: Sparkles,
          isSpecial: true,
        },
        {
          id: 'tasks',
          label: 'Tasks & Planning',
          icon: CheckSquare,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
        },
        {
          id: 'calendar',
          label: 'Schedule & Calendar',
          icon: Calendar,
        },
        {
          id: 'notes',
          label: 'Knowledge & Notes',
          icon: FileText,
        },
        {
          id: 'files',
          label: 'Documents & Files',
          icon: Files,
        },
      ],
    },
    {
      title: 'Operations & Planning',
      items: [
        {
          id: 'command-center',
          label: 'Command Center',
          icon: LayoutDashboard,
        },
        {
          id: 'demand-forecast',
          label: 'Demand Forecast',
          icon: TrendingUp,
        },
        {
          id: 'inventory',
          label: 'Inventory Health',
          icon: Boxes,
        },
        {
          id: 'procurement',
          label: 'Procurement',
          icon: ShoppingBag,
        },
        {
          id: 'simulator',
          label: 'What-If Simulator',
          icon: SlidersHorizontal,
          badge: 'Simulate',
        },
        {
          id: 'orders',
          label: 'Orders',
          icon: PackageCheck,
        },
        {
          id: 'fulfillment',
          label: 'Fulfillment & Fleet',
          icon: Truck,
        },
        {
          id: 'suppliers',
          label: 'Suppliers',
          icon: Building2,
        },
      ],
    },
    {
      title: 'Intelligence & System',
      items: [
        {
          id: 'alerts',
          label: 'Alerts',
          icon: BellRing,
          badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
        },
        {
          id: 'model-insights',
          label: 'Model Insights',
          icon: LineChart,
        },
        {
          id: 'landing',
          label: 'Miley Overview',
          icon: Compass,
        },
        {
          id: 'settings',
          label: 'Settings & Persona',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside
      id="sidebar-nav"
      className="w-64 flex-shrink-0 bg-[#F5F2EC] border-r border-[#E7E2D9] flex flex-col justify-between h-screen sticky top-0 select-none z-20"
    >
      {/* Brand Header with Minimal Warm Assistant Pebble Mark */}
      <div className="p-4 border-b border-[#E7E2D9]">
        <div
          id="brand-header-link"
          onClick={() => setCurrentPage('command-center')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Terracotta Miley Mark */}
          <div className="w-8 h-8 rounded-lg bg-[#C86D51] text-white flex items-center justify-center shadow-[0_1px_2px_rgba(200,109,81,0.2)] group-hover:bg-[#B85D43] transition-colors relative overflow-hidden flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#FBF9F5]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] tracking-tight text-[#232220]">
                Miley
              </span>
              <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#E8E2D8] text-[#6A665E] tracking-wider">
                AI
              </span>
            </div>
            <p className="text-[11px] text-[#7A756D] leading-none mt-0.5">
              Your All-in-One Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-2.5 text-[10px] font-semibold tracking-wider uppercase text-[#969085]">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${
                      isActive
                        ? 'bg-[#EAE3DA] text-[#232220] font-semibold shadow-2xs'
                        : 'text-[#5E5950] hover:bg-[#EFEBE3] hover:text-[#232220]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#C86D51]'
                            : item.isSpecial
                            ? 'text-[#C86D51]'
                            : 'text-[#8A8479]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          typeof item.badge === 'number'
                            ? 'bg-[#BA4336] text-white'
                            : 'bg-[#E5DDD2] text-[#864D3C]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Operational Status */}
      <div className="p-3 border-t border-[#E7E2D9] bg-[#EFECE5]/60">
        <div className="flex items-center justify-between text-[11px] text-[#6A665E] px-1 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3D7A5A]"></span>
            <span className="font-medium text-[#232220]">Miley Online</span>
          </div>
          <span className="font-mono text-[10px] text-[#8A8479]">v3.2</span>
        </div>
        <div className="mt-1 px-1 flex items-center justify-between text-[10px] text-[#8A8479]">
          <span className="truncate">Everything you need. Just ask.</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#C86D51]" />
        </div>
      </div>
    </aside>
  );
};

