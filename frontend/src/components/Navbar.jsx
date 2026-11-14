import React from 'react';
import { 
  Radio, 
  Volume2, 
  Sliders, 
  Eye, 
  Info, 
  Sparkles,
  ExternalLink,
  Disc3,
  Globe2
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  onNavigate, 
  onToggleAccessibility, 
  isAccessibilityOpen,
  selectedStation
}) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-space-900/90 border-b border-space-700/80 transition-colors shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & NASA Mission Tag */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group text-left focus:outline-none focus:ring-2 focus:ring-earth-cyan rounded-lg p-1"
              aria-label="EARTHSONIC Home"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-nasa-blue via-space-850 to-space-950 border border-earth-cyan/40 shadow-glow-cyan transition-transform group-hover:scale-105">
                <Globe2 className="w-6 h-6 text-earth-cyan animate-[spin_20s_linear_infinite]" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-earth-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-earth-cyan"></span>
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-earth-cyan">
                    EARTHSONIC
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-nasa-blue/40 text-cyan-300 border border-earth-cyan/40 font-semibold tracking-wider">
                    NASA 2026
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300 tracking-wide hidden sm:block">
                  The Earth Information Jukebox • 10 NASA SVS Sources
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'home'
                  ? 'text-earth-cyan bg-earth-cyan/15 border border-earth-cyan/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-space-800'
              }`}
            >
              <span>Explore Overview</span>
            </button>

            <button
              onClick={() => onNavigate('jukebox')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                currentView === 'jukebox'
                  ? 'text-space-950 bg-gradient-to-r from-earth-cyan to-teal-300 shadow-glow-cyan font-bold'
                  : 'text-white bg-space-850 hover:bg-space-800 border border-space-700/80 shadow-md'
              }`}
            >
              <Radio className={`w-4 h-4 ${currentView === 'jukebox' ? 'text-space-950 animate-pulse' : 'text-earth-cyan'}`} />
              <span>Jukebox</span>
              {selectedStation && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border hidden md:inline-block ${
                  currentView === 'jukebox' 
                    ? 'bg-black/25 text-space-950 border-black/30 font-bold' 
                    : 'bg-space-900 text-earth-cyan border-space-700'
                }`}>
                  {selectedStation.svsId || selectedStation.shortName}
                </span>
              )}
            </button>

            <a
              href="#stations"
              onClick={() => currentView !== 'home' && onNavigate('home')}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-space-800 transition-all hidden lg:flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-earth-amber" />
              <span>10 SVS Stations</span>
            </a>

            <a
              href="#sonification-mapping"
              onClick={() => currentView !== 'home' && onNavigate('home')}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-space-800 transition-all hidden md:flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Voice Mappings</span>
            </a>

            {/* Accessibility Drawer Toggle */}
            <button
              onClick={onToggleAccessibility}
              aria-label="Toggle Accessibility Panel"
              className={`p-2.5 rounded-xl border transition-all ${
                isAccessibilityOpen
                  ? 'bg-earth-cyan/20 text-earth-cyan border-earth-cyan shadow-glow-cyan'
                  : 'bg-space-850 text-slate-300 border-space-700 hover:text-white hover:border-slate-500'
              }`}
              title="Accessibility & Spoken Voice Controls"
            >
              <Eye className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
