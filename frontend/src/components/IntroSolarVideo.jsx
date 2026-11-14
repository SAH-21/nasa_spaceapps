import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Play, 
  Sparkles, 
  Compass, 
  Radio, 
  Globe 
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export default function IntroSolarVideo({ onCompleteStage1 }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const canvasRef = useRef(null);

  // 10-second countdown timer with auto-transition
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onCompleteStage1();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onCompleteStage1]);

  // Canvas Solar System Orbital Simulation Fallback
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Starfield particles
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.03 + 0.01
    }));

    // Orbit radii & speeds
    const orbits = [
      { name: 'Mercury', r: 70, speed: 2.4, color: '#94a3b8', size: 3 },
      { name: 'Venus', r: 110, speed: 1.8, color: '#f59e0b', size: 5 },
      { name: 'Earth', r: 160, speed: 1.2, color: '#00f0ff', size: 6.5, glow: true },
      { name: 'Mars', r: 210, speed: 0.95, color: '#ef4444', size: 4 },
      { name: 'Jupiter', r: 280, speed: 0.6, color: '#d97706', size: 11 },
      { name: 'Saturn', r: 360, speed: 0.45, color: '#fcd34d', size: 9, hasRing: true },
      { name: 'Uranus', r: 430, speed: 0.3, color: '#38bdf8', size: 6 },
      { name: 'Neptune', r: 490, speed: 0.22, color: '#2563eb', size: 6 }
    ];

    const render = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Twinkling Stars
      stars.forEach(s => {
        s.alpha += Math.sin(time * s.twinkleSpeed) * 0.01;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, s.alpha))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Camera dynamic zoom factor: zooms toward Earth over 10 seconds
      const zoomFactor = 1 + (10 - timeLeft) * 0.12;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoomFactor, zoomFactor);

      // Central Glowing Sun
      const sunGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 65);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.2, '#fef08a');
      sunGrad.addColorStop(0.5, '#f59e0b');
      sunGrad.addColorStop(0.8, '#ea580c');
      sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');

      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 65, 0, Math.PI * 2);
      ctx.fill();

      // Orbital Rings & Planets
      orbits.forEach(planet => {
        // Draw thin luminous ring
        ctx.strokeStyle = planet.glow ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = planet.glow ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.r, planet.r * 0.65, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Calculate planet position along inclined orbit
        const angle = time * planet.speed * 0.4 + planet.r;
        const px = Math.cos(angle) * planet.r;
        const py = Math.sin(angle) * planet.r * 0.65;

        // Draw planet
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(px, py, planet.size, 0, Math.PI * 2);
        ctx.fill();

        // Earth special cyan atmospheric rim-glow
        if (planet.glow) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, planet.size + 3, 0, Math.PI * 2);
          ctx.stroke();

          // Target callout label
          ctx.fillStyle = '#00f0ff';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText('TARGET: EARTH', px + 12, py - 6);
        }

        // Saturn ring
        if (planet.hasRing) {
          ctx.strokeStyle = 'rgba(252, 211, 77, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(px, py, planet.size * 2, planet.size * 0.7, Math.PI / 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      ctx.restore();

      time += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [timeLeft]);

  // Web Audio ambient space drone warm-up
  const handleUserInteract = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      audioEngine.startSpaceDrone();
    }
  };

  const handleSkip = () => {
    audioEngine.startSpaceDrone();
    onCompleteStage1();
  };

  return (
    <div 
      onClick={handleUserInteract}
      className="fixed inset-0 z-50 bg-[#030712] overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none cursor-pointer"
    >
      {/* Background Solar System Video with Canvas Fallback */}
      <video
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none hidden"
        src="/opening_solar_system.mp4"
      />

      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none" 
      />

      {/* Vignette & Ambient Radial Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/40 to-[#030712]/90 pointer-events-none" />

      {/* Top Header Bar (HUD Style) */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-space-900/90 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center gap-2">
            <Radio className="w-5 h-5 animate-pulse text-[#00f0ff]" />
            <span className="font-display font-extrabold text-sm sm:text-base tracking-widest text-white">
              NASA EIC // STAGE 01
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-space-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span>SOLAR SYSTEM TRAJECTORY LOCK</span>
          </div>
        </div>

        {/* Top-Right Skip Intro Button with Countdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              APPROACH COUNTDOWN
            </span>
            <span className="text-sm font-mono font-bold text-[#00f0ff]">
              T-{timeLeft.toString().padStart(2, '0')}s
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="px-4 py-2.5 rounded-xl bg-space-900/90 hover:bg-space-800 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white font-mono text-xs tracking-wider transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Title & Prompt */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-5 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>2026 NASA SPACE APPS CHALLENGE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight text-white drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          THE EARTH INFORMATION{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#14b8a6] to-[#f59e0b]">
            JUKEBOX
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-mono max-w-xl mx-auto leading-relaxed">
          Approaching the third planet from the Sun. Translating multi-spectral planetary observation data into real-time multi-track audio sonification.
        </p>

        {/* Enter CTA / Audio Unlock Button */}
        <div className="pt-4">
          <button
            onClick={handleSkip}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-teal-400 to-[#14b8a6] hover:from-cyan-300 hover:to-teal-300 text-space-950 font-display font-extrabold text-sm sm:text-base tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto cursor-pointer"
          >
            <Globe className="w-5 h-5 text-space-950" />
            <span>Enter the Earth Jukebox</span>
            <ArrowRight className="w-4 h-4 text-space-950" />
          </button>

          <span className="text-[11px] font-mono text-slate-500 block mt-2.5">
            Auto-advancing in {timeLeft} seconds • Click anywhere to enable Web Audio
          </span>
        </div>
      </div>

      {/* Bottom Telemetry HUD Line */}
      <div className="relative z-10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-800/80 pt-4 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">MISSION: EIC-2026</span>
          <span>•</span>
          <span className="text-cyan-400">AUDIO ENGINE READY</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">OBSIDIAN DEEP-SPACE FIELD</span>
          <span className="text-cyan-400">[030712]</span>
        </div>
      </div>
    </div>
  );
}
