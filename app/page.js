'use client';

import React, { useState } from 'react';
import { useISSPosition } from '@/hooks/useISSPosition';
import DashboardHeader from '@/components/DashboardHeader';
import ISSMapLoader from '@/components/ISSMapLoader';
import TelemetryGrid from '@/components/TelemetryGrid';
import LastUpdated from '@/components/LastUpdated';
import MovementTrail from '@/components/MovementTrail';
import PassCalculator from '@/components/PassCalculator';
import CrewPanel from '@/components/CrewPanel';
import PhysicsEnginePanel from '@/components/PhysicsEnginePanel';
import VideoBackground from '@/components/VideoBackground';
import DeepSeekCopilot from '@/components/DeepSeekCopilot';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import Footer from '@/components/Footer';
import { MissionDecalBadge } from '@/components/SpaceStickers';
import {
  AlertTriangle,
  Sparkles,
  Orbit,
  Radio,
  Globe,
  Zap,
  Flame,
  Award,
  ShieldCheck,
  Compass,
  Users,
  Activity,
  Bot
} from 'lucide-react';
import { getGeographicRegion } from '@/lib/geocoding';

export default function Home() {
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' | 'sighting' | 'physics' | 'crew' | 'copilot'
  const [overlayTheme, setOverlayTheme] = useState('cinema'); // 'cinema' | 'vivid' | 'focus'

  const {
    currentPosition,
    trail,
    status,
    error,
    lastSuccessTime,
    isFollowing,
    isTrailVisible,
    isSimulationMode,
    isManualRefreshing,
    canManualRefresh,
    intervalMs,
    refresh,
    retry,
    clearTrail,
    toggleFollow,
    toggleTrail,
    toggleSimulationMode,
    loadDemoData
  } = useISSPosition({
    intervalMs: 7000
  });

  const isInitialLoading = status === 'INITIAL_LOADING' && !currentPosition;
  const isFatalError = status === 'ERROR' && !currentPosition;
  const isStale = status === 'STALE';
  const isDemo = currentPosition?.isDemo || isSimulationMode;

  const currentRegion = currentPosition
    ? getGeographicRegion(currentPosition.latitude, currentPosition.longitude)
    : { name: 'Earth Orbit' };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* 1. Full-Screen 4K Background Video & Frosted Glass Overlay */}
      <VideoBackground
        overlayTheme={overlayTheme}
        onChangeTheme={setOverlayTheme}
      />

      {/* 2. Header with Navigation Tabs & Decals */}
      <DashboardHeader
        status={status}
        isDemo={isDemo}
        isManualRefreshing={isManualRefreshing}
        canManualRefresh={canManualRefresh}
        isSimulationMode={isSimulationMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRefresh={refresh}
        onToggleSimulation={toggleSimulationMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        {/* Notice Banners for Stale / Demo Data */}
        {isDemo && (
          <div className="rounded-none bg-amber-950/80 backdrop-blur-xl border border-amber-500/40 p-4 flex items-center justify-between gap-3 text-amber-200 text-xs shadow-lg font-mono">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 shrink-0 text-amber-400 animate-spin-slow" />
              <span>
                <strong>DEMO TELEMETRY ACTIVE:</strong> Viewing synthetic offline data. Real orbital tracking is paused.
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSimulationMode}
              className="px-3.5 py-1.5 rounded-none bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40 transition-colors shrink-0 shadow-sm uppercase tracking-wider"
            >
              Resume Live API
            </button>
          </div>
        )}

        {isStale && !isDemo && (
          <div className="rounded-none bg-amber-950/80 backdrop-blur-xl border border-amber-500/40 p-4 flex items-center justify-between gap-3 text-amber-200 text-xs shadow-lg font-mono">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 animate-pulse" />
              <div>
                <strong>STALE TELEMETRY:</strong> Polling temporarily delayed ({error || 'Connection timed out'}). Showing last confirmed vector.
              </div>
            </div>
            <button
              type="button"
              onClick={retry}
              className="px-3.5 py-1.5 rounded-none bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors shrink-0 shadow-sm uppercase tracking-wider"
            >
              Retry Downlink
            </button>
          </div>
        )}

        {/* 3. Hero Mission Overview - Sharp Aerospace Telemetry Bar */}
        <div className="relative bg-slate-950/80 backdrop-blur-2xl rounded-none p-6 md:p-8 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden font-mono">
          {/* Aerospace Frame Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">
              <Orbit className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>International Space Station • 420km LEO Trajectory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2 uppercase">
              Live Satellite Orbital Tracking & Vector Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-4">
              Currently flying over{' '}
              <strong className="text-white font-bold bg-slate-900 px-2.5 py-1 rounded-none border border-cyan-500/40 inline-flex items-center gap-1.5 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentRegion.name}</span>
              </strong>{' '}
              at approximately <strong className="text-cyan-300">27,600 km/h (Mach 25.4)</strong>.
            </p>

            {/* Sharp Mission Decal Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <MissionDecalBadge
                icon={Award}
                title="Expedition 72"
                subtitle="7 Crew Members"
                color="blue"
              />
              <MissionDecalBadge
                icon={Zap}
                title="Mach 25.4"
                subtitle="7.66 km/s Speed"
                color="amber"
              />
              <MissionDecalBadge
                icon={Orbit}
                title="16 Sunrises"
                subtitle="Per 24 Hours"
                color="purple"
              />
              <MissionDecalBadge
                icon={ShieldCheck}
                title="NORAD #25544"
                subtitle="Active Since 1998"
                color="emerald"
              />

              {/* Direct DeepSeek AI Copilot Trigger */}
              <button
                type="button"
                id="btn-hero-launch-deepseek"
                onClick={() => {
                  setActiveTab('copilot');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(99,102,241,0.25)] hover:border-indigo-300 cursor-pointer active:scale-95"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>DeepSeek AI Analysis</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Conditional State Views */}
        {isInitialLoading ? (
          <div className="py-16">
            <LoadingState />
          </div>
        ) : isFatalError ? (
          <div className="py-16">
            <ErrorState
              errorMessage={error}
              onRetry={retry}
              onLoadDemo={loadDemoData}
            />
          </div>
        ) : (
          <>
            {/* Tab 1: Main Flight Tracker */}
            {activeTab === 'tracker' && (
              <div className="space-y-6">
                {/* Telemetry Metric Cards */}
                <section aria-label="Current Telemetry Metrics">
                  <TelemetryGrid position={currentPosition} isStale={isStale} />
                </section>

                {/* Map Section */}
                <section aria-label="Interactive Orbital Map" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                        Orbital Ground Track & Future Trajectory
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>Auto-panning {isFollowing ? 'Active' : 'Paused'}</span>
                    </div>
                  </div>

                  <ISSMapLoader
                    position={currentPosition}
                    trail={trail}
                    isFollowing={isFollowing}
                    isTrailVisible={isTrailVisible}
                    onToggleFollow={toggleFollow}
                    onToggleTrail={toggleTrail}
                    onClearTrail={clearTrail}
                  />
                </section>

                {/* Status & Last Updated Bar */}
                <section aria-label="Telemetry Freshness Status">
                  <LastUpdated
                    lastSuccessTime={lastSuccessTime}
                    observationTimestamp={currentPosition?.timestamp}
                    intervalMs={intervalMs}
                    isStale={isStale}
                    isDemo={isDemo}
                  />
                </section>

                {/* Movement Trail History Panel */}
                <section aria-label="Recent Movement Observations">
                  <MovementTrail
                    trail={trail}
                    isTrailVisible={isTrailVisible}
                    onToggleTrail={toggleTrail}
                    onClearTrail={clearTrail}
                  />
                </section>
              </div>
            )}

            {/* Tab 2: Sighting & Distance Radar */}
            {activeTab === 'sighting' && (
              <div className="space-y-6">
                <PassCalculator issPosition={currentPosition} />
                <TelemetryGrid position={currentPosition} isStale={isStale} />
              </div>
            )}

            {/* Tab 3: Orbital Physics & Solar Cycle */}
            {activeTab === 'physics' && (
              <div className="space-y-6">
                <PhysicsEnginePanel position={currentPosition} />
                <TelemetryGrid position={currentPosition} isStale={isStale} />
              </div>
            )}

            {/* Tab 4: Expedition 72 Crew on Board */}
            {activeTab === 'crew' && (
              <div className="space-y-6">
                <CrewPanel />
                <TelemetryGrid position={currentPosition} isStale={isStale} />
              </div>
            )}

            {/* Tab 5: DeepSeek AI Orbital Copilot */}
            {activeTab === 'copilot' && (
              <div className="space-y-6">
                <DeepSeekCopilot currentPosition={currentPosition} />
                <TelemetryGrid position={currentPosition} isStale={isStale} />
              </div>
            )}
          </>
        )}
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
