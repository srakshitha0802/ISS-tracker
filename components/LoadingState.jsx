'use client';

import React from 'react';
import { Satellite, Loader2, Radio } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="rounded-none border border-cyan-500/30 bg-slate-950/85 p-12 text-center max-w-lg mx-auto shadow-2xl backdrop-blur-2xl relative overflow-hidden text-white font-mono">
      {/* Corner Notches */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

      <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <div className="absolute inset-0 border border-cyan-400/40 animate-ping"></div>
        <div className="relative z-10 w-16 h-16 rounded-none bg-slate-900 border border-cyan-400/80 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Satellite className="w-8 h-8 animate-pulse text-cyan-400" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
        <h2 className="text-sm font-bold text-white uppercase tracking-widest">
          Acquiring ISS Telemetry...
        </h2>
      </div>

      <p className="text-xs text-slate-400 mb-6">
        Connecting to WhereTheISS.at REST API for NORAD #25544
      </p>

      {/* Loading progress bar */}
      <div className="h-1.5 w-full bg-slate-900 rounded-none overflow-hidden border border-cyan-500/30">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-300 w-1/2 animate-shimmer"></div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-cyan-300/80 uppercase tracking-wider">
        <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
        <span>Downlink Uplink In Progress</span>
      </div>
    </div>
  );
}
