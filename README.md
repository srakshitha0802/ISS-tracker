# ISS Tracker — Live Space Station Tracker
### Edzul 5-Day Development Challenge

A responsive, high-performance web application designed with a professional mission-control aesthetic to track the International Space Station (ISS, NORAD Catalog #25544) in real time on an interactive world map.

---

## 1. Problem Statement
The International Space Station orbits the Earth at an altitude of approximately 420 kilometres and a velocity exceeding 27,500 km/h (roughly 7.6 km/s), completing one full revolution every 90–93 minutes. Providing accurate, continuous, and visually responsive geospatial tracking in web browsers poses unique technical challenges:
- High orbital velocity demands regular polling while strictly adhering to public API rate limits (~1 request/second).
- Continuous movement across the International Date Line (antimeridian, $\pm 180^\circ$ longitude) can cause naive mapping libraries to draw incorrect horizontal lines across the world canvas.
- Transient network fluctuations or API rate-limit throttling can cause flickering and UI disruption unless stale data preservation and graceful fallback architectures are implemented.
- Unfocused browser tabs waste precious bandwidth and API quotas unless visibility-aware polling is utilized.

**ISS Tracker** solves these challenges by combining real-time REST API consumption, defensive payload validation, same-origin route handler fallback, antimeridian date line split handling, and session breadcrumb persistence.

---

## 2. Project Objectives
- **Accurate Real-Time Telemetry**: Display live latitude, longitude, altitude, orbital velocity, illumination status, and ground footprint diameter.
- **Interactive Geospatial Visualisation**: Plot the space station with a custom SVG spacecraft marker on a dark cartographic map with automatic and manual tracking modes.
- **Resilient Network Handling**: Seamlessly transition between **LIVE**, **UPDATING**, **STALE DATA**, and **ERROR** states.
- **Dual-Layer Fetch Architecture**: Attempt direct browser queries to *Where The ISS At?* and automatically fall back to a same-origin Next.js Route Handler (`/api/iss`) if client-side CORS or firewall restrictions interfere.
- **Session Trajectory Trail**: Record the most recent 30 valid positions, split across the antimeridian, with toggle and clear controls.
- **Separation of Real & Sample Data**: Never confuse demo/simulation data with live telemetry; clearly mark synthetic previews as `DEMO DATA — NOT LIVE`.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server-rendered shell, client hydration, and same-origin proxy |
| **Language** | JavaScript (ESM) | Dynamic scripting per assignment specifications |
| **UI Library** | React 19 | Component hierarchy, state hooks, and reactive telemetry |
| **Styling** | Tailwind CSS v4 & Vanilla CSS | Deep navy mission control palette, glassmorphism, responsive grid |
| **Mapping Engine**| Leaflet & React Leaflet | Interactive geospatial canvas with custom DivIcons |
| **Cartography Tiles** | CartoDB Dark Matter / OpenStreetMap | Dark cartography styled for space mission control |
| **Icons** | Lucide React | High-contrast status, telemetry, and navigation iconography |
| **Data Fetching** | Fetch API + AbortController | Asynchronous polling, request timeouts, and teardown management |
| **Testing** | Node.js Test Runner (`node:test`) | Fast, native unit and end-to-end simulation suites |

---

## 4. Key Features

### 4.1. Mission Control Telemetry Grid
- **Latitude & Longitude**: Rendered with hemisphere notation ($^\circ\text{ N/S}$, $^\circ\text{ E/W}$) and 4 decimal places of precision.
- **Orbital Altitude**: Expressed in kilometres (WGS84 ellipsoid reference).
- **Orbital Velocity**: Real-time velocity formatted in km/h with secondary km/s conversion (~7.66 km/s, Mach 25+).
- **Orbital Illumination (Visibility)**: Indicates whether the station is in direct sunlight (**Daylight**) or within Earth's umbral shadow (**Eclipsed**).
- **Ground Footprint**: Visible horizon communication diameter (~4,500 km).

### 4.2. Interactive World Map
- **Custom Station Marker**: Pulsing radar rings and SVG solar array silhouette.
- **Marker Popup**: Interactive card displaying current coordinates, altitude, velocity, and observation epoch.
- **Follow ISS Mode**: Smooth automatic panning when new coordinates arrive, disengageable at any time so users can freely explore the globe.
- **Antimeridian Date Line Split**: Automatically detects when consecutive coordinates jump across the $+180^\circ / -180^\circ$ boundary and splits the line segment, preventing artificial horizontal lines.

### 4.3. Session Flight Path History
- Stores up to 30 recent observation points captured during the active browser session.
- Displays an expandable historical log with timestamps, coordinates, altitude, and speed.
- Includes **Show/Hide Trail** and **Clear Trail** controls.
- Excludes duplicate coordinates and never pollutes real trails with demo data.

### 4.4. State Management & Reliability
- **Live Polling**: Defaults to a 7-second cadence.
- **Tab Visibility Awareness**: Pauses background polling when the browser tab is hidden and triggers an immediate update upon tab reactivation.
- **Manual Refresh with Rate-Limit Cooldown**: Enforces a 2.5-second cooldown on manual refresh clicks to protect upstream rate limits.
- **Stale Data Preservation**: When an update fails, the application preserves the last confirmed valid coordinates and clearly flags the telemetry as **STALE DATA**.
- **Interactive Simulation Mode**: Includes a "Simulate Demo" button in the header allowing evaluators to test error fallback states and demo banners without requiring the live API to go offline.

---

## 5. Architecture Overview

```
ISS/
├── app/
│   ├── api/
│   │   └── iss/
│   │       └── route.js          # Next.js same-origin proxy route handler
│   ├── globals.css               # Dark theme tokens, animations, Leaflet overrides
│   ├── layout.js                 # HTML root layout, viewport, SEO metadata
│   └── page.js                   # Main mission control dashboard composer
├── components/
│   ├── ConnectionStatus.jsx      # High-contrast live/updating/stale/demo pill
│   ├── DashboardHeader.jsx       # Branding, NORAD badge, refresh & simulation controls
│   ├── ErrorState.jsx            # Telemetry connection error card & retry trigger
│   ├── Footer.jsx                # Attributions, limitations, and challenge credits
│   ├── ISSMap.jsx                # Leaflet map, custom SVG marker, antimeridian split
│   ├── ISSMapLoader.jsx          # SSR-disabled dynamic loader & radar placeholder
│   ├── LastUpdated.jsx           # Live relative time counter & observation epoch
│   ├── LoadingState.jsx          # Initial telemetry acquisition radar animation
│   ├── MovementTrail.jsx         # Breadcrumb history table & trail management
│   ├── TelemetryCard.jsx         # Reusable glassmorphic telemetry metric card
│   └── TelemetryGrid.jsx         # Responsive 6-card telemetry grid
├── hooks/
│   └── useISSPosition.js         # Telemetry polling, lifecycle, trail, and state hook
├── lib/
│   ├── formatters.js             # Coordinate, velocity, altitude, and time formatters
│   ├── issApi.js                 # Dual-layer direct/proxy fetcher with timeout
│   ├── sampleData.js             # Clearly labelled offline demo telemetry
│   └── validation.js             # Finite number and geographic range validation
├── test/
│   ├── e2e-simulation.test.js    # End-to-end data fetching, trail & fallback tests
│   ├── formatters.test.js        # Formatter precision and unit tests
│   └── validation.test.js        # Latitude, longitude, altitude, velocity validation
├── package.json
└── README.md
```

---

## 6. API Integration & Rate Limiting

### Primary Public Endpoint
- **URL**: `https://api.wheretheiss.at/v1/satellites/25544`
- **Documentation**: [https://docs.wheretheiss.at/w/developer](https://docs.wheretheiss.at/w/developer)
- **Authentication**: None required (Free public REST API).
- **Rate Limit**: Approximately 1 request per second.
- **Application Cadence**: 7 seconds (well within safe threshold).

### Fallback Route Handler
- **URL**: `/api/iss`
- **Location**: `app/api/iss/route.js`
- **Function**: Server-side proxy with `Cache-Control: no-store` and payload validation to ensure resilient connectivity if client browser environments restrict third-party cross-origin requests.

---

## 7. Installation & Local Development

### Prerequisites
- **Node.js**: v18.17.0+ or v20.0.0+ (Tested on Node.js v22.23.2)
- **npm**: v9.0.0+ (Tested on npm 10.9.8)

### Step-by-Step Setup
1. **Clone or Navigate to the Repository**:
   ```bash
   cd /Users/srakshitha/Desktop/ISS
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Automated Tests**:
   ```bash
   npm test
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 8. Verification & Test Execution Results

All automated test suites execute via Node's native test runner without third-party test runners:

```bash
$ npm test

> iss-tracker@1.0.0 test
> node --test test/**/*.test.js

▶ End-to-End Logic & Reliability Verification
  ✔ fetches live ISS coordinates from public API
  ✔ forces simulation / demo mode when requested
  ✔ validates date line split algorithm correctly
  ✔ preserves last valid position on subsequent error
  ✔ does not append demo data to history trail
  ✔ deduplicates identical consecutive trail points
✔ End-to-End Logic & Reliability Verification

▶ Telemetry Formatters
  ✔ formats latitude with cardinal direction
  ✔ formats longitude with cardinal direction
  ✔ formats coordinates combination
  ✔ formats altitude with km unit
  ✔ formats velocity in km/h and km/s
  ✔ formats footprint diameter
  ✔ formats visibility status accurately
  ✔ formats relative time calculations
✔ Telemetry Formatters

▶ Geographic Coordinate Validation
  ✔ validates latitude boundaries correctly
  ✔ validates longitude boundaries correctly
  ✔ validates altitude within reasonable LEO bounds
  ✔ validates orbital velocity within realistic LEO speed
✔ Geographic Coordinate Validation

▶ Payload Validation
  ✔ accepts valid full Where The ISS At? payload
  ✔ rejects malformed payloads with missing or out-of-range fields
✔ Payload Validation

ℹ tests 20
ℹ suites 4
ℹ pass 20
ℹ fail 0
```

---

## 9. Suggested 3–5 Minute Evaluator Demo Flow

1. **Initial Acquisition**: Load the application. Observe the acquisition animation transition into **LIVE TELEMETRY** with a pulsing green indicator.
2. **Telemetry Observation**: Review the 6 metric cards (Latitude, Longitude, Altitude, Orbital Velocity, Illumination, and Footprint). Notice coordinates update every 7 seconds.
3. **Map Interaction**:
   - Inspect the custom ISS spacecraft marker and glowing radar pulse.
   - Click the marker to inspect the popup showing exact coordinates and time.
   - Click **Tracking ISS / Follow ISS** to toggle auto-panning off and freely explore the world map.
4. **Flight Path Trail**:
   - Observe the cyan dotted breadcrumb trail extending as telemetry refreshes.
   - Toggle **Trail Shown / Trail Hidden**.
   - Expand the **Recorded Flight Path** table to inspect historical session coordinates.
5. **Rate-Limit & Manual Refresh**: Click **Refresh**. Notice the spinning icon and temporary rate-limit cooldown disabling spam clicks.
6. **Simulation / Fallback Demonstration**: Click **Simulate Demo**. Notice the immediate appearance of the **DEMO DATA ACTIVE** warning banner, the status change to **DEMO DATA — NOT LIVE**, and verify that demo data is not added to the movement trail. Click **Resume Live API** to smoothly return to live telemetry.

---

## 10. Data Limitations & Technical Notes

- **Orbital Decay & Atmospheric Drag**: In Low Earth Orbit (~400–430 km), tiny amounts of atmospheric drag cause orbital decay. The ISS periodically fires thrusters or uses docked cargo ships to re-boost its altitude.
- **Session Trajectory vs. Orbital Ground Track**: Trajectory points in this application represent discrete observations recorded during your active browser tab session, rather than a full Keplerian orbital propagation model.
- **Public API Rate Quotas**: Polling is intentionally calibrated to 7 seconds to respect the public server's free resources while providing a fluid user experience.

---

## 11. Deployment Instructions (Vercel)

This application is ready for zero-configuration deployment to [Vercel](https://vercel.com):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the Vercel Dashboard, click **Add New... -> Project**.
3. Import the repository.
4. Framework Preset will automatically detect **Next.js**.
5. No build command override or environment variables are required.
6. Click **Deploy**.

---

## 12. Team Contributions (Edzul 5-Day Challenge)

| Team Member | Role & Focus Areas | Contributions |
| :--- | :--- | :--- |
| **Neerja** | Full-Stack Engineering & Routing | Next.js architecture, proxy fallback route handler, and state lifecycle management |
| **Vishnavi** | Geospatial & Cartography Integration | Leaflet map configuration, custom SVG station marker, and date-line split handling |
| **Rakshita** | UI/UX & Component Design | Mission control theme, telemetry metric grid, and accessibility |
| **Priyanshu** | Quality Assurance & Testing | Automated test suites, edge case verification, rate-limit defense, and documentation |

---

## 13. Map & API Attributions
- Real-time ISS Telemetry: [Where the ISS at?](https://wheretheiss.at) by Bill Shupp.
- Cartography Tiles: [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors & [CARTO](https://carto.com/attributions).
