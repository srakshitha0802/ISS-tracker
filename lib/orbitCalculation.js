/**
 * Advanced Orbital Calculations, Geodesics & Sighting Mechanics
 */

export const EARTH_RADIUS_KM = 6371;
export const ISS_INCLINATION_DEG = 51.64;
export const ISS_INCLINATION_RAD = (ISS_INCLINATION_DEG * Math.PI) / 180;
export const ORBITAL_PERIOD_MINUTES = 92.68;
export const ORBITAL_PERIOD_SECONDS = ORBITAL_PERIOD_MINUTES * 60; // ~5,561 seconds

/**
 * Calculates great-circle ground distance between two points using the Haversine formula.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Calculates initial compass bearing / forward azimuth heading from point 1 to point 2.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} azimuth angle in degrees [0, 360)
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const bearingDeg = (theta * 180) / Math.PI;
  return (bearingDeg + 360) % 360;
}

/**
 * Calculates 3D slant range (direct straight-line distance through space)
 * accounting for Earth's curvature and satellite altitude.
 * @param {number} groundDistKm 
 * @param {number} altitudeKm 
 * @returns {number} slant range in kilometers
 */
export function calculateSlantRange(groundDistKm, altitudeKm = 420) {
  const theta = groundDistKm / EARTH_RADIUS_KM;
  const R = EARTH_RADIUS_KM;
  const rIss = R + altitudeKm;
  const slantSq = R * R + rIss * rIss - 2 * R * rIss * Math.cos(theta);
  return Math.sqrt(Math.max(0, slantSq));
}

/**
 * Calculates observer elevation angle in degrees above horizon.
 * @param {number} groundDistKm 
 * @param {number} altitudeKm 
 * @returns {number} elevation angle in degrees
 */
export function calculateElevationAngle(groundDistKm, altitudeKm = 420) {
  const theta = groundDistKm / EARTH_RADIUS_KM;
  const R = EARTH_RADIUS_KM;
  const rIss = R + altitudeKm;
  const num = Math.cos(theta) - R / rIss;
  const den = Math.sin(theta);
  if (den === 0) return 90;
  const elevRad = Math.atan2(num, den);
  return (elevRad * 180) / Math.PI;
}

/**
 * Calculates visual horizon radius on Earth's surface for a given altitude.
 * @param {number} altitudeKm 
 * @returns {number} ground radius in kilometers (~2,250 km for 420 km altitude)
 */
export function calculateFootprintRadius(altitudeKm = 420) {
  const R = EARTH_RADIUS_KM;
  const centralAngle = Math.acos(R / (R + altitudeKm));
  return R * centralAngle;
}

/**
 * Predicts the future ground track points for the next 90 minutes.
 * Models orbital motion under 51.64° inclination with Earth rotation offset.
 *
 * @param {number} startLat 
 * @param {number} startLon 
 * @param {number} pointsCount 
 * @returns {Array<[number, number]>} Array of [lat, lon] coordinates
 */
export function predictFutureOrbit(startLat, startLon, pointsCount = 45) {
  const points = [];
  const startLatRad = (startLat * Math.PI) / 180;

  const sinArg = Math.max(-1, Math.min(1, Math.sin(startLatRad) / Math.sin(ISS_INCLINATION_RAD)));
  let currentU = Math.asin(sinArg);

  const stepMinutes = 90 / pointsCount;
  const earthRotPerMinute = 360 / 1436.07;

  for (let i = 0; i <= pointsCount; i++) {
    const elapsedMinutes = i * stepMinutes;
    const orbitalAngle = currentU + (2 * Math.PI * (elapsedMinutes / ORBITAL_PERIOD_MINUTES));

    const latRad = Math.asin(Math.sin(ISS_INCLINATION_RAD) * Math.sin(orbitalAngle));
    const latDeg = (latRad * 180) / Math.PI;

    const lonShiftOrbital = Math.atan2(
      Math.cos(ISS_INCLINATION_RAD) * Math.sin(orbitalAngle),
      Math.cos(orbitalAngle)
    ) * (180 / Math.PI);

    const earthRotationShift = elapsedMinutes * earthRotPerMinute;

    let lonDeg = startLon + lonShiftOrbital - (i === 0 ? lonShiftOrbital : 0) - earthRotationShift;

    while (lonDeg > 180) lonDeg -= 360;
    while (lonDeg < -180) lonDeg += 360;

    points.push([Number(latDeg.toFixed(4)), Number(lonDeg.toFixed(4))]);
  }

  return points;
}

/**
 * Computes live Mach number for a given orbital speed in km/h.
 * @param {number} speedKmH 
 * @returns {number} Mach number (approx Mach 22 - 25.5)
 */
export function computeMachNumber(speedKmH) {
  if (!speedKmH || Number.isNaN(Number(speedKmH))) return 25.4;
  const speedMS = (Number(speedKmH) * 1000) / 3600;
  const speedOfSoundMS = 340.29; // standard sea-level reference
  return Number((speedMS / speedOfSoundMS).toFixed(1));
}

/**
 * Computes approximate countdown to next sunrise / sunset based on solar illumination status.
 * @param {string} visibility 'daylight' | 'eclipsed'
 * @param {number} [timestamp] 
 * @returns {{ event: string, minutesRemaining: number }}
 */
export function estimateNextSolarEvent(visibility, timestamp = Date.now() / 1000) {
  const isDaylight = String(visibility || '').toLowerCase() === 'daylight';
  // Daylight phase is ~55 minutes, shadow phase is ~37 minutes
  const phaseCycle = (timestamp % ORBITAL_PERIOD_SECONDS) / 60;
  
  if (isDaylight) {
    const minLeft = Math.max(1, Math.round(55 - (phaseCycle % 55)));
    return { event: 'Orbital Sunset', minutesRemaining: minLeft };
  } else {
    const minLeft = Math.max(1, Math.round(37 - (phaseCycle % 37)));
    return { event: 'Orbital Sunrise', minutesRemaining: minLeft };
  }
}
