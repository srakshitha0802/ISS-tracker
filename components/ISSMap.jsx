'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Eye, EyeOff, Navigation, Compass, Layers, Orbit, Volume2, VolumeX, Sun, Globe } from 'lucide-react';
import { formatLatitude, formatLongitude, formatAltitude, formatVelocity, formatTimestamp, formatVisibility } from '@/lib/formatters';
import { predictFutureOrbit, calculateBearing, calculateFootprintRadius } from '@/lib/orbitCalculation';
import { getGeographicRegion } from '@/lib/geocoding';
import { soundEffects } from '@/lib/audio';

// Custom Space Station SVG Icon with True Orbital Bearing Heading Rotation
const createISSIcon = (isDaylight = true, headingDeg = 0) => {
  const glowColor = isDaylight ? 'rgba(56, 189, 248, 0.45)' : 'rgba(129, 140, 248, 0.45)';

  const svgHtml = `
    <div class="relative flex items-center justify-center select-none" style="width: 64px; height: 64px;">
      <!-- Pulsing Radar Ping Rings -->
      <div class="absolute inset-0 rounded-full animate-ping opacity-60" style="background-color: ${glowColor}; animation-duration: 2.5s;"></div>
      <div class="absolute inset-1.5 rounded-full border-2 border-cyan-400/70 animate-pulse"></div>

      <!-- Station Core Silhouette with Heading Rotation -->
      <div class="relative z-10 w-12 h-12 flex items-center justify-center bg-slate-950/90 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.7)] backdrop-blur-md transition-transform duration-700" style="transform: rotate(${headingDeg}deg);">
        <svg viewBox="0 0 32 32" fill="none" class="w-8 h-8 text-cyan-300" xmlns="http://www.w3.org/2000/svg">
          <!-- Solar Array Wings Left -->
          <rect x="2" y="7" width="6" height="5" rx="1.5" fill="#38bdf8" stroke="#0284c7" stroke-width="0.8"/>
          <rect x="2" y="13.5" width="6" height="5" rx="1.5" fill="#38bdf8" stroke="#0284c7" stroke-width="0.8"/>
          <rect x="2" y="20" width="6" height="5" rx="1.5" fill="#38bdf8" stroke="#0284c7" stroke-width="0.8"/>
          <line x1="8" y1="16" x2="12" y2="16" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>

          <!-- Central Trusses & Hab Modules -->
          <line x1="12" y1="16" x2="20" y2="16" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
          <rect x="14" y="11" width="4" height="10" rx="2" fill="#f8fafc" stroke="#38bdf8" stroke-width="1.5"/>
          <circle cx="16" cy="16" r="1.8" fill="#38bdf8"/>

          <!-- Solar Array Wings Right -->
          <line x1="20" y1="16" x2="24" y2="16" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
          <rect x="24" y="7" width="6" height="5" rx="1.5" fill="#38bdf8" stroke="#0284c7" stroke-width="0.8"/>
          <rect x="24" y="13.5" width="6" height="5" rx="1.5" fill="#38bdf8" stroke="#0284c7" stroke-width="0.8"/>
          <rect x="24" y="20" width="6" height="5" rx="1.5" fill="#38bdf8" stroke="#0284c7" stroke-width="0.8"/>
        </svg>

        <!-- Forward Direction Indicator Tip -->
        <div class="absolute -top-1 w-2 h-2 bg-rose-400 rounded-full shadow-[0_0_8px_#f43f5e]"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-iss-leaflet-icon',
    iconSize: [64, 64],
    iconAnchor: [32, 32],
    popupAnchor: [0, -36]
  });
};

function MapController({ position, isFollowing }) {
  const map = useMap();
  const prevPosRef = useRef(null);

  useEffect(() => {
    if (!position || typeof position.latitude !== 'number' || typeof position.longitude !== 'number') {
      return;
    }

    const targetCoords = [position.latitude, position.longitude];

    if (!prevPosRef.current) {
      map.setView(targetCoords, map.getZoom() || 3, { animate: false });
      prevPosRef.current = targetCoords;
      return;
    }

    if (isFollowing) {
      map.panTo(targetCoords, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
      });
    }

    prevPosRef.current = targetCoords;
  }, [position, isFollowing, map]);

  return null;
}

function splitTrailAtDateLine(trailPoints) {
  if (!trailPoints || trailPoints.length === 0) return [];

  const segments = [];
  let currentSegment = [];

  for (let i = 0; i < trailPoints.length; i++) {
    const pt = trailPoints[i];
    const coords = Array.isArray(pt) ? pt : [pt.latitude, pt.longitude];
    const lon = Array.isArray(pt) ? pt[1] : pt.longitude;

    if (currentSegment.length > 0) {
      const prevCoords = currentSegment[currentSegment.length - 1];
      const prevLon = prevCoords[1];
      const lonDiff = Math.abs(lon - prevLon);

      if (lonDiff > 180) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    }

    currentSegment.push(coords);
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

const MAP_LAYERS = {
  dark: {
    name: 'Carto Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  voyager: {
    name: 'Carto Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }
};

export default function ISSMap({
  position,
  trail = [],
  isFollowing = true,
  isTrailVisible = true,
  onToggleFollow,
  onToggleTrail,
  onClearTrail
}) {
  const markerRef = useRef(null);
  const [activeLayerKey, setActiveLayerKey] = useState('dark');
  const [showPredictedOrbit, setShowPredictedOrbit] = useState(true);
  const [showFootprint, setShowFootprint] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const coordinates = useMemo(() => {
    if (position && typeof position.latitude === 'number' && typeof position.longitude === 'number') {
      return [position.latitude, position.longitude];
    }
    return [0, 0];
  }, [position]);

  const headingBearing = useMemo(() => {
    if (trail.length >= 2) {
      const p1 = trail[trail.length - 2];
      const p2 = trail[trail.length - 1];
      return calculateBearing(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    }
    return 45;
  }, [trail]);

  const regionInfo = useMemo(() => {
    if (!position) return { name: 'Earth Orbit', code: 'ORBIT' };
    return getGeographicRegion(position.latitude, position.longitude);
  }, [position]);

  const visibilityInfo = useMemo(() => {
    return formatVisibility(position?.visibility);
  }, [position?.visibility]);

  const issIcon = useMemo(() => {
    return createISSIcon(visibilityInfo.isDaylight, headingBearing);
  }, [visibilityInfo.isDaylight, headingBearing]);

  const trailSegments = useMemo(() => {
    if (!isTrailVisible || trail.length < 2) return [];
    return splitTrailAtDateLine(trail);
  }, [trail, isTrailVisible]);

  const predictedOrbitSegments = useMemo(() => {
    if (!showPredictedOrbit || !position || typeof position.latitude !== 'number') return [];
    const points = predictFutureOrbit(position.latitude, position.longitude, 40);
    return splitTrailAtDateLine(points);
  }, [position, showPredictedOrbit]);

  const footprintRadiusMeters = useMemo(() => {
    return calculateFootprintRadius(position?.altitude || 420) * 1000;
  }, [position?.altitude]);

  const toggleSound = () => {
    const muted = soundEffects.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) soundEffects.playClick();
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[660px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950">
      <MapContainer
        center={coordinates}
        zoom={3}
        minZoom={2}
        maxZoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        worldCopyJump={true}
      >
        <TileLayer
          key={activeLayerKey}
          attribution={MAP_LAYERS[activeLayerKey].attribution}
          url={MAP_LAYERS[activeLayerKey].url}
          subdomains="abcd"
          maxZoom={19}
        />

        <MapController position={position} isFollowing={isFollowing} />

        {/* 1. Ground Footprint Horizon Circle */}
        {showFootprint && position && (
          <Circle
            center={coordinates}
            radius={footprintRadiusMeters}
            pathOptions={{
              color: '#38bdf8',
              weight: 1.5,
              opacity: 0.5,
              fillColor: '#38bdf8',
              fillOpacity: 0.08,
              dashArray: '4, 4'
            }}
          />
        )}

        {/* 2. Future Predicted Orbit Track (Amber Dotted Line) */}
        {showPredictedOrbit &&
          predictedOrbitSegments.map((segment, idx) => (
            <Polyline
              key={`predicted-segment-${idx}`}
              positions={segment}
              pathOptions={{
                color: '#fbbf24',
                weight: 2.5,
                opacity: 0.75,
                dashArray: '8, 8',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          ))}

        {/* 3. Recorded Session Flight Trail (Cyan Solid Line) */}
        {isTrailVisible &&
          trailSegments.map((segment, idx) => (
            <Polyline
              key={`trail-segment-${idx}-${segment.length}`}
              positions={segment}
              pathOptions={{
                color: '#38bdf8',
                weight: 3.5,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          ))}

        {/* 4. Trail Historical Breadcrumb Dots */}
        {isTrailVisible &&
          trail.slice(0, -1).map((pt, i) => (
            <CircleMarker
              key={`trail-pt-${pt.timestamp}-${i}`}
              center={[pt.latitude, pt.longitude]}
              radius={3.5}
              pathOptions={{
                color: '#0284c7',
                fillColor: '#38bdf8',
                fillOpacity: 0.75,
                weight: 1.5
              }}
            />
          ))}

        {/* 5. Subsolar Zenith Point Marker */}
        {position?.solar_lat !== null && position?.solar_lat !== undefined && (
          <CircleMarker
            center={[position.solar_lat, position.solar_lon]}
            radius={7}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#fbbf24',
              fillOpacity: 0.9,
              weight: 2
            }}
          >
            <Popup closeButton={false} className="custom-iss-popup-glass">
              <div className="text-xs p-1 font-sans text-white">
                <span className="font-bold text-amber-300 block flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subsolar Zenith Point</span>
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  {formatLatitude(position.solar_lat)}, {formatLongitude(position.solar_lon)}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* 6. Current ISS Position Marker with True Bearing Rotation */}
        {position && (
          <Marker ref={markerRef} position={coordinates} icon={issIcon}>
            <Popup className="custom-iss-popup-glass" closeButton={true}>
              <div className="p-1 min-w-[240px] text-slate-100 font-sans">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="font-extrabold text-xs uppercase tracking-wider text-white">
                      ISS (ZARYA) #25544
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      visibilityInfo.isDaylight
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {visibilityInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Latitude</span>
                    <span className="font-mono font-bold text-cyan-300">{formatLatitude(position.latitude)}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Longitude</span>
                    <span className="font-mono font-bold text-cyan-300">{formatLongitude(position.longitude)}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Altitude</span>
                    <span className="font-mono font-bold text-white">{formatAltitude(position.altitude)}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Heading</span>
                    <span className="font-mono font-bold text-white">{Math.round(headingBearing)}° N</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Region:</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{regionInfo.name}</span>
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Floating Toolbar (Top Right) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
        {/* Follow ISS Button */}
        <button
          type="button"
          id="btn-follow-iss"
          onClick={() => {
            soundEffects.playClick();
            onToggleFollow();
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-xl transition-all duration-200 shadow-xl border ${
            isFollowing
              ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'bg-slate-900/80 text-slate-300 border-white/15 hover:bg-slate-800'
          }`}
        >
          <Crosshair className={`w-4 h-4 ${isFollowing ? 'animate-spin-slow' : 'text-slate-400'}`} />
          <span>{isFollowing ? 'Tracking ISS' : 'Follow ISS'}</span>
          <span className={`w-2 h-2 rounded-full ${isFollowing ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
        </button>

        {/* Future Orbit Projection Toggle */}
        <button
          type="button"
          id="btn-toggle-orbit"
          onClick={() => {
            soundEffects.playClick();
            setShowPredictedOrbit(!showPredictedOrbit);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-xl transition-all border ${
            showPredictedOrbit
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-md'
              : 'bg-slate-900/80 text-slate-400 border-white/15 hover:bg-slate-800'
          }`}
        >
          <Orbit className="w-4 h-4 text-amber-400" />
          <span>{showPredictedOrbit ? 'Next Orbit (90m)' : 'Next Orbit Hidden'}</span>
        </button>

        {/* Footprint Coverage Toggle */}
        <button
          type="button"
          id="btn-toggle-footprint"
          onClick={() => {
            soundEffects.playClick();
            setShowFootprint(!showFootprint);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-xl transition-all border ${
            showFootprint
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-md'
              : 'bg-slate-900/80 text-slate-400 border-white/15 hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>{showFootprint ? 'Footprint Circle' : 'Footprint Off'}</span>
        </button>

        {/* Trail Toggle */}
        <button
          type="button"
          id="btn-toggle-trail"
          onClick={() => {
            soundEffects.playClick();
            onToggleTrail();
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-xl transition-all border ${
            isTrailVisible
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-md'
              : 'bg-slate-900/80 text-slate-400 border-white/15 hover:bg-slate-800'
          }`}
        >
          {isTrailVisible ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          <span>{isTrailVisible ? 'Trail Shown' : 'Trail Hidden'}</span>
        </button>

        {/* Map Layer Switcher */}
        <div className="flex rounded-2xl overflow-hidden border border-white/15 bg-slate-900/80 backdrop-blur-xl shadow-lg p-1 gap-1">
          {Object.entries(MAP_LAYERS).map(([key]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveLayerKey(key);
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                activeLayerKey === key
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {key === 'dark' ? 'Dark' : key === 'voyager' ? 'Voyager' : 'Standard'}
            </button>
          ))}
        </div>

        {/* Audio Mute/Unmute */}
        <button
          type="button"
          onClick={toggleSound}
          title={isAudioMuted ? 'Unmute audio effects' : 'Mute audio effects'}
          className="self-end p-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl text-slate-300 hover:text-cyan-400 border border-white/15 shadow-xl transition-all"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>

      {/* Live Region & Coordinate Pill (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/15 text-xs font-semibold text-white shadow-2xl">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{regionInfo.name}</span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <div className="font-mono text-[11px] text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatLatitude(position?.latitude)}</span>
            <span className="text-white/20">,</span>
            <span>{formatLongitude(position?.longitude)}</span>
            <span className="text-white/20">|</span>
            <span className="font-bold text-cyan-400">{Math.round(headingBearing)}° N</span>
          </div>
        </div>
      </div>
    </div>
  );
}
