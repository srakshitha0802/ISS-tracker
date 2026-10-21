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
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
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

  // Subtle glassy overlays that keep the cosmic video prominently visible
  const overlayClasses = {
    // 1. Cinema (Default): Deep space translucent tint with minimal blur so video is clearly visible
    cinema: 'bg-slate-950/30 backdrop-blur-[0.5px]',
    // 2. Vivid: Ultra clear, maximum video visibility
    vivid: 'bg-slate-950/10 backdrop-blur-none',
    // 3. Focus: Slightly darker for high-contrast reading
    focus: 'bg-slate-950/50 backdrop-blur-[1px]'
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
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover transform scale-105 transition-opacity duration-1000"
          style={{ opacity: isVideoLoaded ? 1 : 0.85 }}
        />
      </div>

      {/* Glassy Translucent Overlay */}
      <div
        className={`fixed inset-0 w-full h-full z-0 transition-all duration-500 pointer-events-none ${
          overlayClasses[overlayTheme] || overlayClasses.cinema
        }`}
      />

      {/* Floating Video Controller (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto">
        <div className="relative">
          {showControls && (
            <div className="absolute bottom-12 right-0 mb-2 p-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/20 shadow-2xl text-xs space-y-3 min-w-[220px] text-white">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 font-bold">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>Atmosphere Video</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40">
                  4K MP4
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Video Visibility Mode:
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeTheme('vivid');
                    }}
                    className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                      overlayTheme === 'vivid'
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-800/60 text-slate-300 border-white/10 hover:bg-slate-800'
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
                    className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                      overlayTheme === 'cinema'
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-800/60 text-slate-300 border-white/10 hover:bg-slate-800'
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
                    className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                      overlayTheme === 'focus'
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-800/60 text-slate-300 border-white/10 hover:bg-slate-800'
                    }`}
                  >
                    Focus
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-[11px] font-medium text-slate-300">Playback State</span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-[11px] font-bold border border-white/15 transition-all"
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white shadow-2xl font-bold text-xs transition-all hover:border-cyan-400/60 active:scale-95"
          >
            <Film className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">Space Ambiance</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      </div>
    </>
  );
}
