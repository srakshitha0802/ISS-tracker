'use client';

import React, { useState } from 'react';
import { Route, Trash2, Eye, EyeOff, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { formatLatitude, formatLongitude, formatAltitude, formatVelocity } from '@/lib/formatters';

export default function MovementTrail({
  trail = [],
  isTrailVisible = true,
  onToggleTrail,
  onClearTrail
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md overflow-hidden">
      {/* Header bar */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400">
            <Route className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                Recorded Flight Path
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                {trail.length} / 30 pts
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live session trajectory breadcrumbs recorded in browser memory
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-trail-visibility"
            onClick={onToggleTrail}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isTrailVisible
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {isTrailVisible ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isTrailVisible ? 'Trail Shown' : 'Trail Hidden'}</span>
          </button>

          {trail.length > 0 && (
            <button
              type="button"
              id="btn-trail-clear"
              onClick={onClearTrail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-900/40 hover:border-rose-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            id="btn-trail-toggle-expand"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label={isExpanded ? 'Collapse trail history' : 'Expand trail history'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Trajectory Disclaimer Alert */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-850 flex items-center gap-2 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          Note: Trail represents sequential observation points recorded during your current browser session, not a full 92-minute orbit.
        </span>
      </div>

      {/* History table (expandable or default preview) */}
      {trail.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs">
          <Route className="w-6 h-6 mx-auto mb-2 text-slate-600 animate-pulse" />
          No movement points recorded yet. Points will populate automatically as telemetry refreshes.
        </div>
      ) : (
        <div className={`overflow-x-auto transition-all ${isExpanded ? 'max-h-72' : 'max-h-40'} overflow-y-auto scrollbar-thin`}>
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/70 text-slate-400 sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Observation Time</th>
                <th className="py-2 px-3">Latitude</th>
                <th className="py-2 px-3">Longitude</th>
                <th className="py-2 px-3">Altitude</th>
                <th className="py-2 px-3">Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trail
                .slice()
                .reverse()
                .map((pt, idx) => {
                  const isLatest = idx === 0;
                  return (
                    <tr
                      key={`${pt.timestamp}-${idx}`}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isLatest ? 'bg-cyan-950/30 text-cyan-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-1.5 px-3 text-slate-500">
                        {isLatest ? (
                          <span className="flex items-center gap-1 text-cyan-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            NOW
                          </span>
                        ) : (
                          `#${trail.length - idx}`
                        )}
                      </td>
                      <td className="py-1.5 px-3 text-slate-400">{pt.timeString || '—'}</td>
                      <td className="py-1.5 px-3 font-mono">{formatLatitude(pt.latitude)}</td>
                      <td className="py-1.5 px-3 font-mono">{formatLongitude(pt.longitude)}</td>
                      <td className="py-1.5 px-3">{formatAltitude(pt.altitude)}</td>
                      <td className="py-1.5 px-3">{formatVelocity(pt.velocity)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
