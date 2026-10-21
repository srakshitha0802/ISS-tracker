'use client';

import React from 'react';
import { Satellite, RefreshCw, Sparkles, Orbit, Radio, Compass, Users } from 'lucide-react';
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
    <header className="border-b-2 border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Branding with Cute Space Stickers */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-200 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Satellite className="w-6 h-6 text-sky-600 animate-pulse" />
                </div>
              </div>
              {/* Floating mini sticker on top of logo */}
              <div className="absolute -top-2 -right-2">
                <RocketSticker size={24} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  ISS Tracker
                  <span className="hidden sm:inline text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Live
                  </span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  NORAD #25544
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Live Space Station Telemetry & Interactive Orbital Science Dashboard
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs for Advanced Features */}
          <div className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 gap-1">
            <button
              type="button"
              id="tab-tracker"
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('tracker');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-sky-500" />
              <span>Live Tracker</span>
            </button>

            <button
              type="button"
              id="tab-sighting"
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('sighting');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sighting'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Distance & Sightings</span>
            </button>

            <button
              type="button"
              id="tab-crew"
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('crew');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'crew'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-500" />
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
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
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
                  ? 'bg-sky-500 hover:bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-200 cursor-pointer active:scale-95'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
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
