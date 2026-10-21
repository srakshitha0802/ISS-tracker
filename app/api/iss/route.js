import { NextResponse } from 'next/server';
import { validateISSPositionPayload } from '@/lib/validation';

const PRIMARY_API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(PRIMARY_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ISSTracker-EdzulChallenge/1.0'
      },
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      return NextResponse.json(
        { error: 'Upstream rate limit exceeded (429). Please wait a moment before retrying.' },
        { status: 429, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream API error: HTTP ${response.status} ${response.statusText}` },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const rawData = await response.json();
    const validation = validateISSPositionPayload(rawData);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Malformed telemetry from upstream API', validationErrors: validation.errors },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(
      {
        ...validation.data,
        isDemo: false,
        proxied: true,
        fetchedAt: Date.now()
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    return NextResponse.json(
      {
        error: isTimeout
          ? 'Upstream API request timed out after 6 seconds.'
          : (err.message || 'Failed to fetch ISS telemetry from upstream API.')
      },
      { status: isTimeout ? 504 : 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
