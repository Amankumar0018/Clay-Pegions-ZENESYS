import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  CheckSquare,
  FileText,
  Boxes,
  TrendingUp,
  ShieldCheck,
  Zap,
  MessageSquare,
  Mic,
  Search,
  Layers,
  ChevronRight,
  Bot,
  Flame,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPageScreen: React.FC = () => {
  const { setCurrentPage, setIsVoiceModeOpen } = useApp();

  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'organize' | 'stockout' | 'summarize'>('organize');
  const [typedMessage, setTypedMessage] = useState('');

  const interactiveExamples = {
    organize: {
      user: 'Help me organize my week and priorities.',
      miley:
        'Absolutely. I found three priorities and four flexible tasks. I recommend approving PO #8821 for 1,510 Wireless Earbuds today, expediting Order #10419 in Mumbai, and scheduling a supplier sync at 10 AM. Want me to turn them into a simple plan?',
      suggestedChip: 'Show my weekly plan in Tasks →',
      targetPage: 'tasks' as const,
    },
    stockout: {
      user: 'Which items are at critical stockout risk right now?',
      miley:
        'Wireless Earbuds has 6.2 days of cover left at Pune, but Supplier A needs 7 days lead time. Demand surged +24.5% this week. Reordering 1,510 units prevents ₹48,600 in lost revenue. Shall I draft the purchase order for you?',
      suggestedChip: 'Draft Wireless Earbuds PO →',
      targetPage: 'procurement' as const,
    },
    summarize: {
      user: 'Extract key takeaways from the Q3 Demand Calibration PDF.',
      miley:
        'Analyzed 8 SKU lines: 1) Western regional demand accelerated +24.5%, 2) Delhi Bluetooth Speaker curve lowered -18%, and 3) Forecast ensemble achieved 9.4% WAPE accuracy benchmark. All data is ready in your Knowledge Base.',
      suggestedChip: 'Inspect Document Insights →',
      targetPage: 'files' as const,
    },
  };

  const currentExample = interactiveExamples[activeInteractiveTab];

  return (
    <div id="miley-landing-page" className="min-h-screen bg-[#FAF8F5] text-[#232220] flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-[#EBE6DC] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Terracotta Miley Mark */}
          <div className="w-8 h-8 rounded-xl bg-[#C86D51] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-[#232220]">Miley</span>
            <span className="text-[10px] ml-2 font-medium px-2 py-0.5 rounded-full bg-[#F0EAE1] text-[#7A5043]">
              Your All-in-One Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="landing-enter-chat-btn"
            onClick={() => setCurrentPage('ai-assistant')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A554D] hover:text-[#232220] rounded-lg transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#C86D51]" />
            <span>Ask Miley</span>
          </button>

          <button
            id="landing-open-workspace-btn"
            onClick={() => setCurrentPage('command-center')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold rounded-xl shadow-xs transition-all hover:shadow-sm"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2EDE4] border border-[#E3DDD1] text-xs font-medium text-[#735A4D] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
          <span>Intelligent. Human. Tactile. Reliable.</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#232220] max-w-3xl leading-[1.12]">
          Everything you need. <br />
          <span className="text-[#C86D51]">Just ask Miley.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-5 text-base sm:text-lg text-[#6A665E] max-w-2xl leading-relaxed">
          Miley brings everyday AI assistance, task organization, document intelligence, and operational decision-making into one unified, calm workspace.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            id="hero-launch-workspace"
            onClick={() => setCurrentPage('command-center')}
            className="px-6 py-3 bg-[#C86D51] hover:bg-[#B75F44] text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_rgba(200,109,81,0.25)] transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <span>Explore Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-open-voice"
            onClick={() => setIsVoiceModeOpen(true)}
            className="px-5 py-3 bg-[#EFEBE2] hover:bg-[#E7E1D6] text-[#232220] border border-[#DFD7CB] text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <Mic className="w-4 h-4 text-[#C86D51]" />
            <span>Try Voice Mode</span>
          </button>
        </div>

        {/* Interactive Assistant Demo Card */}
        <div className="mt-14 w-full max-w-3xl bg-[#FFFFFF] rounded-2xl border border-[#E5E0D6] shadow-[0_12px_36px_rgba(0,0,0,0.04)] p-6 sm:p-8 text-left relative overflow-hidden">
          {/* Header tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#EFECE5]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C86D51]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#232220]">
                Live Assistant Interaction
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F5F2EC] p-1 rounded-lg border border-[#E7E2D9]">
              {(['organize', 'stockout', 'summarize'] as const).map((tab) => (
                <button
                  key={tab}
                  id={`tab-interactive-${tab}`}
                  onClick={() => setActiveInteractiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    activeInteractiveTab === tab
                      ? 'bg-white text-[#232220] shadow-2xs font-semibold'
                      : 'text-[#7A756D] hover:text-[#232220]'
                  }`}
                >
                  {tab === 'organize'
                    ? 'Organize Week'
                    : tab === 'stockout'
                    ? 'Stockout Risk'
                    : 'Document Analysis'}
                </button>
              ))}
            </div>
          </div>

          {/* Chat simulation */}
          <div className="mt-6 space-y-4">
            {/* User message */}
            <div className="flex items-start justify-end gap-3">
              <div className="bg-[#F0EAE1] text-[#232220] px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm font-medium max-w-lg border border-[#E4DCcf]">
                {currentExample.user}
              </div>
              <div className="w-8 h-8 rounded-full bg-[#E5DDD2] text-[#6B473A] font-bold text-xs flex items-center justify-center flex-shrink-0">
                LP
              </div>
            </div>

            {/* Miley message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C86D51] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-[#FAF8F5] text-[#232220] px-5 py-4 rounded-2xl rounded-tl-xs text-xs sm:text-sm leading-relaxed max-w-xl border border-[#EBE6DC] shadow-2xs space-y-3">
                <p>{currentExample.miley}</p>
                <div className="pt-1">
                  <button
                    id="interactive-demo-chip"
                    onClick={() => setCurrentPage(currentExample.targetPage)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                  >
                    <span>{currentExample.suggestedChip}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="px-6 py-16 bg-[#F4EFE6]/60 border-t border-[#E8E2D8]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#232220]">
              Built for how humans actually work
            </h2>
            <p className="text-xs sm:text-sm text-[#716C64]">
              No robotic scripts or cluttered developer panels. Just thoughtful, high-leverage workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Conversational Intelligence */}
            <div
              id="feature-card-chat"
              onClick={() => setCurrentPage('ai-assistant')}
              className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#F6EDE9] text-[#C86D51] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#232220] group-hover:text-[#C86D51] transition-colors">
                    Ask Miley Anything
                  </h3>
                  <p className="text-xs text-[#6A665E] mt-1.5 leading-relaxed">
                    Voice, text, and document grounding. Ask questions about your inventory, demand trends, or draft POs instantly.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#C86D51]">
                <span>Open Assistant</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 2: Tasks & Productivity */}
            <div
              id="feature-card-tasks"
              onClick={() => setCurrentPage('tasks')}
              className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2ED] text-[#3D7A5A] flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#232220] group-hover:text-[#3D7A5A] transition-colors">
                    Intelligent Tasks & Calendar
                  </h3>
                  <p className="text-xs text-[#6A665E] mt-1.5 leading-relaxed">
                    Miley automatically prioritizes tasks based on supply chain urgency, statutory safety lines, and lead times.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#3D7A5A]">
                <span>View Tasks & Calendar</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 3: Operations & Planning */}
            <div
              id="feature-card-ops"
              onClick={() => setCurrentPage('command-center')}
              className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5EDDE] text-[#C4842E] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#232220] group-hover:text-[#C4842E] transition-colors">
                    Operations & What-If Engine
                  </h3>
                  <p className="text-xs text-[#6A665E] mt-1.5 leading-relaxed">
                    Live demand forecasting, inventory velocity tracking across Pune, Mumbai, and Delhi hubs, plus scenario simulation.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#C4842E]">
                <span>Launch Command Center</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <footer className="mt-auto border-t border-[#EBE6DC] bg-[#FAF8F5] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#C86D51] text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-[#232220]">Miley — Your All-in-One Assistant</span>
          </div>

          <p className="text-xs text-[#7A756D]">
            Humanized intelligence. Built for modern operators.
          </p>

          <button
            id="footer-open-workspace"
            onClick={() => setCurrentPage('command-center')}
            className="px-4 py-2 bg-[#232220] hover:bg-[#383633] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Enter Workspace
          </button>
        </div>
      </footer>
    </div>
  );
};
