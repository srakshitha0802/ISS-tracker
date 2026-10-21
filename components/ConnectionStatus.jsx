'use client';

import React from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw, Radio, Sparkles } from 'lucide-react';

export default function ConnectionStatus({ status, isDemo = false, isUpdating = false, errorMessage }) {
  if (isDemo) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black shadow-[0_0_12px_rgba(245,158,11,0.25)] backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
        <span className="tracking-wide">DEMO DATA — NOT LIVE</span>
      </div>
    );
  }

  switch (status) {
    case 'LIVE':
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black shadow-[0_0_15px_rgba(16,185,129,0.25)] backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <span className="tracking-wide">LIVE TELEMETRY</span>
        </div>
      );

    case 'UPDATING':
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span className="tracking-wide">UPDATING...</span>
        </div>
      );

    case 'STALE':
      return (
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.25)] backdrop-blur-md"
          title={errorMessage || 'Using last known coordinates'}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="tracking-wide">STALE DATA</span>
        </div>
      );

    case 'ERROR':
      return (
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300 text-xs font-black shadow-[0_0_15px_rgba(244,63,94,0.25)] backdrop-blur-md"
          title={errorMessage || 'Connection failure'}
        >
          <WifiOff className="w-3.5 h-3.5 text-rose-400" />
          <span className="tracking-wide">SIGNAL LOST</span>
        </div>
      );

    case 'INITIAL_LOADING':
    default:
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-white/20 text-slate-200 text-xs font-black backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-wide">ACQUIRING SIGNAL...</span>
        </div>
      );
  }
}
