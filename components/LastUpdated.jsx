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

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-none bg-slate-950/80 border border-cyan-500/25 text-xs font-mono font-semibold text-slate-300 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Clock className={`w-4 h-4 ${isStale ? 'text-amber-400' : 'text-cyan-400'}`} />
        <span>Last Polled:</span>
        <span className="font-mono text-white font-bold">
          {lastSuccessTime ? formatRelativeTime(lastSuccessTime) : 'Pending...'}
        </span>
        {lastSuccessTime && (
          <span className="hidden sm:inline font-mono text-slate-400">
            ({new Date(lastSuccessTime).toLocaleTimeString()})
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {observationTimestamp && (
          <div className="flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-sans">Observation Epoch:</span>
            <span className="text-white font-bold">{formatTimestamp(observationTimestamp)}</span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-1.5 font-mono text-slate-400">
          <Timer className="w-3.5 h-3.5 text-slate-400" />
          <span>Cadence: {Math.round(intervalMs / 1000)}s</span>
        </div>
      </div>
    </div>
  );
}
