'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Compass, Crosshair, Sparkles, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateHaversineDistance, calculateSlantRange, calculateElevationAngle } from '@/lib/orbitCalculation';
import { soundEffects } from '@/lib/audio';

const PRESET_CITIES = [
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
  { name: 'New York, USA', lat: 40.7128, lon: -74.006, flag: '🇺🇸' },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777, flag: '🇮🇳' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, flag: '🇦🇺' },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, flag: '🇦🇪' }
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
          name: 'My Detected Location',
          lat: Number(pos.coords.latitude.toFixed(4)),
          lon: Number(pos.coords.longitude.toFixed(4)),
          flag: '📍'
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
    const isVisibleNow = elevation > 10; // above 10 degrees is easily visible

    return {
      groundDistKm: Math.round(groundDist),
      slantRangeKm: Math.round(slantRange),
      elevationDeg: Number(elevation.toFixed(1)),
      isVisibleNow
    };
  }, [issPosition, userLocation]);

  return (
    <div className="bg-white/95 rounded-3xl p-6 md:p-8 border-2 border-slate-200/90 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-200">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                ISS Distance & Sighting Radar
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Live Geodesic Range
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 transition-all cursor-pointer active:scale-95"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting...' : 'Detect My Location'}</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{geoError} (You can still select any preset city below)</span>
        </div>
      )}

      {/* Preset city pills */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
          Select An Observer Location:
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <span>{city.flag}</span>
                <span>{city.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time distance telemetry */}
      {distanceMetrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 shadow-sm">
            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-1">
              Observer Location
            </span>
            <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{userLocation.flag}</span>
              <span>{userLocation.name}</span>
            </div>
            <span className="font-mono text-xs text-slate-500 block mt-1">
              {userLocation.lat}° N, {userLocation.lon}° E
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-sm">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
              Direct Slant Range (3D)
            </span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {distanceMetrics.slantRangeKm.toLocaleString()} <span className="text-xs font-normal text-slate-500">km</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Straight-line space vector
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Ground Arc Distance
            </span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {distanceMetrics.groundDistKm.toLocaleString()} <span className="text-xs font-normal text-slate-500">km</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Earth surface great-circle arc
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Sky Elevation Angle
            </span>
            <div className="text-2xl font-black font-mono text-slate-900 flex items-center gap-1.5">
              <span>{distanceMetrics.elevationDeg}°</span>
              {distanceMetrics.isVisibleNow ? (
                <span className="text-xs font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-100">
                  Above Horizon
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                  Below Horizon
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              {distanceMetrics.isVisibleNow
                ? 'ISS is directly overhead in your sky!'
                : 'Behind Earth’s curvature from this city'}
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
