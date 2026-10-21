'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Globe } from 'lucide-react';
import { AstronautSticker } from './SpaceStickers';

function MapLoadingPlaceholder() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] rounded-3xl overflow-hidden border border-white/15 bg-slate-950/70 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6 shadow-2xl text-white">
      <div className="relative z-10 flex flex-col items-center gap-4">
        <AstronautSticker size={80} />
        <div className="space-y-1">
          <p className="text-sm font-extrabold text-white tracking-wider uppercase">
            Initialising Geospatial Map Engine
          </p>
          <p className="text-xs text-slate-300 font-mono">
            Loading cartographic layers & future orbital trajectory...
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-500/40">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>Synchronizing NORAD #25544</span>
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
