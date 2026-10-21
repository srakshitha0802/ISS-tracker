'use client';

import React from 'react';
import { Satellite, Loader2 } from 'lucide-react';
import { AstronautSticker, SparkleDoodle } from './SpaceStickers';

export default function LoadingState() {
  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white/95 p-12 text-center max-w-lg mx-auto shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-sky-400/30 animate-ping"></div>
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-200">
          <Satellite className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
        <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
          Acquiring ISS Telemetry...
        </h2>
      </div>

      <p className="text-xs text-slate-500 font-mono mb-4">
        Connecting to WhereTheISS.at REST API for NORAD #25544
      </p>

      {/* Loading progress bar */}
      <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 w-1/2 animate-shimmer rounded-full"></div>
      </div>

      <div className="mt-6 flex justify-center">
        <AstronautSticker size={52} />
      </div>
    </div>
  );
}
