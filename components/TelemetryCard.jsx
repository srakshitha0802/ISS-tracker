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
    default: 'bg-slate-900 text-slate-300 border-cyan-500/20',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]',
    indigo: 'bg-indigo-950/80 text-indigo-300 border-indigo-400/60',
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    rose: 'bg-rose-950/80 text-rose-300 border-rose-400/60'
  };

  return (
    <div
      className={`group relative rounded-none p-5 transition-all duration-300 border backdrop-blur-xl ${
        highlight
          ? 'bg-slate-950/85 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:border-cyan-300'
          : 'bg-slate-950/75 hover:bg-slate-900/85 border-cyan-500/25 hover:border-cyan-400/50 shadow-xl'
      } flex flex-col justify-between`}
      title={tooltip}
    >
      {/* Precision Corner Accent Marks */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400" />

      {/* Top Header: Title & Icon/Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-none border ${
                badgeStyles[badgeVariant] || badgeStyles.default
              }`}
            >
              {badge}
            </span>
          )}
          {Icon && (
            <div className="p-1.5 rounded-none bg-slate-900 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shadow-sm">
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
