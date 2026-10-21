/**
 * DeepSeek AI Orbital Copilot Engine
 * Integrates DeepSeek API (deepseek-chat) for real-time space telemetry intelligence,
 * orbital mechanics analysis, and mission control inquiries.
 */

const DEEPSEEK_API_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const DEFAULT_MODEL = 'deepseek-chat';

/**
 * Builds an aerospace mission briefing prompt with real-time ISS telemetry context
 */
export function buildTelemetryPrompt(telemetry = {}, query = '') {
  const {
    latitude = 0,
    longitude = 0,
    altitude = 420,
    velocity = 27580,
    visibility = 'daylight',
    regionName = 'Earth Orbit'
  } = telemetry;

  const systemPrompt = `You are the DeepSeek Orbital Copilot, an advanced AI Flight Dynamics Officer and Astrophysics Specialist onboard the International Space Station (NORAD #25544, Expedition 72).
You provide ultra-precise, scientific, yet engaging aerospace intelligence.

Current ISS Live Telemetry Context:
- Sub-satellite Position: ${latitude.toFixed(4)}° Lat, ${longitude.toFixed(4)}° Lon
- Territory / Body of Water Overflown: ${regionName}
- Orbital Altitude: ${Math.round(altitude)} km above Earth
- Orbital Velocity: ${Math.round(velocity).toLocaleString()} km/h (~7.66 km/s, Mach 25.4)
- Illumination State: ${String(visibility).toUpperCase()}
- Crew on Board: 7 Astronauts & Cosmonauts (Expedition 72)
- Keplerian Period: ~92.7 minutes (15.54 orbits / 24 hours)

Provide your analysis in structured, aerospace mission-control format with clear sections:
1. ORBITAL STATUS SUMMARY
2. TRAJECTORY & GROUND TRACK INTELLIGENCE
3. SCIENTIFIC & TECHNICAL ANALYSIS
4. CREW & MISSION OPERATIONS
Be concise, accurate, and inspiring.`;

  return { systemPrompt, userQuery: query };
}

/**
 * Executes a DeepSeek API request using the official endpoint
 * @param {object} telemetry - Live ISS telemetry metrics
 * @param {string} userQuery - User's question or pre-set prompt
 * @param {string} [customApiKey] - User-supplied DeepSeek API key
 * @returns {Promise<{content: string, model: string, source: string}>}
 */
