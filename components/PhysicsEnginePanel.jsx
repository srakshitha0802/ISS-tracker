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
  Activity
} from 'lucide-react';
import { computeMachNumber, estimateNextSolarEvent } from '@/lib/orbitCalculation';
import { formatVelocityKmS } from '@/lib/formatters';

export default function PhysicsEnginePanel({ position }) {
  const velocity = position?.velocity || 27580;
  const machNum = computeMachNumber(velocity);
  const solarEvent = estimateNextSolarEvent(position?.visibility, position?.timestamp);
  const isDaylight = String(position?.visibility || '').toLowerCase() === 'daylight';

  return (
    <div className="bg-white/95 rounded-3xl p-6 md:p-8 border-2 border-slate-200/90 shadow-xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Orbit className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Orbital Physics & Solar Cycle Engine
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                Keplerian LEO Mechanics
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Kinematics, solar sub-point angles, and microgravity parameters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Orbital Energy: 30.5 MJ/kg</span>
        </div>
      </div>

      {/* Physics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Mach Number & Hypersonic Speed */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Speed of Sound Multiple
              </span>
              <Gauge className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black font-mono text-slate-900">
              Mach {machNum}
            </div>
            <p className="text-[11px] font-semibold text-slate-600 mt-1">
              Linear Velocity: {formatVelocityKmS(velocity)}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-amber-200/60 text-[10px] text-amber-900 font-bold">
            ⚡ 22× Faster than commercial airliners
          </div>
        </div>

        {/* 2. Solar Terminator Cycle */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Next Illumination Shift
              </span>
              {isDaylight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              ~{solarEvent.minutesRemaining} <span className="text-xs font-bold text-slate-500">mins</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 mt-1">
              Target: <strong className="text-slate-900">{solarEvent.event}</strong>
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-sky-200/60 text-[10px] text-sky-900 font-bold">
            🌅 16 Sunrises & Sunsets every 24 hours
          </div>
        </div>

        {/* 3. Solar Power Generation */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Solar Array Output
              </span>
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black font-mono text-slate-900">
              {isDaylight ? '120 kW' : 'Battery'}
            </div>
            <p className="text-[11px] font-semibold text-slate-600 mt-1">
              {isDaylight ? '8 Ultra-Flex Wings Active' : 'Li-Ion Battery Storage Mode'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-200/60 text-[10px] text-emerald-900 font-bold">
            🔋 2,400 m² total photovoltaic surface
          </div>
        </div>

        {/* 4. Subsolar Geographic Point */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                Subsolar Point
              </span>
              <Compass className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900">
              {position?.solar_lat !== null && position?.solar_lat !== undefined
                ? `${Number(position.solar_lat).toFixed(2)}°, ${Number(position.solar_lon).toFixed(2)}°`
                : '10.7° S, 101.7° E'}
            </div>
            <p className="text-[11px] font-semibold text-slate-600 mt-1">
              Zenith coordinates of direct sunlight on Earth
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-indigo-200/60 text-[10px] text-indigo-900 font-bold">
            ☀️ Earth axial tilt: 23.44°
          </div>
        </div>
      </div>

      {/* Station Physical Engineering Specs Bar */}
      <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200/90 text-xs">
        <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-600" />
          <span>Spacecraft Engineering & Structural Architecture</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-medium text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Wingspan & Length</span>
            <span className="font-bold text-slate-800">109 m × 73 m (Football Field)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">On-Orbit Mass</span>
            <span className="font-bold text-slate-800">444,615 kg (~445 Tonnes)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Pressurized Volume</span>
            <span className="font-bold text-slate-800">916 m³ (Equivalent to Boeing 747)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Microgravity Environment</span>
            <span className="font-bold text-slate-800">10⁻⁶ g (One Millionth 1G)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
