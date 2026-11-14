import React from 'react';
import { 
  Eye, 
  Volume2, 
  Sliders, 
  Type, 
  Zap, 
  X, 
  Keyboard, 
  Check, 
  Info 
} from 'lucide-react';

export default function AccessibilityControls({
  isOpen,
  onClose,
  highContrast,
  setHighContrast,
  reducedMotion,
  setReducedMotion,
  fontSize,
  setFontSize,
  audioDescriptions,
  setAudioDescriptions
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-space-900/95 backdrop-blur-xl border-l border-slate-700/80 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200"
      role="dialog"
      aria-label="Accessibility Options"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-nasa-cyan/10 text-nasa-cyan border border-nasa-cyan/30">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Accessibility</h2>
            <p className="text-xs text-slate-400 font-mono">Sensory & Interface Tuning</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close accessibility panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {/* Contrast Toggle */}
        <div className="p-4 rounded-xl bg-space-850 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">High Contrast Mode</span>
              <span className="text-xs text-slate-400">Boosts border outlines & telemetry text contrast</span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              role="switch"
              aria-checked={highContrast}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                highContrast ? 'bg-nasa-cyan' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-space-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="p-4 rounded-xl bg-space-850 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">Reduced Motion</span>
              <span className="text-xs text-slate-400">Silences visual pulses and rapid waveform sweeps</span>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              role="switch"
              aria-checked={reducedMotion}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                reducedMotion ? 'bg-nasa-cyan' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-space-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Text Scaling */}
        <div className="p-4 rounded-xl bg-space-850 border border-slate-800">
          <label className="text-sm font-semibold text-white block mb-2 flex items-center gap-2">
            <Type className="w-4 h-4 text-nasa-amber" />
            <span>Telemetry Font Scale</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '100%', label: 'Default', size: '1rem' },
              { id: '115%', label: 'Large', size: '1.15rem' },
              { id: '130%', label: 'X-Large', size: '1.3rem' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setFontSize(opt.size)}
                className={`px-3 py-2 text-xs font-mono rounded-lg border text-center transition-all ${
                  fontSize === opt.size
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-nasa-cyan font-bold'
                    : 'bg-space-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {opt.label} ({opt.id})
              </button>
            ))}
          </div>
        </div>

        {/* Audio Spoken Description Cue */}
        <div className="p-4 rounded-xl bg-space-850 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-nasa-emerald" />
                <span>Audio Cues & Sonification Assist</span>
              </span>
              <span className="text-xs text-slate-400">Auditory clicks upon telemetry state changes</span>
            </div>
            <button
              onClick={() => setAudioDescriptions(!audioDescriptions)}
              role="switch"
              aria-checked={audioDescriptions}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                audioDescriptions ? 'bg-nasa-emerald' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-space-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  audioDescriptions ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="p-4 rounded-xl bg-space-850/80 border border-slate-800">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-slate-400" />
            <span>Keyboard Shortcuts</span>
          </h3>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex justify-between items-center">
              <span>Play / Pause</span>
              <kbd className="px-2 py-0.5 rounded bg-space-950 border border-slate-700 text-nasa-cyan">Space</kbd>
            </li>
            <li className="flex justify-between items-center">
              <span>Select Station 1, 2, 3</span>
              <kbd className="px-2 py-0.5 rounded bg-space-950 border border-slate-700 text-nasa-cyan">1 / 2 / 3</kbd>
            </li>
            <li className="flex justify-between items-center">
              <span>Mute / Unmute Master</span>
              <kbd className="px-2 py-0.5 rounded bg-space-950 border border-slate-700 text-nasa-cyan">M</kbd>
            </li>
            <li className="flex justify-between items-center">
              <span>Toggle Accessibility</span>
              <kbd className="px-2 py-0.5 rounded bg-space-950 border border-slate-700 text-nasa-cyan">A</kbd>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
