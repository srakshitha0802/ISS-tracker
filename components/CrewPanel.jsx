'use client';

import React from 'react';
import { Users, Award, Shield, Compass, Sparkles, Orbit } from 'lucide-react';
import { AstronautSticker } from './SpaceStickers';

const CREW_MEMBERS = [
  {
    name: 'Sunita Williams',
    role: 'Commander',
    agency: 'NASA',
    flag: '🇺🇸',
    spacecraft: 'Boeing Starliner / Crew-9',
    daysInSpace: '320+ Days',
    spacewalks: '7 EVAs (50h 40m)',
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-200'
  },
  {
    name: 'Barry "Butch" Wilmore',
    role: 'Flight Engineer',
    agency: 'NASA',
    flag: '🇺🇸',
    spacecraft: 'Boeing Starliner / Crew-9',
    daysInSpace: '280+ Days',
    spacewalks: '4 EVAs (25h 36m)',
    color: 'from-sky-500/10 to-cyan-500/10 border-sky-200'
  },
  {
    name: 'Nick Hague',
    role: 'Flight Engineer',
    agency: 'NASA',
    flag: '🇺🇸',
    spacecraft: 'SpaceX Crew-9',
    daysInSpace: '200+ Days',
    spacewalks: '3 EVAs (19h 56m)',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-200'
  },
  {
    name: 'Aleksandr Gorbunov',
    role: 'Flight Engineer',
    agency: 'Roscosmos',
    flag: '🇷🇺',
    spacecraft: 'SpaceX Crew-9',
    daysInSpace: 'First Flight',
    spacewalks: '0 EVAs',
    color: 'from-rose-500/10 to-pink-500/10 border-rose-200'
  },
  {
    name: 'Aleksey Ovchinin',
    role: 'Flight Engineer',
    agency: 'Roscosmos',
    flag: '🇷🇺',
    spacecraft: 'Soyuz MS-26',
    daysInSpace: '375+ Days',
    spacewalks: '1 EVA (6h 01m)',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200'
  },
  {
    name: 'Ivan Vagner',
    role: 'Flight Engineer',
    agency: 'Roscosmos',
    flag: '🇷🇺',
    spacecraft: 'Soyuz MS-26',
    daysInSpace: '196+ Days',
    spacewalks: '0 EVAs',
    color: 'from-purple-500/10 to-violet-500/10 border-purple-200'
  },
  {
    name: 'Donald Pettit',
    role: 'Flight Engineer / Astrophotographer',
    agency: 'NASA',
    flag: '🇺🇸',
    spacecraft: 'Soyuz MS-26',
    daysInSpace: '390+ Days',
    spacewalks: '2 EVAs (13h 17m)',
    color: 'from-yellow-500/10 to-amber-500/10 border-yellow-200'
  }
];

export default function CrewPanel() {
  return (
    <div className="bg-white/95 rounded-3xl p-6 md:p-8 border-2 border-slate-200/90 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative background doodles */}
      <div className="absolute top-2 right-4 opacity-20 pointer-events-none">
        <AstronautSticker size={120} />
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Expedition 72 Crew on Board
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-300">
                7 Active Astronauts
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Human spaceflight operations in continuous microgravity since November 2000
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
          <Orbit className="w-4 h-4 text-sky-500 animate-spin-slow" />
          <span>Orbital Laboratory: 16 Sunrises Daily</span>
        </div>
      </div>

      {/* Crew Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
        {CREW_MEMBERS.map((member, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-4 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br ${member.color} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl">{member.flag}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-sm border border-slate-200 uppercase tracking-wider">
                  {member.agency}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-0.5">
                {member.name}
              </h4>
              <p className="text-xs font-semibold text-sky-700 mb-3 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>{member.role}</span>
              </p>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Arrival:</span>
                <span className="font-semibold text-slate-800">{member.spacecraft}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total in Space:</span>
                <span className="font-semibold text-slate-800">{member.daysInSpace}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Spacewalks:</span>
                <span className="font-semibold text-slate-800">{member.spacewalks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
