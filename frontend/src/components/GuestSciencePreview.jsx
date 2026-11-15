import React from 'react';
import { ArrowRight, AudioLines, Cloud, LockKeyhole, Play, Thermometer, Wind } from 'lucide-react';

const FEATURES = [
  { name: 'Temperature', code: 'T2M', icon: Thermometer, accent: 'text-cyan-300' },
  { name: 'Humidity', code: 'RH2M', icon: Cloud, accent: 'text-violet-300' },
  { name: 'Wind', code: 'WS2M', icon: Wind, accent: 'text-emerald-300' }
];

export default function GuestSciencePreview({ onRequestAuth }) {
  return (
    <section id="scientific-jukebox-preview" aria-label="Scientific Jukebox preview" className="border-y border-cyan-400/20 bg-[#071726] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              <AudioLines className="h-4 w-4" /> Explore Earthsonic
            </div>
            <h2 className="max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
              Hear our planet through real NASA data.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Explore daily temperature, relative humidity and wind speed from NASA POWER, translated into a three-layer scientific sound experience. Sign in or create a free account to load measurements and use the Jukebox.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => onRequestAuth('signup')} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#071827] transition hover:bg-cyan-200">
                Create an account <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onRequestAuth('login')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-500 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Already a member? Sign in
              </button>
            </div>
            <p className="flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="h-3.5 w-3.5" /> Interactive audio, NASA datasets and saved mixes require an account.</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-[#10283a] to-[#091322] p-5 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-widest text-cyan-300">SCIENTIFIC JUKEBOX</p>
                <h3 className="mt-2 text-xl font-bold text-white">Climate Symphony</h3>
              </div>
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-100">Account required</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {FEATURES.map(({ name, code, icon: Icon, accent }) => (
                <div key={code} className="rounded-xl border border-white/10 bg-[#081a2b] p-3">
                  <Icon className={`h-5 w-5 ${accent}`} />
                  <p className="mt-3 text-sm font-semibold text-white">{name}</p>
                  <p className="mt-1 text-xs text-slate-400">NASA POWER {code}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-cyan-200/20 bg-[#081a2b] p-5">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-400"><span>NASA daily data timeline</span><LockKeyhole className="h-4 w-4" /></div>
              <div className="flex h-20 items-end justify-between gap-1.5 opacity-60" aria-hidden="true">
                {[38, 54, 43, 75, 63, 82, 59, 69, 45, 73, 62, 88, 51, 68, 42, 78, 61, 71, 49].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-700 to-teal-300" style={{ height: `${height}%` }} />
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">Illustrative preview · no NASA measurements loaded</p>
            </div>
            <button type="button" onClick={() => onRequestAuth('login')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/20">
              <Play className="h-4 w-4" /> Sign in to activate playback
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
