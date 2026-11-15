import React, { useEffect, useRef, useState } from 'react';
import { Activity, Cloud, Loader2, Pause, Play, RefreshCw, Wind } from 'lucide-react';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/+$/, '');

const FIELDS = [
  { id: 'temperature_c', name: 'Temperature', unit: '°C', color: '#76e1f0', type: 'sine' },
  { id: 'relative_humidity_pct', name: 'Humidity', unit: '%', color: '#b4a7ff', type: 'triangle' },
  { id: 'wind_speed_mps', name: 'Wind speed', unit: 'm/s', color: '#6ee7b7', type: 'sine' }
];

function formatNumber(value, digits = 2) {
  return value === null || value === undefined ? 'Missing' : Number(value).toFixed(digits);
}

function linePoints(samples, field) {
  const paths = [];
  let current = [];
  samples.forEach((sample, index) => {
    const normalized = sample.sonification?.[field]?.normalized;
    if (normalized === null || normalized === undefined) {
      if (current.length) paths.push(current.join(' '));
      current = [];
      return;
    }
    const x = samples.length === 1 ? 400 : 18 + 764 * index / (samples.length - 1);
    const y = 150 - 128 * normalized;
    current.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  });
  if (current.length) paths.push(current.join(' '));
  return paths;
}

export default function NASAClimateLab() {
  const [latitude, setLatitude] = useState('21.1458');
  const [longitude, setLongitude] = useState('79.0882');
  const [start, setStart] = useState('2025-01-01');
  const [end, setEnd] = useState('2025-01-07');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const requestId = useRef(0);
  const playbackId = useRef(0);
  const contextRef = useRef(null);
  const timerRef = useRef(null);

  function stopPlayback() {
    playbackId.current += 1;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const context = contextRef.current;
    contextRef.current = null;
    if (context && context.state !== 'closed') {
      context.close().catch(() => {});
    }
    setPlaying(false);
  }

  useEffect(() => () => {
    requestId.current += 1;
    playbackId.current += 1;
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    if (contextRef.current && contextRef.current.state !== 'closed') {
      contextRef.current.close().catch(() => {});
    }
  }, []);

  async function loadData(event) {
    event.preventDefault();
    stopPlayback();
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    setData(null);
    const query = new URLSearchParams({
      latitude,
      longitude,
      start: start.replaceAll('-', ''),
      end: end.replaceAll('-', '')
    });
    try {
      const response = await fetch(`${API_BASE_URL}/api/science/climate?${query}`, { credentials: 'include' });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const message = typeof body?.detail === 'string'
          ? body.detail
          : `Climate data request failed (HTTP ${response.status})`;
        throw new Error(message);
      }
      if (id === requestId.current) setData(body);
    } catch (issue) {
      if (id === requestId.current) setError(issue.message || 'Failed to load NASA POWER climate data.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  async function togglePlayback() {
    if (playing) {
      stopPlayback();
      return;
    }
    const samples = data?.data?.samples || [];
    if (!samples.length) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setError('This browser does not support Web Audio.');
      return;
    }
    const id = ++playbackId.current;
    let context;
    try {
      context = new AudioContextClass();
      contextRef.current = context;
      await context.resume();
      if (id !== playbackId.current) return;
      const duration = 0.4;
      const startAt = context.currentTime + 0.06;
      samples.forEach((sample, day) => {
        FIELDS.forEach((field) => {
          const frequency = sample.sonification?.[field.id]?.frequency_hz;
          if (frequency === undefined || frequency === null) return;
          const begins = startAt + day * duration;
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = field.type;
          oscillator.frequency.setValueAtTime(frequency, begins);
          gain.gain.setValueAtTime(0.0001, begins);
          gain.gain.exponentialRampToValueAtTime(0.018, begins + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, begins + duration * 0.9);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(begins);
          oscillator.stop(begins + duration);
        });
      });
      setPlaying(true);
      timerRef.current = setTimeout(() => {
        if (playbackId.current === id) stopPlayback();
      }, (samples.length * duration + 0.35) * 1000);
    } catch (issue) {
      if (playbackId.current === id) {
        stopPlayback();
        setError(issue.message || 'Could not play climate tones.');
      }
    }
  }

  const samples = data?.data?.samples || [];

  return (
    <section className="rounded-2xl border border-[#325666] bg-gradient-to-br from-[#0e293a] to-[#0b1728] p-5 text-white sm:p-7" aria-label="NASA multi-layer climate lab">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-300">
            <Activity className="h-4 w-4" /> NASA POWER · MULTI-LAYER SCIENCE
          </div>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">Hear Temperature, Humidity & Wind Together</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Three genuine daily NASA POWER variables mapped to three generated sound layers. Missing data stays silent.
          </p>
        </div>
        <div className="flex gap-2 text-teal-300"><Cloud className="h-6 w-6" /><Wind className="h-6 w-6" /></div>
      </div>
      <form onSubmit={loadData} className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Latitude', latitude, setLatitude, -90, 90],
          ['Longitude', longitude, setLongitude, -180, 180]
        ].map(([label, value, update, min, max]) => (
          <label key={label} className="text-xs text-slate-300">{label}
            <input required aria-label={`Climate ${label}`} type="number" step="any" min={min} max={max} value={value} onChange={e => update(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-600 bg-[#081727] px-3 py-2.5 text-white" />
          </label>
        ))}
        {[
          ['Start (UTC)', start, setStart],
          ['End (UTC)', end, setEnd]
        ].map(([label, value, update]) => (
          <label key={label} className="text-xs text-slate-300">{label}
            <input required aria-label={`Climate ${label}`} type="date" value={value} onChange={e => update(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-600 bg-[#081727] px-3 py-2.5 text-white" />
          </label>
        ))}
        <button disabled={loading} type="submit" className="flex min-h-11 items-center justify-center gap-2 self-end rounded-lg bg-teal-300 px-4 py-2.5 text-sm font-bold text-[#061927] disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {loading ? 'Loading...' : 'Load 3 Datasets'}
        </button>
      </form>
      {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      {data && (
        <div className="mt-6 space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            {FIELDS.map(field => (
              <div key={field.id} className="rounded-xl border border-[#345668] bg-[#091d2b] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: field.color }} />{field.name}</div>
                <p className="text-xs text-slate-400">{data.data.available_by_parameter[field.id === 'temperature_c' ? 'T2M' : field.id === 'relative_humidity_pct' ? 'RH2M' : 'WS2M']} available daily readings</p>
                <p className="mt-1 text-xs text-slate-400">Unit: {field.unit}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-[#345668] bg-[#081725] p-4">
            <h3 className="mb-2 text-sm font-semibold">Normalized sound mapping (0–1 per variable)</h3>
            <svg role="img" aria-label="Daily normalized temperature humidity and wind series" viewBox="0 0 800 165" className="h-40 w-full" preserveAspectRatio="none">
              <path d="M0 151 H800 M0 20 H800" stroke="#345668" strokeWidth="1" strokeDasharray="5 7" />
              {FIELDS.flatMap(field => linePoints(samples, field.id).map((points, index) => (
                <polyline key={`${field.id}-${index}`} fill="none" stroke={field.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
              )))}
            </svg>
            <p className="mt-2 text-xs text-slate-400">{data.period.start} to {data.period.end} · {data.data.complete_days}/{data.data.sample_count} complete days</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#345668]">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="bg-[#132a3a] text-slate-300"><tr><th className="p-3">Date</th>{FIELDS.map(field => <th key={field.id} className="p-3">{field.name} ({field.unit})</th>)}</tr></thead>
              <tbody>{samples.map(sample => <tr key={sample.date} className="border-t border-[#284456]"><td className="p-3">{sample.date}</td>{FIELDS.map(field => <td key={field.id} className="p-3">{formatNumber(sample.measurements[field.id])}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl text-xs leading-5 text-slate-400">NASA provides modeled meteorological values, not recorded sounds. Earthsonic creates the three pitch layers and clamps values outside each artistic range. Dates with missing measurements omit that layer.</p>
            <button type="button" onClick={togglePlayback} className="flex items-center gap-2 rounded-xl bg-teal-300 px-5 py-3 text-sm font-bold text-[#061927]">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? 'Stop Climate Audio' : 'Play Climate Symphony'}
            </button>
          </div>
          <a className="inline-flex text-xs font-semibold text-teal-300 underline underline-offset-4" href={data.source.source_url} target="_blank" rel="noreferrer">View original NASA POWER source</a>
        </div>
      )}
      {!data && !error && <p className="mt-5 text-xs text-slate-400">Default coordinates: Nagpur, India. Select up to 31 days; use historical dates for reproducibility.</p>}
    </section>
  );
}
