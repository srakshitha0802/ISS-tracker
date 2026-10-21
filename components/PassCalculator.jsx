'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Compass, Crosshair, Sparkles, Eye, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { calculateHaversineDistance, calculateSlantRange, calculateElevationAngle } from '@/lib/orbitCalculation';
import { soundEffects } from '@/lib/audio';

const PRESET_CITIES = [
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, code: 'GB' },
  { name: 'New York, USA', lat: 40.7128, lon: -74.006, code: 'US' },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777, code: 'IN' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, code: 'JP' },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522, code: 'FR' },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, code: 'AU' },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, code: 'AE' }
];

export default function PassCalculator({ issPosition }) {
  const [userLocation, setUserLocation] = useState(PRESET_CITIES[0]);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // Detect user geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    soundEffects.playClick();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          name: 'Detected Location',
          lat: Number(pos.coords.latitude.toFixed(4)),
          lon: Number(pos.coords.longitude.toFixed(4)),
          code: 'GPS'
        });
        soundEffects.playQuindarBeep();
      },
      (err) => {
        setIsLocating(false);
        setGeoError(err.message || 'Unable to retrieve location.');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Compute live distance metrics
  const distanceMetrics = useMemo(() => {
    if (!issPosition || typeof issPosition.latitude !== 'number' || typeof issPosition.longitude !== 'number') {
      return null;
    }

    const groundDist = calculateHaversineDistance(
      userLocation.lat,
      userLocation.lon,
      issPosition.latitude,
      issPosition.longitude
    );

    const slantRange = calculateSlantRange(groundDist, issPosition.altitude || 420);
    const elevation = calculateElevationAngle(groundDist, issPosition.altitude || 420);
    const isVisibleNow = elevation > 10;

    return {
      groundDistKm: Math.round(groundDist),
      slantRangeKm: Math.round(slantRange),
      elevationDeg: Number(elevation.toFixed(1)),
      isVisibleNow
    };
  }, [issPosition, userLocation]);

  return (
    <div className="bg-slate-950/80 rounded-none p-6 md:p-8 border border-cyan-500/30 shadow-2xl backdrop-blur-xl text-white font-mono relative">
      {/* Corner Notches */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-none bg-amber-950/80 border border-amber-400/60 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                ISS Distance & Sighting Radar
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase">
                Geodesic Range
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Calculate exact distance, elevation angle, and visual horizon sightings from your position
            </p>
          </div>
        </div>

        {/* Location selector / detection button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-detect-location"
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)] border border-cyan-300 transition-all cursor-pointer active:scale-95"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting...' : 'Detect My Location'}</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="mb-4 p-3 rounded-none bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{geoError} (You can select any preset city below)</span>
        </div>
      )}

      {/* Preset city pills */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Select An Observer Ground Station:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_CITIES.map((city) => {
            const isSelected = userLocation.name === city.name;
            return (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setUserLocation(city);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-cyan-500/20'
                }`}
              >
                <Globe className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{city.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time distance telemetry */}
      {distanceMetrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-none bg-slate-900/80 border border-cyan-500/20 shadow-lg">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Observer Location
            </span>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{userLocation.name}</span>
            </div>
            <span className="text-xs text-slate-400 block mt-1">
              {userLocation.lat}° N, {userLocation.lon}° E
            </span>
          </div>

          <div className="p-4 rounded-none bg-slate-900/80 border border-cyan-500/20 shadow-lg">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
              Direct Slant Range (3D)
            </span>
            <div className="text-2xl font-black text-white">
              {distanceMetrics.slantRangeKm.toLocaleString()} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Straight-line space vector
            </span>
          </div>

          <div className="p-4 rounded-none bg-slate-900/80 border border-cyan-500/20 shadow-lg">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
              Ground Arc Distance
            </span>
            <div className="text-2xl font-black text-white">
              {distanceMetrics.groundDistKm.toLocaleString()} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Earth surface great-circle arc
            </span>
          </div>

          <div className="p-4 rounded-none bg-slate-900/80 border border-cyan-500/20 shadow-lg">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
              Sky Elevation Angle
            </span>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{distanceMetrics.elevationDeg}°</span>
              {distanceMetrics.isVisibleNow ? (
                <span className="text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded-none bg-emerald-500/20 border border-emerald-500/40 uppercase">
                  Above Horizon
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-none bg-slate-800 border border-white/10 uppercase">
                  Below Horizon
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              {distanceMetrics.isVisibleNow
                ? 'ISS is in sky line of sight!'
                : 'Behind Earth curvature from here'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 text-xs">
          Loading orbital trajectory telemetry...
        </div>
      )}
    </div>
  );
}
