# ISS Tracker — Live Space Station Tracker
### Edzul 5-Day Development Challenge

A modern, responsive, high-performance web application designed with a clean white aesthetic, playful animated space doodles, vector stickers, and mission-control capabilities to track the International Space Station (ISS, NORAD Catalog #25544) in real time on an interactive world map.

---

## 1. Problem Statement
The International Space Station orbits the Earth at an altitude of approximately 420 kilometres and a velocity exceeding 27,500 km/h (roughly 7.66 km/s), completing one full revolution every 90–93 minutes. Providing accurate, continuous, and visually engaging geospatial tracking in web browsers poses unique technical challenges:
- High orbital velocity demands regular polling while strictly adhering to public API rate limits (~1 request/second).
- Continuous movement across the International Date Line (antimeridian, $\pm 180^\circ$ longitude) can cause mapping libraries to draw incorrect horizontal lines across the world canvas unless split algorithmically.
- Users want to know not just raw coordinates, but human-readable context: *"What ocean is it flying over right now?"*, *"How far is the ISS from my hometown?"*, and *"Can I see it in the night sky tonight?"*.
- Unfocused browser tabs waste bandwidth unless visibility-aware polling is utilized.

**ISS Tracker** solves these challenges by combining real-time REST API consumption, defensive payload validation, same-origin route handler fallback, forward orbit mathematical projection, observer distance calculation, and interactive space stickers & doodles over a clean white background.

---

## 2. Advanced Feature Highlights

### 2.1. Clean White Aesthetic & Animated Space Stickers
- **Luminous White Background**: Styled with subtle celestial dot patterns and soft ambient glow.
- **Interactive Floating Astronaut**: Zero-gravity animated SVG astronaut floating gently and waving on hover.
- **Retro Rocket & Saturn Stickers**: Hand-crafted vector stickers with flame plumes and celestial rings.
- **Mission Decal Badges**: "Expedition 72", "Mach 25.4 Club", "16 Sunrises a Day", and "Zero Gravity Certified".

### 2.2. Forward Orbit Trajectory (Next 90 Minutes)
- In addition to the **30-point recorded flight trail**, the interactive map plots the **predicted future orbit ground track** for the next 90 minutes based on orbital inclination ($51.64^\circ$) and Earth's rotational shift.
- Both past and future trails feature **Antimeridian Date Line Split Handling** to eliminate horizontal canvas streaks across $\pm 180^\circ$.

### 2.3. Sighting & 3D Distance Slant Range Calculator
- **"Detect My Location"**: Uses the browser's Geolocation API (or preset major world cities: London, New York, Mumbai, Tokyo, Paris, Sydney, Dubai).
- **Haversine Ground Distance**: Real-time great-circle arc distance from the user to the space station.
- **3D Space Slant Range**: Direct straight-line distance through space, factoring in Earth's curvature and orbital altitude ($420\text{ km}$).
- **Visual Horizon Elevation Angle**: Determines whether the station is above the observer's visual sky horizon ($> 10^\circ$).

### 2.4. Live Overflight Region Classifier
- Instant, offline geocoding algorithm that identifies whether the ISS is cruising above major oceans (North/South Pacific, Atlantic, Indian, Southern Ocean) or land territories (North America, South America, Europe, Africa, Asia, Australia).

### 2.5. Expedition 72 Live Crew on Board
- Real-time crew directory displaying the 7 astronauts and cosmonauts currently living and working aboard the ISS.
- Mission roles, arrival spacecraft (SpaceX Crew-9, Soyuz MS-26), days in space, spacewalk (EVA) counts, and agency badges (NASA, Roscosmos).

### 2.6. Mission Control Web Audio API Synthesizer
- Built-in sound effects engine using native HTML5 Web Audio API (zero external audio files needed):
  - Apollo Quindar-style telemetry tone ($2524\text{ Hz}$).
  - Soft radar ping on data arrival.
  - UI button click chimes with a toggleable mute control.

### 2.7. Interactive Map Style Switcher
- **CartoDB Voyager (Light)**: Clean, high-legibility cartography tailored for the white background.
- **OpenStreetMap Standard**: Traditional topographic view.
- **CartoDB Dark Matter**: High-contrast dark night view.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server-rendered shell, client hydration, and same-origin proxy |
| **Language** | JavaScript (ESM) | Dynamic scripting per assignment specifications |
| **UI Library** | React 19 | Component hierarchy, state hooks, and reactive telemetry |
| **Styling** | Tailwind CSS v4 & Vanilla CSS | Clean white aesthetic, glassmorphism, floating doodle animations |
| **Audio** | HTML5 Web Audio API | In-browser Apollo Quindar tones and radar sound effects |
| **Mapping Engine**| Leaflet & React Leaflet | Interactive geospatial canvas with custom DivIcons |
| **Cartography Tiles** | Carto Voyager, OSM Standard, Carto Dark | User-selectable multi-layer cartography |
| **Icons & Art** | Lucide React & Custom SVG | Clean iconography and animated floating space stickers |
| **Testing** | Node.js Test Runner (`node:test`) | 25 unit and end-to-end simulation suites |

---

## 4. Architecture Overview

```
ISS/
├── app/
│   ├── api/
│   │   └── iss/
│   │       └── route.js          # Next.js same-origin proxy route handler
│   ├── globals.css               # White background styling, animations, Leaflet themes
│   ├── layout.js                 # HTML root layout, viewport, SEO metadata
│   └── page.js                   # Main mission control dashboard with tab navigation
├── components/
│   ├── ConnectionStatus.jsx      # High-contrast live/updating/stale/demo indicator
│   ├── CrewPanel.jsx             # Expedition 72 active astronauts on board
│   ├── DashboardHeader.jsx       # Branding, navigation tabs, sound & simulation toggles
│   ├── ErrorState.jsx            # Connection error card with retry and demo triggers
│   ├── Footer.jsx                # Attributions, orbital physics, and challenge credits
│   ├── ISSMap.jsx                # Multi-layer map, future orbit track, antimeridian split
│   ├── ISSMapLoader.jsx          # SSR-disabled dynamic loader & placeholder
│   ├── LastUpdated.jsx           # Live relative time counter & observation epoch
│   ├── LoadingState.jsx          # Initial telemetry acquisition radar animation
│   ├── MovementTrail.jsx         # Breadcrumb history table & trail management
│   ├── PassCalculator.jsx        # Geolocation, 3D slant range, and sighting radar
│   ├── SpaceStickers.jsx         # Floating vector stickers (astronaut, rocket, Saturn, decals)
│   ├── TelemetryCard.jsx         # Reusable glassmorphic telemetry metric card
│   └── TelemetryGrid.jsx         # Responsive 6-card telemetry grid
├── hooks/
│   └── useISSPosition.js         # Telemetry polling, lifecycle, trail, and state hook
├── lib/
│   ├── audio.js                  # Web Audio API Quindar and radar sound effects
│   ├── formatters.js             # Coordinate, velocity, altitude, and time formatters
│   ├── geocoding.js              # Offline ocean and territory classifier
│   ├── issApi.js                 # Dual-layer direct/proxy fetcher with timeout
│   ├── orbitCalculation.js       # Forward orbit propagation, Haversine, 3D slant range
│   ├── sampleData.js             # Clearly labelled offline demo telemetry
│   └── validation.js             # Finite number and geographic range validation
├── test/
│   ├── e2e-simulation.test.js    # End-to-end data fetching, trail & fallback tests
│   ├── formatters.test.js        # Formatter precision and unit tests
│   ├── orbit-geocoding.test.js   # Orbital math, 3D slant range, and geocoding tests
│   └── validation.test.js        # Latitude, longitude, altitude, velocity validation
├── package.json
└── README.md
```

---

## 5. Verification & Test Execution Results

All 25 automated tests pass with 0 failures:

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

▶ Advanced Orbital Math & Sighting Calculations
  ✔ calculates Haversine ground distance accurately
  ✔ calculates 3D slant range to ISS in space
  ✔ calculates elevation angle accurately
  ✔ generates continuous future orbit track array
✔ Advanced Orbital Math & Sighting Calculations

▶ Geographic Region & Ocean Classifier
  ✔ identifies major oceans and territories
✔ Geographic Region & Ocean Classifier

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

ℹ tests 25
ℹ suites 6
ℹ pass 25
ℹ fail 0
```

---

## 6. Suggested 3–5 Minute Evaluator Demo Flow

1. **Initial View & Aesthetic**: Open [http://localhost:3001](http://localhost:3001). Notice the clean white background, animated floating astronaut sticker waving on hover, rocket sticker, and the mission decal stickers.
2. **Interactive Map & Overflight Region**:
   - Inspect the station marker, pulsing radar ring, and the bottom-left badge showing the current region (e.g., `🌊 South Pacific Ocean`).
   - Toggle **Next Orbit Visible** to inspect the predicted forward ground track (amber dashed line) alongside the recorded flight trail (blue solid line).
   - Test the map layer switcher (**Voyager**, **Standard**, **Dark**).
3. **Distance & Sighting Radar Tab**:
   - Click the **Distance & Sightings** tab.
   - Click **Detect My Location** or select any city (e.g. *London*, *New York*, *Tokyo*, *Mumbai*).
   - Observe the live 3D space slant range, ground arc distance, and sky elevation angle.
4. **Crew on Board Tab**:
   - Click the **Crew (7)** tab.
   - Inspect the Expedition 72 crew cards with mission commander Sunita Williams, agency badges, and spacewalk records.
5. **Rate-Limit & Audio Beeps**: Click **Refresh** to hear the authentic Apollo Quindar tone and see the rate-limit cooldown defense lock.
6. **Simulation / Demo Mode**: Click **Simulate Demo**. Notice the **DEMO DATA ACTIVE** warning banner, the status change to **DEMO DATA — NOT LIVE**, and verify demo data is never recorded into real movement trails. Click **Resume Live API** to smoothly return to live telemetry.

---

## 7. Team Contributions (Edzul 5-Day Challenge)

| Team Member | Role & Focus Areas | Contributions |
| :--- | :--- | :--- |
| **Neerja** | Full-Stack Engineering & Routing | Next.js architecture, proxy fallback route handler, state lifecycle management |
| **Vishnavi** | Geospatial & Cartography Integration | Leaflet map configuration, multi-layer switcher, future orbit prediction, and antimeridian split |
| **Rakshita** | UI/UX & Creative Design | Clean white aesthetic, floating vector space stickers, decals, and audio effects |
| **Priyanshu** | Quality Assurance & Orbital Science | Distance & slant range calculations, automated test suites (25 tests), and rate-limit defense |

---

## 8. Deployment Instructions (Vercel)

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: enhance UI/UX with clean white aesthetic, space stickers, future orbit prediction, distance radar, and crew panel"
   git push origin main
   ```
2. In the Vercel Dashboard, import the repository.
3. Framework Preset will automatically detect **Next.js**.
4. No build command override or environment variables are required.
5. Click **Deploy**.
