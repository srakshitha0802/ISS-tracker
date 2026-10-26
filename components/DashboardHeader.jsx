'use client';

import React from 'react';
import { RefreshCw, Orbit, Compass, Users, Activity, Bot, Satellite, Zap, Sparkles } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

const NAV_TABS = [
  { id: 'tracker', label: 'Orbital Tracker', icon: Orbit, color: 'gold' },
  { id: 'copilot', label: 'DeepSeek AI', icon: Bot, color: 'gold', accent: true },
  { id: 'sighting', label: 'Radar Pass', icon: Compass, color: 'silver' },
  { id: 'physics', label: 'Physics Engine', icon: Activity, color: 'silver' },
  { id: 'crew', label: 'Expedition 72', icon: Users, color: 'silver' }
];

export default function DashboardHeader({
  status,
  isDemo = false,
  isManualRefreshing = false,
  canManualRefresh = true,
  isSimulationMode = false,
  activeTab = 'tracker',
  onSelectTab,
  onRefresh,
  onToggleSimulation
}) {
  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 py-2.5 pointer-events-auto">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel px-4 sm:px-6 py-2.5 rounded-2xl flex items-center justify-between gap-4 border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">

          {/* ── Brand with Shiny Gold & Silver ── */}
          <button
            type="button"
            onClick={() => onSelectTab('tracker')}
            className="flex items-center gap-3 shrink-0 group text-left cursor-pointer"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
              <Satellite className="w-5 h-5 text-slate-950" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  ISS <span className="text-gold-gradient">TRACKER</span>
                </span>
                <span className="hidden md:inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono font-semibold">
                  PRO
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="text-[10px] text-slate-300 font-mono font-medium">NORAD #25544 · LEO</span>
              </div>
            </div>
          </button>

          {/* ── Geometric Glassy Navigation Tabs ── */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-black/30 border border-white/8" aria-label="Main navigation">
            {NAV_TABS.map(({ id, label, icon: Icon, color, accent }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  id={`tab-${id}`}
                  onClick={() => onSelectTab(id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-500/25 text-amber-200 border border-amber-400/60 shadow-[0_0_16px_rgba(245,158,11,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/6 border border-transparent'
                  } ${accent && !isActive ? 'text-amber-300/90' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'} ${accent && !isActive ? 'animate-pulse text-amber-400' : ''}`} />
                  <span>{label}</span>
                  {accent && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ConnectionStatus
              status={status}
              isDemo={isDemo}
              isUpdating={isManualRefreshing || status === 'UPDATING'}
            />

            {/* Simulation Toggle */}
            <button
              type="button"
              id="btn-toggle-simulation"
              onClick={onToggleSimulation}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isSimulationMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:text-white hover:border-amber-400/30'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSimulationMode ? 'Simulation Active' : 'Simulate'}</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              type="button"
              id="btn-manual-refresh"
              onClick={onRefresh}
              disabled={!canManualRefresh || isManualRefreshing}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                canManualRefresh && !isManualRefreshing
                  ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 text-amber-200 border-amber-400/40 hover:border-amber-400 hover:shadow-[0_0_16px_rgba(245,158,11,0.3)] cursor-pointer active:scale-95'
                  : 'bg-white/5 text-slate-500 border-white/6 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isManualRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isManualRefreshing ? 'Polling…' : 'Sync'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto scrollbar-thin py-2 px-1 mt-1">
          {NAV_TABS.map(({ id, label, icon: Icon, accent }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'glass-panel-gold text-amber-200 border-amber-400/60 font-bold'
                    : 'glass-panel text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
