import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  isValidLatitude,
  isValidLongitude,
  isValidAltitude,
  isValidVelocity,
  isValidTimestamp,
  validateISSPositionPayload
} from '../lib/validation.js';

describe('Geographic Coordinate Validation', () => {
  test('validates latitude boundaries correctly', () => {
    assert.strictEqual(isValidLatitude(0), true);
    assert.strictEqual(isValidLatitude(45.1234), true);
    assert.strictEqual(isValidLatitude(-45.1234), true);
    assert.strictEqual(isValidLatitude(90), true);
    assert.strictEqual(isValidLatitude(-90), true);

    // Invalid latitudes
    assert.strictEqual(isValidLatitude(90.0001), false);
    assert.strictEqual(isValidLatitude(-90.0001), false);
    assert.strictEqual(isValidLatitude(NaN), false);
    assert.strictEqual(isValidLatitude(Infinity), false);
    assert.strictEqual(isValidLatitude('45'), false);
    assert.strictEqual(isValidLatitude(null), false);
  });

  test('validates longitude boundaries correctly', () => {
    assert.strictEqual(isValidLongitude(0), true);
    assert.strictEqual(isValidLongitude(179.99), true);
    assert.strictEqual(isValidLongitude(-179.99), true);
    assert.strictEqual(isValidLongitude(180), true);
    assert.strictEqual(isValidLongitude(-180), true);

    // Invalid longitudes
    assert.strictEqual(isValidLongitude(180.001), false);
    assert.strictEqual(isValidLongitude(-180.001), false);
    assert.strictEqual(isValidLongitude(NaN), false);
    assert.strictEqual(isValidLongitude(undefined), false);
  });

  test('validates altitude within reasonable LEO bounds', () => {
    assert.strictEqual(isValidAltitude(420.5), true);
    assert.strictEqual(isValidAltitude(370), true);
    assert.strictEqual(isValidAltitude(500), true);

    // Invalid altitudes
    assert.strictEqual(isValidAltitude(50), false); // too low (re-entry/airplane)
    assert.strictEqual(isValidAltitude(2000), false); // too high for ISS LEO
    assert.strictEqual(isValidAltitude(-10), false);
  });

  test('validates orbital velocity within realistic LEO speed', () => {
    assert.strictEqual(isValidVelocity(27600), true);
    assert.strictEqual(isValidVelocity(25000), true);

    // Invalid velocity
    assert.strictEqual(isValidVelocity(500), false); // too slow
    assert.strictEqual(isValidVelocity(80000), false); // escape velocity
  });
});

describe('Payload Validation', () => {
  test('accepts valid full Where The ISS At? payload', () => {
    const raw = {
      name: 'iss',
      id: 25544,
      latitude: 10.409771,
      longitude: 104.044095,
      altitude: 422.235,
      velocity: 27571.28,
      visibility: 'daylight',
      footprint: 4518.8,
      timestamp: 1792558669,
      units: 'kilometers'
    };

    const result = validateISSPositionPayload(raw);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.data.latitude, 10.409771);
    assert.strictEqual(result.data.id, 25544);
  });

  test('rejects malformed payloads with missing or out-of-range fields', () => {
    const badPayload = {
      name: 'iss',
      latitude: 150, // invalid
      longitude: 'unknown', // invalid type
      altitude: -50 // invalid
    };

    const result = validateISSPositionPayload(badPayload);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.length >= 3);
    assert.strictEqual(result.data, null);
  });
});
