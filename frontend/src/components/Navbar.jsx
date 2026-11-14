
import React from 'react';
import {
  Eye,
  Globe2,
  Info,
  Loader2,
  LogIn,
  LogOut,
  Radio,
  Sliders,
  UserRound
} from 'lucide-react';

export default function Navbar({
  currentView,
  onNavigate,
  onToggleAccessibility,
  isAccessibilityOpen,
  selectedStation,
  user,
  authChecking,
  authBusy,
  onSignIn,
  onSignOut
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-space-700/80 bg-space-900/95 shadow-xl backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3 py-3 sm:min-h-20">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="group flex min-w-0 items-center gap-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-earth-cyan sm:gap-3"
            aria-label="Earthsonic Home"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-earth-cyan/40 bg-gradient-to-br from-nasa-blue to-space-950">
              <Globe2 className="h-6 w-6 text-earth-cyan" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-white to-earth-cyan bg-clip-text text-base font-extrabold tracking-wider text-transparent sm:text-xl">
                  EARTHSONIC
                </span>

                <span className="hidden rounded border border-earth-cyan/30 bg-nasa-blue/30 px-2 py-0.5 text-[10px] font-semibold text-earth-cyan xl:inline">
                  NASA 2026
                </span>
              </div>

              <p className="hidden text-[11px] text-slate-300 lg:block">
                The Earth Information Jukebox
              </p>
            </div>
          </button>

          <nav
            aria-label="Main navigation"
            className="flex shrink-0 items-center gap-1.5 sm:gap-2"
          >
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className={`rounded-xl px-2.5 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                currentView === 'home'
                  ? 'border border-earth-cyan/40 bg-earth-cyan/15 text-earth-cyan'
                  : 'text-slate-300 hover:bg-space-800 hover:text-white'
              }`}
            >
              Explore
            </button>

            <button
              type="button"
              onClick={() => onNavigate('jukebox')}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                currentView === 'jukebox'
                  ? 'bg-gradient-to-r from-earth-cyan to-teal-300 text-space-950'
                  : 'border border-space-700 bg-space-850 text-white hover:bg-space-800'
              }`}
            >
              <Radio className="h-4 w-4" />
              <span className="hidden min-[420px]:inline">Jukebox</span>

              {selectedStation && currentView === 'jukebox' && (
                <span className="hidden text-[10px] font-bold md:inline">
                  {selectedStation.svsId}
                </span>
              )}
            </button>

            <a
              href="#stations"
              onClick={() => {
                if (currentView !== 'home') onNavigate('home');
              }}
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-space-800 hover:text-white xl:flex"
            >
              <Sliders className="h-4 w-4 text-earth-amber" />
              Stations
            </a>

            <a
              href="#sonification-mapping"
              onClick={() => {
                if (currentView !== 'home') onNavigate('home');
              }}
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-space-800 hover:text-white xl:flex"
            >
              <Info className="h-4 w-4" />
              Voice Mappings
            </a>

            <button
              type="button"
              onClick={onToggleAccessibility}
              aria-label="Toggle accessibility panel"
              title="Accessibility controls"
              className={`rounded-xl border p-2.5 transition ${
                isAccessibilityOpen
                  ? 'border-earth-cyan bg-earth-cyan/20 text-earth-cyan'
                  : 'border-space-700 bg-space-850 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="h-4 w-4" />
            </button>

            {authChecking ? (
              <div
                className="flex h-10 w-10 items-center justify-center"
                aria-label="Checking account session"
              >
                <Loader2 className="h-4 w-4 animate-spin text-earth-cyan" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <div
                  className="hidden max-w-[150px] items-center gap-2 rounded-xl border border-earth-cyan/25 bg-earth-cyan/10 px-3 py-2 text-xs text-earth-cyan lg:flex"
                  title={user.email}
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>

                <button
                  type="button"
                  onClick={onSignOut}
                  disabled={authBusy}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="flex items-center gap-1.5 rounded-xl border border-space-700 bg-space-850 px-2.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-red-400/40 hover:text-white disabled:opacity-60 sm:px-3"
                >
                  {authBusy
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <LogOut className="h-4 w-4" />}
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onSignIn}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#59D8EF] to-[#3DD6BF] px-3 py-2.5 text-xs font-bold text-[#071521] transition hover:brightness-110 sm:px-4 sm:text-sm"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden min-[420px]:inline">Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
