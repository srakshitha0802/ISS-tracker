/**
 * DeepSeek AI Client — Production-Ready with Chat History & Streaming
 * Routes through secure server-side API proxy at /api/deepseek
 */

const DEFAULT_MODEL = 'deepseek-chat';

/**
 * Send a chat conversation to DeepSeek via server-side proxy.
 * Supports streaming mode for real-time token output.
 *
 * @param {Array<{role: string, content: string}>} messages - Full conversation history
 * @param {object} telemetry - Live ISS telemetry data
 * @param {object} options - Optional overrides
 * @param {string} [options.apiKey] - Client-provided API key (used if server key not set)
 * @param {boolean} [options.stream=false] - Enable streaming response
 * @param {function} [options.onChunk] - Called with each streamed text chunk
 * @returns {Promise<{content: string, model: string, source: string}>}
 */
export async function queryDeepSeekAI(messages = [], telemetry = {}, options = {}) {
  const { apiKey = '', stream = false, onChunk = null } = options;

  try {
    const response = await fetch('/api/deepseek', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, telemetry, apiKey, stream })
    });

    // Handle streaming
    if (stream && response.ok && onChunk) {
      return handleStreamingResponse(response, onChunk);
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.content || '',
      model: data.model || DEFAULT_MODEL,
      source: 'live-deepseek-api',
      usage: data.usage
    };
  } catch (err) {
    console.warn('[DeepSeek Client] Request failed:', err.message);
    // Fall back to intelligent local simulation
    const lastMessage = messages[messages.length - 1]?.content || '';
    return generateDynamicFallback(telemetry, lastMessage);
  }
}

/**
 * Handles server-sent event (SSE) streaming from DeepSeek API
 */
async function handleStreamingResponse(response, onChunk) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.trim());

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const deltaContent = parsed.choices?.[0]?.delta?.content || '';
          if (deltaContent) {
            fullContent += deltaContent;
            onChunk(deltaContent);
          }
        } catch {
          // skip malformed SSE line
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return {
    content: fullContent,
    model: DEFAULT_MODEL,
    source: 'live-deepseek-stream'
  };
}

/**
 * Intelligent local fallback when API is unavailable.
 * Uses live telemetry to generate contextually accurate responses.
 */
