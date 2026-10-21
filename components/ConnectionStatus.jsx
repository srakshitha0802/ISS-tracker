'use client';

import React from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw, Radio, Sparkles } from 'lucide-react';

export default function ConnectionStatus({ status, isDemo = false, isUpdating = false, errorMessage }) {
  if (isDemo) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-800 text-xs font-black shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
        <span className="tracking-wide">DEMO DATA — NOT LIVE</span>
      </div>
    );
  }

  switch (status) {
    case 'LIVE':
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-black shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">LIVE TELEMETRY</span>
        </div>
      );

    case 'UPDATING':
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border-2 border-sky-300 text-sky-800 text-xs font-black shadow-sm">
          <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
          <span className="tracking-wide">UPDATING...</span>
        </div>
      );

    case 'STALE':
      return (
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-800 text-xs font-black shadow-sm"
          title={errorMessage || 'Using last known coordinates'}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span className="tracking-wide">STALE DATA</span>
        </div>
      );

    case 'ERROR':
      return (
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-black shadow-sm"
          title={errorMessage || 'Connection failure'}
        >
          <WifiOff className="w-3.5 h-3.5 text-rose-500" />
          <span className="tracking-wide">SIGNAL LOST</span>
        </div>
      );

    case 'INITIAL_LOADING':
    default:
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-700 text-xs font-black">
          <Radio className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
          <span className="tracking-wide">ACQUIRING SIGNAL...</span>
        </div>
      );
  }
}
