'use client';

import React from 'react';
import { RefreshCw, Eye, WifiOff } from 'lucide-react';

export default function ErrorState({ errorMessage, onRetry, onLoadDemo }) {
  return (
    <div className="rounded-none border border-rose-500/40 bg-slate-950/85 p-8 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-2xl text-white font-mono relative">
      {/* Corner Notches */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-rose-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-rose-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-400" />

      <div className="w-16 h-16 rounded-none bg-rose-500/10 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
        <WifiOff className="w-8 h-8" />
      </div>

      <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">
        Telemetry Downlink Interrupted
      </h2>

      <p className="text-xs text-slate-300 mb-6 leading-relaxed max-w-md mx-auto">
        {errorMessage || 'Unable to establish a connection with the Where The ISS At? public satellite tracking API. This can happen due to temporary network disruptions or API rate limiting.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          id="btn-error-retry"
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2 rounded-none text-xs font-bold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95 border border-cyan-300"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>

        {onLoadDemo && (
          <button
            type="button"
            id="btn-error-demo"
            onClick={onLoadDemo}
            className="flex items-center gap-2 px-5 py-2 rounded-none text-xs font-bold uppercase tracking-wider bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-amber-300" />
            <span>View Demo Telemetry</span>
          </button>
        )}
      </div>

      <p className="mt-6 text-[11px] text-slate-400">
        Demo mode allows you to inspect the full interface layout without waiting for external API connectivity.
      </p>
    </div>
  );
}
