'use client';

import React from 'react';

/**
 * Reusable Metric Card for Modern Mission Control (Light/White Aesthetic)
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
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    cyan: 'bg-sky-100 text-sky-800 border-sky-300',
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rose: 'bg-rose-100 text-rose-800 border-rose-300'
  };

  return (
    <div
      className={`group relative rounded-3xl p-5 transition-all duration-300 border-2 ${
        highlight
          ? 'bg-gradient-to-br from-white via-sky-50/60 to-blue-50/80 border-sky-400 shadow-xl shadow-sky-100/60 hover:-translate-y-1'
          : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300 shadow-lg shadow-slate-100 hover:-translate-y-1'
      } flex flex-col justify-between`}
      title={tooltip}
    >
      {/* Top Header: Title & Icon/Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
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
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Main Metric Value & Unit */}
      <div className="my-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl md:text-3xl font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
            {value}
          </span>
          {unit && (
            <span className="font-mono text-xs font-bold text-slate-500">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Subvalue / Helper Text */}
      {subvalue && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
          <span>{subvalue}</span>
        </div>
      )}
    </div>
  );
}
