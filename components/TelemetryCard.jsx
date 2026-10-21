'use client';

import React from 'react';

/**
 * Reusable Metric Card for Mission Control Telemetry
 */
export default function TelemetryCard({
  title,
  value,
  unit,
  subvalue,
  icon: Icon,
  badge,
  badgeVariant = 'default',
  highlight = false,
  tooltip
}) {
  const badgeStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  };

  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-300 border ${
        highlight
          ? 'bg-gradient-to-br from-slate-900/90 to-cyan-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
          : 'bg-slate-900/70 hover:bg-slate-900/90 border-slate-800/80 hover:border-slate-700 shadow-lg'
      } backdrop-blur-md flex flex-col justify-between`}
      title={tooltip}
    >
      {/* Top Header: Title & Icon/Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                badgeStyles[badgeVariant] || badgeStyles.default
              }`}
            >
              {badge}
            </span>
          )}
          {Icon && (
            <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-105 transition-all">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Main Metric Value & Unit */}
      <div className="my-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-slate-100 group-hover:text-cyan-200 transition-colors">
            {value}
          </span>
          {unit && (
            <span className="font-mono text-xs font-medium text-slate-400">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Subvalue / Helper Text */}
      {subvalue && (
        <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{subvalue}</span>
        </div>
      )}
    </div>
  );
}
