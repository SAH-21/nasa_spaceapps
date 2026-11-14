import React, { useEffect, useRef, useState } from 'react';
import {
  AudioLines,
  CheckCircle2,
  FolderOpen,
  Loader2,
  Pencil,
  Save,
  Trash2
} from 'lucide-react';
import { mixesService } from '../services/mixesService';

export default function MixStudio({
  mode = 'dashboard',
  user = null,
  csrfToken = '',
  stations = [],
  station = null,
  settings = null,
  onLoadMix,
  onCountChange
}) {
  const [mixes, setMixes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [mixName, setMixName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const currentTokenRef = useRef(csrfToken);
  currentTokenRef.current = csrfToken;

  useEffect(() => {
    let active = true;
    setMixes([]);
    setError('');
    setSuccess('');

    if (!user || !csrfToken) {
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);

    mixesService.list()
      .then((data) => {
        if (active) setMixes(data.mixes || []);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load mixes.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [user?.id, csrfToken]);

  useEffect(() => {
    if (typeof onCountChange === 'function') {
      onCountChange(user ? (loading || error ? null : mixes.length) : 0);
    }
  }, [user, loading, error, mixes.length, onCountChange]);

  const stationNames = Object.fromEntries(
    stations.map((item) => [item.id, item.shortName || item.title])
  );

  async function handleSave(event) {
    event.preventDefault();

    if (!user || !csrfToken || !station || !settings || busy) return;

    const name = (
      mixName.trim() || `${station.shortName || station.title} Mix`
    ).slice(0, 80);
    const token = csrfToken;

    setBusy(true);
    setError('');
    setSuccess('');

    try {
      const created = await mixesService.create({
        name,
        station_id: station.id,
        settings
      }, token);

      if (currentTokenRef.current !== token) return;

      setMixes((old) => [created, ...old]);
      setMixName('');
      setSuccess(`Saved "${created.name}" to your account.`);
    } catch (err) {
      if (currentTokenRef.current === token) {
        setError(err.message || 'Unable to save mix.');
      }
    } finally {
      if (currentTokenRef.current === token) setBusy(false);
    }
  }

  async function handleLoad(mix) {
    if (busyId !== null || busy) return;

    const token = csrfToken;
    setBusyId(mix.id);
    setError('');
    setSuccess('');

    try {
      const loaded = await mixesService.get(mix.id);
      if (currentTokenRef.current !== token) return;
      onLoadMix?.(loaded);
      setSuccess(`Loaded "${loaded.name}" into the Jukebox.`);
    } catch (err) {
      if (currentTokenRef.current === token) {
        setError(err.message || 'Unable to load mix.');
      }
    } finally {
      if (currentTokenRef.current === token) setBusyId(null);
    }
  }

  async function handleRename(mix) {
    if (busyId !== null || busy) return;

    const name = window.prompt('Rename saved mix:', mix.name)?.trim();
    if (!name || name === mix.name) return;

    if (name.length > 80) {
      setError('Mix names cannot exceed 80 characters.');
      return;
    }

    const token = csrfToken;
    setBusyId(mix.id);
    setError('');
    setSuccess('');

    try {
      const updated = await mixesService.update(mix.id, {
        name,
        station_id: mix.station_id,
        settings: mix.settings
      }, token);

      if (currentTokenRef.current !== token) return;

      setMixes((old) => old.map((item) =>
        item.id === updated.id ? updated : item
      ));
      setSuccess(`Renamed mix to "${updated.name}".`);
    } catch (err) {
      if (currentTokenRef.current === token) {
        setError(err.message || 'Unable to rename mix.');
      }
    } finally {
      if (currentTokenRef.current === token) setBusyId(null);
    }
  }

  async function handleDelete(mix) {
    if (busyId !== null || busy) return;
    if (!window.confirm(`Delete "${mix.name}" permanently?`)) return;

    const token = csrfToken;
    setBusyId(mix.id);
    setError('');
    setSuccess('');

    try {
      await mixesService.remove(mix.id, token);
      if (currentTokenRef.current !== token) return;
      setMixes((old) => old.filter((item) => item.id !== mix.id));
      setSuccess(`Deleted "${mix.name}".`);
    } catch (err) {
      if (currentTokenRef.current === token) {
        setError(err.message || 'Unable to delete mix.');
      }
    } finally {
      if (currentTokenRef.current === token) setBusyId(null);
    }
  }

  return (
    <section
      id={mode === 'dashboard' ? 'saved-mixes' : undefined}
      className="rounded-2xl border border-[#294057] bg-[#111F32] p-5 text-white shadow-xl sm:p-6"
      aria-label="Saved audio mixes"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <AudioLines className="h-5 w-5 text-[#75E4EF]" />
            {mode === 'jukebox' ? 'Save & Load Audio Mixes' : 'My Saved Audio Mixes'}
          </h2>
          <p className="mt-1 text-sm text-[#ADC0D4]">
            Store your volume, mute, loop, and track settings as presets.
          </p>
        </div>
        <span className="rounded-full border border-[#59D8EF]/30 bg-[#59D8EF]/10 px-3 py-1.5 text-xs font-semibold text-[#85E9F0]">
          {loading ? 'Loading...' : `${mixes.length} saved`}
        </span>
      </div>

      {mode === 'jukebox' && user && (
        <form onSubmit={handleSave} className="mb-5 flex flex-wrap gap-3 rounded-xl border border-[#30465C] bg-[#0B1729] p-4">
          <label className="min-w-[190px] flex-1 text-xs font-semibold text-[#ADC0D4]">
            Mix name
            <input
              type="text"
              value={mixName}
              maxLength={80}
              onChange={(event) => setMixName(event.target.value)}
              placeholder={`${station?.shortName || 'Earthsonic'} Mix`}
              className="mt-2 w-full rounded-lg border border-[#39546A] bg-[#142338] px-3 py-3 text-sm text-white outline-none focus:border-[#75E4EF]"
            />
          </label>
          <button
            type="submit"
            disabled={busy || loading || !csrfToken || !station}
            className="inline-flex self-end items-center gap-2 rounded-lg bg-[#75E4EF] px-5 py-3 text-sm font-bold text-[#071521] transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Current Mix
          </button>
        </form>
      )}

      {!user ? (
        <p className="rounded-xl border border-dashed border-[#39546A] bg-[#0B1729] p-5 text-sm text-[#ADC0D4]">
          Sign in to save mixes to your account. You can still use the Jukebox as a guest.
        </p>
      ) : (
        <>
          {error && (
            <p role="alert" className="mb-4 rounded-lg border border-rose-400/40 bg-rose-400/10 p-3 text-sm text-rose-200">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {success}
            </p>
          )}
          {loading ? (
            <p role="status" className="flex items-center gap-2 text-sm text-[#ADC0D4]">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading mixes...
            </p>
          ) : mixes.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#39546A] bg-[#0B1729] p-5 text-sm text-[#ADC0D4]">
              No saved mixes yet. Open the Jukebox, adjust the controls, and save your first mix.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {mixes.map((mix) => (
                <div key={mix.id} className="rounded-xl border border-[#30465C] bg-[#0B1729] p-4">
                  <div className="mb-4 min-w-0">
                    <p className="truncate text-sm font-semibold text-white" title={mix.name}>{mix.name}</p>
                    <p className="mt-1 text-xs text-[#91AAC3]">
                      {stationNames[mix.station_id] || mix.station_id} · Master {mix.settings.master_volume}%
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoad(mix)}
                      disabled={busy || busyId !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#75E4EF] px-3 py-2 text-xs font-bold text-[#071521] disabled:opacity-50"
                    >
                      {busyId === mix.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FolderOpen className="h-3.5 w-3.5" />}
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRename(mix)}
                      disabled={busy || busyId !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#39546A] px-3 py-2 text-xs text-[#ADC0D4] hover:text-white disabled:opacity-50"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(mix)}
                      disabled={busy || busyId !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-300 hover:bg-rose-400/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
