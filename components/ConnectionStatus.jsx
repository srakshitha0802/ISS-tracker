'use client';

import React from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw, Radio, Sparkles } from 'lucide-react';

export default function ConnectionStatus({ status, isDemo = false, isUpdating = false, errorMessage }) {
  if (isDemo) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
        <span className="tracking-wide">DEMO DATA — NOT LIVE</span>
      </div>
    );
  }

  switch (status) {
    case 'LIVE':
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wider">LIVE TELEMETRY</span>
        </div>
      );

    case 'UPDATING':
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_12px_rgba(56,189,248,0.2)]">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span className="tracking-wider">UPDATING...</span>
        </div>
      );

    case 'STALE':
      return (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          title={errorMessage || 'Using last known coordinates'}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="tracking-wider">STALE DATA</span>
        </div>
      );

    case 'ERROR':
      return (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.2)]"
          title={errorMessage || 'Connection failure'}
        >
          <WifiOff className="w-3.5 h-3.5 text-rose-400" />
          <span className="tracking-wider">SIGNAL LOST</span>
        </div>
      );

    case 'INITIAL_LOADING':
    default:
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-wider">ACQUIRING SIGNAL...</span>
        </div>
      );
  }
}
