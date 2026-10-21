import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  calculateHaversineDistance,
  calculateBearing,
  calculateSlantRange,
  calculateElevationAngle,
  calculateFootprintRadius,
  predictFutureOrbit,
  computeMachNumber,
  estimateNextSolarEvent
} from '../lib/orbitCalculation.js';
import { getGeographicRegion } from '../lib/geocoding.js';

describe('Advanced Orbital Math & Sighting Calculations', () => {
  test('calculates Haversine ground distance accurately', () => {
    const dist = calculateHaversineDistance(51.5074, -0.1278, 48.8566, 2.3522);
    assert.ok(dist >= 340 && dist <= 350, `Distance was ${dist}`);
    assert.strictEqual(calculateHaversineDistance(0, 0, 0, 0), 0);
  });

  test('calculates compass bearing heading accurately', () => {
    // Due North from (0, 0) to (10, 0) is 0°
    const dueNorth = calculateBearing(0, 0, 10, 0);
    assert.strictEqual(Math.round(dueNorth), 0);

    // Due East from (0, 0) to (0, 10) is 90°
    const dueEast = calculateBearing(0, 0, 0, 10);
    assert.strictEqual(Math.round(dueEast), 90);
  });

  test('calculates 3D slant range to ISS in space', () => {
    const overheadSlant = calculateSlantRange(0, 420);
    assert.strictEqual(Math.round(overheadSlant), 420);

    const slantAt1000 = calculateSlantRange(1000, 420);
    assert.ok(slantAt1000 > 1000, `Slant range was ${slantAt1000}`);
  });

  test('calculates elevation angle accurately', () => {
    const elevOverhead = calculateElevationAngle(0, 420);
    assert.strictEqual(Math.round(elevOverhead), 90);

    const elevFar = calculateElevationAngle(3000, 420);
    assert.ok(elevFar < 0, `Elevation was ${elevFar}`);
  });

  test('calculates footprint horizon radius', () => {
    const radius = calculateFootprintRadius(420);
    // Radius for 420km altitude is approximately 2,200 - 2,300 km
    assert.ok(radius >= 2200 && radius <= 2350, `Radius was ${radius}`);
  });

  test('computes realistic Mach numbers', () => {
    const mach = computeMachNumber(27580);
    assert.ok(mach >= 22 && mach <= 26, `Mach was ${mach}`);
  });

  test('estimates next solar event countdown', () => {
    const daylightEvent = estimateNextSolarEvent('daylight', 1000);
    assert.strictEqual(daylightEvent.event, 'Orbital Sunset');
    assert.ok(daylightEvent.minutesRemaining > 0);

    const eclipseEvent = estimateNextSolarEvent('eclipsed', 1000);
    assert.strictEqual(eclipseEvent.event, 'Orbital Sunrise');
    assert.ok(eclipseEvent.minutesRemaining > 0);
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
    const pacific = getGeographicRegion(-20, -140);
    assert.strictEqual(pacific.name, 'South Pacific Ocean');

    const atlantic = getGeographicRegion(30, -40);
    assert.strictEqual(atlantic.name, 'North Atlantic Ocean');

    const aus = getGeographicRegion(-25, 135);
    assert.strictEqual(aus.name, 'Australia & Coral Sea');

    const us = getGeographicRegion(38, -95);
    assert.strictEqual(us.name, 'United States & Canada');

    const sahara = getGeographicRegion(25, 10);
    assert.strictEqual(sahara.name, 'Sahara Desert, North Africa');
  });
});
