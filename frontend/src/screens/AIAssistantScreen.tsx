import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Database,
  ArrowRight,
  Sparkles,
  Mic,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGES, CHAT_KNOWLEDGE_BASE, QUICK_ACTION_PROMPTS } from '../data/mockData';

export const AIAssistantScreen: React.FC = () => {
  const {
    appName,
    setCurrentPage,
    setActivePOModalProduct,
    applyPreset,
    products,
    setIsVoiceModeOpen,
    assistantPersona,
    files,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate grounded data retrieval & processing
    setTimeout(() => {
      let matchedKey = 'stockout';
      const lower = text.toLowerCase();

      if (lower.includes('purchase') || lower.includes('buy') || lower.includes('procure')) {
        matchedKey = 'purchase';
      } else if (lower.includes('supplier') || lower.includes('vendor') || lower.includes('earbuds')) {
        matchedKey = 'supplier';
      } else if (lower.includes('delay') || lower.includes('transit') || lower.includes('late')) {
        matchedKey = 'delayed';
      } else if (lower.includes('why') || lower.includes('reason') || lower.includes('risk')) {
        matchedKey = 'why';
      } else if (lower.includes('stockout') || lower.includes('inventory') || lower.includes('deplet')) {
        matchedKey = 'stockout';
      }

      const kbItem = CHAT_KNOWLEDGE_BASE[matchedKey] || CHAT_KNOWLEDGE_BASE['stockout'];

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: kbItem.answer,
        dataSources: kbItem.sources,
        suggestedActions: kbItem.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: NonNullable<ChatMessage['suggestedActions']>[0]) => {
    switch (action.actionType) {
      case 'NAVIGATE':
        setCurrentPage(action.payload);
        break;
      case 'OPEN_PO':
        const prod = products.find((p) => p.name === action.payload) || products[0];
        setActivePOModalProduct(prod);
        break;
      case 'SIMULATE':
        applyPreset(action.payload);
        setCurrentPage('simulator');
        break;
      default:
        break;
    }
  };

  return (
    <div id="ai-assistant-view" className="space-y-4 animate-in fade-in duration-200 h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Title & Subtitle with Persona Indicator */}
      <div className="pb-2 border-b border-[#F0EBE1] flex-shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#232220]">
              Ask {appName}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0EAE1] text-[#7A5043]">
              All-in-One Assistant
            </span>
          </div>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Grounded in live telemetry, warehouse inventory, carrier GPS, and {files.length} indexed documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="assistant-voice-mode-trigger"
            onClick={() => setIsVoiceModeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF3ED] hover:bg-[#F4EAE0] text-[#7A5043] border border-[#E8DDD2] text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Mic className="w-3.5 h-3.5 text-[#C86D51]" />
            <span>Voice Mode</span>
          </button>
        </div>
      </div>

      {/* Main Conversational Container */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-[#E5E0D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                id={`chat-message-${msg.id}`}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#F7EBE8] border border-[#ECD1C8] text-[#C86D51] flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#232220] text-[#FBF9F5] rounded-tr-xs'
                      : 'bg-[#FAF8F5] border border-[#EAE3DA] text-[#232220] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {/* Message body with formatted lines */}
                  <div className="space-y-2 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Grounding Data Sources Badge */}
                  {msg.dataSources && msg.dataSources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#EBE4D8] flex items-center gap-2 flex-wrap text-[11px] text-[#7A756D]">
                      <Database className="w-3.5 h-3.5 text-[#C86D51]" />
                      <span className="font-semibold text-[#5A554D]">Grounding Sources:</span>
                      {msg.dataSources.map((src, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white border border-[#DDD6CA] text-[#4A463F] font-mono text-[10px]"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Quick Actions inside the message */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-[#EBE4D8] space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8479]">
                        Operational Shortcuts:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(act)}
                            className="px-2.5 py-1 bg-white hover:bg-[#F5F1EA] border border-[#DDD6CA] text-[#C86D51] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-2 font-mono ${
                      isUser ? 'text-white/60' : 'text-[#969085]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#EFEAE2] border border-[#DDD6CA] text-[#6B473A] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    LP
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3.5 justify-start items-center text-xs text-[#7A756D]">
              <div className="w-8 h-8 rounded-xl bg-[#F7EBE8] border border-[#ECD1C8] text-[#C86D51] flex items-center justify-center font-bold text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#ECE5DA] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C86D51] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C86D51] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C86D51] animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-xs">Miley is synthesizing inventory, carrier feeds & notes...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Starter Questions Strip */}
        <div className="p-3 border-t border-[#F0EBE1] bg-[#FAF8F5] flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-[#8A8479] flex-shrink-0">
            Suggested:
          </span>
          {QUICK_ACTION_PROMPTS.map((q, i) => (
            <button
              key={i}
              id={`quick-prompt-btn-${i}`}
              onClick={() => handleSendMessage(q.prompt)}
              className="px-2.5 py-1 bg-white hover:bg-[#F5F1EA] border border-[#DDD6CA] text-[#3D3A34] rounded-lg text-xs font-medium whitespace-nowrap transition-colors shadow-2xs flex items-center gap-1"
            >
              <span className="text-[10px] text-[#C86D51] font-semibold uppercase">[{q.category}]</span>
              <span>{q.title}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-[#F0EBE1] flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setIsVoiceModeOpen(true)}
            className="p-2 text-[#7A756D] hover:text-[#C86D51] hover:bg-[#FAF3ED] rounded-xl transition-colors"
            title="Speak with Miley"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            id="assistant-chat-input"
            type="text"
            placeholder="Ask Miley anything: 'Help me organize my week', stockout reasons, PO recommendations..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#DDD6CA] bg-[#FAF8F5] text-[#232220] placeholder:text-[#8A8479] focus:outline-hidden focus:border-[#C86D51] focus:bg-white transition-colors"
          />

          <button
            id="assistant-send-btn"
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-[#C86D51] hover:bg-[#B75F44] disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};

