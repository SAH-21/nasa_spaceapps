import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Maximize2, 
  Volume2, 
  RotateCcw, 
  Layers, 
  Radio, 
  Eye, 
  Activity 
} from 'lucide-react';

export default function EarthVideoPlayer({
  station,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  overlayActive = true,
  onToggleOverlay
}) {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  // Sync native HTML5 video with parent playback state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(e => {
        // Autoplay may be restricted without user interaction
        console.warn('Playback error or user gesture required', e);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Synchronize seek position when parent time changes significantly
  useEffect(() => {
    if (!videoRef.current) return;
    if (Math.abs(videoRef.current.currentTime - currentTime) > 0.6) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onSeek(videoRef.current.currentTime);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-space-950 border border-slate-800 shadow-2xl flex flex-col group">
      
      {/* Top Video Telemetry Header */}
      <div className="px-4 py-2.5 bg-space-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-nasa-cyan' : 'bg-slate-500'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-nasa-cyan' : 'bg-slate-500'}`}></span>
          </span>
          <span className="text-white font-bold">{station.satelliteSource}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 hidden sm:inline">{station.telemetry.resolution}</span>
        </div>

        {/* Data-Analysis Overlay Toggle */}
        <button
          onClick={onToggleOverlay}
          className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-all ${
            overlayActive 
              ? 'bg-nasa-cyan/20 text-nasa-cyan border border-nasa-cyan/40 shadow-sm'
              : 'bg-space-950 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle Python precomputed feature overlay"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Data-Analysis Overlay: {overlayActive ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-space-950 flex items-center justify-center overflow-hidden">
        
        {/* HTML5 Video Element */}
        {!videoError ? (
          <video
            ref={videoRef}
            src={station.videoUrl}
            poster={station.thumbnail}
            className="w-full h-full object-cover"
            playsInline
            muted
            loop
            onTimeUpdate={handleTimeUpdate}
            onError={() => setVideoError(true)}
          />
        ) : (
          <img 
            src={station.thumbnail} 
            alt={station.title} 
            className="w-full h-full object-cover" 
          />
        )}

        {/* Data-Analysis Overlay (Precomputed Spatial Annotations) */}
        {overlayActive && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300">
            {/* Target Reticle Crosshairs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-nasa-cyan/25 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-nasa-cyan/70 animate-ping" />
              <div className="w-full h-[1px] bg-nasa-cyan/20 absolute" />
              <div className="h-full w-[1px] bg-nasa-cyan/20 absolute" />
            </div>

            {/* Corner Bracket Accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-nasa-cyan/60" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-nasa-cyan/60" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-nasa-cyan/60" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-nasa-cyan/60" />

            {/* Overlay Telemetry Badges */}
            <div className="absolute top-4 left-12 bg-space-950/85 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700/80 text-[10px] font-mono text-nasa-cyan flex items-center gap-1.5">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>DATA-ANALYSIS OVERLAY [PRECOMPUTED BY PYTHON]</span>
            </div>

            <div className="absolute bottom-4 right-12 bg-space-950/85 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700/80 text-[10px] font-mono text-slate-300">
              TIME-LOCK: {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        )}

        {/* Center Big Play Button if Paused */}
        {!isPlaying && (
          <button
            onClick={onPlayPause}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-nasa-cyan/90 hover:bg-nasa-cyan text-space-950 flex items-center justify-center shadow-glow-cyan transition-all transform hover:scale-110 active:scale-95 z-20 cursor-pointer"
            aria-label="Play NASA Video Visualization"
          >
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Embedded Progress Bar */}
      <div 
        className="w-full h-2 bg-space-900 cursor-pointer relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          onSeek(pos * duration);
        }}
        role="progressbar"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
      >
        <div 
          className="h-full bg-gradient-to-r from-nasa-blue via-nasa-cyan to-teal-300 relative"
          style={{ width: `${Math.min(100, (currentTime / duration) * 100)}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transform translate-x-1.5" />
        </div>
      </div>
    </div>
  );
}
