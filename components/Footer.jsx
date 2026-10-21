'use client';

import React from 'react';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">ISS Tracker</span>
            <span>—</span>
            <span>Live Space Station Tracker for the Edzul 5-Day Development Challenge</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://wheretheiss.at"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <span>Where the ISS At? API</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <span>OpenStreetMap & CARTO</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Limitations & Technical Disclaimers */}
        <div className="border-t border-slate-900/80 pt-4 text-[11px] text-slate-500 space-y-1">
          <p>
            <span className="font-medium text-slate-400">Technical Considerations:</span> Telemetry is updated at an approximate 7-second cadence respecting upstream rate limits of 1 request/second. Real ISS coordinates fluctuate due to orbital physics, periodic station re-boosts, and upper atmospheric drag in Low Earth Orbit (~400–425 km).
          </p>
          <p>
            The movement trail illustrates recent chronological telemetry points captured during your active browser session, not a full 92-minute orbital ground track.
          </p>
        </div>
      </div>
    </footer>
  );
}
