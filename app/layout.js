import 'leaflet/dist/leaflet.css';
import './globals.css';

const siteUrl = 'https://srakshitha0802.github.io/ISS-tracker';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ISS Tracker — Live Real-Time Space Station Tracking',
  description:
    'Track the International Space Station (ISS) in real time. View live telemetry, interactive CARTO map, orbital trajectory prediction, crew profiles, and ask the ORBITAL AI assistant powered by DeepSeek.',
  keywords: [
    'ISS Tracker',
    'International Space Station',
    'Live Satellite Tracking',
    'Where is the ISS',
    'NASA',
    'Space Station Telemetry',
    'Expedition 72',
    'Orbital Mechanics',
    'DeepSeek AI',
    'CARTO Maps'
  ],
  authors: [{ name: 'ISS Tracker Team' }],
  icons: {
    icon: [
      { url: `${siteUrl}/icon.svg`, type: 'image/svg+xml' },
      { url: `${siteUrl}/logo.png`, sizes: '1254x1254', type: 'image/png' }
    ],
    apple: [{ url: `${siteUrl}/logo.png`, sizes: '180x180', type: 'image/png' }]
  },
  openGraph: {
    title: 'ISS Tracker — Live Real-Time Space Station Tracking',
    description:
      'Live ISS telemetry, interactive CARTO map, AI-powered orbital analysis, and crew info. Production-ready.',
    url: siteUrl,
    siteName: 'ISS Tracker',
    images: [{ url: `${siteUrl}/logo.png`, width: 1254, height: 1254, alt: 'ISS Tracker' }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISS Tracker — Live Real-Time Space Station Tracking',
    description: 'Live ISS telemetry, interactive CARTO map, and AI-powered orbital intelligence.',
    images: [`${siteUrl}/logo.png`]
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        {/* Google Fonts — Inter + JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#020617] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
