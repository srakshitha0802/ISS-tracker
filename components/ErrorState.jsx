'use client';

import React from 'react';
import { AlertOctagon, RefreshCw, Eye, WifiOff } from 'lucide-react';
import { AstronautSticker } from './SpaceStickers';

export default function ErrorState({ errorMessage, onRetry, onLoadDemo }) {
  return (
    <div className="rounded-3xl border border-rose-500/30 bg-slate-950/75 p-8 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-2xl text-white">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400 shadow-sm">
        <WifiOff className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-black text-white mb-2">
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>

        {onLoadDemo && (
          <button
            type="button"
            id="btn-error-demo"
            onClick={onLoadDemo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-all cursor-pointer active:scale-95 shadow-sm"
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
