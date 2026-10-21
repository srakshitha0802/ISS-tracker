'use client';

import React from 'react';

/**
 * ISS Tracker Precision Aerospace Emblem & Logo
 * Designed with sharp HUD geometry, dual-axis photovoltaic arrays,
 * orbital trajectory vector arc, and mission control typography.
 */
export default function ISSLogo({ size = 'md', className = '', showSubtext = true }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const badgeSize = isSm ? 'w-9 h-9' : isLg ? 'w-14 h-14' : 'w-11 h-11';
  const iconSize = isSm ? 'w-6 h-6' : isLg ? 'w-9 h-9' : 'w-7 h-7';

  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Sharp Aerospace Flight Insignia */}
      <div className="relative shrink-0">
        <div
          className={`relative ${badgeSize} bg-slate-950 border border-cyan-400/80 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:border-cyan-300 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]`}
        >
          {/* Corner Precision Aerospace Target Notches */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-300 pointer-events-none" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-300 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-300 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-300 pointer-events-none" />

          {/* High-Precision ISS Vector SVG */}
          <svg
            viewBox="0 0 64 64"
            className={`${iconSize} transition-transform duration-500 group-hover:scale-105`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Solar Array Cyan Glow Gradient */}
              <linearGradient id="solarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
              </linearGradient>
              {/* Core Truss Gradient */}
              <linearGradient id="trussGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              {/* Orbital Arc Gradient */}
              <linearGradient id="orbitArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Elliptical Orbital Vector Ring */}
            <ellipse
              cx="32"
              cy="32"
              rx="28"
              ry="11"
              transform="rotate(-26 32 32)"
              stroke="url(#orbitArc)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="opacity-75 group-hover:opacity-100"
            />

            {/* Main Integrated Truss Structure (ITS) */}
            <line x1="8" y1="32" x2="56" y2="32" stroke="url(#trussGrad)" strokeWidth="2.2" strokeLinecap="square" />
            
            {/* Cross Struts on Truss */}
            <line x1="20" y1="30" x2="20" y2="34" stroke="#22d3ee" strokeWidth="1.2" />
            <line x1="44" y1="30" x2="44" y2="34" stroke="#22d3ee" strokeWidth="1.2" />

            {/* Left Solar Array Panels (Port) */}
            {/* Mast */}
            <line x1="14" y1="14" x2="14" y2="50" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Upper Wing */}
            <rect x="9" y="15" width="10" height="13" fill="url(#solarGlow)" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="9" y1="19.5" x2="19" y2="19.5" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="9" y1="24" x2="19" y2="24" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="14" y1="15" x2="14" y2="28" stroke="#38bdf8" strokeWidth="0.8" />
            {/* Lower Wing */}
            <rect x="9" y="36" width="10" height="13" fill="url(#solarGlow)" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="9" y1="40.5" x2="19" y2="40.5" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="9" y1="45" x2="19" y2="45" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="14" y1="36" x2="14" y2="49" stroke="#38bdf8" strokeWidth="0.8" />

            {/* Right Solar Array Panels (Starboard) */}
            {/* Mast */}
            <line x1="50" y1="14" x2="50" y2="50" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Upper Wing */}
            <rect x="45" y="15" width="10" height="13" fill="url(#solarGlow)" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="45" y1="19.5" x2="55" y2="19.5" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="45" y1="24" x2="55" y2="24" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="50" y1="15" x2="50" y2="28" stroke="#38bdf8" strokeWidth="0.8" />
            {/* Lower Wing */}
            <rect x="45" y="36" width="10" height="13" fill="url(#solarGlow)" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="45" y1="40.5" x2="55" y2="40.5" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="45" y1="45" x2="55" y2="45" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="50" y1="36" x2="50" y2="49" stroke="#38bdf8" strokeWidth="0.8" />

            {/* Pressurized Modules Complex (Center Stack) */}
            {/* Longitudinal Module Stack (Zvezda / Zarya / Unity / Destiny) */}
            <rect x="28" y="21" width="8" height="22" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.4" />
            <line x1="28" y1="26" x2="36" y2="26" stroke="#06b6d4" strokeWidth="0.8" />
            <line x1="28" y1="32" x2="36" y2="32" stroke="#22d3ee" strokeWidth="1" />
            <line x1="28" y1="38" x2="36" y2="38" stroke="#06b6d4" strokeWidth="0.8" />

            {/* Transverse Lab Modules (Columbus / Kibo JEM) */}
            <rect x="23" y="28.5" width="18" height="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
            
            {/* Cupola Nadir Earth Observation Viewport */}
            <circle cx="32" cy="32" r="2.2" fill="#38bdf8" />
            <circle cx="32" cy="32" r="1" fill="#ffffff" />

            {/* Communications Dish Array */}
            <path d="M 23 25 Q 21 21 24 19" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
            <circle cx="24" cy="19" r="1" fill="#f59e0b" />

            {/* Active Telemetry Beacon Signal Point */}
            <circle cx="32" cy="19" r="1.5" fill="#22d3ee" className="animate-ping" />
          </svg>

          {/* Exterior Corner Active Pulse LED */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        </div>
      </div>

      {/* Identity Typography */}
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-widest text-white uppercase font-sans ${
              isSm ? 'text-sm' : isLg ? 'text-2xl' : 'text-lg sm:text-xl'
            }`}
          >
            ISS<span className="text-cyan-400">TRACKER</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-cyan-950/90 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)] tracking-wider">
            LIVE
          </span>
        </div>

        {showSubtext && (
          <p
            className={`font-mono text-slate-400 uppercase tracking-widest ${
              isSm ? 'text-[9px]' : 'text-[10px]'
            }`}
          >
            NORAD #25544 <span className="text-cyan-500/60">•</span> 51.64° INC <span className="text-cyan-500/60">•</span> LEO FLIGHT
          </p>
        )}
      </div>
    </div>
  );
}
