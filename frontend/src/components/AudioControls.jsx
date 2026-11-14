import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Sliders, 
  Radio 
} from 'lucide-react';

export default function AudioControls({
  isPlaying,
  onPlayPause,
  onReset,
  currentTime,
  duration,
  masterVolume,
  onMasterVolumeChange,
  isMuted,
  onToggleMute,
  isLooping,
  onToggleLoop
}) {
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl bg-space-900 border border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      
      {/* Left: Playback Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPlayPause}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-nasa-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-space-950 flex items-center justify-center font-bold shadow-glow-cyan/50 transition-transform active:scale-95"
          aria-label={isPlaying ? 'Pause Audio and Video' : 'Play Audio and Video'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          )}
        </button>

        <button
          onClick={onReset}
          className="p-3 rounded-xl bg-space-850 hover:bg-space-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
          title="Restart Playback from Beginning"
          aria-label="Restart Playback"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleLoop}
          className={`p-3 rounded-xl border transition-all ${
            isLooping 
              ? 'bg-nasa-cyan/15 text-nasa-cyan border-nasa-cyan/50' 
              : 'bg-space-850 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
          title="Toggle Seamless Loop"
          aria-label="Toggle Loop"
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>

      {/* Middle: Digital Time Display */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 font-mono">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">SYNCHRONIZED TELEMETRY TIME</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-nasa-cyan tracking-wider">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-xs text-slate-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Master Volume Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-xl bg-space-850 hover:bg-space-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
          aria-label={isMuted ? 'Unmute Master' : 'Mute Master'}
        >
          {isMuted || masterVolume === 0 ? (
            <VolumeX className="w-5 h-5 text-nasa-red" />
          ) : (
            <Volume2 className="w-5 h-5 text-nasa-cyan" />
          )}
        </button>

        <div className="flex flex-col gap-1 w-28 sm:w-36">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>MASTER GAIN</span>
            <span className="text-slate-200 font-bold">{isMuted ? '0%' : `${masterVolume}%`}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : masterVolume}
            onChange={(e) => onMasterVolumeChange(Number(e.target.value))}
            className="w-full accent-nasa-cyan bg-space-950 h-1.5 rounded-lg cursor-pointer"
            aria-label="Master Volume Slider"
          />
        </div>
      </div>

    </div>
  );
}
