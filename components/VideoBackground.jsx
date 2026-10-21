'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Film,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  Headphones,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { soundEffects } from '@/lib/audio';
import { getAssetPath } from '@/lib/basePath';

export default function VideoBackground({
  overlayTheme = 'cinema',
  onChangeTheme
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Audio State Management
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.75);
  const [showAudioBanner, setShowAudioBanner] = useState(true);

  // Initialize playback on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start with muted playback for browser autoplay policies
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.volume = volume;

    const startPlayback = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Initial video autoplay deferred:', err);
        setIsPlaying(false);
        const unlock = () => {
          if (video && video.paused) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
      }
    };

    startPlayback();
  }, [volume]);

  // Toggle Video Play/Pause
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

  // Toggle Mute / Unmute
  const toggleAudio = useCallback((forcedMute = null) => {
    const video = videoRef.current;
    if (!video) return;

    soundEffects.playClick();
    const nextMuted = forcedMute !== null ? forcedMute : !isMuted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      video.volume = volume > 0 ? volume : 0.75;
      if (volume === 0) setVolume(0.75);
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      setShowAudioBanner(false);
    }
  }, [isMuted, volume]);

  // Handle Volume Slider
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    const video = videoRef.current;
    if (video) {
      video.volume = newVol;
      if (newVol > 0 && isMuted) {
        video.muted = false;
        setIsMuted(false);
        setShowAudioBanner(false);
      } else if (newVol === 0 && !isMuted) {
        video.muted = true;
        setIsMuted(true);
      }
    }
  };

  // Overlay classes
  const overlayClasses = {
    cinema: 'bg-slate-950/20 backdrop-blur-[0.5px]',
    vivid: 'bg-transparent backdrop-blur-none',
    focus: 'bg-slate-950/45 backdrop-blur-[1px]'
  };

  return (
    <>
      {/* Background Video Element with Audio Support */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          src={getAssetPath('/gemini_generated_video_0a46d2c2.mp4')}
          autoPlay
          loop
          muted={isMuted}
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

      {/* Floating Prompt Banner: Unmute Cosmic Video Soundtrack */}
      {isMuted && showAudioBanner && isVideoLoaded && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-40 pointer-events-auto animate-bounce-gentle max-w-sm">
          <div className="bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/50 p-3 shadow-[0_0_25px_rgba(6,182,212,0.3)] text-white font-mono text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-none bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
                <Headphones className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider">
                  Cosmic Audio Soundtrack
                </p>
                <p className="text-[10px] text-slate-300">
                  Video audio is currently muted by default
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id="btn-quick-unmute-banner"
                onClick={() => toggleAudio(false)}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(6,182,212,0.5)] cursor-pointer active:scale-95"
              >
                Unmute Sound
              </button>
              <button
                type="button"
                onClick={() => setShowAudioBanner(false)}
                className="p-1 hover:text-cyan-300 text-slate-400 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Aerospace Video & Audio HUD Controller (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto font-mono">
        <div className="relative">
          {showControls && (
            <div className="absolute bottom-12 right-0 mb-2 p-4 rounded-none bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] text-xs space-y-3.5 min-w-[270px] text-white">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30 font-bold">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span className="uppercase tracking-wider text-[11px]">Media Controller</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-none border border-cyan-500/40">
                  4K MP4 + Audio
                </span>
              </div>

              {/* Audio Controls Section */}
              <div className="space-y-2 p-2.5 bg-slate-900/80 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>Soundtrack Audio:</span>
                  </span>
                  <button
                    type="button"
                    id="btn-toggle-audio-inside"
                    onClick={() => toggleAudio()}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      !isMuted
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/50 hover:bg-rose-900'
                    }`}
                  >
                    {!isMuted ? 'Audible (ON)' : 'Muted (OFF)'}
                  </button>
                </div>

                {/* Volume Slider & Animated Equalizer */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-cyan-400" />
                      <span>Volume:</span>
                    </span>
                    <span className="font-bold text-cyan-300">
                      {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    id="slider-video-volume"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-none cursor-pointer"
                  />
                  {!isMuted && (
                    <div className="flex items-center gap-1 pt-1 justify-center">
                      <span className="h-3 w-1 bg-cyan-400 animate-pulse" />
                      <span className="h-4 w-1 bg-cyan-300 animate-pulse delay-75" />
                      <span className="h-2 w-1 bg-emerald-400 animate-pulse delay-150" />
                      <span className="h-4 w-1 bg-cyan-400 animate-pulse delay-100" />
                      <span className="h-3 w-1 bg-sky-300 animate-pulse delay-200" />
                      <span className="text-[9px] uppercase tracking-wider text-cyan-300 pl-1 font-bold">
                        Stereo 48kHz Audio Playing
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tint Selection */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Atmosphere Tint:
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeTheme('vivid');
                    }}
                    className={`px-2 py-1.5 rounded-none text-[10px] font-bold transition-all border ${
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
                    className={`px-2 py-1.5 rounded-none text-[10px] font-bold transition-all border ${
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
                    className={`px-2 py-1.5 rounded-none text-[10px] font-bold transition-all border ${
                      overlayTheme === 'focus'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
                    }`}
                  >
                    Focus
                  </button>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20">
                <span className="text-[11px] text-slate-300">Video Playback</span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold border border-cyan-500/30 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick HUD Buttons Bar */}
          <div className="flex items-center gap-2">
            {/* Direct 1-Click Audio Toggle Button */}
            <button
              type="button"
              id="btn-quick-audio-toggle"
              onClick={() => toggleAudio()}
              title={isMuted ? 'Cosmic Audio is Muted — Click to Play Audio' : 'Cosmic Audio Playing — Click to Mute'}
              className={`flex items-center gap-2 px-3 py-2 rounded-none backdrop-blur-xl border font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                !isMuted
                  ? 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-950/90 hover:bg-slate-900 text-slate-300 border-cyan-500/40 hover:text-white'
              }`}
            >
              {!isMuted ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="uppercase tracking-wider text-[11px]">Audio ON</span>
                  <span className="w-2 h-2 bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-amber-400" />
                  <span className="uppercase tracking-wider text-[11px]">Audio Muted</span>
                  <span className="w-2 h-2 bg-amber-400" />
                </>
              )}
            </button>

            {/* Video Atmosphere Controls Toggle */}
            <button
              type="button"
              id="btn-video-controls"
              onClick={() => {
                soundEffects.playClick();
                setShowControls(!showControls);
              }}
              title="Video Atmosphere Settings"
              className="flex items-center gap-2 px-3.5 py-2 rounded-none bg-slate-950/90 hover:bg-slate-900 backdrop-blur-xl border border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] font-bold text-xs transition-all hover:border-cyan-300 active:scale-95 cursor-pointer"
            >
              <Film className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Ambience</span>
              <span className={`w-2 h-2 ${isPlaying ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
