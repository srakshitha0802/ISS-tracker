'use client';

import React from 'react';
import { Satellite, Loader2 } from 'lucide-react';
import { AstronautSticker, SparkleDoodle } from './SpaceStickers';

export default function LoadingState() {
  return (
    <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-12 text-center max-w-lg mx-auto shadow-2xl backdrop-blur-2xl relative overflow-hidden text-white">
      <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping"></div>
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
          <Satellite className="w-8 h-8 animate-pulse text-white" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
          Acquiring ISS Telemetry...
        </h2>
      </div>

      <p className="text-xs text-slate-300 font-mono mb-4">
        Connecting to WhereTheISS.at REST API for NORAD #25544
      </p>

      {/* Loading progress bar */}
      <div className="mt-4 h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/15">
        <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 w-1/2 animate-shimmer rounded-full"></div>
      </div>

      <div className="mt-6 flex justify-center">
        <AstronautSticker size={52} />
      </div>
    </div>
  );
}
