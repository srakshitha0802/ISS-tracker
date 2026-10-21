'use client';

import React from 'react';
import { Satellite, RefreshCw, Sparkles, Orbit, Radio, Compass, Users, Activity } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import { AstronautSticker, RocketSticker } from './SpaceStickers';
import { soundEffects } from '@/lib/audio';

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
    <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40 shadow-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Branding with Space Graphic */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center">
                  <Satellite className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2">
                <RocketSticker size={24} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                  ISS Tracker
                  <span className="hidden sm:inline text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                    Live
                  </span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-300 border border-white/10">
                  NORAD #25544
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Live Space Station Telemetry & Interactive Orbital Science Dashboard
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <div className="flex items-center bg-slate-900/60 backdrop-blur-lg p-1.5 rounded-2xl border border-white/10 gap-1 overflow-x-auto">
            <button
              type="button"
              id="tab-tracker"
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('tracker');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'tracker'
                  ? 'bg-cyan-500/20 text-cyan-200 shadow-sm border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Flight Track</span>
            </button>

            <button
              type="button"
              id="tab-sighting"
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('sighting');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'sighting'
                  ? 'bg-amber-500/20 text-amber-200 shadow-sm border border-amber-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Distance Radar</span>
            </button>

            <button
              type="button"
              id="tab-physics"
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('physics');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'physics'
                  ? 'bg-purple-500/20 text-purple-200 shadow-sm border border-purple-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Solar & Physics</span>
            </button>

            <button
              type="button"
              id="tab-crew"
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('crew');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'crew'
                  ? 'bg-indigo-500/20 text-indigo-200 shadow-sm border border-indigo-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Crew (7)</span>
            </button>
          </div>

          {/* Right Status & Action Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            <ConnectionStatus
              status={status}
              isDemo={isDemo}
              isUpdating={isManualRefreshing || status === 'UPDATING'}
            />

            {/* Simulation Toggle */}
            <button
              type="button"
              id="btn-toggle-simulation"
              onClick={() => {
                soundEffects.playClick();
                onToggleSimulation();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all ${
                isSimulationMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSimulationMode ? 'Exit Demo' : 'Simulate Demo'}</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              type="button"
              id="btn-manual-refresh"
              onClick={() => {
                soundEffects.playQuindarBeep();
                onRefresh();
              }}
              disabled={!canManualRefresh || isManualRefreshing}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold border transition-all ${
                canManualRefresh && !isManualRefreshing
                  ? 'bg-cyan-600/80 hover:bg-cyan-500 text-white border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95'
                  : 'bg-slate-900/50 text-slate-500 border-white/5 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin' : ''}`} />
              <span>{isManualRefreshing ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
