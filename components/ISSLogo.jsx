'use client';

import React from 'react';

export default function ISSLogo({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sharp High-Tech Aerospace Hex/Insignia */}
      <div className="relative group shrink-0">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-slate-950 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all group-hover:border-cyan-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          {/* Tech Corner Accent Marks */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-cyan-400" />

          {/* Precision ISS Vector Icon */}
          <svg
            viewBox="0 0 48 48"
            className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            {/* Main Truss Axis */}
            <line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2.2" />
            
            {/* Pressurized Modules (Habitation & Labs) */}
            <rect x="21" y="16" width="6" height="16" fill="rgba(6, 182, 212, 0.25)" stroke="currentColor" strokeWidth="1.6" />
            <rect x="18" y="21" width="12" height="6" fill="rgba(6, 182, 212, 0.35)" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="24" cy="24" r="2.5" fill="currentColor" />

            {/* Left Solar Array Wings */}
            <line x1="10" y1="12" x2="10" y2="36" stroke="currentColor" strokeWidth="1.6" />
            <rect x="8" y="13" width="4" height="9" fill="rgba(56, 189, 248, 0.2)" stroke="currentColor" strokeWidth="1" />
            <rect x="8" y="26" width="4" height="9" fill="rgba(56, 189, 248, 0.2)" stroke="currentColor" strokeWidth="1" />

            {/* Right Solar Array Wings */}
            <line x1="38" y1="12" x2="38" y2="36" stroke="currentColor" strokeWidth="1.6" />
            <rect x="36" y="13" width="4" height="9" fill="rgba(56, 189, 248, 0.2)" stroke="currentColor" strokeWidth="1" />
            <rect x="36" y="26" width="4" height="9" fill="rgba(56, 189, 248, 0.2)" stroke="currentColor" strokeWidth="1" />

            {/* Radar / Trajectory Arc */}
            <path
              d="M 12 8 A 20 20 0 0 1 36 8"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              className="opacity-70 animate-pulse"
            />
          </svg>

          {/* Center Beacon Point */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
        </div>
      </div>

      {/* Typography */}
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-widest text-white uppercase ${isSm ? 'text-sm' : isLg ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
            ISS<span className="text-cyan-400">TRACKER</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 tracking-wider">
            LIVE
          </span>
        </div>
        <p className={`font-mono text-slate-400 uppercase tracking-widest ${isSm ? 'text-[9px]' : 'text-[10px]'}`}>
          NORAD #25544 • ORBITAL VECTOR
        </p>
      </div>
    </div>
  );
}
