import './globals.css';

export const metadata = {
  title: 'ISS Tracker — Live Space Station Tracker',
  description:
    'Track the International Space Station (ISS) in real time on an interactive world map. View live latitude, longitude, altitude, orbital velocity, and flight path trajectory.',
  keywords: [
    'ISS Tracker',
    'International Space Station',
    'Live Satellite Tracking',
    'Where is the ISS',
    'NASA',
    'Space Station Telemetry',
    'Orbital Mechanics'
  ],
  authors: [{ name: 'Edzul Development Challenge Team' }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
