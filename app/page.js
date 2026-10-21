'use client';

import React from 'react';
import { useISSPosition } from '@/hooks/useISSPosition';
import DashboardHeader from '@/components/DashboardHeader';
import ISSMapLoader from '@/components/ISSMapLoader';
import TelemetryGrid from '@/components/TelemetryGrid';
import LastUpdated from '@/components/LastUpdated';
import MovementTrail from '@/components/MovementTrail';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import Footer from '@/components/Footer';
import { AlertTriangle, Sparkles, Orbit, Radio, Globe } from 'lucide-react';

export default function Home() {
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* 1. Dashboard Header */}
      <DashboardHeader
        status={status}
        isDemo={isDemo}
        isManualRefreshing={isManualRefreshing}
        canManualRefresh={canManualRefresh}
        isSimulationMode={isSimulationMode}
        onRefresh={refresh}
        onToggleSimulation={toggleSimulationMode}
      />

      {/* Main Mission Control Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notice Banners for Stale / Demo Data */}
        {isDemo && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 flex items-center justify-between gap-3 text-amber-300 text-xs shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>DEMO DATA ACTIVE:</strong> You are viewing synthetic demonstration telemetry. Real movement tracking is paused.
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSimulationMode}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 font-semibold border border-amber-500/40 transition-colors shrink-0"
            >
              Resume Live API
            </button>
          </div>
        )}

        {isStale && !isDemo && (
          <div className="rounded-xl bg-amber-500/15 border border-amber-500/40 p-3.5 flex items-center justify-between gap-3 text-amber-200 text-xs shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
              <div>
                <strong>STALE DATA:</strong> Telemetry refresh temporarily delayed ({error || 'Connection timed out'}). Displaying last confirmed orbital position.
              </div>
            </div>
            <button
              type="button"
              onClick={retry}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shrink-0 shadow"
            >
              Retry Now
            </button>
          </div>
        )}

        {/* 2. Hero Mission Overview Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-1 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-medium tracking-wider uppercase mb-1">
              <Orbit className="w-4 h-4" />
              <span>Low Earth Orbit Telemetry System</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Real-Time Orbital Position & Vector Metrics
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Ground Track Resolution: <span className="text-cyan-300">WGS84 Ellipsoid</span>
          </div>
        </div>

        {/* 3. Conditional States or Main Dashboard Grid */}
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
            {/* Telemetry Metric Cards */}
            <section aria-label="Current Telemetry Metrics">
              <TelemetryGrid position={currentPosition} isStale={isStale} />
            </section>

            {/* Map Section */}
            <section aria-label="Interactive Orbital Map" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Orbital Ground Track
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Auto-pan {isFollowing ? 'Active' : 'Paused'}</span>
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
          </>
        )}
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
