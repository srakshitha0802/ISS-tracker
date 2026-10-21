/**
 * Formatting utilities for ISS telemetry and geographic data
 */

/**
 * Formats latitude with cardinal direction (N/S) and 4 decimal places.
 * @param {number} lat 
 * @returns {string} e.g. "10.4098° N"
 */
export function formatLatitude(lat) {
  if (lat === null || lat === undefined || Number.isNaN(Number(lat))) return '—';
  const val = Number(lat);
  const dir = val >= 0 ? 'N' : 'S';
  return `${Math.abs(val).toFixed(4)}° ${dir}`;
}

/**
 * Formats longitude with cardinal direction (E/W) and 4 decimal places.
 * @param {number} lon 
 * @returns {string} e.g. "104.0441° E"
 */
export function formatLongitude(lon) {
  if (lon === null || lon === undefined || Number.isNaN(Number(lon))) return '—';
  const val = Number(lon);
  const dir = val >= 0 ? 'E' : 'W';
  return `${Math.abs(val).toFixed(4)}° ${dir}`;
}

/**
 * Formats coordinates into standard compact string.
 * @param {number} lat 
 * @param {number} lon 
 * @returns {string} e.g. "10.4098° N, 104.0441° E"
 */
export function formatCoordinates(lat, lon) {
  return `${formatLatitude(lat)}, ${formatLongitude(lon)}`;
}

/**
 * Formats altitude in kilometers.
 * @param {number} alt 
 * @returns {string} e.g. "422.24 km"
 */
export function formatAltitude(alt) {
  if (alt === null || alt === undefined || Number.isNaN(Number(alt))) return '—';
  const val = Number(alt);
  return `${val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} km`;
}

/**
 * Formats orbital velocity in km/h.
 * @param {number} vel 
 * @returns {string} e.g. "27,571 km/h"
 */
export function formatVelocity(vel) {
  if (vel === null || vel === undefined || Number.isNaN(Number(vel))) return '—';
  const val = Number(vel);
  return `${Math.round(val).toLocaleString('en-US')} km/h`;
}

/**
 * Computes and formats orbital velocity in km/s.
 * @param {number} velKmH 
 * @returns {string} e.g. "7.66 km/s"
 */
export function formatVelocityKmS(velKmH) {
  if (velKmH === null || velKmH === undefined || Number.isNaN(Number(velKmH))) return '—';
  const kmS = Number(velKmH) / 3600;
  return `${kmS.toFixed(2)} km/s`;
}

/**
 * Formats ground footprint diameter in kilometers.
 * @param {number} fp 
 * @returns {string} e.g. "4,519 km"
 */
export function formatFootprint(fp) {
  if (fp === null || fp === undefined || Number.isNaN(Number(fp))) return '—';
  return `${Math.round(Number(fp)).toLocaleString('en-US')} km`;
}

/**
 * Formats visibility status with descriptive metadata.
 * @param {string} visibility 
 * @returns {{ label: string, isDaylight: boolean, description: string }}
 */
export function formatVisibility(visibility) {
  const norm = String(visibility || '').toLowerCase().trim();
  if (norm === 'daylight') {
    return {
      label: 'Daylight',
      isDaylight: true,
      description: 'The space station is currently illuminated by direct sunlight.'
    };
  }
  if (norm === 'eclipsed') {
    return {
      label: 'Eclipsed',
      isDaylight: false,
      description: 'The space station is currently passing through the Earth’s shadow.'
    };
  }
  return {
    label: norm ? norm.charAt(0).toUpperCase() + norm.slice(1) : 'Unknown',
    isDaylight: false,
    description: 'Orbital illumination classification is unavailable.'
  };
}

/**
 * Formats Unix epoch timestamp into local date/time string.
 * @param {number} timestampSec Unix seconds
 * @returns {string} e.g. "Oct 21, 2026, 10:28:15 AM"
 */
export function formatTimestamp(timestampSec) {
  if (!timestampSec || Number.isNaN(Number(timestampSec))) return '—';
  try {
    const date = new Date(Number(timestampSec) * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return '—';
  }
}

/**
 * Formats time elapsed since a given timestamp in seconds or milliseconds.
 * @param {number} timestampMs 
 * @returns {string} e.g. "Just now", "4s ago", "1m ago"
 */
export function formatRelativeTime(timestampMs) {
  if (!timestampMs) return 'Never';
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - timestampMs) / 1000));
  
  if (diffSec < 3) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}
