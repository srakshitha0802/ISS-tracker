'use client';

import React from 'react';
import { ExternalLink, Radio, Shield, Globe, Terminal } from 'lucide-react';
import ISSLogo from './ISSLogo';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-2xl py-10 text-xs text-slate-400 relative z-10 shadow-[0_-4px_30px_rgba(0,0,0,0.7)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-cyan-500/15">
          {/* Logo and Tagline */}
          <div className="space-y-1">
            <ISSLogo size="sm" />
            <p className="text-[11px] font-mono text-slate-400 pl-0.5">
              Live Real-Time Satellite Telemetry & Vector Tracking Console • Edzul Challenge
            </p>
          </div>

          {/* Two Core APIs Ribbon */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <a
              href="https://wheretheiss.at"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>API 1: Where The ISS At?</span>
              <ExternalLink className="w-3 h-3 text-cyan-400/70" />
            </a>

            <a
              href="https://platform.deepseek.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 hover:text-white hover:border-indigo-400 transition-all shadow-sm"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>API 2: DeepSeek AI</span>
              <ExternalLink className="w-3 h-3 text-indigo-400/70" />
            </a>

            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-slate-900 border border-slate-700/50 text-slate-400 hover:text-white transition-all shadow-sm text-[11px]"
            >
              <Globe className="w-3 h-3 text-slate-400" />
              <span>Map: CARTO / OSM</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Aerospace Technical Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-[11px] font-mono leading-relaxed">
          <div className="p-3 rounded-none bg-slate-900/60 border border-cyan-500/15">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Orbital Mechanics</span>
            </div>
            <p className="text-slate-400">
              Mean altitude 420 km, inclination 51.64°, orbital period ~92.7 minutes (15.54 rev/day).
            </p>
          </div>

          <div className="p-3 rounded-none bg-slate-900/60 border border-cyan-500/15">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5" />
              <span>Telemetry Downlink</span>
            </div>
            <p className="text-slate-400">
              Continuous 7-second rate-limited polling with exponential backoff & antimeridian split handling.
            </p>
          </div>

          <div className="p-3 rounded-none bg-slate-900/60 border border-cyan-500/15">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Spacecraft Registry</span>
            </div>
            <p className="text-slate-400">
              NORAD #25544 • COSPAR 1998-067A • Continually inhabited since November 2000.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
