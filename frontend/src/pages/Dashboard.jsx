
import React, { useState } from 'react';
import MixStudio from '../components/MixStudio';
import NASATemperatureLab from '../components/NASATemperatureLab';
import NASAClimateLab from '../components/NASAClimateLab';
import {
  ArrowRight,
  AudioLines,
  Compass,
  Database,
  ExternalLink,
  Globe2,
  Heart,
  Loader2,
  Radio,
  ShieldCheck,
  Sparkles,
  UserRound
} from 'lucide-react';

export default function Dashboard({
  user,
  stations = [],
  favorites = [],
  favoritesLoading = false,
  favoritesError = '',
  favoriteBusyIds = [],
  onToggleFavorite,
  onSelectStation,
  onLaunchJukebox,
  onExplore,
  csrfToken = '',
  onLoadMix
}) {
  const [savedMixCount, setSavedMixCount] = useState(null);
  const email = user?.email || '';
  const explorerName = email
    ? email.split('@')[0]
    : 'Explorer';

  const favoriteSet = new Set(favorites);

  const savedStations = stations.filter((station) =>
    favoriteSet.has(station.id)
  );

  const cards = [
    {
      title: 'NASA Stations',
      value: String(stations.length),
      subtitle: 'Available to explore',
      icon: Globe2
    },
    {
      title: 'Favorites',
      value: favoritesLoading
        ? '...'
        : favoritesError
          ? '--'
          : String(favorites.length),
      subtitle: 'Your saved stations',
      icon: Heart
    },
    {
      title: 'Saved Mixes',
      value: savedMixCount === null ? '...' : String(savedMixCount),
      subtitle: 'Your saved sound configurations',
      icon: AudioLines
    }
  ];

  function openStation(station) {
    onSelectStation(station);
    onLaunchJukebox();
  }

  function isBusy(stationId) {
    return favoritesLoading || favoriteBusyIds.includes(stationId);
  }

  function renderFavoriteButton(station) {
    const saved = favoriteSet.has(station.id);
    const busy = isBusy(station.id);

    return (
      <button
        type="button"
        onClick={() => onToggleFavorite(station)}
        disabled={busy}
        aria-label={
          saved
            ? `Remove ${station.shortName || station.title} from favorites`
            : `Save ${station.shortName || station.title} to favorites`
        }
        aria-pressed={saved}
        title={saved ? 'Remove favorite' : 'Add to favorites'}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition disabled:cursor-wait disabled:opacity-60 ${
          saved
            ? 'border-rose-400/40 bg-rose-400/10 text-rose-300 hover:bg-rose-400/20'
            : 'border-[#39546A] bg-[#142338] text-[#92AEC3] hover:border-[#75E4EF]/60 hover:text-[#75E4EF]'
        }`}
      >
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Heart
            className={`h-5 w-5 ${
              saved ? 'fill-current' : ''
            }`}
          />
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-[#091426] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-9">
        <section className="relative overflow-hidden rounded-[28px] border border-[#29465C] bg-gradient-to-br from-[#142F46] via-[#111E35] to-[#0B1728] p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#59D8EF]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#59D8EF]/30 bg-[#59D8EF]/10 px-4 py-2 text-xs font-semibold tracking-wide text-[#85E9F0]">
                <Sparkles className="h-4 w-4" />
                YOUR EARTHSONIC SPACE
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                Welcome back,
                <span className="block bg-gradient-to-r from-[#7CE6EF] to-[#58DABF] bg-clip-text text-transparent">
                  {explorerName}
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#B8CBDF] sm:text-base">
                Explore NASA Earth visualizations, discover
                data-driven sounds, and save the stations
                you love to your personal collection.
              </p>
            </div>

            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-[#59D8EF]/30 bg-[#59D8EF]/10">
              <Globe2 className="h-16 w-16 text-[#75E5EF]" />
            </div>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onLaunchJukebox}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#75E4EF] to-[#56DCC1] px-6 py-3.5 text-sm font-bold text-[#071521] transition hover:brightness-110"
            >
              <Radio className="h-4 w-4" />
              Launch Jukebox
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center gap-2 rounded-xl border border-[#45637A] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Compass className="h-4 w-4" />
              Explore Earth
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold">
            Your Exploration Overview
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-[#294057] bg-[#111F32] p-6"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#59D8EF]/20 bg-[#59D8EF]/10">
                    <Icon className="h-6 w-6 text-[#75E4EF]" />
                  </div>

                  <p className="text-sm text-[#ADC0D4]">
                    {card.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {card.value}
                  </p>

                  <p className="mt-2 text-xs text-[#8FA9C0]">
                    {card.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {favoritesError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-5 py-4 text-sm text-rose-200"
          >
            {favoritesError}
          </div>
        )}

        <section
          id="my-favorites"
          className="rounded-2xl border border-[#294057] bg-[#111F32] p-6"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5 fill-rose-400 text-rose-400" />
                <h2 className="text-xl font-bold">
                  My Favorite Stations
                </h2>
              </div>

              <p className="text-sm text-[#ADC0D4]">
                Your saved NASA stations, available whenever you sign in.
              </p>
            </div>

            <span className="rounded-full border border-[#59D8EF]/30 bg-[#59D8EF]/10 px-4 py-2 text-xs font-semibold text-[#85E9F0]">
              {favoritesLoading
                ? 'Loading...'
                : `${savedStations.length} saved`}
            </span>
          </div>

          {favoritesLoading ? (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl border border-[#30465C] bg-[#0B1729] p-6 text-sm text-[#B8CBDF]"
            >
              <Loader2 className="h-5 w-5 animate-spin text-[#75E4EF]" />
              Loading your favorite stations...
            </div>
          ) : savedStations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#3C546A] bg-[#0B1729] px-5 py-10 text-center">
              <Heart className="mx-auto mb-4 h-10 w-10 text-[#75E4EF]/60" />

              <h3 className="font-semibold text-white">
                No favorites saved yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#96AEC5]">
                Choose a station below and press its heart
                button to add it to your collection.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {savedStations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center gap-3 rounded-xl border border-[#30465C] bg-[#0B1729] p-3"
                >
                  <button
                    type="button"
                    onClick={() => openStation(station)}
                    className="group min-w-0 flex-1 rounded-lg p-2 text-left transition hover:bg-[#182D43]"
                  >
                    <p className="text-xs font-semibold text-[#75E4EF]">
                      {station.svsId}
                    </p>

                    <h3 className="mt-1 truncate text-sm font-bold text-white">
                      {station.shortName || station.title}
                    </h3>

                    <p className="mt-1 flex items-center gap-1 text-xs text-[#96AEC5]">
                      Open in Jukebox
                      <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                    </p>
                  </button>

                  {renderFavoriteButton(station)}
                </div>
              ))}
            </div>
          )}
        </section>

        <MixStudio
          mode="dashboard"
          user={user}
          csrfToken={csrfToken}
          stations={stations}
          onLoadMix={onLoadMix}
          onCountChange={setSavedMixCount}
        />

        <NASATemperatureLab />

        <NASAClimateLab />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-2xl border border-[#294057] bg-[#111F32] p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  Explore NASA Stations
                </h2>

                <p className="mt-1 text-sm text-[#ADC0D4]">
                  Open a station or save it to your collection.
                </p>
              </div>

              <Globe2 className="h-6 w-6 text-[#75E4EF]" />
            </div>

            <div className="space-y-3">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center gap-3 rounded-xl border border-[#30465C] bg-[#0B1729] p-3 transition hover:border-[#59D8EF]/40"
                >
                  <button
                    type="button"
                    onClick={() => openStation(station)}
                    className="group flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg p-2 text-left transition hover:bg-[#182D43]"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#75E4EF]">
                        {station.svsId}
                      </p>

                      <h3 className="mt-1 truncate text-sm font-bold">
                        {station.shortName || station.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#96AEC5]">
                        {station.voiceName || 'Earth visualization'}
                      </p>
                    </div>

                    <ArrowRight className="h-5 w-5 shrink-0 text-[#75E4EF] transition group-hover:translate-x-1" />
                  </button>

                  {renderFavoriteButton(station)}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onExplore}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#75E4EF] hover:underline"
            >
              Explore the full Earthsonic homepage
              <ExternalLink className="h-4 w-4" />
            </button>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-[#294057] bg-[#111F32] p-6">
              <div className="mb-5 flex items-center gap-2">
                <UserRound className="h-5 w-5 text-[#75E4EF]" />

                <h2 className="text-lg font-bold">
                  Your Account
                </h2>
              </div>

              <p className="text-xs text-[#96AEC5]">
                Registered email
              </p>

              <p className="mt-1 break-all text-sm font-semibold">
                {email}
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#3DD6BF]/20 bg-[#3DD6BF]/10 px-4 py-3">
                <ShieldCheck className="h-5 w-5 text-[#3DD6BF]" />

                <span className="text-sm text-[#B0F4DF]">
                  Authenticated session
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#294057] bg-[#111F32] p-6">
              <div className="mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-[#75E4EF]" />

                <h2 className="text-lg font-bold">
                  EarthPulse Engine
                </h2>
              </div>

              <p className="text-sm leading-6 text-[#ADC0D4]">
                The current backend processes a NASA
                night-lights visualization into 100 brightness
                samples and corresponding sound frequencies.
              </p>

              <p className="mt-4 text-xs leading-5 text-[#96AEC5]">
                This is relative image-brightness sonification,
                not calibrated satellite radiance.
                Additional stations may use demonstration data.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
