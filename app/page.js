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
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import Footer from '@/components/Footer';
import {
  AstronautSticker,
  RocketSticker,
  SaturnSticker,
  SparkleDoodle,
  MissionDecalBadge
} from '@/components/SpaceStickers';
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
  Users
} from 'lucide-react';
import { getGeographicRegion } from '@/lib/geocoding';

export default function Home() {
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' | 'sighting' | 'crew'

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
    : { name: 'Earth Orbit', flag: '🌍' };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-800 relative">
      {/* 1. Header with navigation tabs & decals */}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notice Banners for Stale / Demo Data */}
        {isDemo && (
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 flex items-center justify-between gap-3 text-amber-900 text-xs shadow-sm">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 shrink-0 text-amber-500 animate-spin-slow" />
              <span>
                <strong>DEMO DATA ACTIVE:</strong> You are viewing synthetic offline telemetry. Real movement tracking is paused.
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSimulationMode}
              className="px-3.5 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 font-bold border border-amber-400 transition-colors shrink-0 shadow-sm"
            >
              Resume Live API
            </button>
          </div>
        )}

        {isStale && !isDemo && (
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 flex items-center justify-between gap-3 text-amber-900 text-xs shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 animate-pulse" />
              <div>
                <strong>STALE DATA:</strong> Telemetry refresh temporarily delayed ({error || 'Connection timed out'}). Showing last confirmed position.
              </div>
            </div>
            <button
              type="button"
              onClick={retry}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors shrink-0 shadow-sm"
            >
              Retry Now
            </button>
          </div>
        )}

        {/* 2. Hero Mission Overview with Space Stickers & Doodles */}
        <div className="relative bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-blue-50/60 rounded-3xl p-6 md:p-8 border-2 border-slate-200/80 shadow-md overflow-hidden">
          {/* Playful Floating Space Stickers in corners */}
          <div className="absolute -top-3 -right-2 hidden sm:block">
            <AstronautSticker size={84} />
          </div>
          <div className="absolute bottom-2 right-24 hidden md:block opacity-90">
            <SaturnSticker size={64} />
          </div>
          <div className="absolute top-3 left-1/3 hidden lg:block opacity-40">
            <SparkleDoodle size={28} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-sky-700 text-xs font-black tracking-wider uppercase mb-1.5">
              <Orbit className="w-4 h-4 text-sky-600 animate-spin-slow" />
              <span>International Space Station • 420km LEO Orbit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
              Live Satellite Orbital Tracking & Vector Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
              Currently flying over{' '}
              <strong className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200 inline-flex items-center gap-1 shadow-sm">
                <span>{currentRegion.flag}</span>
                <span>{currentRegion.name}</span>
              </strong>{' '}
              at approximately <strong>27,600 km/h</strong>.
            </p>

            {/* Playful Mission Decal Stickers */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <MissionDecalBadge
                icon={Award}
                title="Expedition 72"
                subtitle="7 Astronauts On Board"
                color="blue"
              />
              <MissionDecalBadge
                icon={Zap}
                title="Mach 25.4"
                subtitle="7.66 km/sec Velocity"
                color="amber"
              />
              <MissionDecalBadge
                icon={Orbit}
                title="16 Sunrises"
                subtitle="Every 24 Earth Hours"
                color="purple"
              />
              <MissionDecalBadge
                icon={ShieldCheck}
                title="NORAD #25544"
                subtitle="Active Since 1998"
                color="emerald"
              />
            </div>
          </div>
        </div>

        {/* 3. Conditional State Views */}
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
            {/* View 1: Main Tracker (Map + Telemetry Grid + Trail) */}
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
                      <Globe className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Orbital Ground Track & Future Trajectory
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
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

            {/* View 2: Sighting & Distance Radar */}
            {activeTab === 'sighting' && (
              <div className="space-y-6">
                <PassCalculator issPosition={currentPosition} />
                {/* Also show telemetry grid below calculator for reference */}
                <TelemetryGrid position={currentPosition} isStale={isStale} />
              </div>
            )}

            {/* View 3: Expedition 72 Crew on Board */}
            {activeTab === 'crew' && (
              <div className="space-y-6">
                <CrewPanel />
                <TelemetryGrid position={currentPosition} isStale={isStale} />
              </div>
            )}
          </>
        )}
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
