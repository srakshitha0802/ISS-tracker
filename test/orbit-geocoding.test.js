import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  calculateHaversineDistance,
  calculateSlantRange,
  calculateElevationAngle,
  predictFutureOrbit
} from '../lib/orbitCalculation.js';
import { getGeographicRegion } from '../lib/geocoding.js';

describe('Advanced Orbital Math & Sighting Calculations', () => {
  test('calculates Haversine ground distance accurately', () => {
    // Distance between London (51.5074, -0.1278) and Paris (48.8566, 2.3522) ~343 km
    const dist = calculateHaversineDistance(51.5074, -0.1278, 48.8566, 2.3522);
    assert.ok(dist >= 340 && dist <= 350, `Distance was ${dist}`);

    // Distance from a point to itself is 0
    assert.strictEqual(calculateHaversineDistance(0, 0, 0, 0), 0);
  });

  test('calculates 3D slant range to ISS in space', () => {
    // When ground distance is 0 (ISS directly overhead), slant range equals altitude (~420 km)
    const overheadSlant = calculateSlantRange(0, 420);
    assert.strictEqual(Math.round(overheadSlant), 420);

    // At 1,000 km ground distance, slant range is greater due to hypotenuse
    const slantAt1000 = calculateSlantRange(1000, 420);
    assert.ok(slantAt1000 > 1000, `Slant range was ${slantAt1000}`);
  });

  test('calculates elevation angle accurately', () => {
    // Directly overhead = 90 degrees
    const elevOverhead = calculateElevationAngle(0, 420);
    assert.strictEqual(Math.round(elevOverhead), 90);

    // Far away (> 2,500 km) = below visual horizon (< 0 degrees)
    const elevFar = calculateElevationAngle(3000, 420);
    assert.ok(elevFar < 0, `Elevation was ${elevFar}`);
  });

  test('generates continuous future orbit track array', () => {
    const points = predictFutureOrbit(0, 0, 30);
    assert.strictEqual(points.length, 31);
    for (const [lat, lon] of points) {
      assert.ok(lat >= -52 && lat <= 52, `Latitude ${lat} within ISS 51.64° inclination`);
      assert.ok(lon >= -180 && lon <= 180, `Longitude ${lon} within [-180, 180]`);
    }
  });
});

describe('Geographic Region & Ocean Classifier', () => {
  test('identifies major oceans and territories', () => {
    // Pacific Ocean
    const pacific = getGeographicRegion(-20, -140);
    assert.strictEqual(pacific.name, 'South Pacific Ocean');

    // North Atlantic
    const atlantic = getGeographicRegion(30, -40);
    assert.strictEqual(atlantic.name, 'North Atlantic Ocean');

    // Australia
    const aus = getGeographicRegion(-25, 135);
    assert.strictEqual(aus.name, 'Australia & Coral Sea');

    // United States
    const us = getGeographicRegion(38, -95);
    assert.strictEqual(us.name, 'United States & Canada');

    // Sahara Desert
    const sahara = getGeographicRegion(25, 10);
    assert.strictEqual(sahara.name, 'Sahara Desert, North Africa');
  });
});
