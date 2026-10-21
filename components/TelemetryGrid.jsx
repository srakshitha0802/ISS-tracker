'use client';

import React from 'react';
import {
  Compass,
  Navigation,
  Mountain,
  Gauge,
  Sun,
  Moon,
  Radio,
  Satellite
} from 'lucide-react';
import TelemetryCard from './TelemetryCard';
import {
  formatLatitude,
  formatLongitude,
  formatAltitude,
  formatVelocity,
  formatVelocityKmS,
  formatFootprint,
  formatVisibility
} from '@/lib/formatters';

export default function TelemetryGrid({ position, isStale = false }) {
  if (!position) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse flex flex-col justify-between p-4"
          >
            <div className="h-3 w-16 bg-slate-800 rounded"></div>
            <div className="h-6 w-24 bg-slate-800 rounded"></div>
            <div className="h-2 w-20 bg-slate-850 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const { latitude, longitude, altitude, velocity, visibility, footprint } = position;
  const visibilityInfo = formatVisibility(visibility);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Latitude Card */}
      <TelemetryCard
        title="Latitude"
        value={typeof latitude === 'number' ? formatLatitude(latitude) : '—'}
        icon={Navigation}
        badge={latitude >= 0 ? 'North' : 'South'}
        badgeVariant="cyan"
        subvalue={`Equator delta: ${Math.abs(latitude).toFixed(2)}°`}
        tooltip="Angular distance north or south of the Earth's equator"
      />

      {/* 2. Longitude Card */}
      <TelemetryCard
        title="Longitude"
        value={typeof longitude === 'number' ? formatLongitude(longitude) : '—'}
        icon={Compass}
        badge={longitude >= 0 ? 'East' : 'West'}
        badgeVariant="cyan"
        subvalue={`Prime Meridian delta: ${Math.abs(longitude).toFixed(2)}°`}
        tooltip="Angular distance east or west of the Prime Meridian"
      />

      {/* 3. Altitude Card */}
      <TelemetryCard
        title="Altitude"
        value={typeof altitude === 'number' ? Math.round(altitude).toLocaleString() : '—'}
        unit="km"
        icon={Mountain}
        badge="LEO"
        badgeVariant="indigo"
        subvalue={`Height above WGS84: ${formatAltitude(altitude)}`}
        tooltip="Distance of the space station above Earth's reference geoid"
      />

      {/* 4. Orbital Velocity Card */}
      <TelemetryCard
        title="Orbital Velocity"
        value={typeof velocity === 'number' ? Math.round(velocity).toLocaleString() : '—'}
        unit="km/h"
        icon={Gauge}
        badge="Mach 25+"
        badgeVariant="amber"
        subvalue={`Speed: ${formatVelocityKmS(velocity)}`}
        highlight={true}
        tooltip="Linear speed required to maintain Low Earth Orbit"
      />

      {/* 5. Visibility Card */}
      <TelemetryCard
        title="Illumination"
        value={visibilityInfo.label}
        icon={visibilityInfo.isDaylight ? Sun : Moon}
        badge={visibilityInfo.isDaylight ? 'Direct Sun' : "Earth's Umbra"}
        badgeVariant={visibilityInfo.isDaylight ? 'amber' : 'indigo'}
        subvalue={visibilityInfo.isDaylight ? 'Solar Arrays Generating' : 'Operating on Battery Power'}
        tooltip="Orbital illumination status: whether station is in direct sunlight or Earth's shadow"
      />

      {/* 6. Ground Footprint Card */}
      <TelemetryCard
        title="Footprint"
        value={typeof footprint === 'number' ? Math.round(footprint).toLocaleString() : '—'}
        unit="km ⌀"
        icon={Radio}
        badge="Coverage"
        badgeVariant="emerald"
        subvalue="Visible horizon circle"
        tooltip="Approximate line-of-sight communication footprint diameter on Earth"
      />
    </div>
  );
}
