'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Globe } from 'lucide-react';
import { AstronautSticker } from './SpaceStickers';

function MapLoadingPlaceholder() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] rounded-3xl overflow-hidden border-2 border-slate-200/90 bg-white/95 flex flex-col items-center justify-center text-center p-6 shadow-xl">
      <div className="relative z-10 flex flex-col items-center gap-4">
        <AstronautSticker size={80} />
        <div className="space-y-1">
          <p className="text-sm font-extrabold text-slate-800 tracking-wider uppercase">
            Initialising Geospatial Map Engine
          </p>
          <p className="text-xs text-slate-500 font-mono">
            Loading cartographic layers & future orbital trajectory...
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