export async function queryDeepSeekAI(telemetry = {}, userQuery = '', customApiKey = '') {
  const apiKey = customApiKey || getStoredApiKey() || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY : '');
  const { systemPrompt, userQuery: finalQuery } = buildTelemetryPrompt(telemetry, userQuery);

  // If a real API key is available, call the live DeepSeek API
  if (apiKey && apiKey.trim().length > 0) {
    try {
      const response = await fetch(DEEPSEEK_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: finalQuery || 'Generate a comprehensive real-time flight telemetry briefing for our current orbital coordinates.' }
          ],
          temperature: 0.6,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`DeepSeek API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response returned from DeepSeek API.';

      return {
        content,
        model: data.model || DEFAULT_MODEL,
        source: 'live-deepseek-api',
        usage: data.usage
      };
    } catch (err) {
      console.warn('Direct DeepSeek API call failed, falling back to orbital calculation engine:', err.message);
      // Fall through to dynamic calculation engine if network or quota issue occurs
    }
  }

  // Fallback: Real-time dynamic astrophysical synthesis engine calibrated to live coordinates
  return generateDynamicOrbitalBriefing(telemetry, finalQuery);
}

/**
 * Intelligent telemetry-driven astrophysical intelligence generator
 * Used when offline or awaiting user's DeepSeek API key configuration.
 */
function generateDynamicOrbitalBriefing(telemetry, query = '') {
  const lat = telemetry.latitude || 0;
  const lon = telemetry.longitude || 0;
  const alt = Math.round(telemetry.altitude || 420);
  const vel = Math.round(telemetry.velocity || 27580);
  const region = telemetry.regionName || 'Oceanic Territory';
  const isDay = String(telemetry.visibility || '').toLowerCase() === 'daylight';
  const mach = (vel / 1080).toFixed(1);

  // Check if query is specialized
  const lowerQuery = (query || '').toLowerCase();

  let analysisText = '';

  if (lowerQuery.includes('why') || lowerQuery.includes('fall') || lowerQuery.includes('gravity')) {
    analysisText = `### DEEPSEEK FLIGHT MECHANICS ANALYSIS: ORBITAL EQUILIBRIUM

1. **CENTRIPETAL FORCE vs GRAVITATIONAL ACCELERATION**
   - Earth's gravitational acceleration at ${alt} km is approximately **8.7 m/s²** (~89% of surface gravity). The ISS is NOT in "zero gravity", but in continuous, perpetual free-fall around Earth's curvature.
   - Forward orbital velocity ($v = ${vel.toLocaleString()} \\text{ km/h} = 7.66 \\text{ km/s}$) matches the curve of the Earth: for every 8,000 meters the ISS travels horizontally, the Earth's surface curves away by exactly 4.9 meters.

2. **ATMOSPHERIC DRAG & ORBITAL DECAY**
   - At ${alt} km in the thermosphere, trace atmospheric particles ($N_2, O$) create aerodynamic drag. The station loses ~50 to 100 meters of altitude daily, compensated by periodic Progress and Cygnus thruster reboosts.

3. **MISSION ADVICE**
   - Microgravity onboard is a result of orbital free-fall, enabling crystal growth, protein crystallization, and tissue chip experiments impossible under 1G on Earth.`;
  } else if (lowerQuery.includes('crew') || lowerQuery.includes('experiment') || lowerQuery.includes('astronaut')) {
    analysisText = `### DEEPSEEK EXPEDITION 72 CREW OPERATIONS BRIEFING

1. **ACTIVE ON-ORBIT CREW (7 ASTRONAUTS & COSMONAUTS)**
   - **Commander**: Sunita Williams (NASA) — Long-duration spaceflight commander & veteran of 7 EVAs.
   - **Flight Engineers**: Barry Wilmore (NASA), Nick Hague (NASA), Aleksandr Gorbunov (Roscosmos), Aleksey Ovchinin (Roscosmos), Ivan Vagner (Roscosmos), Don Pettit (NASA).

2. **KEY EXPERIMENTS RUNNING TODAY**
   - **Plant Habitat-03**: Multi-generational epigenetic adaptations of crops in microgravity for future Mars transit.
   - **Microchannel Flow Physics**: Capillary fluid management systems for closed-loop environmental life support (ECLSS).
   - **NeuroMapping & Space Headaches**: Assessing brain structural shifts caused by cephalad fluid shifts in microgravity.

3. **HABITAT ENVIRONMENTAL CONDITIONS**
   - Cabin pressure: 101.3 kPa (14.7 psi, Sea Level atmosphere)
   - Atmosphere: 78% $N_2$, 21% $O_2$, $<0.3\\% CO_2$ scrubbed continuously by the Carbon Dioxide Removal Assembly (CDRA).`;
  } else if (lowerQuery.includes('radio') || lowerQuery.includes('frequency') || lowerQuery.includes('ham') || lowerQuery.includes('doppler')) {
    analysisText = `### DEEPSEEK ARISS RADIO TELEMETRY BRIEFING

1. **RADIO FREQUENCY ASSIGNMENTS (ARISS)**
   - **VHF Voice Downlink**: 145.800 MHz FM (ITU Region 1, 2 & 3)
   - **Packet Radio (APRS)**: 145.825 MHz FM (1200 baud AFSK)
   - **UHF Uplink**: 437.525 MHz FM
   - **Crossband Repeater**: Uplink 437.800 MHz (CTCSS 67.0 Hz), Downlink 145.990 MHz

2. **DOPPLER SHIFT CALCULATION AT MACH ${mach}**
   - Radial velocity relative to observer causes a $\\pm 3.5 \\text{ kHz}$ Doppler shift on 145 MHz.
   - AOS (Acquisition of Signal): Tune +3 kHz (145.803 MHz)
   - TCA (Time of Closest Approach): Center frequency (145.800 MHz)
   - LOS (Loss of Signal): Tune -3 kHz (145.797 MHz).`;
  } else {
    // Default comprehensive mission briefing
    analysisText = `### DEEPSEEK ORBITAL SITUATIONAL REPORT

1. **COORDINATES & SECTOR OVERFLIGHT**
   - **Current Footprint**: Directly above **${region}** (${lat.toFixed(4)}°, ${lon.toFixed(4)}°).
   - **Ground Radius**: The station's horizon covers a circle of ~2,250 km radius across Earth's surface.

2. **FLIGHT DYNAMICS & KINEMATICS**
   - **Speed**: ${vel.toLocaleString()} km/h (Mach ${mach}, 7.66 km/s).
   - **Altitude**: ${alt} km above the geoid (Low Earth Orbit, LEO).
   - **Solar Cycle**: Currently operating in **${isDay ? 'SOLAR ILLUMINATION (DAYLIGHT)' : 'EARTH SHADOW (ECLIPSE)'}**. ${isDay ? 'UltraFlex solar arrays actively generating ~120 kW electrical power, charging lithium-ion battery banks.' : 'Station relying on 24 Li-ion battery orbital storage units until next sunrise in ~45 minutes.'}

3. **NEXT ORBITAL PREDICTION**
   - Earth rotation beneath the orbit shifts each consecutive orbital path westward by **22.9° of longitude** (~2,550 km at the equator).`;
  }

  return {
    content: analysisText,
    model: 'deepseek-chat (Simulated Engine / Configure API Key for Live DeepSeek Server)',
    source: 'deepseek-engine-telemetry'
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
