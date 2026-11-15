import React, { useState } from 'react';
import StationCard from './StationCard';
import { Radio, Layers, Sparkles, Filter } from 'lucide-react';

export default function StationSelector({ 
  stations, 
  selectedStation, 
  onSelectStation 
}) {
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All 10 SVS Stations' },
    { id: 'biosphere', label: 'Biosphere & Forest' },
    { id: 'atmosphere', label: 'Atmosphere & Lightning' },
    { id: 'ocean', label: 'Ocean & Hydrodynamics' },
    { id: 'urban', label: 'Urban & Astronomy' }
  ];

  const filteredStations = stations.filter(stn => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'biosphere') return stn.id.includes('4950') || stn.id.includes('5196');
    if (filterCategory === 'atmosphere') return stn.id.includes('4960') || stn.id.includes('5011') || stn.id.includes('5533') || stn.id.includes('5669');
    if (filterCategory === 'ocean') return stn.id.includes('5425') || stn.id.includes('3912');
    if (filterCategory === 'urban') return stn.id.includes('5313') || stn.id.includes('13786');
    return true;
  });

  return (
    <section id="stations" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D97706] mb-2">
              <Radio className="w-4 h-4" />
              <span>STATION DISPATCHER // 10 SVS SOURCES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18181B] font-display tracking-tight">
              Select Earth Observation Station
            </h2>
            <p className="text-sm text-[#71717A] font-sans mt-1 max-w-2xl">
              Audition and load any of the 10 official NASA SVS visual and video models into the Earth Information Jukebox. Each station features specialized acoustic voices and multi-track stems.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#EFECE6] p-1.5 rounded-2xl border border-[#DCD7CD]/80">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  filterCategory === cat.id
                    ? 'bg-[#EFECE6] text-[#18181B] font-bold shadow-glow-cyan'
                    : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#EFECE6]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Station Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isSelected={selectedStation?.id === station.id}
              onSelect={onSelectStation}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
