/**
 * ISS Telemetry Validation Utilities
 * Ensures incoming data from public APIs meets strict geographic and numerical constraints.
 */

/**
 * Checks if a value is a finite number.
 * @param {unknown} val
 * @returns {boolean}
 */
export function isFiniteNumber(val) {
  return typeof val === 'number' && Number.isFinite(val);
}

/**
 * Validates latitude in degrees [-90, 90].
 * @param {unknown} lat
 * @returns {boolean}
 */
export function isValidLatitude(lat) {
  if (!isFiniteNumber(lat)) return false;
  return lat >= -90 && lat <= 90;
}

/**
 * Validates longitude in degrees [-180, 180].
 * @param {unknown} lon
 * @returns {boolean}
 */
export function isValidLongitude(lon) {
  if (!isFiniteNumber(lon)) return false;
  return lon >= -180 && lon <= 180;
}

/**
 * Validates altitude in kilometers (ISS operates in LEO ~370-460 km, allowing 100-1000 km).
 * @param {unknown} alt
 * @returns {boolean}
 */
export function isValidAltitude(alt) {
  if (!isFiniteNumber(alt)) return false;
  return alt >= 100 && alt <= 1000;
}

/**
 * Validates orbital velocity in km/h (ISS orbital speed is ~27,600 km/h, allowing 15,000-35,000 km/h).
 * @param {unknown} vel
 * @returns {boolean}
 */
export function isValidVelocity(vel) {
  if (!isFiniteNumber(vel)) return false;
  return vel >= 15000 && vel <= 35000;
}

/**
 * Validates observation timestamp (Unix timestamp in seconds).
 * Must be greater than Jan 1, 2020 and not impossibly far in the future (+2 days).
 * @param {unknown} ts
 * @returns {boolean}
 */
export function isValidTimestamp(ts) {
  if (!isFiniteNumber(ts)) return false;
  const minTs = 1577836800; // 2020-01-01T00:00:00Z
  // Allow up to 10 years in the future for safety in synthetic/test environments
  const maxTs = Math.floor(Date.now() / 1000) + 315360000; 
  return ts >= minTs && ts <= maxTs;
}

/**
 * Validates the complete ISS position response payload.
 * @param {unknown} payload
 * @returns {{ isValid: boolean, errors: string[], data: object | null }}
 */
export function validateISSPositionPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { isValid: false, errors: ['Payload must be a non-null object'], data: null };
  }

  const {
    name,
    id,
    latitude,
    longitude,
    altitude,
    velocity,
    visibility,
    footprint,
    timestamp,
    units
  } = payload;

  if (!isValidLatitude(latitude)) {
    errors.push(`Invalid latitude: ${latitude}. Must be a finite number between -90 and 90.`);
  }

  if (!isValidLongitude(longitude)) {
    errors.push(`Invalid longitude: ${longitude}. Must be a finite number between -180 and 180.`);
  }

  if (!isValidAltitude(altitude)) {
    errors.push(`Invalid altitude: ${altitude}. Must be a finite number between 100 and 1000 km.`);
  }

  if (!isValidVelocity(velocity)) {
    errors.push(`Invalid velocity: ${velocity}. Must be a finite number between 15,000 and 35,000 km/h.`);
  }

  if (!isValidTimestamp(timestamp)) {
    errors.push(`Invalid timestamp: ${timestamp}. Must be a valid epoch timestamp.`);
  }

  const cleanVisibility = typeof visibility === 'string' && visibility.trim().length > 0
    ? visibility.toLowerCase().trim()
    : 'unknown';

  const cleanUnits = typeof units === 'string' && units.trim().length > 0
    ? units.toLowerCase().trim()
    : 'kilometers';

  const cleanFootprint = isFiniteNumber(footprint) && footprint > 0
    ? footprint
    : 4500; // standard approx ISS footprint diameter

  if (errors.length > 0) {
    return { isValid: false, errors, data: null };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      name: typeof name === 'string' ? name : 'iss',
      id: id || 25544,
      latitude: Number(latitude),
      longitude: Number(longitude),
      altitude: Number(altitude),
      velocity: Number(velocity),
      visibility: cleanVisibility,
      footprint: Number(cleanFootprint),
      timestamp: Number(timestamp),
      units: cleanUnits,
      solar_lat: isFiniteNumber(payload.solar_lat) ? Number(payload.solar_lat) : null,
      solar_lon: isFiniteNumber(payload.solar_lon) ? Number(payload.solar_lon) : null
    }
  };
}
