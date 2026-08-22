import React, { useState } from 'react';
import {
  Sliders,
  Check,
  Sparkles,
  Volume2,
  Mic,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const {
    appName,
    setAppName,
    addToast,
    assistantPersona,
    setAssistantPersona,
  } = useApp();

  const [localName, setLocalName] = useState(appName);
  const [leadTimeSafetyDays, setLeadTimeSafetyDays] = useState(2);
  const [stockoutThresholdDays, setStockoutThresholdDays] = useState(7);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName.trim()) {
      setAppName(localName.trim());
    }
    addToast(
      'Settings Saved',
      'Workspace configurations, assistant persona, and operational policies updated.',
      'success'
    );
  };

  return (
    <div id="settings-view" className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#F0EBE1]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#232220]">
            Settings & Assistant Preferences
          </h1>
          <p className="text-xs md:text-sm text-[#7A756D] mt-1">
            Configure Miley persona, voice interaction, forecasting safety buffers, and workspace defaults.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Miley Persona & Interaction Section */}
        <div className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C86D51]" />
            <h3 className="text-sm font-bold text-[#232220]">
              Miley Persona & Voice Experience
            </h3>
          </div>
          <p className="text-xs text-[#7A756D]">
            Customize how Miley communicates across chat and spoken voice interactions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4A463F]">
                Tone & Personality:
              </label>
              <select
                value={assistantPersona.tone}
                onChange={(e) =>
                  setAssistantPersona({
                    ...assistantPersona,
                    tone: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFD8CC] bg-[#FAF8F5] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              >
                <option value="warm">Warm & Encouraging (Humanized)</option>
                <option value="analytical">Analytical & Direct (Operations Focus)</option>
                <option value="concise">Concise & Executive (Quick Briefings)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4A463F]">
                Voice Profile:
              </label>
              <select
                value={assistantPersona.voiceStyle}
                onChange={(e) =>
                  setAssistantPersona({
                    ...assistantPersona,
                    voiceStyle: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFD8CC] bg-[#FAF8F5] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              >
                <option value="warm-natural">Soft Calm (Terracotta Natural)</option>
                <option value="bright">Bright & Energetic</option>
                <option value="crisp">Crisp Studio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Working Name */}
        <div className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#232220]">
              Product & Assistant Name
            </h3>
            <p className="text-xs text-[#7A756D]">
              Customizable platform working name. Updates header and navigation globally.
            </p>
          </div>

          <div className="max-w-md space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-[#4A463F]">
              Assistant Name:
            </label>
            <input
              id="assistant-name-input"
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFD8CC] bg-[#FAF8F5] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
            />
          </div>
        </div>

        {/* Operational Thresholds */}
        <div className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#232220]">
              Inventory & Forecasting Policy
            </h3>
            <p className="text-xs text-[#7A756D]">
              Define statutory triggers for autonomous PO drafting and alert horizons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC] space-y-2">
              <label className="text-xs font-semibold text-[#232220] block">
                Critical Stockout Alert Horizon:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="3"
                  max="14"
                  value={stockoutThresholdDays}
                  onChange={(e) => setStockoutThresholdDays(Number(e.target.value))}
                  className="flex-1 accent-[#C86D51]"
                />
                <span className="font-mono text-xs font-bold text-[#BA4336] w-14 text-right">
                  {stockoutThresholdDays} days
                </span>
              </div>
              <p className="text-[11px] text-[#7A756D]">
                Items with days cover below this threshold trigger priority alerts.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC] space-y-2">
              <label className="text-xs font-semibold text-[#232220] block">
                Lead Time Buffer (Safety Margin):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="7"
                  value={leadTimeSafetyDays}
                  onChange={(e) => setLeadTimeSafetyDays(Number(e.target.value))}
                  className="flex-1 accent-[#C86D51]"
                />
                <span className="font-mono text-xs font-bold text-[#3D7A5A] w-14 text-right">
                  +{leadTimeSafetyDays} days
                </span>
              </div>
              <p className="text-[11px] text-[#7A756D]">
                Added to supplier quoted lead time to protect against transit delay.
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            id="save-preferences-btn"
            type="submit"
            className="px-5 py-2.5 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

