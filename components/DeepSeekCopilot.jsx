'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Key,
  RefreshCw,
  Copy,
  Check,
  Cpu,
  Orbit,
  Radio,
  Zap,
  Shield,
  HelpCircle,
  ExternalLink,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import {
  queryDeepSeekAI,
  getStoredApiKey,
  setStoredApiKey
} from '@/lib/deepseekApi';
import { soundEffects } from '@/lib/audio';
import { getGeographicRegion } from '@/lib/geocoding';

const PRESET_QUERIES = [
  {
    label: 'Live Trajectory Briefing',
    icon: Orbit,
    prompt: 'Generate an immediate orbital situation report and flight dynamics briefing based on current telemetry.'
  },
  {
    label: 'Orbital Free-Fall Physics',
    icon: Zap,
    prompt: 'Explain why the ISS remains in orbit at 27,600 km/h without falling, detailing centripetal force and atmospheric drag.'
  },
  {
    label: 'Expedition 72 Science',
    icon: Sparkles,
    prompt: 'What microgravity experiments and biological investigations are Commander Sunita Williams and the Expedition 72 crew running today?'
  },
  {
    label: 'HAM Radio & Doppler Shift',
    icon: Radio,
    prompt: 'What are the ARISS amateur radio downlink frequencies for the ISS, and calculate the Doppler shift at current orbital velocity?'
  }
];

