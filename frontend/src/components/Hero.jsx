import React, { useState } from 'react';
import { 
  Play, 
  Volume2, 
  Radio, 
  Layers, 
  Activity, 
  ArrowRight, 
  Clock, 
  Sliders, 
  Globe2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { NASA_CHALLENGE_INFO } from '../data/stations';
import { audioEngine } from '../services/audioEngine';

export default function Hero({ onLaunchJukebox, onSelectStation }) {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const handleAuditoryDemo = () => {
    setIsPlayingDemo(true);
    audioEngine.playStationPreview('svs-4950');
    setTimeout(() => setIsPlayingDemo(false), 900);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-space-700/80 bg-telemetry-grid">
      {/* Ambient Radial Nebulae Backlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-nasa-blue/25 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[340px] h-[340px] bg-earth-cyan/15 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[280px] h-[280px] bg-earth-emerald/10 rounded-full blur-[90px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Challenge & Code Freeze Notice Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-5 rounded-2xl bg-space-850/90 border border-space-700/80 shadow-xl backdrop-blur-md mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-earth-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-earth-emerald"></span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-200">
              {NASA_CHALLENGE_INFO.edition}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-earth-cyan font-mono font-medium hidden sm:inline">
              10 Official NASA SVS Sources
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-earth-amber bg-earth-amber/10 px-3 py-1 rounded-lg border border-earth-amber/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Freeze: {NASA_CHALLENGE_INFO.codeFreeze}</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nasa-blue/30 border border-earth-cyan/40 text-earth-cyan text-xs font-mono tracking-wider shadow-glow-cyan">
            <Activity className="w-3.5 h-3.5 animate-pulse text-earth-cyan" />
            <span>NASA SCIENTIFIC SATELLITE SONIFICATION SYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display">
            Listen to the Pulse of{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-earth-cyan via-teal-300 to-earth-emerald">
              Our Living Earth
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 font-sans max-w-3xl mx-auto leading-relaxed">
            EARTHSONIC translates 10 official NASA Scientific Visualization Studio (SVS) video models into synchronized, multi-track acoustic compositions. Explore 3D forest canopies, atmospheric rivers, orbital lightning, decadal CO2 respiration, and ocean currents.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onLaunchJukebox}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-earth-cyan via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-space-950 font-display font-extrabold text-base shadow-glow-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 cursor-pointer"
            >
              <Radio className="w-5 h-5 text-space-950" />
              <span>Launch Earth Jukebox</span>
              <ArrowRight className="w-4 h-4 text-space-950" />
            </button>

            <button
              onClick={handleAuditoryDemo}
              className={`px-6 py-4 rounded-2xl bg-space-850 hover:bg-space-800 text-slate-100 border border-space-700 hover:border-earth-cyan/60 font-semibold text-base transition-all flex items-center gap-2.5 shadow-lg ${
                isPlayingDemo ? 'border-earth-cyan text-earth-cyan shadow-glow-cyan' : ''
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isPlayingDemo ? 'text-earth-cyan animate-bounce' : 'text-slate-300'}`} />
              <span>{isPlayingDemo ? 'Synthesizing Voices...' : 'Audition Voice Signature'}</span>
            </button>
          </div>

          {/* Telemetry Summary Pill Bar (Across SVS categories) */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left font-mono">
            <div className="p-3.5 rounded-xl bg-space-850/80 border border-space-700/80 shadow-md">
              <span className="text-[10px] text-slate-400 block uppercase">Canopy LiDAR</span>
              <span className="text-sm font-bold text-earth-emerald">SVS #4950 GEDI</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Voice 1 Harp & Woodwind</span>
            </div>

            <div className="p-3.5 rounded-xl bg-space-850/80 border border-space-700/80 shadow-md">
              <span className="text-[10px] text-slate-400 block uppercase">Vapor Rivers</span>
              <span className="text-sm font-bold text-earth-cyan">SVS #4960 MERRA-2</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Voice 2 Rain Pad Sweep</span>
            </div>

            <div className="p-3.5 rounded-xl bg-space-850/80 border border-space-700/80 shadow-md">
              <span className="text-[10px] text-slate-400 block uppercase">Orbital Lightning</span>
              <span className="text-sm font-bold text-earth-amber">SVS #5011 ISS-LIS</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Voice 3 Marimba Hits</span>
            </div>

            <div className="p-3.5 rounded-xl bg-space-850/80 border border-space-700/80 shadow-md">
              <span className="text-[10px] text-slate-400 block uppercase">Deep Ocean</span>
              <span className="text-sm font-bold text-sky-400">SVS #5425 ECCO2</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Voice 5 Stereo Strings</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
