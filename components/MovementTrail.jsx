'use client';

import React, { useState } from 'react';
import { Route, Trash2, Eye, EyeOff, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { formatLatitude, formatLongitude, formatAltitude, formatVelocity } from '@/lib/formatters';
import { soundEffects } from '@/lib/audio';

export default function MovementTrail({
  trail = [],
  isTrailVisible = true,
  onToggleTrail,
  onClearTrail
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/65 shadow-2xl backdrop-blur-xl overflow-hidden text-white">
      {/* Header bar */}
      <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wide">
                Recorded Flight Path
              </h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                {trail.length} / 30 Observations
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time sequence of orbital points recorded during your browser session
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-trail-visibility"
            onClick={() => {
              soundEffects.playClick();
              onToggleTrail();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              isTrailVisible
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 hover:bg-cyan-500/30'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:bg-slate-800'
            }`}
          >
            {isTrailVisible ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>{isTrailVisible ? 'Trail Shown' : 'Trail Hidden'}</span>
          </button>

          {trail.length > 0 && (
            <button
              type="button"
              id="btn-trail-clear"
              onClick={() => {
                soundEffects.playClick();
                onClearTrail();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Trail</span>
            </button>
          )}

          <button
            type="button"
            id="btn-trail-toggle-expand"
            onClick={() => {
              soundEffects.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors"
            aria-label={isExpanded ? 'Collapse trail history' : 'Expand trail history'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Trajectory Disclaimer Alert */}
      <div className="px-5 py-2.5 bg-slate-900/40 border-b border-white/10 flex items-center gap-2 text-xs font-medium text-cyan-200">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Note: This trail maps sequential observations from your current active browser session, not a full 92-minute orbit.
        </span>
      </div>

      {/* History table */}
      {trail.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-medium">
          <Route className="w-8 h-8 mx-auto mb-2 text-slate-500 animate-pulse" />
          No movement points recorded yet. Points populate automatically every 7 seconds.
        </div>
      ) : (
        <div className={`overflow-x-auto transition-all ${isExpanded ? 'max-h-80' : 'max-h-44'} overflow-y-auto scrollbar-thin`}>
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 sticky top-0 border-b border-white/10 font-bold backdrop-blur-md">
              <tr>
                <th className="py-2.5 px-4">#</th>
                <th className="py-2.5 px-4">Observation Time</th>
                <th className="py-2.5 px-4">Latitude</th>
                <th className="py-2.5 px-4">Longitude</th>
                <th className="py-2.5 px-4">Altitude</th>
                <th className="py-2.5 px-4">Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trail
                .slice()
                .reverse()
                .map((pt, idx) => {
                  const isLatest = idx === 0;
                  return (
                    <tr
                      key={`${pt.timestamp}-${idx}`}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isLatest ? 'bg-cyan-950/30 text-cyan-200 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-4 text-slate-400">
                        {isLatest ? (
                          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                            LATEST
                          </span>
                        ) : (
                          `#${trail.length - idx}`
                        )}
                      </td>
                      <td className="py-2 px-4 text-slate-400">{pt.timeString || '—'}</td>
                      <td className="py-2 px-4 font-bold text-cyan-300">{formatLatitude(pt.latitude)}</td>
                      <td className="py-2 px-4 font-bold text-cyan-300">{formatLongitude(pt.longitude)}</td>
                      <td className="py-2 px-4 text-white">{formatAltitude(pt.altitude)}</td>
                      <td className="py-2 px-4 text-white">{formatVelocity(pt.velocity)}</td>
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
