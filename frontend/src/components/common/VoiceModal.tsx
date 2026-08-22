import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VoiceModal: React.FC = () => {
  const {
    isVoiceModeOpen,
    setIsVoiceModeOpen,
    voiceState,
    setVoiceState,
    voiceTranscript,
    setVoiceTranscript,
    setCurrentPage,
    addToast,
    assistantPersona,
  } = useApp();

  const [aiResponse, setAiResponse] = useState<string>('');
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  const sampleVoicePrompts = [
    'Help me organize my priorities and tasks for today.',
    'Why is Wireless Earbuds at critical stockout risk?',
    'What should we purchase this week to protect inventory?',
    'Which supplier is recommended for our upcoming replenishment?',
    'Summarize delayed shipments and carrier impacts in Mumbai.',
  ];

  useEffect(() => {
    if (!isVoiceModeOpen) {
      setVoiceState('idle');
      setVoiceTranscript('');
      setAiResponse('');
    }
  }, [isVoiceModeOpen, setVoiceState, setVoiceTranscript]);

  if (!isVoiceModeOpen) return null;

  const handleStartListening = () => {
    setVoiceState('listening');
    setAiResponse('');
    setVoiceTranscript('');

    const prompt = sampleVoicePrompts[activeSampleIndex];
    let charIdx = 0;

    const interval = setInterval(() => {
      if (charIdx <= prompt.length) {
        setVoiceTranscript(prompt.slice(0, charIdx));
        charIdx += 2;
      } else {
        clearInterval(interval);
        setVoiceState('processing');

        setTimeout(() => {
          setVoiceState('speaking');
          if (prompt.includes('organize')) {
            setAiResponse(
              "I've organized your day around 3 critical tasks: 1) Approve the Wireless Earbuds PO for 1,510 units, 2) Expedite the delayed Mumbai order #10419 with Bharat Precision, and 3) Prep for your 10 AM Supply Chain Sync. Would you like me to open your Tasks board?"
            );
          } else if (prompt.includes('stockout') || prompt.includes('Wireless Earbuds')) {
            setAiResponse(
              'Wireless Earbuds has 6.2 days of stock remaining at Pune, but Supplier A requires a 7-day lead time. Demand surged 24.5% this week. Reordering 1,510 units now protects ₹48,600 in revenue.'
            );
          } else if (prompt.includes('purchase')) {
            setAiResponse(
              'For Week 34, I recommend purchasing 1,510 units of Wireless Earbuds via Supplier A and 410 Smart Watch Series 4 units via Supplier C to hedge against delays. Bluetooth Speakers has 450 excess units, so skip reordering.'
            );
          } else {
            setAiResponse(
              'I found 12 delayed shipments, notably Order #10419 in Mumbai due to component bottlenecks. 37 downstream customer deliveries are impacted. Rerouting 50 units to Supplier C reserve will resolve the bottleneck.'
            );
          }
        }, 1200);
      }
    }, 45);
  };

  const handleStopListening = () => {
    if (voiceState === 'listening') {
      setVoiceState('processing');
      setTimeout(() => {
        setVoiceState('speaking');
        setAiResponse(
          "I heard your request. All telemetry and operational data are synced. You have 3 priority recommendations and 4 tasks pending today."
        );
      }, 1000);
    } else {
      setVoiceState('idle');
    }
  };

  const handleActionClick = () => {
    setIsVoiceModeOpen(false);
    if (voiceTranscript.includes('organize') || voiceTranscript.includes('task')) {
      setCurrentPage('tasks');
    } else if (voiceTranscript.includes('stockout') || voiceTranscript.includes('forecast')) {
      setCurrentPage('demand-forecast');
    } else if (voiceTranscript.includes('purchase') || voiceTranscript.includes('PO')) {
      setCurrentPage('procurement');
    } else {
      setCurrentPage('ai-assistant');
    }
  };

  return (
    <div
      id="voice-assistant-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#232220]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div
        id="voice-modal-card"
        className="w-full max-w-lg bg-[#FAF8F5] rounded-2xl border border-[#E7E2D9] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EBE6DC] flex items-center justify-between bg-[#F5F1EA]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#C86D51] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#232220]">Miley Voice Assistant</h3>
              <p className="text-[11px] text-[#7A756D]">Real-time conversational intelligence</p>
            </div>
          </div>
          <button
            id="close-voice-modal"
            onClick={() => setIsVoiceModeOpen(false)}
            className="p-1.5 rounded-lg text-[#7A756D] hover:text-[#232220] hover:bg-[#EAE4DB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Visualizer Area */}
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
          {/* Animated Waveform / Mic Circle */}
          <div className="relative flex items-center justify-center">
            {voiceState === 'listening' && (
              <div className="absolute w-32 h-32 rounded-full bg-[#C86D51]/15 animate-ping" />
            )}
            {voiceState === 'speaking' && (
              <div className="absolute w-32 h-32 rounded-full bg-[#3D7A5A]/15 animate-pulse" />
            )}

            <button
              id="voice-mic-main-button"
              onClick={voiceState === 'listening' ? handleStopListening : handleStartListening}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                voiceState === 'listening'
                  ? 'bg-[#C86D51] text-white scale-105 shadow-[#C86D51]/30'
                  : voiceState === 'processing'
                  ? 'bg-[#D6884F] text-white animate-pulse'
                  : voiceState === 'speaking'
                  ? 'bg-[#3D7A5A] text-white'
                  : 'bg-[#EDE7DE] text-[#232220] hover:bg-[#E4DDD2] hover:scale-105'
              }`}
            >
              {voiceState === 'processing' ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : voiceState === 'speaking' ? (
                <Volume2 className="w-8 h-8" />
              ) : voiceState === 'listening' ? (
                <Mic className="w-8 h-8 animate-pulse" />
              ) : (
                <Mic className="w-8 h-8 text-[#C86D51]" />
              )}
              <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider opacity-90">
                {voiceState === 'idle'
                  ? 'Tap to speak'
                  : voiceState === 'listening'
                  ? 'Listening...'
                  : voiceState === 'processing'
                  ? 'Thinking...'
                  : 'Speaking...'}
              </span>
            </button>
          </div>

          {/* Sound wave bars (simulated) */}
          {voiceState === 'listening' && (
            <div className="flex items-center gap-1.5 h-8">
              {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#C86D51] rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Live Transcript Display */}
          <div className="w-full min-h-[70px] p-4 bg-[#F5F1EA] rounded-xl border border-[#E7E2D9] text-left">
            <div className="text-[10px] font-bold text-[#8A8479] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{voiceTranscript ? 'What Miley Heard' : 'Try saying something like'}</span>
              {voiceState === 'listening' && (
                <span className="flex items-center gap-1 text-[#C86D51] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C86D51] animate-ping" />
                  Live
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#232220] font-medium leading-relaxed">
              {voiceTranscript || `"${sampleVoicePrompts[activeSampleIndex]}"`}
            </p>
          </div>

          {/* AI Response Output */}
          {aiResponse && (
            <div className="w-full p-4 bg-[#EAF2ED] border border-[#C6DDD0] rounded-xl text-left animate-in fade-in duration-300">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#3D7A5A] uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Miley Responded</span>
              </div>
              <p className="text-xs sm:text-sm text-[#232220] leading-relaxed">
                {aiResponse}
              </p>
              <button
                id="voice-response-navigate-btn"
                onClick={handleActionClick}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3D7A5A] hover:bg-[#316348] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <span>Take Action in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Suggested Voice Prompts Carousel */}
          {voiceState === 'idle' && (
            <div className="w-full text-left space-y-2">
              <div className="text-[11px] font-semibold text-[#7A756D]">
                Suggested questions:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleVoicePrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    id={`sample-prompt-${idx}`}
                    onClick={() => {
                      setActiveSampleIndex(idx);
                      handleStartListening();
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-[#EFEBE3] hover:bg-[#EAE4DB] text-[#4A463F] border border-[#DFD8CC] transition-colors text-left"
                  >
                    "{prompt.length > 35 ? prompt.slice(0, 35) + '...' : prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#EBE6DC] bg-[#F5F1EA] flex items-center justify-between text-xs text-[#7A756D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3D7A5A]"></span>
            <span>Tone: {assistantPersona.tone.charAt(0).toUpperCase() + assistantPersona.tone.slice(1)}</span>
          </div>
          <span>Natural speech powered by Miley</span>
        </div>
      </div>
    </div>
  );
};
