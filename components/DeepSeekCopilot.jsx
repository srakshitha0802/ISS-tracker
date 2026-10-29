'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Orbit,
  Radio,
  Zap,
  Users,
  Sun,
  Globe,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  ExternalLink,
  Cpu
} from 'lucide-react';
import {
  queryDeepSeekAI,
  getStoredApiKey,
  setStoredApiKey,
  testApiKeyConnection
} from '@/lib/deepseekApi';
import { getGeographicRegion } from '@/lib/geocoding';

// Suggested quick-ask prompts with gold and cyan accents
const QUICK_PROMPTS = [
  { icon: Sparkles, label: 'How AI Works', prompt: 'Explain how AI works in a few words' },
  { icon: Orbit, label: 'Live Orbital Telemetry', prompt: 'Give me a live orbital telemetry briefing for the ISS right now.' },
  { icon: Zap, label: 'Orbital Mechanics', prompt: 'Explain the physics of why the ISS maintains orbit without falling.' },
  { icon: Users, label: 'Expedition 72 Crew', prompt: 'Who is on the Expedition 72 crew right now and what science are they performing?' },
  { icon: Radio, label: 'Radio Frequencies', prompt: 'What frequencies does the ISS use for ARISS amateur radio downlinks and packets?' },
  { icon: Sun, label: 'Solar Power System', prompt: 'How do the ISS solar arrays and Li-ion batteries manage orbital eclipse cycles?' },
  { icon: Globe, label: 'Severe Weather Scan', prompt: 'How does the ISS detect cyclones, severe weather storms, and floods from space?' }
];

// Renders markdown-like formatting in the assistant responses
function FormattedMessage({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let listBuffer = [];
  let inNumberedList = false;

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1.5 my-2.5 pl-2">
          {listBuffer.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-slate-200 text-xs sm:text-sm">
              <span className="text-cyan-400 font-bold shrink-0 mt-0.5">{inNumberedList ? `${i + 1}.` : '▸'}</span>
              <span dangerouslySetInnerHTML={{ __html: processInline(item) }} />
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
      inNumberedList = false;
    }
  };

  lines.forEach((line, i) => {
    const numbered = line.match(/^(\d+)\.\s+(.+)/);
    const bulleted = line.match(/^[-*•]\s+(.+)/);
    const heading = line.match(/^\*\*(.+)\*\*$/);
    const quote = line.match(/^>\s+(.+)/);
    const empty = line.trim() === '';

    if (heading) {
      flushList();
      elements.push(
        <p key={i} className="font-extrabold text-cyan-300 mt-3.5 mb-1.5 text-sm sm:text-base tracking-wide flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          {heading[1]}
        </p>
      );
    } else if (quote) {
      flushList();
      elements.push(
        <div key={i} className="my-2.5 p-3 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-xs text-amber-200 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: processInline(quote[1]) }} />
        </div>
      );
    } else if (numbered) {
      if (!inNumberedList) { flushList(); inNumberedList = true; }
      listBuffer.push(numbered[2]);
    } else if (bulleted) {
      if (inNumberedList) { flushList(); }
      listBuffer.push(bulleted[1]);
    } else if (empty) {
      flushList();
      elements.push(<div key={i} className="h-1.5" />);
    } else if (line.trim()) {
      flushList();
      elements.push(
        <p
          key={i}
          className="text-slate-200 leading-relaxed text-xs sm:text-sm"
          dangerouslySetInnerHTML={{ __html: processInline(line) }}
        />
      );
    }
  });

  flushList();
  return <div className="space-y-1">{elements}</div>;
}

function processInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-200 font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-black/40 text-cyan-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-cyan-500/20">$1</code>');
}

