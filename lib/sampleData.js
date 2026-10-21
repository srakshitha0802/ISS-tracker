/**
 * Sample Data Fallback Module
 * 
 * IMPORTANT: This data is for DEMONSTRATION / OFFLINE PREVIEW ONLY.
 * It must NEVER be mistaken for live orbital telemetry and must NEVER be
 * appended to the real movement trail history.
 */

export const SAMPLE_ISS_DATA = {
  name: 'iss',
  id: 25544,
  latitude: 51.5074,
  longitude: -0.1278,
  altitude: 419.45,
  velocity: 27582.4,
  visibility: 'daylight',
  footprint: 4505.2,
  timestamp: 1776700000,
  units: 'kilometers',
  solar_lat: 12.34,
  solar_lon: -15.67,
  isDemo: true,
  sourceLabel: 'DEMO DATA — NOT LIVE',
  disclaimer: 'This is offline fallback demonstration data. It does not represent the real-time position of the International Space Station.'
};

/**
 * Returns a cloned sample payload clearly flagged as non-live demo data.
 * @returns {typeof SAMPLE_ISS_DATA}
 */
export function getSampleISSData() {
  return {
    ...SAMPLE_ISS_DATA,
    fetchedAt: Date.now()
  };
}
