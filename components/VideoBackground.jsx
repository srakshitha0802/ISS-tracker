'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Sliders, Eye, Film } from 'lucide-react';
import { soundEffects } from '@/lib/audio';

export default function VideoBackground({
  overlayTheme = 'pearl',
  onChangeTheme
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Browser autoplay restriction handling
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    soundEffects.playClick();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Overlay styles
  const overlayClasses = {
    // 1. Frosted Pearl: Crisp, clean, readable white theme with cosmic video ambiance
    pearl: 'bg-white/85 backdrop-blur-[6px]',
    // 2. Crystal Glass: Higher video transparency
    crystal: 'bg-white/60 backdrop-blur-[4px]',
    // 3. Deep Space: High-contrast cinema night mode
    cinema: 'bg-slate-950/75 backdrop-blur-[6px]'
  };

  return (
    <>
      {/* Background Video Element */}
      <div className="fixed inset-0 w-full h-full -z-30 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          src="/gemini_generated_video_0a46d2c2.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover transform scale-105 transition-opacity duration-1000"
          style={{ opacity: isVideoLoaded ? 1 : 0 }}
        />
      </div>

      {/* Dynamic Frosted Glassmorphism Overlay */}
      <div
        className={`fixed inset-0 w-full h-full -z-20 transition-all duration-500 pointer-events-none ${
          overlayClasses[overlayTheme] || overlayClasses.pearl
        }`}
      />

      {/* Floating Video Ambiance Controller (Bottom Right Pill) */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto">
        <div className="relative">
          {showControls && (
            <div className="absolute bottom-12 right-0 mb-2 p-3 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-200/90 shadow-2xl text-xs space-y-2.5 min-w-[210px] animate-float-slow">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-sky-500" />
                  <span>Atmosphere Engine</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  4K MP4
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Glass Ambiance Mode:
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeTheme('pearl');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      overlayTheme === 'pearl'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Pearl
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeTheme('crystal');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      overlayTheme === 'crystal'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Crystal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeTheme('cinema');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      overlayTheme === 'cinema'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Cinema
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-600">Motion Playback</span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all"
                >
                  {isPlaying ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Toggle Button */}
          <button
            type="button"
            id="btn-video-controls"
            onClick={() => {
              soundEffects.playClick();
              setShowControls(!showControls);
            }}
            title="Video Background Settings"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-200 text-slate-700 hover:text-sky-600 shadow-xl font-bold text-xs transition-all hover:scale-105 active:scale-95"
          >
            <Film className="w-4 h-4 text-sky-500 animate-pulse" />
            <span className="hidden sm:inline">Cosmic Motion</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </button>
        </div>
      </div>
    </>
  );
}
