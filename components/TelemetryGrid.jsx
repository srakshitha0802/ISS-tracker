'use client';

import React from 'react';
import {
  Compass,
  Navigation,
  Mountain,
  Gauge,
  Sun,
  Moon,
  Radio
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-3xl bg-slate-950/60 border border-white/10 animate-pulse flex flex-col justify-between p-5 backdrop-blur-xl"
          >
            <div className="h-3 w-16 bg-slate-800 rounded-full"></div>
            <div className="h-7 w-24 bg-slate-800 rounded-full"></div>
            <div className="h-2 w-20 bg-slate-800 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const { latitude, longitude, altitude, velocity, visibility, footprint } = position;
  const visibilityInfo = formatVisibility(visibility);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {/* 1. Latitude Card */}
      <TelemetryCard
        title="Latitude"
        value={typeof latitude === 'number' ? formatLatitude(latitude) : '—'}
        icon={Navigation}
        badge={latitude >= 0 ? 'North' : 'South'}
        badgeVariant="cyan"
        subvalue={`Equator Offset: ${Math.abs(latitude).toFixed(2)}°`}
        tooltip="Angular distance north or south of the Earth's equator"
      />

      {/* 2. Longitude Card */}
      <TelemetryCard
        title="Longitude"
        value={typeof longitude === 'number' ? formatLongitude(longitude) : '—'}
        icon={Compass}
        badge={longitude >= 0 ? 'East' : 'West'}
        badgeVariant="cyan"
        subvalue={`Meridian Offset: ${Math.abs(longitude).toFixed(2)}°`}
        tooltip="Angular distance east or west of the Prime Meridian"
      />

      {/* 3. Altitude Card */}
      <TelemetryCard
        title="Altitude"
        value={typeof altitude === 'number' ? Math.round(altitude).toLocaleString() : '—'}
        unit="km"
        icon={Mountain}
        badge="LEO ~420km"
        badgeVariant="indigo"
        subvalue={`Height: ${formatAltitude(altitude)}`}
        tooltip="Orbital altitude above Earth's reference geoid"
      />

      {/* 4. Orbital Velocity Card */}
      <TelemetryCard
        title="Orbital Speed"
        value={typeof velocity === 'number' ? Math.round(velocity).toLocaleString() : '—'}
        unit="km/h"
        icon={Gauge}
        badge="Mach 25.4"
        badgeVariant="amber"
        subvalue={`Rate: ${formatVelocityKmS(velocity)}`}
        highlight={true}
        tooltip="Cruising velocity to maintain orbit without falling"
      />

      {/* 5. Illumination Card */}
      <TelemetryCard
        title="Solar Status"
        value={visibilityInfo.label}
        icon={visibilityInfo.isDaylight ? Sun : Moon}
        badge={visibilityInfo.isDaylight ? 'Sunlit' : 'Shadow'}
        badgeVariant={visibilityInfo.isDaylight ? 'amber' : 'indigo'}
        subvalue={visibilityInfo.isDaylight ? 'Solar Arrays 100%' : 'Nickel-Hydrogen Battery'}
        tooltip="Orbital lighting classification (Daylight vs. Earth's shadow)"
      />

      {/* 6. Horizon Footprint Card */}
      <TelemetryCard
        title="Footprint"
        value={typeof footprint === 'number' ? Math.round(footprint).toLocaleString() : '—'}
        unit="km ⌀"
        icon={Radio}
        badge="Line-of-Sight"
        badgeVariant="emerald"
        subvalue="Visible horizon diameter"
        tooltip="Diameter of Earth visible to the space station"
      />
    </div>
  );
}
