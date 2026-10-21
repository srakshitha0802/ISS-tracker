'use client';

import React from 'react';
import { RefreshCw, Sparkles, Orbit, Compass, Users, Activity } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import ISSLogo from './ISSLogo';
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
    <header className="border-b border-cyan-500/30 bg-slate-950/85 backdrop-blur-2xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Branding with Sharp Aerospace ISS Logo */}
          <ISSLogo size="md" onClick={() => onSelectTab('tracker')} />

          {/* Center Navigation Tabs - Sharp HUD Design */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-none border border-cyan-500/30 gap-1 overflow-x-auto shadow-inner">
            <button
              type="button"
              id="tab-tracker"
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('tracker');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === 'tracker'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === 'sighting'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === 'physics'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === 'crew'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Crew (7)</span>
            </button>
          </div>

          {/* Right Status & Action Controls - Sharp HUD Controls */}
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                isSimulationMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-950/80 text-slate-300 border-cyan-500/30 hover:bg-slate-900 hover:text-white hover:border-cyan-400'
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
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                canManualRefresh && !isManualRefreshing
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95'
                  : 'bg-slate-900 text-slate-500 border-white/5 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin' : ''}`} />
              <span>{isManualRefreshing ? 'Polling...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
