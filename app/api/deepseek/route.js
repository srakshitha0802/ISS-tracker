/**
 * Server-Side DeepSeek AI API Route
 * Proxies requests to DeepSeek securely, keeping API keys server-side.
 * Supports streaming responses for real-time token output.
 */

import { NextResponse } from 'next/server';

const DEEPSEEK_API_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const DEFAULT_MODEL = 'deepseek-chat';

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, telemetry, stream = false } = body;

    // Resolve API key: prefer env var (server-side), fall back to client-provided key
    const apiKey =
      process.env.DEEPSEEK_API_KEY ||
      process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY ||
      body.apiKey ||
      '';

    if (!apiKey || apiKey.trim().length === 0) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in your .env.local file.' },
        { status: 401 }
      );
    }

    // Build system prompt with live telemetry context
    const systemPrompt = buildSystemPrompt(telemetry);

    // Construct the full messages array with system context
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content }))
    ];

    const requestBody = {
      model: DEFAULT_MODEL,
      messages: fullMessages,
      temperature: 0.65,
      max_tokens: 1200,
      stream
    };

    const dsResponse = await fetch(DEEPSEEK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!dsResponse.ok) {
      const errText = await dsResponse.text();
      return NextResponse.json(
        { error: `DeepSeek API error (${dsResponse.status}): ${errText}` },
        { status: dsResponse.status }
      );
    }

    if (stream) {
      // Forward the SSE stream directly to the client
      const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no'
      });
      return new Response(dsResponse.body, { headers });
    }

    const data = await dsResponse.json();
    return NextResponse.json({
      content: data.choices?.[0]?.message?.content || '',
      model: data.model || DEFAULT_MODEL,
      usage: data.usage
    });
  } catch (err) {
    console.error('[DeepSeek Route] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function buildSystemPrompt(telemetry = {}) {
  const {
    latitude = 0,
    longitude = 0,
    altitude = 420,
    velocity = 27580,
    visibility = 'daylight',
    regionName = 'Earth Orbit',
    footprint = 4500,
    timestamp = null
  } = telemetry;

  const machNumber = (velocity / 1236).toFixed(1);
  const timeStr = timestamp
    ? new Date(timestamp * 1000).toUTCString()
    : new Date().toUTCString();

  return `You are ORBITAL, an advanced AI space intelligence assistant embedded in an ISS real-time tracking dashboard.

LIVE ISS TELEMETRY (as of ${timeStr}):
• Position: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E
• Overflying: ${regionName}
• Altitude: ${Math.round(altitude)} km above Earth's geoid
• Orbital Velocity: ${Math.round(velocity).toLocaleString()} km/h (Mach ${machNumber}, ~7.66 km/s)
• Illumination: ${String(visibility).toUpperCase()}
• Horizon Footprint: ~${Math.round(footprint).toLocaleString()} km diameter
• Crew: 7 astronauts & cosmonauts (Expedition 72)
• Orbital Period: ~92.7 min | 15.54 orbits/day
• Inclination: 51.64° | NORAD #25544

PERSONALITY & STYLE:
- You are precise, scientific, and engaging — like a real Flight Dynamics Officer combined with a brilliant science communicator.
- Format responses using **bold** for key terms, structured numbered lists for complex topics, and concise bullet points.
- Always ground your answers in the live telemetry data above. Reference specific coordinates, altitude, or velocity when relevant.
- Be helpful and conversational for simple questions; deep and technical for complex orbital/physics inquiries.
- Keep responses focused and readable — avoid excessive length. Aim for clarity.
- Never mention that you are an AI language model in your responses. You are ORBITAL, the ISS mission intelligence system.`;
}