function generateDynamicFallback(telemetry = {}, query = '') {
  const lat = telemetry.latitude || 0;
  const lon = telemetry.longitude || 0;
  const alt = Math.round(telemetry.altitude || 420);
  const vel = Math.round(telemetry.velocity || 27580);
  const region = telemetry.regionName || 'Oceanic Territory';
  const isDay = String(telemetry.visibility || 'daylight').toLowerCase() === 'daylight';
  const mach = (vel / 1236).toFixed(1);
  const lq = query.toLowerCase();

  let content = '';

  if (lq.includes('orbit') && (lq.includes('why') || lq.includes('fall') || lq.includes('gravity'))) {
    content = `**Why Doesn't the ISS Fall?**

At ${alt} km altitude, gravity still pulls with ~8.7 m/s² — about 89% of surface gravity. The ISS *is* constantly falling, but it's falling *around* Earth.

**The Key Physics:**
1. **Orbital Velocity Balance** — At ${vel.toLocaleString()} km/h (Mach ${mach}), the ISS moves so fast horizontally that for every meter it falls, Earth's surface curves away by the same amount.
2. **Centripetal Equilibrium** — Gravitational force = mv²/r, perfectly balanced at this orbital radius (6,791 km from Earth's center).
3. **Atmospheric Drag** — At ${alt} km in the thermosphere, trace molecules cause ~50–100m of daily altitude loss, corrected by periodic reboost burns.

This is *continuous free-fall* — which is why everything onboard is weightless. The crew doesn't feel gravity because they're falling at the same rate as the station.`;
  } else if (lq.includes('crew') || lq.includes('astronaut') || lq.includes('expedition')) {
    content = `**Expedition 72 Crew Status**

Currently ${alt} km above Earth overflying **${region}**.

**Active Crew (7 Members):**
1. **Cmdr. Sunita Williams** (NASA) — Mission commander, 7 EVA veteran
2. **Barry Wilmore** (NASA) — Flight Engineer
3. **Nick Hague** (NASA) — Flight Engineer  
4. **Don Pettit** (NASA) — Science Officer
5. **Aleksandr Gorbunov** (Roscosmos)
6. **Aleksey Ovchinin** (Roscosmos)
7. **Ivan Vagner** (Roscosmos)

**Current Activities:**
- **Plant Habitat-03**: Epigenetic crop adaptation studies for Mars transit
- **Fluid Physics**: Capillary flow management for ECLSS
- **NeuroMapping**: Tracking cephalad fluid shifts during long-duration spaceflight
- **EVA Preparation**: Spacesuit maintenance and Airlock systems checks`;
  } else if (lq.includes('radio') || lq.includes('ham') || lq.includes('frequency') || lq.includes('doppler')) {
    content = `**ARISS Radio Communications**

ISS currently at Mach ${mach} over **${region}** (${lat.toFixed(2)}°, ${lon.toFixed(2)}°).

**Downlink Frequencies:**
- **Voice (VHF):** 145.800 MHz FM (all ITU regions)
- **APRS Packet:** 145.825 MHz FM (1200 baud AFSK)
- **UHF Uplink:** 437.525 MHz FM
- **Repeater:** Up 437.800 MHz (CTCSS 67.0 Hz) / Down 145.990 MHz

**Doppler Shift at Current Velocity:**
- Maximum shift: ±3.5 kHz on 145 MHz band
- **AOS** (signal acquisition): Tune +3 kHz → 145.803 MHz
- **TCA** (closest approach): Center → 145.800 MHz  
- **LOS** (signal loss): Tune -3 kHz → 145.797 MHz

A typical pass lasts 8–12 minutes above 10° elevation.`;
  } else if (lq.includes('solar') || lq.includes('power') || lq.includes('panel')) {
    content = `**ISS Solar Power System**

Currently in **${isDay ? 'SOLAR ILLUMINATION' : 'EARTH SHADOW'}** over ${region}.

**Power Generation:**
- **8 solar array wings**, each 34m × 12m (272 m² total)
- Peak generation: **120 kW** at full solar exposure
- ${isDay ? '☀️ Arrays are currently tracking the sun, generating full power and charging battery banks.' : '🌑 Station is in Earth\'s shadow — 24 Li-ion battery orbital replacement units are discharging to maintain 75–80 kW load.'}

**Orbital Solar Cycle:**
- ISS experiences **16 sunrises per day** (one every 92.7 min)
- Eclipse periods last ~35 minutes per orbit
- Battery depth-of-discharge kept below 35% for longevity`;
  } else {
    content = `**ISS Orbital Status Report**

📍 **Current Position:** ${lat.toFixed(4)}°, ${lon.toFixed(4)}° over **${region}**
🚀 **Velocity:** ${vel.toLocaleString()} km/h (Mach ${mach})
📡 **Altitude:** ${alt} km LEO
${isDay ? '☀️' : '🌑'} **Illumination:** ${isDay ? 'Solar Daylight — arrays at full output' : 'Earth Shadow — on battery power'}

**Trajectory Intelligence:**
- Each orbit shifts the ground track ~22.9° westward (2,550 km at equator) due to Earth's rotation
- Horizon footprint covers ~2,250 km radius — visible to observers in that circle
- Next orbit completes in approximately ${Math.round(92.7 - ((Date.now() / 60000) % 92.7))} minutes

**Ask me anything about the ISS** — orbital mechanics, crew activities, space physics, pass predictions, or mission history.`;
  }

  return {
    content,
    model: 'ORBITAL Local Intelligence (No API key — responses are pre-computed)',
    source: 'local-fallback'
  };
}

/**
 * Get stored DeepSeek API Key from browser local storage
 */
export function getStoredApiKey() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('DEEPSEEK_API_KEY') || '';
  } catch {
    return '';
  }
}

/**
 * Save DeepSeek API Key to browser local storage
 */
export function setStoredApiKey(key) {
  if (typeof window === 'undefined') return;
  try {
    if (!key) {
      localStorage.removeItem('DEEPSEEK_API_KEY');
    } else {
      localStorage.setItem('DEEPSEEK_API_KEY', key.trim());
    }
  } catch {
    // ignore
  }
}
