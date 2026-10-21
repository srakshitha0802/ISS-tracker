'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Film, Eye, Sparkles } from 'lucide-react';
import { soundEffects } from '@/lib/audio';

export default function VideoBackground({
  overlayTheme = 'cinema',
  onChangeTheme
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM property enforcement required for browser autoplay policies
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlayback = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Initial video autoplay deferred:', err);
        setIsPlaying(false);
        // Automatically start on the first user interaction
        const unlock = () => {
          if (video.paused) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
      }
    };

    startPlayback();
  }, []);

  const togglePlay = () => {
    soundEffects.playClick();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Subtle glassy overlays that keep the cosmic video prominently visible
  const overlayClasses = {
    // 1. Cinema (Default): Deep space translucent tint with minimal blur so video is clearly visible
    cinema: 'bg-slate-950/20 backdrop-blur-[0.5px]',
    // 2. Vivid: Ultra clear, maximum video visibility
    vivid: 'bg-transparent backdrop-blur-none',
    // 3. Focus: Slightly darker for high-contrast reading
    focus: 'bg-slate-950/45 backdrop-blur-[1px]'
  };

  return (
    <>
      {/* Background Video Element */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          src="/gemini_generated_video_0a46d2c2.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedData={() => setIsVideoLoaded(true)}
          onCanPlay={() => {
            setIsVideoLoaded(true);
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          }}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover transform scale-105 transition-opacity duration-1000"
          style={{ opacity: isVideoLoaded ? 1 : 0.9 }}
        />
      </div>

      {/* Glassy Translucent Overlay */}
      <div
        className={`fixed inset-0 w-full h-full z-0 transition-all duration-500 pointer-events-none ${
          overlayClasses[overlayTheme] || overlayClasses.cinema
        }`}
      />

      {/* Floating Video Controller (Bottom Right) - Sharp Aerospace HUD */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto">
        <div className="relative">
          {showControls && (
            <div className="absolute bottom-12 right-0 mb-2 p-3.5 rounded-none bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)] text-xs space-y-3 min-w-[230px] text-white">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 font-bold">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono uppercase tracking-wider text-[11px]">Cosmic Ambiance</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-none border border-cyan-500/40">
                  4K MP4
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Atmosphere Tint:
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeTheme('vivid');
                    }}
                    className={`px-2 py-1.5 rounded-none text-[10px] font-mono font-bold transition-all border ${
                      overlayTheme === 'vivid'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
                    }`}
                  >
                    Vivid
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeTheme('cinema');
                    }}
                    className={`px-2 py-1.5 rounded-none text-[10px] font-mono font-bold transition-all border ${
                      overlayTheme === 'cinema'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
                    }`}
                  >
                    Cinema
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeTheme('focus');
                    }}
                    className={`px-2 py-1.5 rounded-none text-[10px] font-mono font-bold transition-all border ${
                      overlayTheme === 'focus'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
                    }`}
                  >
                    Focus
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20">
                <span className="text-[11px] font-mono text-slate-300">Playback Status</span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-mono font-bold border border-cyan-500/30 transition-all"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
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
            title="Video Atmosphere Settings"
            className="flex items-center gap-2 px-3.5 py-2 rounded-none bg-slate-950/90 hover:bg-slate-900 backdrop-blur-xl border border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono font-bold text-xs transition-all hover:border-cyan-300 active:scale-95"
          >
            <Film className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Space Ambiance</span>
            <span className={`w-2 h-2 rounded-none ${isPlaying ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
          </button>
        </div>
      </div>
    </>
  );
}