export default function DeepSeekCopilot({ currentPosition }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [hasAutoGreeted, setHasAutoGreeted] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [activeModel, setActiveModel] = useState('Autonomous Onboard AI');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);
  const [testState, setTestState] = useState({ status: 'idle', message: '' });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize stored key on mount
  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) {
      setApiKey(stored);
      setKeyInput(stored);
      setActiveModel(detectModelLabel(stored));
    }
  }, []);

  const region = currentPosition
    ? getGeographicRegion(currentPosition.latitude, currentPosition.longitude)
    : { name: 'Low Earth Orbit' };

  const telemetry = {
    latitude: currentPosition?.latitude || 0,
    longitude: currentPosition?.longitude || 0,
    altitude: currentPosition?.altitude || 420,
    velocity: currentPosition?.velocity || 27580,
    visibility: currentPosition?.visibility || 'daylight',
    regionName: region.name,
    footprint: currentPosition?.footprint || 4500,
    timestamp: currentPosition?.timestamp || Math.floor(Date.now() / 1000)
  };

  function detectModelLabel(key) {
    if (!key) return 'Google Gemini Flash';
    if (key.startsWith('AIza') || key.startsWith('AQ.')) return 'Google Gemini Flash';
    if (key.startsWith('gsk_')) return 'Groq (Llama-3.3)';
    if (key.startsWith('sk-or-')) return 'OpenRouter AI';
    if (key.startsWith('sk-proj-')) return 'OpenAI (GPT-4o)';
    return 'Google Gemini AI';
  }

  // Initial welcome greeting
  useEffect(() => {
    if (!hasAutoGreeted && currentPosition) {
      setHasAutoGreeted(true);
      const greeting = {
        role: 'assistant',
        id: 'welcome',
        model: activeModel,
        content: `**ORBITAL COPILOT INTELLIGENCE ONLINE**

Ground tracking verified. Cruising at **${Math.round(currentPosition.velocity || 27580).toLocaleString()} km/h** (~Mach ${((currentPosition.velocity || 27580) / 1236).toFixed(1)}) at **${Math.round(currentPosition.altitude || 420)} km** altitude over **${region.name}**.

I can answer **any questions** across all domains — from live ISS orbital dynamics, upcoming ground passes, and Expedition 72 crew experiments, to weather forecasts, natural disaster tracking, astronomy, mathematics, and general science.`
      };
      setMessages([greeting]);
    }
  }, [hasAutoGreeted, currentPosition, region.name, activeModel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (textToSend) => {
      const query = (textToSend || input).trim();
      if (!query || isLoading) return;

      const userMessage = {
        role: 'user',
        content: query,
        id: Date.now()
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);
      setError(null);

      const historyForApi = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      try {
        const result = await queryDeepSeekAI(historyForApi, telemetry, {
          apiKey,
          stream: false
        });

        if (result?.model) {
          setActiveModel(result.model);
        }

        const assistantMessage = {
          role: 'assistant',
          content: result.content,
          model: result.model || activeModel,
          id: Date.now() + 1
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(err.message || 'Error communicating with AI Copilot.');
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, messages, isLoading, telemetry, apiKey, activeModel]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setHasAutoGreeted(false);
  };

  const handleSaveKey = () => {
    const trimmed = keyInput.trim();
    setApiKey(trimmed);
    setStoredApiKey(trimmed);
    setActiveModel(detectModelLabel(trimmed));
    setTestState({ status: 'success', message: 'API Key saved to your browser session!' });
    setTimeout(() => {
      setShowKeyModal(false);
      setTestState({ status: 'idle', message: '' });
    }, 1200);
  };

  const handleClearKey = () => {
    setKeyInput('');
    setApiKey('');
    setStoredApiKey('');
    setActiveModel('Autonomous Onboard AI');
    setTestState({ status: 'idle', message: 'Key removed. Operating on autonomous onboard intelligence.' });
  };

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestState({ status: 'error', message: 'Please enter an API key to test.' });
      return;
    }
    setTestState({ status: 'testing', message: 'Testing connection to provider...' });
    const res = await testApiKeyConnection(keyInput.trim());
    if (res.ok) {
      setTestState({
        status: 'success',
        message: `✓ Connected successfully to ${res.provider} (${res.model})!`
      });
    } else {
      setTestState({
        status: 'error',
        message: `✕ Authentication failed: ${res.error}`
      });
    }
  };

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel-blue border border-cyan-400/40 overflow-hidden shadow-2xl relative">
      {/* ── Cyan Corner Accent Brackets ── */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-20" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20 bg-black/50 backdrop-blur-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-cyan-200/40">
              <Bot className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-300 border-2 border-slate-950 shadow-[0_0_8px_#38bdf8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight font-display">
                ORBITAL <span className="text-blue-gradient font-black">AI COPILOT</span>
              </h3>
              <span className="hidden sm:inline-block text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-mono font-bold">
                ● {activeModel.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              Live AI Intelligence · Multi-Domain Q&A Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Overflight region pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full badge-blue text-[10px] font-mono font-bold">
            <Globe className="w-3 h-3 text-cyan-400" />
            {region.name}
          </div>

          {/* API Key Settings Button */}
          <button
            type="button"
            onClick={() => {
              setKeyInput(apiKey || getStoredApiKey());
              setShowKeyModal(true);
            }}
            title="Configure AI API Key (DeepSeek, Groq, OpenAI)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.2)]"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden md:inline">{apiKey ? 'Key Active' : 'API Key'}</span>
          </button>

          {/* Clear chat */}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              title="Clear conversation"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Message Feed ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 min-h-0 scrollbar-thin">
        {/* Empty state — quick prompt grid */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/25 via-sky-400/20 to-blue-500/25 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)]">
                <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">Ask ORBITAL Anything</h4>
              <p className="text-xs text-slate-300 max-w-sm">
                Equipped with live ISS telemetry, orbital physics, severe weather tracking, and general science intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 w-full max-w-2xl">
              {QUICK_PROMPTS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(p.prompt)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl glass-panel hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] text-left transition-all group cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-200 leading-tight">
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Conversation messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(56,189,248,0.4)] border border-cyan-300/40">
                <Bot className="w-4 h-4 text-slate-950 font-bold" />
              </div>
            )}

            {/* Bubble */}
            <div className={`group relative max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`px-4 sm:px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-500/30 via-sky-500/25 to-blue-600/30 border border-cyan-400/50 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(56,189,248,0.25)]'
                    : 'glass-panel-silver rounded-tl-sm text-slate-100 shadow-[0_6px_24px_rgba(0,0,0,0.5)] border border-white/15'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <FormattedMessage content={msg.content} />
                ) : (
                  <span className="font-medium text-white">{msg.content}</span>
                )}
              </div>

              {/* Bottom tag & copy button */}
              <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 font-mono">
                {msg.model && (
                  <span className="text-cyan-300/80 font-semibold">{msg.model}</span>
                )}
                {msg.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-opacity cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading state */}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <Bot className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <div className="max-w-[85%] px-5 py-3.5 rounded-2xl rounded-tl-sm glass-panel-silver flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span className="text-xs font-mono text-cyan-200">
                ORBITAL Intelligence is synthesizing response…
              </span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div className="space-y-1">
              <span className="font-bold">Notice:</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Prompts Row (when chat is active) ── */}
      {messages.length > 0 && !isLoading && (
        <div className="px-4 pb-2.5 flex gap-2 overflow-x-auto scrollbar-thin shrink-0">
          {QUICK_PROMPTS.slice(0, 4).map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendMessage(p.prompt)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel hover:border-cyan-400/40 text-[11px] font-medium text-slate-300 hover:text-cyan-200 transition-all cursor-pointer"
            >
              <p.icon className="w-3 h-3 text-cyan-400" />
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Bar ── */}
      <div className="px-4 py-4 border-t border-cyan-500/20 bg-black/55 backdrop-blur-2xl shrink-0">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              id="orbital-chat-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask anything — orbit physics, weather, math calculations, science, space facts…"
              rows={1}
              disabled={isLoading}
              className="w-full resize-none bg-black/50 border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none transition-all disabled:opacity-50 pr-10 shadow-inner font-sans"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(56,189,248,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-slate-950 font-bold" />
            )}
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>Press Enter to send · Shift+Enter for newline</span>
          <span className="flex items-center gap-1 text-cyan-300 font-mono">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            {apiKey ? 'API Key Active' : 'Autonomous Engine Active'}
          </span>
        </div>
      </div>

      {/* ── API Key Configuration Modal ── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel-blue border border-cyan-400/50 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.3)] p-6 relative">
            <button
              type="button"
              onClick={() => {
                setShowKeyModal(false);
                setTestState({ status: 'idle', message: '' });
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">AI Provider Settings</h3>
                <p className="text-xs text-slate-300">
                  Google Gemini (Recommended), DeepSeek, Groq, or OpenAI
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <label className="text-slate-200 font-semibold">
                    API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-2"
                  >
                    Get Free Gemini Key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKeyText ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => {
                      setKeyInput(e.target.value);
                      setTestState({ status: 'idle', message: '' });
                    }}
                    placeholder="Paste Gemini (AQ... or AIzaSy...) or DeepSeek (sk-...)"
                    className="w-full bg-black/60 border border-cyan-500/40 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 font-mono text-xs pr-10 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(!showKeyText)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Supported Providers Guide */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
                <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Supported Providers:
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px] pl-1 font-mono">
                  <li>• <strong className="text-cyan-300">Google Gemini (Recommended)</strong>: Free keys start with <code className="text-cyan-300 font-bold">AQ.</code> or <code className="text-cyan-300 font-bold">AIzaSy</code> (Gemini Flash Latest)</li>
                  <li>• <strong className="text-white">Groq (Fast Free Alternative)</strong>: Keys start with <code className="text-cyan-300 font-bold">gsk_</code> (Llama-3.3)</li>
                  <li>• <strong className="text-white">DeepSeek</strong>: Keys start with <code className="text-cyan-300 font-bold">sk-</code> from platform.deepseek.com</li>
                  <li>• <strong className="text-white">OpenAI</strong>: Keys start with <code className="text-cyan-300 font-bold">sk-proj-</code></li>
                </ul>
              </div>

              {/* Status Message */}
              {testState.message && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    testState.status === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                      : testState.status === 'error'
                      ? 'bg-rose-500/15 border border-rose-500/30 text-rose-200'
                      : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-200'
                  }`}
                >
                  {testState.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {testState.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                  {testState.status === 'testing' && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0 mt-0.5" />}
                  <span className="leading-relaxed">{testState.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer font-mono text-xs"
                >
                  Clear Key
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={testState.status === 'testing'}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold transition-all cursor-pointer text-xs"
                  >
                    Test Key
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer text-xs"
                  >
                    Save & Activate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
