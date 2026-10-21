'use client';

import React from 'react';
import { AlertOctagon, RefreshCw, Eye, WifiOff } from 'lucide-react';
import { AstronautSticker } from './SpaceStickers';

export default function ErrorState({ errorMessage, onRetry, onLoadDemo }) {
  return (
    <div className="rounded-3xl border-2 border-rose-200 bg-white/95 p-8 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-md">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-sm">
        <WifiOff className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-black text-slate-900 mb-2">
        Telemetry Downlink Interrupted
      </h2>

      <p className="text-xs text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
        {errorMessage || 'Unable to establish a connection with the Where The ISS At? public satellite tracking API. This can happen due to temporary network disruptions or API rate limiting.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          id="btn-error-retry"
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>

        {onLoadDemo && (
          <button
            type="button"
            id="btn-error-demo"
            onClick={onLoadDemo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-amber-600" />
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
