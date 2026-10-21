/**
 * Orbital Calculations & Sighting Mechanics
 */

const EARTH_RADIUS_KM = 6371;
const ISS_INCLINATION_RAD = (51.64 * Math.PI) / 180; // 51.64 degrees
const ORBITAL_PERIOD_MINUTES = 92.68; // ~92.7 minutes per orbit

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
  // Law of Cosines in geocentric polar coordinates
  const slantSq = R * R + rIss * rIss - 2 * R * rIss * Math.cos(theta);
  return Math.sqrt(Math.max(0, slantSq));
}

/**
 * Calculates observer elevation angle in degrees above horizontal.
 * > 0 degrees means the ISS is above the observer's visual horizon.
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

  // Determine current orbital phase argument (0 to 2*pi)
  const sinArg = Math.max(-1, Math.min(1, Math.sin(startLatRad) / Math.sin(ISS_INCLINATION_RAD)));
  let currentU = Math.asin(sinArg);

  // Time step per point: 90 minutes / pointsCount
  const stepMinutes = 90 / pointsCount;
  const earthRotPerMinute = 360 / 1436.07; // Earth rotation ~0.2507 degrees per minute

  for (let i = 0; i <= pointsCount; i++) {
    const elapsedMinutes = i * stepMinutes;
    const orbitalAngle = currentU + (2 * Math.PI * (elapsedMinutes / ORBITAL_PERIOD_MINUTES));

    // Latitude from inclination and orbital argument
    const latRad = Math.asin(Math.sin(ISS_INCLINATION_RAD) * Math.sin(orbitalAngle));
    const latDeg = (latRad * 180) / Math.PI;

    // Longitude shift factoring in orbital progression and Earth's eastward spin
    const lonShiftOrbital = Math.atan2(
      Math.cos(ISS_INCLINATION_RAD) * Math.sin(orbitalAngle),
      Math.cos(orbitalAngle)
    ) * (180 / Math.PI);

    const earthRotationShift = elapsedMinutes * earthRotPerMinute;

    let lonDeg = startLon + lonShiftOrbital - (i === 0 ? lonShiftOrbital : 0) - earthRotationShift;

    // Normalize longitude to [-180, 180]
    while (lonDeg > 180) lonDeg -= 360;
    while (lonDeg < -180) lonDeg += 360;

    points.push([Number(latDeg.toFixed(4)), Number(lonDeg.toFixed(4))]);
  }

  return points;
}
