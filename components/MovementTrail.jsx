'use client';

import React, { useState } from 'react';
import { Route, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { formatLatitude, formatLongitude, formatAltitude, formatVelocity } from '@/lib/formatters';

export default function MovementTrail({
  trail = [],
  isTrailVisible = true,
  onToggleTrail,
  onClearTrail
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl glass-panel border border-white/12 overflow-hidden text-white shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Route className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Orbital Ground Track History</h3>
            <p className="text-[11px] text-slate-300 font-mono">
              {trail.length} telemetry points recorded this session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-trail-visibility"
            onClick={onToggleTrail}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isTrailVisible
                ? 'badge-gold font-bold'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            {isTrailVisible ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isTrailVisible ? 'Trail Active' : 'Trail Hidden'}</span>
          </button>

          {trail.length > 0 && (
            <button
              type="button"
              id="btn-trail-clear"
              onClick={onClearTrail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Trail
            </button>
          )}

          <button
            type="button"
            id="btn-trail-expand"
            onClick={() => setIsExpanded((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold glass-panel text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand Table'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Trail Table */}
      {trail.length === 0 ? (
        <div className="px-5 py-8 text-center text-slate-400 text-xs font-mono">
          Accumulating trajectory vector points as ISS orbits…
        </div>
      ) : (
        <div className={`overflow-x-auto ${isExpanded ? 'max-h-96' : 'max-h-52'} scrollbar-thin transition-all`}>
          <table className="w-full text-xs font-mono">
            <thead className="bg-black/40 text-amber-300/90 text-[10px] uppercase tracking-wider sticky top-0 border-b border-white/8 backdrop-blur-md">
              <tr>
                <th className="px-4 py-2.5 text-left font-bold">#</th>
                <th className="px-4 py-2.5 text-left font-bold">Latitude</th>
                <th className="px-4 py-2.5 text-left font-bold">Longitude</th>
                <th className="px-4 py-2.5 text-left font-bold">Altitude</th>
                <th className="px-4 py-2.5 text-left font-bold">Velocity</th>
                <th className="px-4 py-2.5 text-right font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 text-slate-200">
              {[...trail].reverse().map((pt, i) => (
                <tr
                  key={pt.timestamp || i}
                  className={`hover:bg-amber-500/8 transition-colors ${
                    i === 0 ? 'bg-amber-500/10 text-amber-200 font-bold' : ''
                  }`}
                >
                  <td className="px-4 py-2 text-slate-400">{trail.length - i}</td>
                  <td className="px-4 py-2 font-medium">{formatLatitude(pt.latitude)}</td>
                  <td className="px-4 py-2 font-medium">{formatLongitude(pt.longitude)}</td>
                  <td className="px-4 py-2 text-slate-300">{formatAltitude(pt.altitude)}</td>
                  <td className="px-4 py-2 text-slate-300">{formatVelocity(pt.velocity)}</td>
                  <td className="px-4 py-2 text-right text-slate-400">{pt.timeString || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
