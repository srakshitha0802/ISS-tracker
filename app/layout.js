import './globals.css';

export const metadata = {
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
  authors: [{ name: 'Edzul Development Challenge Team' }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-sky-500/20 selection:text-sky-700 antialiased">
        {children}
      </body>
    </html>
  );
}
