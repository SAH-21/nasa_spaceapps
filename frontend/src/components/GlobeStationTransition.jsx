import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  ArrowRight, 
  Volume2, 
  Layers, 
  Activity, 
  Sparkles, 
  Maximize2,
  Wind,
  Zap,
  Moon,
  Waves,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { NASA_EIC_STATIONS } from '../data/nasaMockData';
import { audioEngine } from '../services/audioEngine';

export default function GlobeStationTransition({ 
  onLaunchHUD, 
  selectedStation, 
  onSelectStation,
  onBackToStage1 
}) {
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [countdown, setCountdown] = useState(18);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const globeCanvasRef = useRef(null);

  const currentStation = NASA_EIC_STATIONS[activeStationIndex] || NASA_EIC_STATIONS[0];

  // 18-second guided tour countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto-advance to next station or launch HUD
          setActiveStationIndex(curr => (curr + 1) % NASA_EIC_STATIONS.length);
          return 18;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeStationIndex]);

  // Synchronize parent state
  useEffect(() => {
    onSelectStation(currentStation);
  }, [activeStationIndex, onSelectStation]);

  const handleSelectStation = (index) => {
    setActiveStationIndex(index);
    setCountdown(18);
    const stn = NASA_EIC_STATIONS[index];
    onSelectStation(stn);

    // Audio preview signature
    setIsPlayingPreview(true);
    if (stn.id === 'iss-lightning') {
      audioEngine.triggerLightningStrike(0.9);
    } else if (stn.id === 'geos-aerosols') {
      audioEngine.playRegionNote('C3');
    } else if (stn.id === 'night-lights') {
      audioEngine.playRegionNote('E4');
    } else {
      audioEngine.playRegionNote('G3');
    }
    setTimeout(() => setIsPlayingPreview(false), 900);
  };

  const getStationIcon = (id) => {
    switch (id) {
      case 'geos-aerosols':
        return <Wind className="w-4 h-4 text-[#00f0ff]" />;
      case 'iss-lightning':
        return <Zap className="w-4 h-4 text-[#f59e0b]" />;
      case 'night-lights':
        return <Moon className="w-4 h-4 text-[#10b981]" />;
      case 'ocean-currents':
        return <Waves className="w-4 h-4 text-[#38bdf8]" />;
      default:
        return <Activity className="w-4 h-4 text-[#00f0ff]" />;
    }
  };

  // 3D/2.5D Rotating Earth Centerpiece with Atmospheric Cyan Rim-Glow
  useEffect(() => {
    const canvas = globeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let rotation = 0;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) * 0.72;

      // 1. Deep Atmospheric Outer Glow
      const atmGlow = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.35);
      atmGlow.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      atmGlow.addColorStop(0.5, 'rgba(20, 184, 166, 0.15)');
      atmGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');

      ctx.fillStyle = atmGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base Earth Sphere (Deep Space Ocean Blues & Obsidian Shading)
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.35,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphereGrad.addColorStop(0, '#0f2744');
      sphereGrad.addColorStop(0.5, '#091526');
      sphereGrad.addColorStop(0.85, '#050c18');
      sphereGrad.addColorStop(1, '#02050b');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Simulated Rotating Continents & Geospatial Vectors
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Latitude lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        const yOffset = (lat / 90) * radius;
        const w = Math.sqrt(Math.max(0, radius * radius - yOffset * yOffset));
        ctx.beginPath();
        ctx.ellipse(cx, cy + yOffset, w, w * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines rotating
      for (let lon = 0; lon < 360; lon += 45) {
        const angle = ((lon + rotation) * Math.PI) / 180;
        const xOffset = Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.ellipse(cx + xOffset * 0.5, cy, Math.abs(xOffset), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Layer-specific particle overlays (Aerosol dust / Lightning flashes / Night lights)
      if (currentStation.id === 'geos-aerosols') {
        // Swirling Golden & Cyan Aerosol Plumes
        for (let i = 0; i < 35; i++) {
          const pAngle = ((i * 12 + rotation * 1.5) * Math.PI) / 180;
          const px = cx + Math.cos(pAngle) * (radius * 0.7);
          const py = cy + Math.sin(pAngle) * (radius * 0.45);
          ctx.fillStyle = i % 2 === 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(0, 240, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(px, py, 3 + (i % 3) * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (currentStation.id === 'iss-lightning') {
        // High-contrast Lightning Flashes
        for (let i = 0; i < 6; i++) {
          const lAngle = ((i * 60 + rotation * 2) * Math.PI) / 180;
          const lx = cx + Math.cos(lAngle) * (radius * 0.65);
          const ly = cy + Math.sin(lAngle) * (radius * 0.5);
          const flash = Math.random() > 0.4;
          if (flash) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(lx, ly, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      } else if (currentStation.id === 'night-lights') {
        // Urban Illumination City Clusters
        for (let i = 0; i < 40; i++) {
          const nAngle = ((i * 9 + rotation) * Math.PI) / 180;
          const nx = cx + Math.sin(nAngle) * (radius * 0.8);
          const ny = cy + Math.cos(nAngle * 0.6) * (radius * 0.6);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
          ctx.beginPath();
          ctx.arc(nx, ny, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // 4. Cyan Atmospheric Rim-Glow Outline
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Equatorial Telemetry Scan Ring
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.25, radius * 0.35, Math.PI / 12, 0, Math.PI * 2);
      ctx.stroke();

      rotation += 0.35;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [currentStation.id]);

  return (
    <div className="relative min-h-screen bg-[#030712] overflow-hidden flex flex-col justify-between p-4 sm:p-8 select-none">
      
      {/* Background Deep-Space Starfield & Giant Watermark Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
        <div className="text-center">
          <div className="text-xs sm:text-sm font-mono tracking-[0.35em] text-cyan-400/40 uppercase mb-2">
            EXPLORE NASA EIC SONIFICATION
          </div>
          <div className="text-6xl sm:text-9xl md:text-[14rem] font-extrabold font-display tracking-tighter text-white/[0.04] leading-none whitespace-nowrap">
            EARTH JUKEBOX
          </div>
        </div>
      </div>

      {/* Top Header Navigation */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToStage1}
            className="p-2 rounded-xl bg-space-900 border border-slate-800 text-slate-400 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
            title="Return to Solar System Overview"
          >
            <span>← Stage 01</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-white tracking-wider">
                EARTH JUKEBOX
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 font-bold">
                STAGE 02 // ORBITAL SELECTOR
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 hidden sm:block">
              Interactive 3D Planetary Station Dispatcher
            </p>
          </div>
        </div>

        {/* Guided Tour Countdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-space-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Guided Tour: <strong className="text-cyan-400 font-bold">{countdown}s</strong></span>
          </div>

          <button
            onClick={() => onLaunchHUD(currentStation)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-space-950 font-display font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>LAUNCH SONIFICATION HUD</span>
            <ArrowRight className="w-4 h-4 text-space-950" />
          </button>
        </div>
      </div>

      {/* Main Section: Center Globe + Right-Side Vertical Timeline Selector */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6">
        
        {/* Left / Center Area: Centerpiece Globe (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[500px]">
          <canvas 
            ref={globeCanvasRef} 
            className="w-full h-full max-h-[520px] max-w-[520px] aspect-square block cursor-grab active:cursor-grabbing" 
          />

          {/* Active Station Sub-Badge floating below Earth */}
          <div className="mt-4 px-4 py-2 rounded-2xl bg-space-950/90 backdrop-blur-md border border-slate-800 text-center shadow-xl">
            <div className="flex items-center justify-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              <span className="text-white font-bold">{currentStation.title}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400">{currentStation.metrics.sensorArray}</span>
            </div>
          </div>
        </div>

        {/* Right-Side: Vertical Timeline Selector (NASA Stations) (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>NASA EIC Jukebox Stations</span>
            </span>
            <span className="text-xs font-mono text-cyan-400">04 Stations Active</span>
          </div>

          {/* Vertical Node Timeline List */}
          <div className="space-y-3">
            {NASA_EIC_STATIONS.map((station, idx) => {
              const isActive = idx === activeStationIndex;
              return (
                <div
                  key={station.id}
                  onClick={() => handleSelectStation(idx)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? 'bg-space-900/95 border-cyan-400 ring-1 ring-cyan-400/40 shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                      : 'bg-space-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-space-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Node Number / Active Icon */}
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border font-mono font-bold text-xs transition-colors ${
                        isActive
                          ? 'bg-cyan-500/20 text-[#00f0ff] border-cyan-400'
                          : 'bg-space-950 text-slate-400 border-slate-800 group-hover:border-slate-700'
                      }`}
                    >
                      {isActive ? getStationIcon(station.id) : `0${station.index}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold font-display ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {station.shortName}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-space-950 text-slate-400 border border-slate-800">
                          {station.badge.split('//')[1]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {station.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Station Sleek Glassmorphic Preview Card */}
          <div className="p-5 rounded-2xl bg-space-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                {currentStation.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Resolution: {currentStation.metrics.globalResolution || currentStation.metrics.spatialResolution || currentStation.metrics.spatialFootprint}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStation.summary}
            </p>

            {/* Acoustic Stems Preview Bar */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Sonification Layer Distribution
              </span>
              <div className="flex h-2 rounded-full overflow-hidden bg-space-950 border border-slate-800">
                {currentStation.defaultLayers.map(layer => (
                  <div
                    key={layer.id}
                    style={{ width: `${layer.percentage}%`, backgroundColor: layer.color }}
                    title={`${layer.name}: ${layer.percentage}%`}
                  />
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => onLaunchHUD(currentStation)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] via-teal-400 to-[#14b8a6] hover:from-cyan-300 hover:to-teal-300 text-space-950 font-display font-bold text-xs tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>LAUNCH SONIFICATION HUD</span>
              <ArrowRight className="w-4 h-4 text-space-950" />
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Status Telemetry Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-800/80 pt-3 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">PLANETARY GRID: 3D SPHERICAL PROJECTION</span>
          <span>•</span>
          <span className="text-cyan-400">NASA EIC 2026</span>
        </div>

        <div className="text-slate-400">
          SELECT STATION NODE OR CLICK TO ZOOM INTO STAGE 03
        </div>
      </div>

    </div>
  );
}
