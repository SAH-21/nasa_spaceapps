import React from 'react';
import Hero from '../components/Hero';
import StationSelector from '../components/StationSelector';
import { 
  Sliders, 
  Layers, 
  Cpu, 
  Volume2, 
  Radio, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Clock, 
  Music2, 
  Workflow, 
  ExternalLink 
} from 'lucide-react';
import { NASA_CHALLENGE_INFO } from '../data/stations';

export default function Home({ 
  stations, 
  selectedStation, 
  onSelectStation, 
  onLaunchJukebox 
}) {
  return (
    <div className="min-h-screen bg-space-900">
      
      {/* 1. Hero Section */}
      <Hero 
        onLaunchJukebox={onLaunchJukebox} 
        onSelectStation={onSelectStation} 
      />

      {/* 2. Station Selector (All 10 Official NASA SVS Stations) */}
      <StationSelector
        stations={stations}
        selectedStation={selectedStation}
        onSelectStation={(stn) => {
          onSelectStation(stn);
        }}
      />

      {/* 3. Comprehensive Sonification Voice Mapping Table */}
      <section id="sonification-mapping" className="py-16 bg-space-850/80 border-t border-b border-space-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-2 text-xs font-mono text-earth-cyan mb-2">
              <Music2 className="w-4 h-4" />
              <span>DATA-TO-SOUND VOICES FORMULATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Scientific Voice Mapping Matrix
            </h2>
            <p className="text-sm text-slate-300 font-sans mt-2 leading-relaxed">
              Transforming 10 official NASA SVS visual models and satellite observation datasets into intuitive acoustic voices.
            </p>
            <div className="mt-4 p-3.5 rounded-xl bg-nasa-blue/25 border border-earth-cyan/40 text-xs text-cyan-200 font-mono flex items-center gap-2.5">
              <Info className="w-4 h-4 flex-shrink-0 text-earth-cyan" />
              <span><strong>Note:</strong> These acoustic voice assignments are our team's chosen artistic and physical mappings for the 2026 NASA Space Apps Challenge.</span>
            </div>
          </div>

          {/* 10-Station Full Voice Mapping Table */}
          <div className="rounded-2xl overflow-hidden border border-space-700 bg-space-950 shadow-2xl mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead className="bg-space-900 text-xs font-mono uppercase text-slate-400 border-b border-space-700">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-bold text-white">SVS Source & Dataset</th>
                    <th scope="col" className="px-5 py-4 font-bold text-earth-cyan">Acoustic Voice Mapping</th>
                    <th scope="col" className="px-5 py-4 font-bold text-slate-300 hidden md:table-cell">Sonification Synthesis Details</th>
                    <th scope="col" className="px-5 py-4 font-bold text-slate-300">Official Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-800 text-xs font-mono">
                  {stations.map((stn) => (
                    <tr key={stn.id} className="hover:bg-space-900/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stn.accentColor }} />
                          <span className="text-earth-cyan font-bold">{stn.svsId}:</span>
                          <span className="font-sans text-slate-200">{stn.shortName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-earth-teal font-semibold">
                        {stn.voiceName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 font-sans hidden md:table-cell">
                        {stn.sonificationApproach}
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={stn.svsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-space-900 border border-space-700 text-slate-300 hover:text-earth-cyan hover:border-earth-cyan transition-colors"
                        >
                          <span>{stn.svsId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Launch Jukebox Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-space-850 via-space-800 to-space-850 border border-space-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-xs font-mono text-earth-cyan uppercase tracking-wider font-bold">
                Interactive Multi-Track Station
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
                Enter the Earth Jukebox Workstation
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1 max-w-xl">
                Experience synchronized NASA SVS video playback, precomputed Python data-analysis overlays, multi-track stem mixing, and real-time audio telemetry.
              </p>
            </div>

            <button
              onClick={onLaunchJukebox}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-earth-cyan via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-space-950 font-display font-extrabold text-base shadow-glow-cyan transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 flex-shrink-0 cursor-pointer"
            >
              <Radio className="w-5 h-5 text-space-950" />
              <span>Launch Jukebox Workstation</span>
              <ArrowRight className="w-4 h-4 text-space-950" />
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-space-950 border-t border-space-700/80 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">EARTHSONIC</span>
            <span>•</span>
            <span>NASA Space Apps Challenge 2026</span>
          </div>
          <div className="text-slate-400">
            Code Freeze Deadline: <span className="text-earth-amber font-semibold">{NASA_CHALLENGE_INFO.codeFreeze}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
