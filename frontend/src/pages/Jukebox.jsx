import React, { useState, useEffect } from 'react';
import EarthVideoPlayer from '../components/EarthVideoPlayer';
import AudioControls from '../components/AudioControls';
import TrackMixer from '../components/TrackMixer';
import AudioVisualizer from '../components/AudioVisualizer';
import Timeline from '../components/Timeline';
import { STATIONS } from '../data/stations';
import { dataService } from '../services/dataService';
import { audioEngine } from '../services/audioEngine';
import { 
  Radio, 
  Info, 
  Sliders, 
  Layers, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  Volume2,
  VolumeX,
  Activity,
  Globe2,
  Cpu,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function Jukebox({ 
  selectedStation, 
  onSelectStation, 
  onBackToHome 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45.0);
  const [masterVolume, setMasterVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [overlayActive, setOverlayActive] = useState(true);
  const [timelineData, setTimelineData] = useState(null);
  const [speechActive, setSpeechActive] = useState(true);

  // EarthPulse FastAPI backend integration state
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'standby' | 'checking'
  const [earthPulseData, setEarthPulseData] = useState(null);
  const [isSyncingBackend, setIsSyncingBackend] = useState(false);

  // Initialize track states dynamically from the active station's tracks
  const [tracksState, setTracksState] = useState(() => {
    const initial = {};
    selectedStation.tracks.forEach(tr => {
      initial[tr.id] = { volume: tr.defaultVolume, muted: false };
    });
    return initial;
  });

  // Check EarthPulse FastAPI backend connection on mount & load sonification data
  useEffect(() => {
    let mounted = true;

    async function initBackend() {
      const health = await dataService.checkBackendHealth(backendUrl);
      if (!mounted) return;

      if (health.online) {
        setBackendStatus('online');
      } else {
        setBackendStatus('standby');
      }

      const sonification = await dataService.fetchEarthPulseSonification(backendUrl);
      if (mounted) {
        setEarthPulseData(sonification);
      }
    }

    initBackend();

    return () => {
      mounted = false;
    };
  }, [backendUrl]);

  // When station changes, update tracks and load timeline
  useEffect(() => {
    let mounted = true;
    dataService.loadTimeline(selectedStation.id).then(data => {
      if (mounted) {
        setTimelineData(data);
        if (data.duration) setDuration(data.duration);
      }
    });

    const newTrackState = {};
    selectedStation.tracks.forEach(tr => {
      newTrackState[tr.id] = { volume: tr.defaultVolume, muted: false };
    });
    setTracksState(newTrackState);
    setCurrentTime(0);

    return () => {
      mounted = false;
    };
  }, [selectedStation.id]);

  // Real-time audio frequency stream modulation during playback
  useEffect(() => {
    if (isPlaying && earthPulseData?.frequencies?.length) {
      const sampleIndex = Math.floor((currentTime / duration) * (earthPulseData.sample_count || 100)) % 100;
      const freq = earthPulseData.frequencies[sampleIndex] || 440;
      const brightness = earthPulseData.brightness[sampleIndex] || 0.5;
      audioEngine.playEarthPulseFrame(freq, brightness);
    } else {
      audioEngine.stopEarthPulse();
    }
  }, [isPlaying, currentTime, duration, earthPulseData]);

  useEffect(() => {
    audioEngine.setMasterVolume(isMuted ? 0 : masterVolume / 100);
  }, [masterVolume, isMuted]);

  const handlePlayPause = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      audioEngine.init();
      audioEngine.resume();
      if (speechActive) {
        audioEngine.speakStationInfo(selectedStation);
      }
    } else {
      audioEngine.stopEarthPulse();
    }
  };

  const handleReset = () => {
    setCurrentTime(0);
    audioEngine.stopEarthPulse();
  };

  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
  };

  const handleToggleTrackMute = (trackId) => {
    setTracksState(prev => {
      const current = prev[trackId] || { volume: 75, muted: false };
      const nextMuted = !current.muted;
      audioEngine.setTrackVolume(trackId, nextMuted ? 0 : current.volume / 100);
      return {
        ...prev,
        [trackId]: { ...current, muted: nextMuted }
      };
    });
  };

  const handleTrackVolumeChange = (trackId, newVol) => {
    setTracksState(prev => {
      const current = prev[trackId] || { volume: 75, muted: false };
      audioEngine.setTrackVolume(trackId, current.muted ? 0 : newVol / 100);
      return {
        ...prev,
        [trackId]: { ...current, volume: newVol }
      };
    });
  };

  // Re-fetch live data from FastAPI backend endpoint /api/sonification
  const handleSyncBackend = async () => {
    setIsSyncingBackend(true);
    const health = await dataService.checkBackendHealth(backendUrl);
    setBackendStatus(health.online ? 'online' : 'standby');

    const sonification = await dataService.fetchEarthPulseSonification(backendUrl);
    setEarthPulseData(sonification);
    setIsSyncingBackend(false);

    if (speechActive) {
      audioEngine.speakText(
        health.online
          ? `Connected to EarthPulse FastAPI backend. Received 100 normalized brightness values and frequencies between 180 and 760 Hertz.`
          : `EarthPulse backend is in calibrated standby mode. Sonification engine ready.`
      );
    }
  };

  // Compute live sample indices for display
  const currentSampleIdx = Math.floor((currentTime / duration) * (earthPulseData?.sample_count || 100)) % 100;
  const currentHz = earthPulseData?.frequencies?.[currentSampleIdx] || 440;
  const currentB = earthPulseData?.brightness?.[currentSampleIdx] || 0.5;

  return (
    <div className="min-h-screen py-8 bg-space-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Station Switcher Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-space-850 border border-space-700 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2.5 rounded-xl bg-space-900 hover:bg-space-800 text-slate-300 hover:text-white border border-space-700 transition-colors flex items-center gap-1.5 text-xs font-mono font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Overview</span>
            </button>

            <div className="h-6 w-[1px] bg-space-700 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-earth-cyan uppercase">
                  {selectedStation.svsId}:
                </span>
                <span className="text-sm font-bold text-white font-display">
                  {selectedStation.title}
                </span>
                <a
                  href={selectedStation.svsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded bg-space-900 text-slate-400 hover:text-earth-cyan border border-space-700 transition-colors"
                  title="View Official SVS Page"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] font-sans text-earth-teal font-medium">
                {selectedStation.voiceName} • {selectedStation.displayMode}
              </p>
            </div>
          </div>

          {/* Quick Voiceover Guide Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !speechActive;
                setSpeechActive(next);
                audioEngine.toggleSpeech(next);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                speechActive 
                  ? 'bg-earth-emerald/20 text-earth-emerald border-earth-emerald/40' 
                  : 'bg-space-900 text-slate-400 border-space-700'
              }`}
              title="NASA Spoken Voiceover Guide for Telemetry & Alerts"
            >
              {speechActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>NASA Voiceover: {speechActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* 10 SVS Stations Scrollable Pill Switcher Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {STATIONS.map(stn => {
            const isActive = stn.id === selectedStation.id;
            return (
              <button
                key={stn.id}
                onClick={() => onSelectStation(stn)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-earth-cyan text-space-950 font-bold border-earth-cyan shadow-glow-cyan'
                    : 'bg-space-850 text-slate-300 hover:text-white hover:bg-space-800 border-space-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-space-950' : 'bg-earth-cyan'}`} />
                <span>{stn.svsId}: {stn.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Live EarthPulse FastAPI Backend Connection Banner */}
        <div className="p-4 rounded-2xl bg-space-850/90 border border-space-700 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
              backendStatus === 'online' 
                ? 'bg-earth-emerald/20 text-earth-emerald border-earth-emerald/40' 
                : 'bg-earth-amber/20 text-earth-amber border-earth-amber/40'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  EarthPulse Backend:
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  backendStatus === 'online'
                    ? 'bg-earth-emerald/20 text-earth-emerald border-earth-emerald/40'
                    : 'bg-earth-amber/20 text-earth-amber border-earth-amber/40'
                }`}>
                  {backendStatus === 'online' ? 'GET /api/sonification ONLINE' : 'STANDBY (Calibrated 100-pt Sonification)'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                FastAPI Pillow Image Scanner • 100 Normalized Brightness & Frequencies (180 – 760 Hz)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Readout Values */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono bg-space-900 px-3 py-1.5 rounded-xl border border-space-700">
              <span className="text-slate-400">
                PT #{currentSampleIdx + 1}: <strong className="text-earth-cyan font-bold">{currentHz} Hz</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">
                BRIGHTNESS: <strong className="text-earth-amber font-bold">{currentB}</strong>
              </span>
            </div>

            <button
              onClick={handleSyncBackend}
              disabled={isSyncingBackend}
              className="px-3.5 py-2 rounded-xl bg-space-900 hover:bg-space-800 text-slate-200 border border-space-700 hover:border-earth-cyan text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
              title="Poll GET /api/health and /api/sonification"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-earth-cyan ${isSyncingBackend ? 'animate-spin' : ''}`} />
              <span>{isSyncingBackend ? 'Polling...' : 'Sync Backend'}</span>
            </button>
          </div>
        </div>

        {/* Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: NASA Video Player + Synchronized Timeline (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <EarthVideoPlayer
              station={selectedStation}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              overlayActive={overlayActive}
              onToggleOverlay={() => setOverlayActive(!overlayActive)}
            />

            <Timeline
              station={selectedStation}
              timelineData={timelineData}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />

            <AudioControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              currentTime={currentTime}
              duration={duration}
              masterVolume={masterVolume}
              onMasterVolumeChange={setMasterVolume}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              isLooping={isLooping}
              onToggleLoop={() => setIsLooping(!isLooping)}
            />

          </div>

          {/* Right Column: Audio Stem Mixer + Real-time Visualizer + Voice Mapping Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <AudioVisualizer
              isPlaying={isPlaying}
              color={selectedStation.accentColor}
              height={70}
              barsCount={32}
            />

            <TrackMixer
              station={selectedStation}
              tracksState={tracksState}
              onToggleTrackMute={handleToggleTrackMute}
              onTrackVolumeChange={handleTrackVolumeChange}
              isPlaying={isPlaying}
            />

            {/* Voice Mapping & NASA SVS Telemetry Info Card */}
            <div className="p-5 rounded-2xl bg-space-850 border border-space-700 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-space-700">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-earth-amber" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {selectedStation.voiceName}
                  </h4>
                </div>
                <a
                  href={selectedStation.svsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-earth-cyan flex items-center gap-1 hover:underline"
                >
                  <span>{selectedStation.svsId} Official Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {selectedStation.sonificationApproach}
              </p>

              <div className="space-y-1.5 pt-1">
                {selectedStation.soundMapping.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-space-900 border border-space-700/80">
                    <span className="text-slate-200 font-sans font-medium truncate max-w-[50%]">
                      {item.data}
                    </span>
                    <span className="text-earth-cyan font-mono text-[11px] font-bold truncate max-w-[48%] text-right">
                      {item.sound}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] font-mono text-slate-400 pt-1 flex justify-between">
                <span>Sensor: {selectedStation.telemetry.instrument || selectedStation.telemetry.platform}</span>
                <span className="text-earth-teal">EarthPulse Synchronized</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
