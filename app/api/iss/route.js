import { NextResponse } from 'next/server';
import { validateISSPositionPayload } from '@/lib/validation';
import { getSampleISSData } from '@/lib/sampleData';

export const dynamic = 'force-static';
export const revalidate = false;

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
      }
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
  } catch {
    clearTimeout(timeoutId);
    return NextResponse.json(
      {
        ...getSampleISSData(),
        isDemo: true,
        source: 'build-fallback',
        fetchedAt: Date.now()
      },
      { status: 200 }
    );
  }
}
