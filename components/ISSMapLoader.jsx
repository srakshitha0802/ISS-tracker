'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Satellite } from 'lucide-react';

function MapLoadingPlaceholder() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] rounded-none overflow-hidden border border-cyan-500/30 bg-slate-950/80 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6 shadow-2xl text-white">
      {/* Corner Notches */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-none bg-slate-900 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Satellite className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-mono font-bold text-white tracking-widest uppercase">
            Initialising Geospatial Map Engine
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Loading cartographic layers & future orbital trajectory...
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 px-3 py-1.5 rounded-none border border-cyan-500/40">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>SYNCHRONIZING NORAD #25544</span>
        </div>
      </div>
    </div>
  );
}

const DynamicISSMap = dynamic(() => import('./ISSMap'), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />
});

export default function ISSMapLoader(props) {
  return <DynamicISSMap {...props} />;
}
