'use client';

import React from 'react';
import { ExternalLink, Radio, Globe, Terminal, Satellite, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 glass-panel py-8 text-xs text-slate-300 relative z-10 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Satellite className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">
                ISS <span className="text-gold-gradient">TRACKER PRO</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">NORAD #25544 · Orbital Ground Station</div>
            </div>
          </div>

          {/* API attribution links */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { href: 'https://wheretheiss.at', icon: Radio, label: 'Where The ISS At?' },
              { href: 'https://platform.deepseek.com', icon: Terminal, label: 'DeepSeek AI' },
              { href: 'https://carto.com/attributions', icon: Globe, label: 'CARTO Basemaps' }
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 glass-panel hover:border-amber-400/40 text-slate-300 hover:text-amber-200 transition-all font-mono text-[11px]"
              >
                <Icon className="w-3 h-3 text-amber-400" />
                <span>{label}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-5 pt-5 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
          <span>Orbital inclination 51.64° · Period 92.7 min · 15.54 rev/day · Expedition 72</span>
          <span className="text-amber-300/80 font-bold">DeepSeek AI + CARTO Maps Enabled</span>
        </div>
      </div>
    </footer>
  );
}
