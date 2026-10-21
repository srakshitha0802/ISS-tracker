'use client';

import React from 'react';
import { Users, Award, Shield, Compass, Sparkles, Orbit, Globe } from 'lucide-react';
import { AstronautSticker } from './SpaceStickers';

const CREW_MEMBERS = [
  {
    name: 'Sunita Williams',
    role: 'Commander',
    agency: 'NASA',
    country: 'United States',
    spacecraft: 'Boeing Starliner / Crew-9',
    daysInSpace: '320+ Days',
    spacewalks: '7 EVAs (50h 40m)',
    color: 'from-blue-900/40 to-indigo-950/40 border-blue-500/30'
  },
  {
    name: 'Barry "Butch" Wilmore',
    role: 'Flight Engineer',
    agency: 'NASA',
    country: 'United States',
    spacecraft: 'Boeing Starliner / Crew-9',
    daysInSpace: '280+ Days',
    spacewalks: '4 EVAs (25h 36m)',
    color: 'from-sky-900/40 to-cyan-950/40 border-sky-500/30'
  },
  {
    name: 'Nick Hague',
    role: 'Flight Engineer',
    agency: 'NASA',
    country: 'United States',
    spacecraft: 'SpaceX Crew-9',
    daysInSpace: '200+ Days',
    spacewalks: '3 EVAs (19h 56m)',
    color: 'from-amber-900/40 to-orange-950/40 border-amber-500/30'
  },
  {
    name: 'Aleksandr Gorbunov',
    role: 'Flight Engineer',
    agency: 'Roscosmos',
    country: 'International Cosmonaut',
    spacecraft: 'SpaceX Crew-9',
    daysInSpace: 'First Flight',
    spacewalks: '0 EVAs',
    color: 'from-rose-900/40 to-red-950/40 border-rose-500/30'
  },
  {
    name: 'Aleksey Ovchinin',
    role: 'Flight Engineer',
    agency: 'Roscosmos',
    country: 'International Cosmonaut',
    spacecraft: 'Soyuz MS-26',
    daysInSpace: '375+ Days',
    spacewalks: '1 EVA (6h 01m)',
    color: 'from-emerald-900/40 to-teal-950/40 border-emerald-500/30'
  },
  {
    name: 'Ivan Vagner',
    role: 'Flight Engineer',
    agency: 'Roscosmos',
    country: 'International Cosmonaut',
    spacecraft: 'Soyuz MS-26',
    daysInSpace: '196+ Days',
    spacewalks: '0 EVAs',
    color: 'from-purple-900/40 to-violet-950/40 border-purple-500/30'
  },
  {
    name: 'Donald Pettit',
    role: 'Flight Engineer / Astrophotographer',
    agency: 'NASA',
    country: 'United States',
    spacecraft: 'Soyuz MS-26',
    daysInSpace: '390+ Days',
    spacewalks: '2 EVAs (13h 17m)',
    color: 'from-yellow-900/40 to-amber-950/40 border-yellow-500/30'
  }
];

export default function CrewPanel() {
  return (
    <div className="bg-slate-950/65 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden text-white">
      {/* Decorative background astronaut */}
      <div className="absolute top-2 right-4 opacity-15 pointer-events-none">
        <AstronautSticker size={120} />
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight">
                Expedition 72 Crew on Board
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                7 Active Astronauts
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Human spaceflight operations in continuous microgravity since November 2000
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900/60 px-3.5 py-1.5 rounded-xl border border-white/10">
          <Orbit className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Orbital Laboratory: 16 Sunrises Daily</span>
        </div>
      </div>

      {/* Crew Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
        {CREW_MEMBERS.map((member, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 bg-gradient-to-br ${member.color} backdrop-blur-lg flex flex-col justify-between shadow-lg`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{member.country}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  {member.agency}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-white mb-0.5">
                {member.name}
              </h4>
              <p className="text-xs font-semibold text-cyan-300 mb-3 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>{member.role}</span>
              </p>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-white/10 pt-2.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Arrival:</span>
                <span className="font-semibold text-white">{member.spacecraft}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total in Space:</span>
                <span className="font-semibold text-white">{member.daysInSpace}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Spacewalks:</span>
                <span className="font-semibold text-white">{member.spacewalks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
