'use client';

import React from 'react';
import { Satellite, Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-amber-400/50 animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl glass-panel-gold border border-amber-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.25)]">
          <Satellite className="w-8 h-8 text-amber-300 animate-float" />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2 text-sm font-extrabold text-white">
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          Synchronizing Real-Time ISS Telemetry…
        </div>
        <p className="text-xs text-slate-300 font-mono">
          Connecting to NORAD #25544 · CARTO Basemap Engine
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-52 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 animate-shimmer" />
      </div>
    </div>
  );
}
