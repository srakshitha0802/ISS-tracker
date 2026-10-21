'use client';

import React from 'react';

/**
 * Reusable Metric Card for Modern Mission Control (Glassy Dark Aesthetic)
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
    default: 'bg-slate-800/80 text-slate-300 border-white/10',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  };

  return (
    <div
      className={`group relative rounded-3xl p-5 transition-all duration-300 border backdrop-blur-xl ${
        highlight
          ? 'bg-gradient-to-br from-slate-900/85 via-cyan-950/50 to-slate-950/85 border-cyan-400/50 shadow-[0_8px_32px_0_rgba(6,182,212,0.2)] hover:-translate-y-1 hover:border-cyan-400'
          : 'bg-slate-950/65 hover:bg-slate-900/75 border-white/10 hover:border-white/20 shadow-xl hover:-translate-y-1'
      } flex flex-col justify-between`}
      title={tooltip}
    >
      {/* Top Header: Title & Icon/Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                badgeStyles[badgeVariant] || badgeStyles.default
              }`}
            >
              {badge}
            </span>
          )}
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Main Metric Value & Unit */}
      <div className="my-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl md:text-3xl font-black tracking-tight text-white group-hover:text-cyan-200 transition-colors">
            {value}
          </span>
          {unit && (
            <span className="font-mono text-xs font-bold text-slate-400">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Subvalue / Helper Text */}
      {subvalue && (
        <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
          <span>{subvalue}</span>
        </div>
      )}
    </div>
  );
}
