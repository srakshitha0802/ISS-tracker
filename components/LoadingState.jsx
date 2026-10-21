'use client';

import React from 'react';
import { Satellite, Radio, Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="rounded-2xl border border-cyan-900/40 bg-slate-950/70 p-10 text-center max-w-lg mx-auto shadow-2xl backdrop-blur-md">
      <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping"></div>
        <div className="relative z-10 w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
          <Satellite className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
        <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
          Acquiring ISS Telemetry...
        </h2>
      </div>

      <p className="text-xs text-slate-400 font-mono">
        Interrogating WhereTheISS.at REST API for NORAD Catalogue #25544
      </p>

      {/* Loading progress bars */}
      <div className="mt-6 space-y-2">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-1/2 animate-shimmer rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
