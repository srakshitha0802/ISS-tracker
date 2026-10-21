import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  formatLatitude,
  formatLongitude,
  formatCoordinates,
  formatAltitude,
  formatVelocity,
  formatVelocityKmS,
  formatFootprint,
  formatVisibility,
  formatRelativeTime
} from '../lib/formatters.js';

describe('Telemetry Formatters', () => {
  test('formats latitude with cardinal direction', () => {
    assert.strictEqual(formatLatitude(10.40977), '10.4098° N');
    assert.strictEqual(formatLatitude(-25.61234), '25.6123° S');
    assert.strictEqual(formatLatitude(0), '0.0000° N');
    assert.strictEqual(formatLatitude(null), '—');
    assert.strictEqual(formatLatitude(NaN), '—');
  });

  test('formats longitude with cardinal direction', () => {
    assert.strictEqual(formatLongitude(104.0441), '104.0441° E');
    assert.strictEqual(formatLongitude(-52.4493), '52.4493° W');
    assert.strictEqual(formatLongitude(0), '0.0000° E');
    assert.strictEqual(formatLongitude(undefined), '—');
  });

  test('formats coordinates combination', () => {
    assert.strictEqual(formatCoordinates(12.3456, -78.9012), '12.3456° N, 78.9012° W');
  });

  test('formats altitude with km unit', () => {
    assert.strictEqual(formatAltitude(422.235), '422.24 km');
    assert.strictEqual(formatAltitude(null), '—');
  });

  test('formats velocity in km/h and km/s', () => {
    assert.strictEqual(formatVelocity(27571.28), '27,571 km/h');
    assert.strictEqual(formatVelocityKmS(27571.28), '7.66 km/s');
    assert.strictEqual(formatVelocity(null), '—');
  });

  test('formats footprint diameter', () => {
    assert.strictEqual(formatFootprint(4518.8), '4,519 km');
  });

  test('formats visibility status accurately', () => {
    const daylight = formatVisibility('daylight');
    assert.strictEqual(daylight.label, 'Daylight');
    assert.strictEqual(daylight.isDaylight, true);

    const eclipsed = formatVisibility('eclipsed');
    assert.strictEqual(eclipsed.label, 'Eclipsed');
    assert.strictEqual(eclipsed.isDaylight, false);

    const unknown = formatVisibility('');
    assert.strictEqual(unknown.label, 'Unknown');
  });

  test('formats relative time calculations', () => {
    const now = Date.now();
    assert.strictEqual(formatRelativeTime(now - 1000), 'Just now');
    assert.strictEqual(formatRelativeTime(now - 7000), '7s ago');
    assert.strictEqual(formatRelativeTime(now - 120000), '2m ago');
    assert.strictEqual(formatRelativeTime(null), 'Never');
  });
});
