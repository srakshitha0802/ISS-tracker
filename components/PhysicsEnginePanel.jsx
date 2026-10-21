'use client';

import React from 'react';
import {
  Gauge,
  Zap,
  Sun,
  Moon,
  Orbit,
  Compass,
  Layers,
  Sparkles,
  Shield,
  Activity,
  BatteryCharging
} from 'lucide-react';
import { computeMachNumber, estimateNextSolarEvent } from '@/lib/orbitCalculation';
import { formatVelocityKmS } from '@/lib/formatters';

export default function PhysicsEnginePanel({ position }) {
  const velocity = position?.velocity || 27580;
  const machNum = computeMachNumber(velocity);
  const solarEvent = estimateNextSolarEvent(position?.visibility, position?.timestamp);
  const isDaylight = String(position?.visibility || '').toLowerCase() === 'daylight';

  return (
    <div className="bg-slate-950/80 rounded-none p-6 md:p-8 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-6 text-white font-mono relative">
      {/* Corner Notches */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-none bg-purple-950/80 border border-purple-400/60 flex items-center justify-center text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
            <Orbit className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Orbital Physics & Solar Cycle Engine
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-purple-950/80 text-purple-300 border border-purple-400/40 uppercase">
                Keplerian LEO Mechanics
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kinematics, solar sub-point angles, and microgravity parameters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-none border border-cyan-500/30">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Orbital Energy: 30.5 MJ/kg</span>
        </div>
      </div>

      {/* Physics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Mach Number & Hypersonic Speed */}
        <div className="p-5 rounded-none bg-slate-900/80 border border-cyan-500/20 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Speed of Sound Multiple
              </span>
              <Gauge className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">
              Mach {machNum}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Linear Velocity: {formatVelocityKmS(velocity)}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-cyan-500/20 text-[10px] text-amber-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>22x Faster than airliners</span>
          </div>
        </div>

        {/* 2. Solar Terminator Cycle */}
        <div className="p-5 rounded-none bg-slate-900/80 border border-cyan-500/20 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                Next Illumination Shift
              </span>
              {isDaylight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </div>
            <div className="text-2xl font-black text-white">
              ~{solarEvent.minutesRemaining} <span className="text-xs font-bold text-slate-400">mins</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Target: <strong className="text-white">{solarEvent.event}</strong>
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-cyan-500/20 text-[10px] text-sky-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5" />
            <span>16 Sunrises & Sunsets / 24h</span>
          </div>
        </div>

        {/* 3. Solar Power Generation */}
        <div className="p-5 rounded-none bg-slate-900/80 border border-cyan-500/20 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Solar Array Output
              </span>
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {isDaylight ? '120 kW' : 'Battery'}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {isDaylight ? '8 Ultra-Flex Wings Active' : 'Nickel-Hydrogen Storage Mode'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-cyan-500/20 text-[10px] text-emerald-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>2,400 m² total PV surface</span>
          </div>
        </div>

        {/* 4. Subsolar Geographic Point */}
        <div className="p-5 rounded-none bg-slate-900/80 border border-cyan-500/20 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Subsolar Point
              </span>
              <Compass className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">
              {position?.solar_lat !== null && position?.solar_lat !== undefined
                ? `${Number(position.solar_lat).toFixed(2)}°, ${Number(position.solar_lon).toFixed(2)}°`
                : '10.70°, 101.70°'}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Zenith coordinates of direct sunlight
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-cyan-500/20 text-[10px] text-indigo-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <Orbit className="w-3.5 h-3.5" />
            <span>Earth axial tilt: 23.44°</span>
          </div>
        </div>
      </div>

      {/* Station Physical Engineering Specs Bar */}
      <div className="p-5 rounded-none bg-slate-900/80 border border-cyan-500/20 text-xs">
        <h4 className="font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Spacecraft Engineering & Structural Architecture</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Wingspan & Length</span>
            <span className="font-bold text-white">109 m x 73 m (Football Field)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">On-Orbit Mass</span>
            <span className="font-bold text-white">444,615 kg (~445 Tonnes)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Pressurized Volume</span>
            <span className="font-bold text-white">916 m³ (Equivalent to Boeing 747)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Microgravity Environment</span>
            <span className="font-bold text-white">10⁻⁶ g (One Millionth 1G)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
