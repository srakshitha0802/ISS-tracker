'use client';

import React, { useState } from 'react';
import { useISSPosition } from '@/hooks/useISSPosition';
import VideoBackground from '@/components/VideoBackground';
import DashboardHeader from '@/components/DashboardHeader';
import ISSMapLoader from '@/components/ISSMapLoader';
import TelemetryGrid from '@/components/TelemetryGrid';
import LastUpdated from '@/components/LastUpdated';
import MovementTrail from '@/components/MovementTrail';
import PassCalculator from '@/components/PassCalculator';
import CrewPanel from '@/components/CrewPanel';
import PhysicsEnginePanel from '@/components/PhysicsEnginePanel';
import DeepSeekCopilot from '@/components/DeepSeekCopilot';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import Footer from '@/components/Footer';
import {
  AlertTriangle,
  Orbit,
  Globe,
  Zap,
  Award,
  ShieldCheck,
  Bot,
  Satellite,
  Wind,
  Sparkles
} from 'lucide-react';
import { getGeographicRegion } from '@/lib/geocoding';

// ── Stat Badge with Gold & Silver Sheen ───────────────────────────────────
function StatBadge({ icon: Icon, label, value, variant = 'silver' }) {
  const variants = {
    gold:   'badge-gold',
    silver: 'badge-silver',
    cyan:   'bg-cyan-500/15 border-cyan-400/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
    emerald:'bg-emerald-500/15 border-emerald-400/40 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
  };

  return (
    <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium backdrop-blur-xl ${variants[variant] || variants.silver}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="text-white/80">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

// ── Glassy Alert Banner ───────────────────────────────────────────────────
function AlertBanner({ icon: Icon, iconClass, message, action, onAction }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl glass-panel-gold border border-amber-400/40 text-sm shadow-xl">
      <div className="flex items-center gap-3 text-amber-200 font-medium">
        <Icon className={`w-4 h-4 shrink-0 text-amber-400 ${iconClass}`} />
        <span className="text-xs sm:text-sm">{message}</span>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(245,158,11,0.4)] cursor-pointer"
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ── Section Heading with Gold Icon & Silver Title ────────────────────────
function SectionHeading({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-400">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-100">{title}</h2>
      </div>
      {right && <div className="text-xs font-mono text-slate-300">{right}</div>}
    </div>
  );
}

// ── Main Dashboard Application ───────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState('tracker');

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
  } = useISSPosition({ intervalMs: 7000 });

  const isInitialLoading = status === 'INITIAL_LOADING' && !currentPosition;
  const isFatalError = status === 'ERROR' && !currentPosition;
  const isStale = status === 'STALE';
  const isDemo = currentPosition?.isDemo || isSimulationMode;

  const currentRegion = currentPosition
    ? getGeographicRegion(currentPosition.latitude, currentPosition.longitude)
    : { name: 'Low Earth Orbit' };

  const machNumber = currentPosition
    ? ((currentPosition.velocity || 27580) / 1236).toFixed(1)
    : '25.4';

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 overflow-x-hidden">
      {/* ── Background Video Playback (gemini_generated_video_0a46d2c2.mp4) ── */}
      <VideoBackground />

      {/* ── Foreground Glassy UI Content ── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Header ── */}
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

        {/* ── Main Layout ── */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5">

          {/* ── Alert Banners ── */}
          {isDemo && (
            <AlertBanner
              icon={Zap}
              iconClass="animate-pulse"
              message="Simulation Mode Active — Synthesizing real-time orbital trajectory telemetry."
              action="Resume Live Orbit"
              onAction={toggleSimulationMode}
            />
          )}
          {isStale && !isDemo && (
            <AlertBanner
              icon={AlertTriangle}
              iconClass="animate-pulse"
              message={`Telemetry delayed — ${error || 're-syncing with NORAD'}. Showing last confirmed vector.`}
              action="Reconnect"
              onAction={retry}
            />
          )}

          {/* ── Hero Bar: Luxury Frosted Glass with Shiny Gold & Silver ── */}
          <section className="glass-panel-gold rounded-3xl p-5 sm:p-7 border border-amber-400/40 relative overflow-hidden shadow-2xl">
            {/* Aerospace Corner Accents */}
            <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-amber-300">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ISS · NORAD #25544 · EXPEDITION 72
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Currently Overflying{' '}
                  <span className="text-gold-gradient font-black drop-shadow-[0_2px_15px_rgba(245,158,11,0.4)]">
                    {currentRegion.name}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-mono">
                  Cruising at <span className="text-white font-bold">Mach {machNumber}</span> ({currentPosition ? Math.round(currentPosition.velocity || 27580).toLocaleString() : '27,580'} km/h) · <span className="text-white font-bold">{currentPosition ? Math.round(currentPosition.altitude || 420) : 420} km</span> altitude · 51.64° inclination
                </p>
              </div>

              {/* Quick Stat Badges & Ask AI CTA */}
              <div className="flex flex-wrap items-center gap-2">
                <StatBadge icon={Award} label="Expedition" value="72" variant="gold" />
                <StatBadge icon={Wind} label="Velocity" value={`Mach ${machNumber}`} variant="gold" />
                <StatBadge icon={Orbit} label="Daily Orbits" value="15.54" variant="silver" />
                <StatBadge icon={ShieldCheck} label="NORAD" value="#25544" variant="emerald" />

                <button
                  type="button"
                  id="btn-hero-launch-ai"
                  onClick={() => setActiveTab('copilot')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-slate-950 font-bold" />
                  <span>Ask DeepSeek AI</span>
                  <Sparkles className="w-3 h-3 text-slate-950" />
                </button>
              </div>
            </div>
          </section>

          {/* ── Loading / Fatal Error ── */}
          {isInitialLoading ? (
            <div className="py-20">
              <LoadingState />
            </div>
          ) : isFatalError ? (
            <div className="py-20">
              <ErrorState errorMessage={error} onRetry={retry} onLoadDemo={loadDemoData} />
            </div>
          ) : (
            <>
              {/* ════════ TAB 1: TRACKER ════════ */}
              {activeTab === 'tracker' && (
                <div className="space-y-5 animate-fade-up">
                  {/* Telemetry Metrics Grid */}
                  <section aria-label="Live telemetry metrics">
                    <SectionHeading icon={Satellite} title="Live Orbital Telemetry" />
                    <TelemetryGrid position={currentPosition} isStale={isStale} />
                  </section>

                  {/* CARTO Orbital Map */}
                  <section aria-label="Orbital map">
                    <SectionHeading
                      icon={Globe}
                      title="Interactive Orbital Ground Track"
                      right={
                        <span className="flex items-center gap-2 px-2.5 py-1 rounded-full badge-gold font-mono text-[11px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${isFollowing ? 'bg-amber-400 animate-ping' : 'bg-slate-500'}`} />
                          {isFollowing ? 'Auto-Tracking Active' : 'Manual Panning'}
                        </span>
                      }
                    />
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

                  {/* Telemetry Status Bar */}
                  <section aria-label="Telemetry status">
                    <LastUpdated
                      lastSuccessTime={lastSuccessTime}
                      observationTimestamp={currentPosition?.timestamp}
                      intervalMs={intervalMs}
                      isStale={isStale}
                      isDemo={isDemo}
                    />
                  </section>

                  {/* Flight Trail History Table */}
                  <section aria-label="Flight trail history">
                    <SectionHeading icon={Orbit} title="Ground Track Flight History" />
                    <MovementTrail
                      trail={trail}
                      isTrailVisible={isTrailVisible}
                      onToggleTrail={toggleTrail}
                      onClearTrail={clearTrail}
                    />
                  </section>
                </div>
              )}

              {/* ════════ TAB 2: AI COPILOT ════════ */}
              {activeTab === 'copilot' && (
                <div className="animate-fade-up" style={{ height: 'calc(100vh - 210px)', minHeight: '620px' }}>
                  <DeepSeekCopilot currentPosition={currentPosition} />
                </div>
              )}

              {/* ════════ TAB 3: RADAR / SIGHTING ════════ */}
              {activeTab === 'sighting' && (
                <div className="space-y-5 animate-fade-up">
                  <PassCalculator issPosition={currentPosition} />
                  <TelemetryGrid position={currentPosition} isStale={isStale} />
                </div>
              )}

              {/* ════════ TAB 4: PHYSICS ENGINE ════════ */}
              {activeTab === 'physics' && (
                <div className="space-y-5 animate-fade-up">
                  <PhysicsEnginePanel position={currentPosition} />
                  <TelemetryGrid position={currentPosition} isStale={isStale} />
                </div>
              )}

              {/* ════════ TAB 5: EXPEDITION CREW ════════ */}
              {activeTab === 'crew' && (
                <div className="space-y-5 animate-fade-up">
                  <CrewPanel />
                  <TelemetryGrid position={currentPosition} isStale={isStale} />
                </div>
              )}
            </>
          )}
        </main>

        {/* ── Footer ── */}
        <Footer />
      </div>
    </div>
  );
}
