import React, { useState } from 'react';
import {
  Play,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  Zap,
  Moon,
  Wind,
  Trees,
  Waves,
  CloudRain,
  ExternalLink
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export default function StationCard({
  station,
  isSelected,
  onSelect
}) {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handleAudioPreview = (e) => {
    e.stopPropagation();
    setIsPlayingPreview(true);
    audioEngine.playStationPreview(station.id);
    audioEngine.speakStationInfo(station);
    setTimeout(() => setIsPlayingPreview(false), 900);
  };

  const accentBorder = isSelected
    ? 'border-[#DCD7CD] ring-2 ring-[#0B3D91]/80 bg-[#EFECE6] shadow-glow-cyan'
    : 'border-[#DCD7CD] hover:border-[#DCD7CD]/60 bg-[#EFECE6] hover:bg-[#EFECE6]/95';

  return (
    <div
      onClick={() => onSelect(station)}
      className={`relative rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-xl ${accentBorder}`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(station);
        }
      }}
    >
      <div>
        {/* Top Header: SVS ID + External SVS link + Preview Voice Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EFECE6]/95 text-[#D97706] border border-[#DCD7CD]/70">
              {station.svsId}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] text-[#71717A] border border-[#DCD7CD]">
              {station.voiceName ? station.voiceName.split(' ')[1] : 'Voice'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Direct Official SVS Link */}
            <a
              href={station.svsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-[#FAF9F6] text-[#71717A] hover:text-[#D97706] border border-[#DCD7CD] hover:border-[#DCD7CD] transition-colors"
              title={`View ${station.svsId} on NASA SVS`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Audition Voice Button */}
            <button
              onClick={handleAudioPreview}
              title={`Audition voice for ${station.title}`}
              className={`p-1.5 rounded-lg border transition-all ${
                isPlayingPreview
                  ? 'bg-[#EFECE6] text-[#18181B] border-[#DCD7CD] shadow-glow-cyan'
                  : 'bg-[#FAF9F6] text-[#71717A] border-[#DCD7CD] hover:text-[#18181B] hover:border-[#DCD7CD]'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingPreview ? 'animate-bounce' : ''}`} />
            </button>
          </div>
        </div>

        {/* Thumbnail Image Viewport */}
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-[#EFECE6] border border-[#DCD7CD]">
          <img
            src={station.thumbnail}
            alt={station.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9] via-[#FAF9F6]/30 to-transparent" />

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-[#18181B] bg-[#FAF9F6]/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#DCD7CD] truncate max-w-[70%]">
              {station.category}
            </span>

            {isSelected && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-[#D97706] bg-[#FAF9F6]/95 px-2 py-1 rounded border border-[#DCD7CD]/80">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active
              </span>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-lg font-bold text-[#18181B] group-hover:text-[#D97706] transition-colors font-display">
          {station.title}
        </h3>
        <p className="text-xs text-[#D97706] font-mono mt-0.5 mb-2.5 font-medium">
          {station.voiceName}
        </p>

        <p className="text-xs text-[#71717A] font-sans line-clamp-3 leading-relaxed mb-4">
          {station.description}
        </p>

        {/* Sound Mapping Preview */}
        <div className="p-3 rounded-xl bg-[#FAF9F6]/95 border border-[#DCD7CD]/80 space-y-1 mb-4 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#71717A] font-mono text-[10px] uppercase">Acoustic Mapping:</span>
            <span className="text-[#D97706] font-mono text-[11px] font-semibold truncate max-w-[60%] text-right">
              {station.soundMapping[0]?.sound || 'Pentatonic Harmonics'}
            </span>
          </div>
        </div>
      </div>

      {/* Select / Load Action Button */}
      <div className="pt-2">
        <button
          onClick={() => onSelect(station)}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
            isSelected
              ? 'bg-[#EFECE6] text-[#18181B] shadow-glow-cyan'
              : 'bg-[#EFECE6] hover:bg-[#EFECE6] text-[#18181B] border border-[#DCD7CD] hover:border-[#DCD7CD]'
          }`}
        >
          <span>{isSelected ? 'Loaded in Jukebox Workstation' : 'Load into Jukebox'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
