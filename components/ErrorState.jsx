'use client';

import React from 'react';
import { AlertOctagon, RefreshCw, Eye, WifiOff } from 'lucide-react';

export default function ErrorState({ errorMessage, onRetry, onLoadDemo }) {
  return (
    <div className="rounded-2xl border border-rose-900/60 bg-gradient-to-b from-rose-950/40 to-slate-950 p-6 md:p-8 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-md">
      <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
        <WifiOff className="w-7 h-7" />
      </div>

      <h2 className="text-lg font-bold text-slate-100 mb-2">
        Telemetry Downlink Interrupted
      </h2>

      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        {errorMessage || 'Unable to establish a connection with the Where The ISS At? public satellite tracking API. This can happen due to temporary network disruptions or API rate limiting.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          id="btn-error-retry"
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>

        {onLoadDemo && (
          <button
            type="button"
            id="btn-error-demo"
            onClick={onLoadDemo}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>View Demo Telemetry</span>
          </button>
        )}
      </div>

      <p className="mt-4 text-[11px] text-slate-500">
        Demo mode allows you to inspect the interface layout without mistaking simulated telemetry for live data.
      </p>
    </div>
  );
}
