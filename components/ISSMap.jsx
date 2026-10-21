'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Eye, EyeOff, Navigation, Compass } from 'lucide-react';
import { formatLatitude, formatLongitude, formatAltitude, formatVelocity, formatTimestamp, formatVisibility } from '@/lib/formatters';

// Custom Space Station SVG Icon
const createISSIcon = (isDaylight = true) => {
  const pulseColor = isDaylight ? '#38bdf8' : '#818cf8';
  const glowColor = isDaylight ? 'rgba(56, 189, 248, 0.4)' : 'rgba(129, 140, 248, 0.4)';

  const svgHtml = `
    <div class="relative flex items-center justify-center" style="width: 52px; height: 52px;">
      <!-- Pulsing Radar Ping Rings -->
      <div class="absolute inset-0 rounded-full animate-ping opacity-60" style="background-color: ${glowColor}; animation-duration: 3s;"></div>
      <div class="absolute inset-1 rounded-full border border-cyan-400/60 animate-pulse"></div>

      <!-- Station Core Silhouette Box -->
      <div class="relative z-10 w-10 h-10 flex items-center justify-center bg-slate-950/90 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.7)] backdrop-blur-sm">
        <svg viewBox="0 0 32 32" fill="none" class="w-6 h-6 text-cyan-300" xmlns="http://www.w3.org/2000/svg">
          <!-- Solar Array Wings Left -->
          <rect x="2" y="8" width="6" height="4" rx="1" fill="#38bdf8" fill-opacity="0.9" stroke="#0284c7" stroke-width="0.8"/>
          <rect x="2" y="14" width="6" height="4" rx="1" fill="#38bdf8" fill-opacity="0.9" stroke="#0284c7" stroke-width="0.8"/>
          <rect x="2" y="20" width="6" height="4" rx="1" fill="#38bdf8" fill-opacity="0.9" stroke="#0284c7" stroke-width="0.8"/>
          <line x1="8" y1="16" x2="12" y2="16" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>

          <!-- Central Trusses & Hab Modules -->
          <line x1="12" y1="16" x2="20" y2="16" stroke="#e2e8f0" stroke-width="2.5" stroke-linecap="round"/>
          <rect x="14" y="12" width="4" height="8" rx="1.5" fill="#f8fafc" stroke="#38bdf8" stroke-width="1"/>
          <circle cx="16" cy="16" r="1.5" fill="#38bdf8"/>

          <!-- Solar Array Wings Right -->
          <line x1="20" y1="16" x2="24" y2="16" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
          <rect x="24" y="8" width="6" height="4" rx="1" fill="#38bdf8" fill-opacity="0.9" stroke="#0284c7" stroke-width="0.8"/>
          <rect x="24" y="14" width="6" height="4" rx="1" fill="#38bdf8" fill-opacity="0.9" stroke="#0284c7" stroke-width="0.8"/>
          <rect x="24" y="20" width="6" height="4" rx="1" fill="#38bdf8" fill-opacity="0.9" stroke="#0284c7" stroke-width="0.8"/>
        </svg>
      </div>

      <!-- Small Pointer Direction Arrow -->
      <div class="absolute -bottom-1 z-20 w-2 h-2 bg-cyan-400 rotate-45 shadow-[0_0_6px_#38bdf8]"></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-iss-leaflet-icon',
    iconSize: [52, 52],
    iconAnchor: [26, 26],
    popupAnchor: [0, -28]
  });
};

/**
 * Helper hook to smooth-pan the map when coordinates change if follow mode is enabled.
 */
function MapController({ position, isFollowing }) {
  const map = useMap();
  const prevPosRef = useRef(null);

  useEffect(() => {
    if (!position || typeof position.latitude !== 'number' || typeof position.longitude !== 'number') {
      return;
    }

    const targetCoords = [position.latitude, position.longitude];

    if (!prevPosRef.current) {
      // First position received: center with default zoom
      map.setView(targetCoords, map.getZoom() || 3, { animate: false });
      prevPosRef.current = targetCoords;
      return;
    }

    // Only pan if follow mode is active
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

/**
 * Splits continuous points across the International Date Line (-180° / +180° antimeridian)
 * to prevent drawing a horizontal line across the entire map canvas.
 */
function splitTrailAtDateLine(trailPoints) {
  if (!trailPoints || trailPoints.length === 0) return [];

  const segments = [];
  let currentSegment = [];

  for (let i = 0; i < trailPoints.length; i++) {
    const pt = trailPoints[i];
    const coords = [pt.latitude, pt.longitude];

    if (currentSegment.length > 0) {
      const prevPt = trailPoints[i - 1];
      const lonDiff = Math.abs(pt.longitude - prevPt.longitude);

      // If longitude jumps by more than 180 degrees, it has crossed the antimeridian
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

  const coordinates = useMemo(() => {
    if (position && typeof position.latitude === 'number' && typeof position.longitude === 'number') {
      return [position.latitude, position.longitude];
    }
    return [0, 0];
  }, [position]);

  const visibilityInfo = useMemo(() => {
    return formatVisibility(position?.visibility);
  }, [position?.visibility]);

  const issIcon = useMemo(() => {
    return createISSIcon(visibilityInfo.isDaylight);
  }, [visibilityInfo.isDaylight]);

  // Split polyline at the international date line
  const trailSegments = useMemo(() => {
    if (!isTrailVisible || trail.length < 2) return [];
    return splitTrailAtDateLine(trail);
  }, [trail, isTrailVisible]);

  return (
    <div className="relative w-full h-[480px] md:h-[580px] lg:h-[620px] rounded-2xl overflow-hidden border border-cyan-900/50 shadow-2xl bg-slate-950">
      <MapContainer
        center={coordinates}
        zoom={3}
        minZoom={2}
        maxZoom={10}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        worldCopyJump={true}
      >
        {/* CartoDB Dark Matter Tiles for authentic space mission control look */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        <MapController position={position} isFollowing={isFollowing} />

        {/* ISS Movement Trail Segments */}
        {isTrailVisible &&
          trailSegments.map((segment, idx) => (
            <Polyline
              key={`segment-${idx}-${segment.length}`}
              positions={segment}
              pathOptions={{
                color: '#38bdf8',
                weight: 3,
                opacity: 0.75,
                dashArray: '6, 6',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          ))}

        {/* Trail Historical Breadcrumb Dots */}
        {isTrailVisible &&
          trail.slice(0, -1).map((pt, i) => (
            <CircleMarker
              key={`trail-pt-${pt.timestamp}-${i}`}
              center={[pt.latitude, pt.longitude]}
              radius={3}
              pathOptions={{
                color: '#0284c7',
                fillColor: '#38bdf8',
                fillOpacity: 0.6,
                weight: 1
              }}
            />
          ))}

        {/* Current ISS Position Marker */}
        {position && (
          <Marker
            ref={markerRef}
            position={coordinates}
            icon={issIcon}
          >
            <Popup className="custom-iss-popup" closeButton={true}>
              <div className="p-1 min-w-[220px] text-slate-100 font-sans">
                <div className="flex items-center justify-between border-b border-cyan-800/60 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="font-bold text-xs uppercase tracking-wider text-cyan-300">
                      ISS (ZARYA) #25544
                    </span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    visibilityInfo.isDaylight
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {visibilityInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Latitude</span>
                    <span className="font-mono text-cyan-200">{formatLatitude(position.latitude)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Longitude</span>
                    <span className="font-mono text-cyan-200">{formatLongitude(position.longitude)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Altitude</span>
                    <span className="font-mono text-slate-200">{formatAltitude(position.altitude)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Velocity</span>
                    <span className="font-mono text-slate-200">{formatVelocity(position.velocity)}</span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Recorded:</span>
                  <span className="font-mono text-slate-300">{formatTimestamp(position.timestamp)}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Control Floating Toolbar (Top Right) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
        {/* Follow ISS Toggle Button */}
        <button
          type="button"
          id="btn-follow-iss"
          onClick={onToggleFollow}
          aria-label={isFollowing ? 'Disable automatic map tracking' : 'Enable automatic map tracking'}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-200 shadow-lg border ${
            isFollowing
              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-500'
          }`}
        >
          <Crosshair className={`w-4 h-4 ${isFollowing ? 'text-cyan-400 animate-spin-slow' : 'text-slate-400'}`} />
          <span>{isFollowing ? 'Tracking ISS' : 'Follow ISS'}</span>
          <span className={`w-2 h-2 rounded-full ${isFollowing ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
        </button>

        {/* Trail Visibility Toggle Button */}
        <button
          type="button"
          id="btn-toggle-trail"
          onClick={onToggleTrail}
          aria-label={isTrailVisible ? 'Hide orbital trail' : 'Show orbital trail'}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-200 shadow-lg border ${
            isTrailVisible
              ? 'bg-slate-800/80 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          {isTrailVisible ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          <span>{isTrailVisible ? 'Trail Visible' : 'Trail Hidden'}</span>
        </button>

        {/* Trail Clear Button */}
        {trail.length > 0 && (
          <button
            type="button"
            id="btn-clear-trail"
            onClick={onClearTrail}
            aria-label="Clear recorded movement trail"
            className="flex items-center justify-center px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-900/80 text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 backdrop-blur-md transition-all"
          >
            Clear Trail ({trail.length})
          </button>
        )}
      </div>

      {/* Map Live Coordinates Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-900/60 text-xs font-mono text-cyan-300 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{formatLatitude(position?.latitude)}</span>
          <span className="text-slate-600">|</span>
          <span>{formatLongitude(position?.longitude)}</span>
        </div>
      </div>
    </div>
  );
}
