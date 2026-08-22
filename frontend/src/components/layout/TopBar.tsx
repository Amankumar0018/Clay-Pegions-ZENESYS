import React, { useState } from 'react';
import {
  Search,
  Bell,
  RefreshCw,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Mic,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WarehouseLocation } from '../../types';

export const TopBar: React.FC = () => {
  const {
    selectedWarehouse,
    setSelectedWarehouse,
    setIsSearchOpen,
    unreadAlertsCount,
    setCurrentPage,
    addToast,
    setIsVoiceModeOpen,
    theme,
    toggleTheme,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const warehouses: WarehouseLocation[] = ['All', 'Pune', 'Mumbai', 'Delhi'];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast(
        'Telemetry Synced',
        'Ingested latest demand signals, warehouse stock counts, and GPS carrier events.',
        'info'
      );
    }, 600);
  };

  return (
    <header
      id="top-bar-nav"
      className="h-14 bg-[#FAF8F5] border-b border-[#E7E2D9] px-6 flex items-center justify-between sticky top-0 z-10"
    >
      {/* Left: Global Search & Warehouse Switcher */}
      <div className="flex items-center gap-4">
        {/* Search trigger button */}
        <button
          id="global-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EFECE5] hover:bg-[#EAE4DC] text-[#6A665E] text-xs transition-colors w-72 text-left border border-[#E3DDD4] hover:border-[#D6CEC2]"
        >
          <Search className="w-3.5 h-3.5 text-[#8A8479]" />
          <span className="flex-1 truncate">Search products, orders, suppliers...</span>
          <kbd className="text-[10px] bg-[#FAF8F5] border border-[#DCD6CA] rounded px-1.5 py-0.5 font-mono text-[#5A564E]">
            ⌘K
          </kbd>
        </button>

        {/* Warehouse Filter Selector */}
        <div className="flex items-center bg-[#EFECE5] p-0.5 rounded-lg border border-[#E3DDD4]">
          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#6A665E]">
            <MapPin className="w-3 h-3 text-[#C86D51]" />
            <span className="hidden sm:inline">Hub:</span>
          </div>
          {warehouses.map((wh) => (
            <button
              key={wh}
              id={`filter-warehouse-${wh.toLowerCase()}`}
              onClick={() => setSelectedWarehouse(wh)}
              className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                selectedWarehouse === wh
                  ? 'bg-[#FAF8F5] text-[#232220] shadow-2xs font-semibold'
                  : 'text-[#6A665E] hover:text-[#232220]'
              }`}
            >
              {wh}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Operational Status, Demo Indicator, Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Voice & Assistant Quick Actions */}
        <button
          id="topbar-voice-btn"
          onClick={() => setIsVoiceModeOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF3ED] hover:bg-[#F4EAE0] text-[#7A5043] border border-[#E8DDD2] text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          title="Start voice interaction with Miley"
        >
          <Mic className="w-3.5 h-3.5 text-[#C86D51]" />
          <span className="hidden md:inline">Voice</span>
        </button>

        <button
          id="topbar-ask-miley-btn"
          onClick={() => setCurrentPage('ai-assistant')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          title="Open Miley Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ask Miley</span>
        </button>

        {/* Sync telemetry indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-[#7A756D]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3D7A5A]"></span>
          <span>Last synced 2 min ago</span>
          <button
            id="refresh-telemetry-btn"
            onClick={handleRefresh}
            title="Sync network telemetry"
            className="p-1 text-[#8A8479] hover:text-[#232220] hover:bg-[#EFECE5] rounded-md transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C86D51]' : ''}`} />
          </button>
        </div>

        {/* NetSuite Integration Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0F5B5C]/10 border border-[#0F5B5C]/30 text-[11px] font-semibold text-[#0F5B5C]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>NetSuite Demo / Sandbox</span>
        </div>

        {/* Theme Toggle */}
        <button
          id="top-bar-theme-toggle"
          onClick={toggleTheme}
          className="p-2 text-[#6A665E] hover:text-[#232220] hover:bg-[#EFECE5] rounded-md transition-colors"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          id="top-bar-notifications"
          onClick={() => setCurrentPage('alerts')}
          className="relative p-2 text-[#6A665E] hover:text-[#232220] hover:bg-[#EFECE5] rounded-md transition-colors"
          title="View Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BA4336]" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            id="user-profile-menu-trigger"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 hover:bg-[#EFECE5] rounded-lg transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-[#F4EAE6] border border-[#E9DACF] text-[#933F24] flex items-center justify-center font-bold text-xs">
              LP
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-[#232220] leading-tight">
                Laxmi Patil
              </div>
              <div className="text-[10px] text-[#7A756D] leading-tight">
                Operations & Planning
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8479] hidden md:block" />
          </button>

          {showProfileMenu && (
            <div
              id="user-profile-dropdown"
              className="absolute right-0 mt-2 w-56 bg-[#FAF8F5] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#E7E2D9] py-1.5 text-xs text-[#232220] z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-2 border-b border-[#EBE6DC]">
                <p className="font-semibold text-[#232220]">Laxmi Patil</p>
                <p className="text-[11px] text-[#7A756D]">laxmipatil5106@gmail.com</p>
                <p className="text-[10px] font-mono text-[#C86D51] mt-0.5">Role: Supply Chain Lead</p>
              </div>

              <div className="py-1">
                <button
                  id="profile-dropdown-whatif"
                  onClick={() => {
                    setCurrentPage('simulator');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F2ECE4] flex items-center gap-2 text-[#4E4A43]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C86D51]" />
                  <span>What-If Simulator</span>
                </button>
                <button
                  id="profile-dropdown-models"
                  onClick={() => {
                    setCurrentPage('model-insights');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F2ECE4] flex items-center gap-2 text-[#4E4A43]"
                >
                  <Layers className="w-3.5 h-3.5 text-[#C86D51]" />
                  <span>Forecast Models & WAPE</span>
                </button>
                <button
                  id="profile-dropdown-settings"
                  onClick={() => {
                    setCurrentPage('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F2ECE4] flex items-center gap-2 text-[#4E4A43]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7A5A]" />
                  <span>Platform Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