export default function DeepSeekCopilot({ currentPosition }) {
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState(() => getStoredApiKey());
  const [customInput, setCustomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [modelInfo, setModelInfo] = useState('deepseek-chat');
  const [hasCopied, setHasCopied] = useState(false);

  const terminalEndRef = useRef(null);

  // Compute live contextual data
  const region = currentPosition
    ? getGeographicRegion(currentPosition.latitude, currentPosition.longitude)
    : { name: 'Earth Orbit' };

  const telemetryContext = {
    latitude: currentPosition?.latitude || 0,
    longitude: currentPosition?.longitude || 0,
    altitude: currentPosition?.altitude || 420,
    velocity: currentPosition?.velocity || 27580,
    visibility: currentPosition?.visibility || 'daylight',
    regionName: region.name
  };

  // Run analysis query
  const executeQuery = async (queryText) => {
    if (!queryText.trim() || isLoading) return;
    soundEffects.playQuindarBeep();
    setIsLoading(true);

    try {
      const result = await queryDeepSeekAI(telemetryContext, queryText, apiKey);
      setActiveAnalysis(result.content);
      setModelInfo(result.model);
      soundEffects.playRadarPing();
    } catch (err) {
      setActiveAnalysis(`ERROR: Failed to contact DeepSeek AI services: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial briefing on first mount if none exists
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted && !activeAnalysis && currentPosition) {
        executeQuery(PRESET_QUERIES[0].prompt);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition?.latitude]);

  const handleSaveKey = () => {
    soundEffects.playClick();
    setStoredApiKey(tempKeyInput);
    setApiKey(tempKeyInput);
    setShowKeyModal(false);
  };

  const handleClearKey = () => {
    soundEffects.playClick();
    setStoredApiKey('');
    setApiKey('');
    setTempKeyInput('');
    setShowKeyModal(false);
  };

  const handleCopy = () => {
    if (!activeAnalysis) return;
    navigator.clipboard.writeText(activeAnalysis);
    setHasCopied(true);
    soundEffects.playClick();
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950/85 rounded-none p-6 md:p-8 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-white font-mono relative space-y-6">
      {/* Corner Notches */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-none bg-indigo-950/80 border border-indigo-400/60 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>DeepSeek Orbital Copilot</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-indigo-950 text-indigo-300 border border-indigo-500/40 uppercase">
                  AI Telemetry Analyst
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous astrophysics copilot powered by the DeepSeek API • Real-time telemetry synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* API Key Modal Button */}
          <button
            type="button"
            id="btn-deepseek-key-settings"
            onClick={() => {
              soundEffects.playClick();
              setShowKeyModal(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              apiKey
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-500/30'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? 'API Key Active' : 'Configure DeepSeek Key'}</span>
          </button>

          <button
            type="button"
            onClick={() => executeQuery(customInput || PRESET_QUERIES[0].prompt)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Reasoning...' : 'Re-Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry Ribbon Sent to DeepSeek */}
      <div className="p-3 bg-slate-900/90 border border-cyan-500/20 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
            DeepSeek Telemetry Feed:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="bg-slate-950 px-2 py-0.5 border border-white/10">
            Target: <strong className="text-white">{region.name}</strong>
          </span>
          <span className="bg-slate-950 px-2 py-0.5 border border-white/10">
            Position: <strong className="text-white">{telemetryContext.latitude.toFixed(2)}°, {telemetryContext.longitude.toFixed(2)}°</strong>
          </span>
          <span className="bg-slate-950 px-2 py-0.5 border border-white/10">
            Speed: <strong className="text-cyan-300">Mach {(telemetryContext.velocity / 1080).toFixed(1)}</strong>
          </span>
          <span className="bg-slate-950 px-2 py-0.5 border border-white/10">
            Model: <strong className="text-indigo-300">{modelInfo}</strong>
          </span>
        </div>
      </div>

      {/* Preset Query Action Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Orbital Inquiry Quick Actions:</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_QUERIES.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setCustomInput(preset.prompt);
                  executeQuery(preset.prompt);
                }}
                disabled={isLoading}
                className="flex items-center gap-2 p-2.5 text-left rounded-none bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/20 hover:border-cyan-400 text-slate-200 transition-all text-xs group cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <div className="p-1.5 bg-slate-950 rounded-none border border-cyan-500/30 text-cyan-400 group-hover:text-cyan-300">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[11px] uppercase tracking-wider">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DeepSeek Aerospace Readout Terminal */}
      <div className="relative bg-slate-950 rounded-none border border-cyan-500/40 p-4 sm:p-6 shadow-inner">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-cyan-300 font-bold uppercase tracking-wider">
              DeepSeek AI Real-Time Telemetry Readout
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-cyan-500/30 transition-all cursor-pointer"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Output Area */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-cyan-300">
            <Bot className="w-8 h-8 animate-bounce text-cyan-400" />
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-cyan-400 animate-ping rounded-full" />
              <span>DeepSeek AI synthesizing orbital mechanics...</span>
            </div>
          </div>
        ) : activeAnalysis ? (
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-line space-y-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {activeAnalysis}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-xs">
            Select an orbital inquiry or ask DeepSeek AI below.
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Custom Prompt Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeQuery(customInput);
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            id="input-deepseek-query"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask DeepSeek AI (e.g. 'Calculate orbital decay at 420km with current solar flux')..."
            className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-xs px-4 py-3 border border-cyan-500/40 rounded-none focus:outline-none focus:border-cyan-300 shadow-inner font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !customInput.trim()}
          className="flex items-center gap-2 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer disabled:opacity-50 transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask DeepSeek</span>
        </button>
      </form>

      {/* DeepSeek API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-cyan-500/50 p-6 max-w-md w-full shadow-[0_0_40px_rgba(6,182,212,0.3)] space-y-4 font-mono text-white relative">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm uppercase">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>DeepSeek API Configuration</span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your official DeepSeek API Key (<code className="text-cyan-300">sk-...</code>) to unlock live direct requests to <strong className="text-white">api.deepseek.com</strong>.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="deepseek-api-key" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                DeepSeek API Key:
              </label>
              <input
                id="deepseek-api-key"
                type="password"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-slate-900 border border-cyan-500/40 text-white text-xs p-2.5 rounded-none font-mono focus:border-cyan-300 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block pt-1">
                Stored strictly in your local browser storage. Never transmitted to third-party tracking servers.
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20">
              {apiKey ? (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-3 py-1.5 bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase hover:bg-rose-900 transition-colors"
                >
                  Remove Key
                </button>
              ) : (
                <a
                  href="https://platform.deepseek.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveKey}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider border border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
