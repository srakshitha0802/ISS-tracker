'use client';

import React from 'react';

/**
 * 1. Floating Astronaut Sticker with Interactive Wave on Hover
 */
export function AstronautSticker({ className = '', size = 64 }) {
  return (
    <div
      className={`group cursor-pointer select-none transition-transform duration-300 hover:scale-110 active:scale-95 inline-block ${className}`}
      title="Astronaut on EVA Spacewalk — Click to wave!"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_8px_16px_rgba(56,189,248,0.35)] animate-float"
      >
        {/* Tether umbilical cord */}
        <path
          d="M20 70 C 10 50, 25 35, 38 45"
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Life Support Backpack */}
        <rect x="28" y="32" width="16" height="32" rx="5" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2.5" />
        <rect x="31" y="36" width="10" height="8" rx="2" fill="#0284c7" />

        {/* Suit Body */}
        <ellipse cx="50" cy="54" rx="16" ry="18" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
        {/* Mission chest patch */}
        <circle cx="45" cy="48" r="3" fill="#ef4444" />
        <rect x="51" y="46" width="6" height="4" rx="1" fill="#3b82f6" />

        {/* Legs with boots */}
        <path d="M42 68 L38 84 L30 84" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M58 68 L62 84 L70 84" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <ellipse cx="32" cy="84" rx="4" ry="2" fill="#38bdf8" />
        <ellipse cx="68" cy="84" rx="4" ry="2" fill="#38bdf8" />

        {/* Left Arm (Relaxed) */}
        <path d="M36 46 L26 56 L30 62" stroke="#0284c7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="62" r="3.5" fill="#38bdf8" />

        {/* Right Arm (Waving on hover) */}
        <g className="group-hover:rotate-12 origin-[64px_46px] transition-transform duration-300">
          <path d="M64 46 L76 38 L82 28" stroke="#0284c7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle cx="82" cy="28" r="4" fill="#38bdf8" />
          {/* Glove thumb */}
          <path d="M80 27 L78 24" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Helmet */}
        <circle cx="50" cy="30" r="16" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
        {/* Golden Visor with Sun Glint */}
        <ellipse cx="51" cy="30" rx="11" ry="9" fill="url(#visorGold)" stroke="#f59e0b" strokeWidth="1.5" />
        <ellipse cx="48" cy="28" rx="4" ry="2.5" fill="#ffffff" fillOpacity="0.8" />

        {/* Defs */}
        <defs>
          <linearGradient id="visorGold" x1="40" y1="20" x2="62" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="0.7" stopColor="#d97706" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * 2. Rocket Ship Sticker with Animated Fire Trail
 */
export function RocketSticker({ className = '', size = 56 }) {
  return (
    <div
      className={`group cursor-pointer select-none transition-transform duration-300 hover:rotate-6 hover:scale-110 active:scale-95 inline-block ${className}`}
      title="Orbital Resupply Rocket"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.3)] animate-float-slow"
      >
        {/* Exhaust Fire Plume */}
        <g className="animate-pulse">
          <path d="M50 72 Q 40 86 50 96 Q 60 86 50 72 Z" fill="#f97316" />
          <path d="M50 74 Q 45 84 50 92 Q 55 84 50 74 Z" fill="#facc15" />
          <circle cx="50" cy="80" r="3" fill="#ffffff" />
        </g>

        {/* Rocket Booster Fins */}
        <path d="M34 58 L20 72 L36 68 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
        <path d="M66 58 L80 72 L64 68 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />

        {/* Rocket Fuselage */}
        <path
          d="M50 14 C 36 28 34 60 36 72 L 64 72 C 66 60 64 28 50 14 Z"
          fill="#ffffff"
          stroke="#0284c7"
          strokeWidth="3"
        />

        {/* Nose Cone */}
        <path d="M50 14 C 44 22 41 28 41 32 L 59 32 C 59 28 56 22 50 14 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />

        {/* Porthole Window */}
        <circle cx="50" cy="44" r="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
        <circle cx="48" cy="42" r="3" fill="#ffffff" />

        {/* Red Racing Stripes */}
        <path d="M38 60 L62 60" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        <path d="M39 65 L61 65" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * 3. Saturn Ringed Planet Sticker
 */
export function SaturnSticker({ className = '', size = 56 }) {
  return (
    <div
      className={`group cursor-pointer select-none transition-transform duration-300 hover:rotate-12 hover:scale-110 inline-block ${className}`}
      title="Gas Giant Saturn"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.25)] animate-float"
      >
        {/* Back Ring Half */}
        <path
          d="M12 48 C 12 36, 88 36, 88 48"
          stroke="#fde68a"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M16 48 C 16 38, 84 38, 84 48"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Planet Sphere */}
        <circle cx="50" cy="50" r="24" fill="url(#saturnGradient)" stroke="#d97706" strokeWidth="2" />

        {/* Atmospheric Cloud Stripes */}
        <path d="M28 46 Q 50 50 72 46" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M26 52 Q 50 56 74 52" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M30 58 Q 50 62 70 58" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

        {/* Front Ring Half */}
        <path
          d="M12 50 C 12 66, 88 66, 88 50"
          stroke="#fde68a"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M16 50 C 16 63, 84 63, 84 50"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <defs>
          <radialGradient id="saturnGradient" cx="40%" cy="40%" r="60%">
            <stop stopColor="#fef3c7" />
            <stop offset="0.6" stopColor="#fcd34d" />
            <stop offset="1" stopColor="#f59e0b" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * 4. Doodled Star Sparkles & Constellations
 */
export function SparkleDoodle({ className = '', size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-amber-400 animate-pulse ${className}`}
    >
      <path
        d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z"
        fill="currentColor"
        stroke="#f59e0b"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * 5. Cute Badge Decal Stickers (Pill/Badge Stickers)
 */
export function MissionDecalBadge({ icon: Icon, title, subtitle, color = 'blue' }) {
  const styles = {
    blue: 'bg-cyan-950/80 text-cyan-200 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:border-cyan-300 backdrop-blur-md',
    rose: 'bg-rose-950/80 text-rose-200 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.2)] hover:border-rose-300 backdrop-blur-md',
    amber: 'bg-amber-950/80 text-amber-200 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:border-amber-300 backdrop-blur-md',
    emerald: 'bg-emerald-950/80 text-emerald-200 border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:border-emerald-300 backdrop-blur-md',
    purple: 'bg-purple-950/80 text-purple-200 border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:border-purple-300 backdrop-blur-md'
  };

  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-none border font-mono transition-all duration-300 hover:border-cyan-300 cursor-default select-none ${styles[color]}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 text-cyan-400" />}
      <div className="leading-tight">
        <div className="text-[11px] font-bold tracking-wider uppercase text-white">{title}</div>
        {subtitle && <div className="text-[9px] text-slate-300 opacity-90">{subtitle}</div>}
      </div>
    </div>
  );
}
