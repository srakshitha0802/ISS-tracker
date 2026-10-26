'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Film,
  Volume2,
  VolumeX,
  Volume1,
  Headphones,
  Sliders,
  Check,
  X,
  Sparkles
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

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.volume = volume;

    const startPlayback = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Video autoplay deferred until user interaction:', err);
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

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const overlayClasses = {
    cinema: 'bg-slate-950/45 backdrop-blur-[1px]',
    vivid: 'bg-slate-950/25 backdrop-blur-none',
    focus: 'bg-slate-950/65 backdrop-blur-[2px]'
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
          style={{ opacity: isVideoLoaded ? 1 : 0.85 }}
        />
      </div>

      {/* Glassy Translucent Overlay to ensure contrast while showing video */}
      <div
        className={`fixed inset-0 w-full h-full z-0 transition-all duration-500 pointer-events-none ${
          overlayClasses[overlayTheme] || overlayClasses.cinema
        }`}
      />

      {/* Subtle Aerospace Gold/Silver Scanline Grid Effect */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))]" />

      {/* Floating Prompt Banner: Unmute Cosmic Video Soundtrack */}
      {isMuted && showAudioBanner && isVideoLoaded && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-40 pointer-events-auto animate-bounce-gentle max-w-sm">
          <div className="glass-panel-gold p-3 rounded-2xl text-white font-mono text-xs flex items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                <Headphones className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-amber-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Cosmic Atmosphere Audio
                </p>
                <p className="text-[10px] text-slate-300">
                  Video soundscape is muted by default
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id="btn-quick-unmute-banner"
                onClick={() => toggleAudio(false)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95"
              >
                Unmute
              </button>
              <button
                type="button"
                onClick={() => setShowAudioBanner(false)}
                className="p-1 hover:text-amber-300 text-slate-400 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Gold & Silver Aerospace Media Controller (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto font-mono">
        <div className="relative">
          {showControls && (
            <div className="absolute bottom-12 right-0 mb-2 p-4 rounded-2xl glass-panel-gold text-xs space-y-3.5 min-w-[270px] text-white">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 font-bold">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span className="uppercase tracking-wider text-[11px]">Cosmic Media Engine</span>
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  MP4 + Audio
                </span>
              </div>

              {/* Audio Controls Section */}
              <div className="space-y-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/8">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                    <span>Soundtrack:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAudio()}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      isMuted
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isMuted ? 'Muted' : 'Unmuted'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-7 font-mono">{Math.round(volume * 100)}%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Video Playback Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-300 text-[11px]">Video Motion:</span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-[11px]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pause Motion</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Play Motion</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tint Style Preset */}
              {onChangeTheme && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Glass Transparency:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['cinema', 'vivid', 'focus'].map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => {
                          soundEffects.playClick();
                          onChangeTheme(theme);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium uppercase transition-all ${
                          overlayTheme === theme
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 font-bold'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Floating Toggle Buttons (Glassy Gold & Silver) */}
          <div className="flex items-center gap-2">
            {/* 1-Click Audio Toggle */}
            <button
              type="button"
              id="btn-quick-audio-toggle"
              onClick={() => toggleAudio()}
              title={isMuted ? 'Cosmic Audio is Muted — Click to Play Audio' : 'Cosmic Audio Playing — Click to Mute'}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                !isMuted
                  ? 'border-amber-400/50 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'text-slate-300 hover:text-white hover:border-amber-400/30'
              }`}
            >
              {!isMuted ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="uppercase tracking-wider text-[11px]">Audio On</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="uppercase tracking-wider text-[11px] text-slate-400">Muted</span>
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                </>
              )}
            </button>

            {/* Video Controls Toggle */}
            <button
              type="button"
              id="btn-video-controls"
              onClick={() => {
                soundEffects.playClick();
                setShowControls(!showControls);
              }}
              title="Cosmic Video Atmosphere Settings"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-white font-bold text-xs transition-all hover:border-amber-400/40 active:scale-95 cursor-pointer"
            >
              <Film className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Ambience</span>
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-600'}`} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
