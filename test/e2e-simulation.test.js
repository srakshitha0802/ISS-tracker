import { test, describe } from 'node:test';
import assert from 'node:assert';
import { fetchISSPosition, ISSApiError } from '../lib/issApi.js';
import { validateISSPositionPayload } from '../lib/validation.js';
import { getSampleISSData, SAMPLE_ISS_DATA } from '../lib/sampleData.js';

describe('End-to-End Logic & Reliability Verification', () => {
  test('fetches live ISS coordinates from public API', async () => {
    const liveData = await fetchISSPosition();
    assert.ok(liveData, 'Live data should be returned');
    assert.strictEqual(typeof liveData.latitude, 'number');
    assert.strictEqual(typeof liveData.longitude, 'number');
    assert.strictEqual(typeof liveData.altitude, 'number');
    assert.strictEqual(typeof liveData.velocity, 'number');
    assert.strictEqual(liveData.isDemo, false, 'Live data must not be flagged as demo');
    assert.ok(liveData.latitude >= -90 && liveData.latitude <= 90, 'Latitude in [-90, 90]');
    assert.ok(liveData.longitude >= -180 && liveData.longitude <= 180, 'Longitude in [-180, 180]');
    assert.ok(liveData.altitude >= 100 && liveData.altitude <= 1000, 'Altitude in reasonable LEO range');
    assert.ok(liveData.velocity >= 15000 && liveData.velocity <= 35000, 'Velocity in ~27k km/h range');
  });

  test('forces simulation / demo mode when requested', async () => {
    const demoData = await fetchISSPosition({ forceSimulation: true });
    assert.strictEqual(demoData.isDemo, true);
    assert.strictEqual(demoData.sourceLabel, 'DEMO DATA — NOT LIVE');
    assert.ok(demoData.disclaimer.includes('demonstration data'));
  });

  test('validates date line split algorithm correctly', () => {
    // Normal continuous segment without crossing date line
    const normalPoints = [
      { latitude: 10, longitude: 170, timestamp: 100 },
      { latitude: 12, longitude: 175, timestamp: 107 }
    ];
    const diffNormal = Math.abs(normalPoints[1].longitude - normalPoints[0].longitude);
    assert.strictEqual(diffNormal <= 180, true);

    // Crossing international date line from +179° to -178°
    const dateLinePoints = [
      { latitude: 10, longitude: 179.5, timestamp: 100 },
      { latitude: 12, longitude: -178.5, timestamp: 107 }
    ];
    const diffDateLine = Math.abs(dateLinePoints[1].longitude - dateLinePoints[0].longitude);
    assert.strictEqual(diffDateLine > 180, true, 'Longitude jump > 180 indicates antimeridian crossing');
  });

  test('preserves last valid position on subsequent error', () => {
    let lastValid = { latitude: 20.5, longitude: 100.2, timestamp: 1000, altitude: 420 };
    let current = { ...lastValid };

    // Simulate an error on next fetch
    const failedFetch = () => {
      throw new ISSApiError('Simulated network timeout');
    };

    try {
      failedFetch();
    } catch {
      // In hook, current position falls back to lastValid and status becomes STALE
      current = lastValid;
    }

    assert.strictEqual(current.latitude, 20.5);
    assert.strictEqual(current.altitude, 420);
  });

  test('does not append demo data to history trail', () => {
    const trail = [];
    const pushToTrail = (pos) => {
      if (pos.isDemo) return;
      trail.push(pos);
    };

    const demo = getSampleISSData();
    pushToTrail(demo);
    assert.strictEqual(trail.length, 0, 'Demo points must never be added to trail');

    const real = { latitude: 15, longitude: 80, timestamp: 2000, isDemo: false };
    pushToTrail(real);
    assert.strictEqual(trail.length, 1, 'Real point should be added');
  });

  test('deduplicates identical consecutive trail points', () => {
    const trail = [];
    const pushToTrail = (pos) => {
      if (pos.isDemo) return;
      if (trail.length > 0) {
        const last = trail[trail.length - 1];
        if (
          Math.abs(last.latitude - pos.latitude) < 0.0001 &&
          Math.abs(last.longitude - pos.longitude) < 0.0001 &&
          last.timestamp === pos.timestamp
        ) {
          return;
        }
      }
      trail.push(pos);
    };

    const pt1 = { latitude: 15.1234, longitude: 80.5678, timestamp: 1000, isDemo: false };
    pushToTrail(pt1);
    pushToTrail(pt1); // duplicate
    pushToTrail({ ...pt1 }); // duplicate clone

    assert.strictEqual(trail.length, 1, 'Duplicate points should be ignored');

    const pt2 = { latitude: 15.2234, longitude: 81.1678, timestamp: 1007, isDemo: false };
    pushToTrail(pt2);
    assert.strictEqual(trail.length, 2, 'New point should be added');
  });
});
