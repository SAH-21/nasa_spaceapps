import React from 'react';
import Hero from '../components/Hero';
import ScientificJukebox from '../components/ScientificJukebox';
import GuestSciencePreview from '../components/GuestSciencePreview';
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
  isAuthenticated = false,
  onRequestAuth,
  scienceStopSignal = 0,
  stations, 
  selectedStation, 
  onSelectStation, 
  onLaunchJukebox 
}) {
  return (
    <div className="editorial-home min-h-screen bg-[#FAF9F6]">
      
      {/* 1. Hero Section */}
      <Hero 
        onLaunchJukebox={onLaunchJukebox} 
        onSelectStation={onSelectStation} 
        canInteract={isAuthenticated}
        onRequireAuth={onRequestAuth}
      />

      {isAuthenticated ? (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ScientificJukebox stopSignal={scienceStopSignal} />
        </div>
      ) : (
        <GuestSciencePreview onRequestAuth={onRequestAuth} />
      )}

      {/* 2. Station Selector (All 10 Official NASA SVS Stations) */}
      <StationSelector
        stations={stations}
        selectedStation={selectedStation}
        onSelectStation={(stn) => {
          onSelectStation(stn);
        }}
      />

      {/* 3. Comprehensive Sonification Voice Mapping Table */}
      <section id="sonification-mapping" className="py-16 bg-[#EFECE6]/95 border-t border-b border-[#DCD7CD]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D97706] mb-2">
              <Music2 className="w-4 h-4" />
              <span>DATA-TO-SOUND VOICES FORMULATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18181B] font-display">
              Scientific Voice Mapping Matrix
            </h2>
            <p className="text-sm text-[#71717A] font-sans mt-2 leading-relaxed">
              Transforming 10 official NASA SVS visual models and satellite observation datasets into intuitive acoustic voices.
            </p>
            <div className="mt-4 p-3.5 rounded-xl bg-[#EFECE6]/95 border border-[#DCD7CD]/80 text-xs text-[#D97706] font-mono flex items-center gap-2.5">
              <Info className="w-4 h-4 flex-shrink-0 text-[#D97706]" />
              <span><strong>Note:</strong> These acoustic voice assignments are our team's chosen artistic and physical mappings for the 2026 NASA Space Apps Challenge.</span>
            </div>
          </div>

          {/* 10-Station Full Voice Mapping Table */}
          <div className="rounded-2xl overflow-hidden border border-[#DCD7CD] bg-[#EFECE6] shadow-2xl mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead className="bg-[#FAF9F6] text-xs font-mono uppercase text-[#71717A] border-b border-[#DCD7CD]">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-bold text-[#18181B]">SVS Source & Dataset</th>
                    <th scope="col" className="px-5 py-4 font-bold text-[#D97706]">Acoustic Voice Mapping</th>
                    <th scope="col" className="px-5 py-4 font-bold text-[#71717A] hidden md:table-cell">Sonification Synthesis Details</th>
                    <th scope="col" className="px-5 py-4 font-bold text-[#71717A]">Official Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD7CD] text-xs font-mono">
                  {stations.map((stn) => (
                    <tr key={stn.id} className="hover:bg-[#FAF9F6]/95 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#18181B]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stn.accentColor }} />
                          <span className="text-[#D97706] font-bold">{stn.svsId}:</span>
                          <span className="font-sans text-[#18181B]">{stn.shortName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#D97706] font-semibold">
                        {stn.voiceName}
                      </td>
                      <td className="px-5 py-3.5 text-[#71717A] font-sans hidden md:table-cell">
                        {stn.sonificationApproach}
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={stn.svsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#DCD7CD] text-[#71717A] hover:text-[#D97706] hover:border-[#DCD7CD] transition-colors"
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
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF9F6] to-[#EFECE6] border border-[#DCD7CD] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-xs font-mono text-[#D97706] uppercase tracking-wider font-bold">
                Interactive Multi-Track Station
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] mt-1 font-display">
                Enter the Earth Jukebox Workstation
              </h3>
              <p className="text-xs sm:text-sm text-[#71717A] font-sans mt-1 max-w-xl">
                Experience synchronized NASA SVS video playback, precomputed Python data-analysis overlays, multi-track stem mixing, and real-time audio telemetry.
              </p>
            </div>

            <button
              onClick={onLaunchJukebox}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF9F6] to-[#EFECE6] hover:from-[#FFFDF9] hover:to-[#EFECE6] text-[#18181B] font-display font-extrabold text-base shadow-glow-cyan transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 flex-shrink-0 cursor-pointer"
            >
              <Radio className="w-5 h-5 text-[#18181B]" />
              <span>Launch Jukebox Workstation</span>
              <ArrowRight className="w-4 h-4 text-[#18181B]" />
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#EFECE6] border-t border-[#DCD7CD]/80 text-center text-xs font-mono text-[#71717A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#18181B] font-bold">EARTHSONIC</span>
            <span>•</span>
            <span>NASA Space Apps Challenge 2026</span>
          </div>
          <div className="text-[#71717A]">
            Code Freeze Deadline: <span className="text-[#D97706] font-semibold">{NASA_CHALLENGE_INFO.codeFreeze}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
