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
    <div className="rounded-3xl border-2 border-slate-200/90 bg-white/95 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Header bar */}
      <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 border border-sky-300 text-sky-600 flex items-center justify-center shadow-sm">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Recorded Flight Path
              </h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                {trail.length} / 30 Observations
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
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
                ? 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isTrailVisible ? <Eye className="w-4 h-4 text-sky-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
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
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label={isExpanded ? 'Collapse trail history' : 'Expand trail history'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Trajectory Disclaimer Alert */}
      <div className="px-5 py-2.5 bg-sky-50/60 border-b border-sky-100 flex items-center gap-2 text-xs font-medium text-sky-900">
        <Info className="w-4 h-4 text-sky-600 shrink-0" />
        <span>
          Note: This trail maps sequential observations from your current active browser session, not a full 92-minute orbit.
        </span>
      </div>

      {/* History table */}
      {trail.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-medium">
          <Route className="w-8 h-8 mx-auto mb-2 text-slate-300 animate-pulse" />
          No movement points recorded yet. Points populate automatically every 7 seconds.
        </div>
      ) : (
        <div className={`overflow-x-auto transition-all ${isExpanded ? 'max-h-80' : 'max-h-44'} overflow-y-auto scrollbar-thin`}>
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-2.5 px-4">#</th>
                <th className="py-2.5 px-4">Observation Time</th>
                <th className="py-2.5 px-4">Latitude</th>
                <th className="py-2.5 px-4">Longitude</th>
                <th className="py-2.5 px-4">Altitude</th>
                <th className="py-2.5 px-4">Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trail
                .slice()
                .reverse()
                .map((pt, idx) => {
                  const isLatest = idx === 0;
                  return (
                    <tr
                      key={`${pt.timestamp}-${idx}`}
                      className={`hover:bg-slate-50 transition-colors ${
                        isLatest ? 'bg-sky-50 text-sky-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <td className="py-2 px-4 text-slate-400">
                        {isLatest ? (
                          <span className="flex items-center gap-1.5 text-sky-600 font-bold">
                            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                            LATEST
                          </span>
                        ) : (
                          `#${trail.length - idx}`
                        )}
                      </td>
                      <td className="py-2 px-4 text-slate-500">{pt.timeString || '—'}</td>
                      <td className="py-2 px-4 font-bold">{formatLatitude(pt.latitude)}</td>
                      <td className="py-2 px-4 font-bold">{formatLongitude(pt.longitude)}</td>
                      <td className="py-2 px-4">{formatAltitude(pt.altitude)}</td>
                      <td className="py-2 px-4">{formatVelocity(pt.velocity)}</td>
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
