import './globals.css';

const siteUrl = 'https://srakshitha0802.github.io/ISS-tracker';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ISS Tracker — Live Space Station Tracker',
  description:
    'Track the International Space Station (ISS) in real time on an interactive world map. View live latitude, longitude, altitude, orbital velocity, ground distance radar, and flight path trajectory.',
  keywords: [
    'ISS Tracker',
    'International Space Station',
    'Live Satellite Tracking',
    'Where is the ISS',
    'NASA',
    'Space Station Telemetry',
    'Expedition 72',
    'Orbital Mechanics'
  ],
  authors: [{ name: 'Edzul Development Challenge Team' }],
  icons: {
    icon: [
      { url: `${siteUrl}/icon.svg`, type: 'image/svg+xml' },
      { url: `${siteUrl}/logo.png`, sizes: '1254x1254', type: 'image/png' }
    ],
    apple: [
      { url: `${siteUrl}/logo.png`, sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    title: 'ISS Tracker — Live Space Station Tracker',
    description: 'Track the International Space Station (ISS) in real time on an interactive world map. Live telemetry, trajectory prediction, and distance radar.',
    url: siteUrl,
    siteName: 'ISS Tracker',
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1254,
        height: 1254,
        alt: 'ISS Tracker Official Aerospace Emblem'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISS Tracker — Live Space Station Tracker',
    description: 'Track the International Space Station (ISS) in real time on an interactive world map.',
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
      <body className="min-h-full flex flex-col bg-transparent text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 antialiased">
        {children}
      </body>
    </html>
  );
}
