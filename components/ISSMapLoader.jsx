'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Globe } from 'lucide-react';

// Loading Placeholder during SSR and client bundle hydration
function MapLoadingPlaceholder() {
  return (
    <div className="relative w-full h-[480px] md:h-[580px] lg:h-[620px] rounded-2xl overflow-hidden border border-cyan-900/40 bg-slate-950/80 flex flex-col items-center justify-center text-center p-6 shadow-2xl">
      {/* Background orbital grid rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[300px] h-[300px] rounded-full border border-cyan-400"></div>
        <div className="w-[450px] h-[450px] rounded-full border border-cyan-400 absolute"></div>
        <div className="w-[600px] h-[600px] rounded-full border border-cyan-400 absolute"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative">
          <Globe className="w-12 h-12 text-cyan-500 animate-pulse" />
          <Loader2 className="w-6 h-6 text-cyan-300 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-200 tracking-wider uppercase">
            Initialising Orbital Map Engine
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Loading OpenStreetMap cartography & telemetry layers...
          </p>
        </div>
      </div>
    </div>
  );
}

// Dynamically import Leaflet ISSMap with SSR disabled
const DynamicISSMap = dynamic(() => import('./ISSMap'), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />
});

export default function ISSMapLoader(props) {
  return <DynamicISSMap {...props} />;
}
