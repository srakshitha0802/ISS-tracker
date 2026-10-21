'use client';

import React from 'react';
import { ExternalLink, Heart, Sparkles } from 'lucide-react';
import { AstronautSticker, SaturnSticker } from './SpaceStickers';

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-slate-200/80 bg-white/95 py-10 text-xs text-slate-500 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AstronautSticker size={42} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">ISS Tracker</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-600">Live Space Station Tracker</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Built with precision for the Edzul 5-Day Development Challenge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="https://wheretheiss.at"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 transition-colors"
            >
              <span>Where the ISS At? API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 transition-colors"
            >
              <span>OpenStreetMap & CARTO</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Limitations & Technical Disclaimers */}
        <div className="border-t border-slate-100 pt-5 text-[11px] text-slate-500 space-y-1.5 leading-relaxed">
          <p>
            <strong className="text-slate-700">Orbital Physics Note:</strong> The International Space Station completes approximately 15.54 orbits per day (one revolution every ~92.7 minutes) at an orbital inclination of 51.64° to the equator. Data is polled at an approximate 7-second cadence in accordance with public API rate limits.
          </p>
          <p>
            The session movement trail maps discrete observation points captured within your active browser tab, while the forward ground track models the predicted orbital trajectory over the next 90 minutes.
          </p>
        </div>
      </div>
    </footer>
  );
}
