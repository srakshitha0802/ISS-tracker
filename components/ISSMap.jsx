'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Eye, EyeOff, Navigation, Compass, Layers, Orbit, Volume2, VolumeX, Sun } from 'lucide-react';
import { formatLatitude, formatLongitude, formatAltitude, formatVelocity, formatTimestamp, formatVisibility } from '@/lib/formatters';
import { predictFutureOrbit, calculateBearing, calculateFootprintRadius } from '@/lib/orbitCalculation';
import { getGeographicRegion } from '@/lib/geocoding';
import { soundEffects } from '@/lib/audio';

// Custom Space Station SVG Icon with True Orbital Bearing Heading Rotation
const createISSIcon = (isDaylight = true, headingDeg = 0) => {
  const glowColor = isDaylight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(99, 102, 241, 0.4)';

  const svgHtml = `
    <div class="relative flex items-center justify-center select-none" style="width: 64px; height: 64px;">
      <!-- Pulsing Radar Ping Rings -->
      <div class="absolute inset-0 rounded-full animate-ping opacity-60" style="background-color: ${glowColor}; animation-duration: 2.5s;"></div>
      <div class="absolute inset-1.5 rounded-full border-2 border-sky-500/70 animate-pulse"></div>

      <!-- Station Core Silhouette with Heading Rotation -->
      <div class="relative z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full border-2 border-sky-500 shadow-[0_4px_25px_rgba(2,132,199,0.55)] backdrop-blur-sm transition-transform duration-700" style="transform: rotate(${headingDeg}deg);">
        <svg viewBox="0 0 32 32" fill="none" class="w-8 h-8 text-sky-600" xmlns="http://www.w3.org/2000/svg">
          <!-- Solar Array Wings Left -->
          <rect x="2" y="7" width="6" height="5" rx="1.5" fill="#0284c7" stroke="#0369a1" stroke-width="0.8"/>
          <rect x="2" y="13.5" width="6" height="5" rx="1.5" fill="#0284c7" stroke="#0369a1" stroke-width="0.8"/>
          <rect x="2" y="20" width="6" height="5" rx="1.5" fill="#0284c7" stroke="#0369a1" stroke-width="0.8"/>
          <line x1="8" y1="16" x2="12" y2="16" stroke="#64748b" stroke-width="1.8" stroke-linecap="round"/>

          <!-- Central Trusses & Hab Modules -->
          <line x1="12" y1="16" x2="20" y2="16" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
          <rect x="14" y="11" width="4" height="10" rx="2" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
          <circle cx="16" cy="16" r="1.8" fill="#f59e0b"/>

          <!-- Solar Array Wings Right -->
          <line x1="20" y1="16" x2="24" y2="16" stroke="#64748b" stroke-width="1.8" stroke-linecap="round"/>
          <rect x="24" y="7" width="6" height="5" rx="1.5" fill="#0284c7" stroke="#0369a1" stroke-width="0.8"/>
          <rect x="24" y="13.5" width="6" height="5" rx="1.5" fill="#0284c7" stroke="#0369a1" stroke-width="0.8"/>
          <rect x="24" y="20" width="6" height="5" rx="1.5" fill="#0284c7" stroke="#0369a1" stroke-width="0.8"/>
        </svg>

        <!-- Forward Direction Indicator Tip -->
        <div class="absolute -top-1 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_6px_#ef4444]"></div>
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
  voyager: {
    name: 'Carto Voyager (Light)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  },
  dark: {
    name: 'Carto Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
  const [activeLayerKey, setActiveLayerKey] = useState('voyager');
  const [showPredictedOrbit, setShowPredictedOrbit] = useState(true);
  const [showFootprint, setShowFootprint] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const coordinates = useMemo(() => {
    if (position && typeof position.latitude === 'number' && typeof position.longitude === 'number') {
      return [position.latitude, position.longitude];
    }
    return [0, 0];
  }, [position]);

  // Compute true flight heading bearing from recent trail points
  const headingBearing = useMemo(() => {
    if (trail.length >= 2) {
      const p1 = trail[trail.length - 2];
      const p2 = trail[trail.length - 1];
      return calculateBearing(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    }
    return 45; // nominal northeasterly ascent
  }, [trail]);

  const regionInfo = useMemo(() => {
    if (!position) return { name: 'Earth Orbit', flag: '🛰️' };
    return getGeographicRegion(position.latitude, position.longitude);
  }, [position]);

  const visibilityInfo = useMemo(() => {
    return formatVisibility(position?.visibility);
  }, [position?.visibility]);

  const issIcon = useMemo(() => {
    return createISSIcon(visibilityInfo.isDaylight, headingBearing);
  }, [visibilityInfo.isDaylight, headingBearing]);

  // Trail segments split across Date Line
  const trailSegments = useMemo(() => {
    if (!isTrailVisible || trail.length < 2) return [];
    return splitTrailAtDateLine(trail);
  }, [trail, isTrailVisible]);

  // Future 90-minute predicted orbit split across Date Line
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
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[660px] rounded-3xl overflow-hidden border-2 border-slate-200/90 shadow-2xl bg-slate-50">
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
              color: '#0284c7',
              weight: 1.5,
              opacity: 0.4,
              fillColor: '#38bdf8',
              fillOpacity: 0.08,
              dashArray: '4, 4'
            }}
          />
        )}

        {/* 2. Future Predicted Orbit Track (Amber / Gold Dotted Line) */}
        {showPredictedOrbit &&
          predictedOrbitSegments.map((segment, idx) => (
            <Polyline
              key={`predicted-segment-${idx}`}
              positions={segment}
              pathOptions={{
                color: '#f59e0b',
                weight: 2.5,
                opacity: 0.7,
                dashArray: '8, 8',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          ))}

        {/* 3. Recorded Session Flight Trail (Sky Blue Solid Line) */}
        {isTrailVisible &&
          trailSegments.map((segment, idx) => (
            <Polyline
              key={`trail-segment-${idx}-${segment.length}`}
              positions={segment}
              pathOptions={{
                color: '#0284c7',
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
                color: '#0369a1',
                fillColor: '#38bdf8',
                fillOpacity: 0.7,
                weight: 1.5
              }}
            />
          ))}

        {/* 5. Subsolar Zenith Point Marker (Where Sun is Directly Overhead) */}
        {position?.solar_lat !== null && position?.solar_lat !== undefined && (
          <CircleMarker
            center={[position.solar_lat, position.solar_lon]}
            radius={7}
            pathOptions={{
              color: '#d97706',
              fillColor: '#fbbf24',
              fillOpacity: 0.9,
              weight: 2
            }}
          >
            <Popup closeButton={false}>
              <div className="text-xs p-1 font-sans">
                <span className="font-bold text-amber-700 block">☀️ Subsolar Zenith Point</span>
                <span className="text-[11px] text-slate-600 font-mono">
                  {formatLatitude(position.solar_lat)}, {formatLongitude(position.solar_lon)}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* 6. Current ISS Position Marker with True Bearing Rotation */}
        {position && (
          <Marker ref={markerRef} position={coordinates} icon={issIcon}>
            <Popup className="custom-iss-popup-light" closeButton={true}>
              <div className="p-1 min-w-[240px] text-slate-800 font-sans">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      ISS (ZARYA) #25544
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      visibilityInfo.isDaylight
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    }`}
                  >
                    {visibilityInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Latitude</span>
                    <span className="font-mono font-bold text-slate-800">{formatLatitude(position.latitude)}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Longitude</span>
                    <span className="font-mono font-bold text-slate-800">{formatLongitude(position.longitude)}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Altitude</span>
                    <span className="font-mono font-bold text-sky-700">{formatAltitude(position.altitude)}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Heading</span>
                    <span className="font-mono font-bold text-slate-800">{Math.round(headingBearing)}° N</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Region:</span>
                  <span className="font-bold text-slate-800">
                    {regionInfo.flag} {regionInfo.name}
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
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-md transition-all duration-200 shadow-lg border-2 ${
            isFollowing
              ? 'bg-sky-500 text-white border-sky-400 shadow-sky-200'
              : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Crosshair className={`w-4 h-4 ${isFollowing ? 'animate-spin-slow' : 'text-slate-400'}`} />
          <span>{isFollowing ? 'Tracking ISS' : 'Follow ISS'}</span>
          <span className={`w-2 h-2 rounded-full ${isFollowing ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
        </button>

        {/* Future Orbit Projection Toggle */}
        <button
          type="button"
          id="btn-toggle-orbit"
          onClick={() => {
            soundEffects.playClick();
            setShowPredictedOrbit(!showPredictedOrbit);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-md transition-all border-2 ${
            showPredictedOrbit
              ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-md'
              : 'bg-white/95 text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Orbit className="w-4 h-4 text-amber-500" />
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
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-md transition-all border-2 ${
            showFootprint
              ? 'bg-sky-50 text-sky-900 border-sky-300 shadow-md'
              : 'bg-white/95 text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4 text-sky-500" />
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
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-md transition-all border-2 ${
            isTrailVisible
              ? 'bg-sky-50 text-sky-900 border-sky-300 shadow-md'
              : 'bg-white/95 text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {isTrailVisible ? <Eye className="w-4 h-4 text-sky-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          <span>{isTrailVisible ? 'Trail Shown' : 'Trail Hidden'}</span>
        </button>

        {/* Map Layer Switcher */}
        <div className="flex rounded-2xl overflow-hidden border-2 border-slate-200 bg-white/95 shadow-md p-1 gap-1">
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
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {key === 'voyager' ? 'Voyager' : key === 'osm' ? 'Standard' : 'Dark'}
            </button>
          ))}
        </div>

        {/* Audio Mute/Unmute */}
        <button
          type="button"
          onClick={toggleSound}
          title={isAudioMuted ? 'Unmute mission control audio pings' : 'Mute audio'}
          className="self-end p-2 rounded-2xl bg-white/95 text-slate-700 hover:text-sky-600 border-2 border-slate-200 shadow-md transition-all"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-500" />}
        </button>
      </div>

      {/* Live Region & Coordinate Pill (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-200 text-xs font-semibold text-slate-800 shadow-xl">
          <div className="flex items-center gap-1.5 font-bold text-sky-700">
            <span className="text-base">{regionInfo.flag}</span>
            <span>{regionInfo.name}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <div className="font-mono text-[11px] text-slate-600 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-500" />
            <span>{formatLatitude(position?.latitude)}</span>
            <span className="text-slate-300">,</span>
            <span>{formatLongitude(position?.longitude)}</span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-sky-700">{Math.round(headingBearing)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
