import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jukebox from './pages/Jukebox';
import AccessibilityControls from './components/AccessibilityControls';
import { STATIONS } from './data/stations';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'jukebox'
  const [selectedStation, setSelectedStation] = useState(STATIONS[0]);

  // Accessibility State
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState('1rem');
  const [audioDescriptions, setAudioDescriptions] = useState(true);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  // Apply root font-size variable
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontSize);
  }, [fontSize]);

  // Global Keyboard Navigation (Space, 1-9, M, A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= STATIONS.length) {
        setSelectedStation(STATIONS[num - 1]);
      } else if (e.key === 'a' || e.key === 'A') {
        setIsAccessibilityOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectStation = (station) => {
    setSelectedStation(station);
    if (audioDescriptions) {
      audioEngine.playStationPreview(station.id);
    }
  };

  const handleLaunchJukebox = () => {
    setCurrentView('jukebox');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div 
      className={`min-h-screen bg-space-900 text-slate-100 flex flex-col font-sans transition-colors ${
        highContrast ? 'high-contrast' : ''
      } ${reducedMotion ? 'reduced-motion' : ''}`}
    >
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }}
        onToggleAccessibility={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
        isAccessibilityOpen={isAccessibilityOpen}
        selectedStation={selectedStation}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'home' ? (
          <Home
            stations={STATIONS}
            selectedStation={selectedStation}
            onSelectStation={handleSelectStation}
            onLaunchJukebox={handleLaunchJukebox}
          />
        ) : (
          <Jukebox
            selectedStation={selectedStation}
            onSelectStation={handleSelectStation}
            onBackToHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Slide-out Accessibility Controls Drawer */}
      <AccessibilityControls
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        fontSize={fontSize}
        setFontSize={setFontSize}
        audioDescriptions={audioDescriptions}
        setAudioDescriptions={setAudioDescriptions}
      />
    </div>
  );
}
