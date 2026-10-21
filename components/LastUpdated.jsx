'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Radio, Timer } from 'lucide-react';
import { formatTimestamp, formatRelativeTime } from '@/lib/formatters';

export default function LastUpdated({
  lastSuccessTime,
  observationTimestamp,
  intervalMs = 7000,
  isStale = false,
  isDemo = false
}) {
  const [, setTick] = useState(0);

  // Re-render every second so the relative time counter stays live
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <Clock className={`w-3.5 h-3.5 ${isStale ? 'text-amber-400' : 'text-cyan-400'}`} />
        <span>Last Polled:</span>
        <span className="font-mono text-slate-200">
          {lastSuccessTime ? formatRelativeTime(lastSuccessTime) : 'Pending...'}
        </span>
        {lastSuccessTime && (
          <span className="hidden sm:inline font-mono text-slate-500">
            ({new Date(lastSuccessTime).toLocaleTimeString()})
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {observationTimestamp && (
          <div className="flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Telemetry Epoch:</span>
            <span className="text-cyan-300">{formatTimestamp(observationTimestamp)}</span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-1.5 font-mono text-slate-500">
          <Timer className="w-3 h-3" />
          <span>Cadence: {Math.round(intervalMs / 1000)}s</span>
        </div>
      </div>
    </div>
  );
}
