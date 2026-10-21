# ISS Tracker — Live Space Station Flight Telemetry HUD
### Edzul 5-Day Development Challenge

[![Deploy Next.js to GitHub Pages](https://github.com/srakshitha0802/ISS-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/srakshitha0802/ISS-tracker/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Site-GitHub_Pages-06b6d4?style=flat&logo=github)](https://srakshitha0802.github.io/ISS-tracker/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat&logo=next.js)](https://nextjs.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Tests Passing](https://img.shields.io/badge/Tests-29%2F29%20Pass-10b981?style=flat&logo=vitest)](https://github.com/srakshitha0802/ISS-tracker)

An advanced, real-time aerospace flight telemetry and geospatial tracking web application for the **International Space Station (ISS, NORAD Catalog #25544)**. Engineered with a sharp-edged mission control HUD aesthetic, cosmic 4K MP4 ambient space video background, precision Keplerian orbital mechanics calculations, forward orbit projection, 3D observer distance radar, and live Expedition 72 crew dossier.

🌐 **Live URL**: [https://srakshitha0802.github.io/ISS-tracker/](https://srakshitha0802.github.io/ISS-tracker/)  
📦 **Repository**: [https://github.com/srakshitha0802/ISS-tracker](https://github.com/srakshitha0802/ISS-tracker)

---

## 1. Key Architectural & Design Features

### 1.1. Sharp Aerospace HUD & Theme Design System
- **Crisp Sharp Edges**: All components, cards, tables, badges, and modals feature sharp rectangular geometry (`rounded-none`) with laser-aligned corner accent brackets.
- **Deep Space Theme Palette**:
  - **Obsidian Slate Base**: `#020617` / `slate-950`
  - **Telemetry Cyan**: `#06b6d4` & `#22d3ee`
  - **Solar & Mach Amber**: `#f59e0b` & `#fbbf24`
  - **Signal Emerald**: `#10b981` & `#34d399`
- **Custom Precision Vector ISS Logo**: Bespoke SVG insignia featuring authentic space station architecture (central truss structure, port/starboard dual-axis photovoltaic solar wings, pressurized habitat modules, and orbital vector arcs).

### 1.2. High-Definition Cosmic Video Background Engine
- **Direct DOM Playback Management**: Autoplay policies handled via direct DOM property enforcement (`video.muted = true`, `video.defaultMuted = true`, `video.playsInline = true`).
- **User-Gesture Recovery**: Auto-resumes playback on initial interaction (`click`, `touchstart`, `keydown`).
- **Live Ambiance Controller**: Switch between **Cinema** (translucent HUD tint), **Vivid** (100% transparent zero-blur space view), and **Focus** (dark contrast analysis view).

### 1.3. Real-Time Telemetry & Failover Reliability
- **Where The ISS At? REST API Integration**: Regular polling with exponential backoff and rate-limit preservation.
- **Antimeridian ($\pm 180^\circ$) Date Line Split Algorithm**: Automatically detects when the space station crosses the 180th meridian and splits trajectory polylines to prevent horizontal canvas wrapping artifacts.
- **Dual Connection Pipeline**: Direct browser fetch with CORS support for GitHub Pages static hosting, backed by same-origin proxy fallbacks for server runtimes.

### 1.4. Forward Orbit Track & Sighting Distance Radar
- **90-Minute Future Orbit Track**: Projects next orbital path factoring orbital inclination ($51.64^\circ$) and Earth rotation.
- **3D Ground Distance & Slant Range**: Computes great-circle ground distance (Haversine) and true line-of-sight Euclidean distance through space factoring 420 km altitude.
- **Horizon Elevation Angles**: Instant visual sighting notifications when the ISS is above the user's horizon ($> 10^\circ$).

### 1.5. Live Expedition 72 Crew Dossier
- Real-time roster of the 7 astronauts and cosmonauts currently residing on board the space station, detailing roles, launch vehicles (SpaceX Crew-9, Soyuz MS-26), days in orbit, and spacewalk (EVA) logs.

### 1.6. Mission Control Web Audio API Synthesizer
- Built-in sound effects engine using native Web Audio API oscillators:
  - Apollo Quindar-style telemetry confirmation tone ($2524\text{ Hz}$).
  - Soft radar ping on coordinate refresh.
  - UI button tactile chimes with mute toggle.

---

## 2. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.2 (App Router) | Static export compatibility for GitHub Pages |
| **Runtime** | React 19.3.0 | Modern client architecture & hooks |
| **Styling** | Vanilla CSS + Tailwind CSS v4 | Sharp HUD glassmorphism design system |
| **Mapping Engine** | Leaflet 1.9.4 & React-Leaflet 5.0 | Multi-layer interactive geospatial world map |
| **Icons** | Lucide React | High-contrast vector icons (zero cartoon emojis) |
| **Audio** | Native HTML5 Web Audio API | Zero external audio asset dependencies |
| **Testing** | Node.js Test Runner | 29/29 passing tests covering math, API, and validation |
| **CI/CD** | GitHub Actions | Automated build & deploy to GitHub Pages |

---

## 3. Local Development

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/srakshitha0802/ISS-tracker.git
cd ISS-tracker

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live dashboard.

### Run Quality Gates & Tests
```bash
# Run 29 comprehensive automated tests
npm test

# Run ESLint check
npm run lint

# Build static production bundle for GitHub Pages
npm run build:gh-pages
```

---

## 4. Deployment to GitHub Pages

This repository is configured with a GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that automatically runs tests, builds the static export, and deploys to GitHub Pages upon pushing to the `main` branch.

To enable GitHub Pages in your GitHub repository settings:
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Push to `main`, and the deployment will complete automatically.

---

## 5. License & Credits
Developed for the **Edzul 5-Day Development Challenge**.  
Telemetry provided by [Where The ISS At? API](https://wheretheiss.at) by Bill Shupp.  
Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) and [CARTO](https://carto.com).
