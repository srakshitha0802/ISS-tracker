'use client';

import React from 'react';
import { Satellite, RefreshCw, Sparkles, Orbit, Radio } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

export default function DashboardHeader({
  status,
  isDemo = false,
  isManualRefreshing = false,
  canManualRefresh = true,
  isSimulationMode = false,
  onRefresh,
  onToggleSimulation
}) {
  return (
    <header className="border-b border-cyan-950/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-[0_0_15px_rgba(56,189,248,0.35)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Satellite className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                ISS Tracker
                <span className="hidden sm:inline text-xs font-normal text-slate-400">
                  — Live Space Station Tracker
                </span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                NORAD #25544
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              International Space Station Orbital Telemetry & Real-Time Geospatial Tracking
            </p>
          </div>
        </div>

        {/* Right Status & Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Connection Status Pill */}
          <ConnectionStatus
            status={status}
            isDemo={isDemo}
            isUpdating={isManualRefreshing || status === 'UPDATING'}
          />

          {/* Simulation Toggle Button for Testing / Demo */}
          <button
            type="button"
            id="btn-toggle-simulation"
            onClick={onToggleSimulation}
            title={
              isSimulationMode
                ? 'Switch back to live Where The ISS At? API stream'
                : 'Simulate API failure and test demo data fallback'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isSimulationMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulationMode ? 'Exit Demo' : 'Simulate Demo'}</span>
          </button>

          {/* Manual Refresh Button with Rate-Limit Cooldown Protection */}
          <button
            type="button"
            id="btn-manual-refresh"
            onClick={onRefresh}
            disabled={!canManualRefresh || isManualRefreshing}
            aria-label="Refresh ISS telemetry immediately"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              canManualRefresh && !isManualRefreshing
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.25)] cursor-pointer'
                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-70'
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isManualRefreshing ? 'Refreshing' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
