import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ 
  isPlaying = false, 
  color = '#00E5FF', 
  height = 64,
  barsCount = 32 
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      const barWidth = (width / barsCount) - 2;

      for (let i = 0; i < barsCount; i++) {
        let barHeight;
        if (isPlaying) {
          // Dynamic simulated frequency response
          const freq = Math.sin(phase + i * 0.25) * Math.cos(phase * 0.8 + i * 0.1);
          const noise = Math.sin(phase * 1.5 + i * 0.6) * 0.3;
          barHeight = Math.max(4, (Math.abs(freq) * 0.7 + Math.abs(noise) * 0.3) * (h * 0.85));
        } else {
          // Idle low resting telemetry pulse
          barHeight = 4 + Math.sin(phase * 0.2 + i * 0.3) * 2;
        }

        const x = i * (barWidth + 2);
        const y = h - barHeight;

        // Gradient from base to peak
        const grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, color);
        grad.addColorStop(1, `${color}22`);

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Top glow pip
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 2, barWidth, 2);
      }

      phase += isPlaying ? 0.08 : 0.02;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, color, barsCount]);

  return (
    <div className="w-full rounded-xl bg-space-950 p-3 border border-slate-800/80 shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-nasa-cyan animate-ping' : 'bg-slate-600'}`} />
          Acoustic Spectrum Telemetry
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          {isPlaying ? '64-BIN FFT ACTIVE' : 'IDLE / STANDBY'}
        </span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={height} 
        className="w-full h-16 block rounded"
      />
    </div>
  );
}
