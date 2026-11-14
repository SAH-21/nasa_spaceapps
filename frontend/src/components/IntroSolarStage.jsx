import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Radio, Sparkles, Globe } from 'lucide-react';
import { voicesEngine } from '../services/voicesEngine';

export default function IntroSolarStage({ onCompleteStage1 }) {
  const [timeLeft, setTimeLeft] = useState(10.0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const canvasRef = useRef(null);

  // 10.0s Automatic transition countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timer);
          onCompleteStage1();
          return 0;
        }
        return +(prev - 0.1).toFixed(1);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onCompleteStage1]);

  // Cosmic Choir Pad Audio Warm-up
  const handleUserInteract = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      voicesEngine.playChoirPad();
    }
  };

  const handleSkip = () => {
    voicesEngine.playChoirPad();
    onCompleteStage1();
  };

  // Canvas Solar System Orbital Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2
    }));

    const planets = [
      { name: 'Mercury', r: 75, speed: 2.2, color: '#94a3b8', size: 3 },
      { name: 'Venus', r: 115, speed: 1.6, color: '#f59e0b', size: 5 },
      { name: 'Earth', r: 165, speed: 1.1, color: '#00f0ff', size: 7, isTarget: true },
      { name: 'Mars', r: 215, speed: 0.85, color: '#ef4444', size: 4 },
      { name: 'Jupiter', r: 290, speed: 0.5, color: '#d97706', size: 12 },
      { name: 'Saturn', r: 370, speed: 0.38, color: '#fcd34d', size: 9 },
      { name: 'Uranus', r: 440, speed: 0.26, color: '#38bdf8', size: 6 },
      { name: 'Neptune', r: 500, speed: 0.18, color: '#2563eb', size: 6 }
    ];

    const render = () => {
      ctx.fillStyle = '#020409'; // Waterfall Black Backdrop
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Stars
      stars.forEach(s => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Camera dynamic zoom toward Earth
      const zoomFactor = 1 + (10 - timeLeft) * 0.15;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoomFactor, zoomFactor);

      // Glowing Sun
      const sunGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 70);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.2, '#fef08a');
      sunGrad.addColorStop(0.5, '#f59e0b');
      sunGrad.addColorStop(0.85, '#ea580c');
      sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.fill();

      // Orbits & Planets
      planets.forEach(p => {
        ctx.strokeStyle = p.isTarget ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = p.isTarget ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
        ctx.stroke();

        const angle = time * p.speed * 0.35 + p.r;
        const px = Math.cos(angle) * p.r;
        const py = Math.sin(angle) * p.r * 0.62;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.isTarget) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, p.size + 4, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#00f0ff';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText('TARGET: EARTH // SVS HUB', px + 14, py - 6);
        }
      });

      ctx.restore();

      time += 0.02;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [timeLeft]);

  return (
    <div 
      onClick={handleUserInteract}
      className="fixed inset-0 z-50 bg-[#020409] overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none cursor-pointer"
    >
      {/* Background Solar System Video with Canvas Fallback */}
      <video
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none hidden"
        src="/CAN_KART_pindown.io_1794653425.mp4"
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-waterfall-900/90 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center gap-2">
            <Radio className="w-5 h-5 animate-pulse text-[#00f0ff]" />
            <span className="font-display font-extrabold text-xs sm:text-sm tracking-hud uppercase text-white">
              STAGE 01 // SOLAR ZOOM
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono tabular-nums text-slate-400 bg-[#060a14]/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span>WATERFALL BLACK [020409]</span>
          </div>
        </div>

        {/* Skip Button */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              TRANSITION
            </span>
            <span className="text-sm font-mono tabular-nums font-bold text-[#00f0ff]">
              T-{timeLeft.toFixed(1)}s
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="px-4 py-2.5 rounded-xl bg-[#060a14]/90 hover:bg-[#0a1020] border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white font-mono text-xs tracking-wider transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
          >
            <span>Skip Intro →</span>
          </button>
        </div>
      </div>

      {/* Center Cinematic Title */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-5 my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>2026 NASA SPACE APPS CHALLENGE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-hud uppercase text-white drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          THE EARTH INFORMATION{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#14b8a6] to-[#f59e0b]">
            JUKEBOX
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
          Translating 10 Official NASA SVS visual models and multi-spectral satellite observations into real-time multi-track audio sonification.
        </p>

        <div className="pt-4">
          <button
            onClick={handleSkip}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-teal-400 to-[#14b8a6] hover:from-cyan-300 hover:to-teal-300 text-waterfall-950 font-display font-extrabold text-sm sm:text-base tracking-hud uppercase shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto cursor-pointer"
          >
            <Globe className="w-5 h-5 text-waterfall-950" />
            <span>Enter the Earth Jukebox</span>
            <ArrowRight className="w-4 h-4 text-waterfall-950" />
          </button>

          <span className="text-[11px] font-mono tabular-nums text-slate-500 block mt-2.5">
            Auto-advancing at 10.0s • Cosmic choir pad active
          </span>
        </div>
      </div>

      {/* Footer Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-800/80 pt-4 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">10 NASA SVS SOURCES READY</span>
          <span>•</span>
          <span className="text-cyan-400">VOICES ENGINE INITIALIZED</span>
        </div>

        <div className="text-slate-400">
          CAN_KART_pindown.io_1794653425.mp4
        </div>
      </div>
    </div>
  );
}
