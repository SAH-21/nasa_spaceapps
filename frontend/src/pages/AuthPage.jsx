
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Eye,
  EyeOff,
  Globe2,
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles
} from 'lucide-react';
import { authService } from '../services/authService';

export default function AuthPage({ onBack, onAuthenticated, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [reduceMotion, setReduceMotion] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  const isSignup = mode === 'signup';

  useEffect(() => {
    const query = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const handleChange = () => {
      setReduceMotion(query.matches);
    };

    query.addEventListener('change', handleChange);

    return () => {
      query.removeEventListener('change', handleChange);
    };
  }, []);

  function switchMode(nextMode) {
    if (loading || mode === nextMode) return;

    setMode(nextMode);
    setPassword('');
    setError('');
    setShowPassword(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');

    let accountCreated = false;

    try {
      const normalizedEmail = email.trim();

      if (isSignup) {
        await authService.register(normalizedEmail, password);
        accountCreated = true;
      }

      const session = await authService.login(
        normalizedEmail,
        password
      );

      onAuthenticated(session);
    } catch (err) {
      setError(
        accountCreated
          ? 'Your account was created, but automatic sign-in failed. Choose Sign In and try again.'
          : err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-[#050B18] text-white">

      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30 blur-xl"
        style={{
          backgroundImage: 'url(/earthsonic-auth-poster.webp)'
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] overflow-hidden min-[850px]:inset-y-0 min-[850px]:left-0 min-[850px]:right-auto min-[850px]:h-full min-[850px]:w-[56%]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#050B18]" />

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/earthsonic-auth-poster.webp)'
          }}
        />

        {!reduceMotion && (
          <video
            className="absolute inset-0 h-full w-full object-cover object-[center_40%] min-[850px]:object-contain [filter:brightness(1.2)_contrast(1.08)_saturate(1.2)]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/earthsonic-auth-poster.webp"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source
              src="/earthsonic-auth-bg.mp4"
              type="video/mp4"
            />
          </video>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/10 via-transparent to-[#020814]/55 min-[850px]:from-[#020814]/5 min-[850px]:via-transparent min-[850px]:to-[#020814]/45" />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] bg-gradient-to-r from-transparent to-[#020814]/80 min-[850px]:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-5 px-4 py-6 sm:px-8 min-[850px]:grid-cols-[minmax(0,1fr)_minmax(360px,450px)] min-[850px]:gap-7 min-[850px]:px-8 min-[850px]:py-10 xl:gap-16 xl:px-12">

        <section
          className="relative flex min-h-48 flex-col justify-end overflow-hidden rounded-[24px] border border-white/25 bg-[#071427]/15 p-5 shadow-[0_12px_45px_rgba(0,0,0,0.16)] min-[850px]:hidden"
          aria-label="Earthsonic cinematic introduction"
        >
          <div
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061021]/75 to-transparent"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#071527]/40 px-3 py-1.5 text-[10px] font-bold tracking-widest text-[#A3F2F9] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              EARTHSONIC EXPERIENCE
            </div>

            <h2 className="max-w-md text-2xl font-black tracking-tight text-white drop-shadow-lg sm:text-3xl">
              Listen to our living Earth.
            </h2>

            <p className="mt-1 text-sm text-[#E1EEF8]">
              A cosmic backdrop for your next discovery.
            </p>
          </div>
        </section>

        <section className="relative hidden min-w-0 max-w-xl self-stretch flex-col justify-between gap-6 py-8 min-[850px]:flex">
          <div className="flex items-center gap-3 self-start rounded-2xl border border-white/15 bg-[#041022]/55 px-4 py-3 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#67E5F2]/35 bg-[#67E5F2]/10">
              <Globe2 className="h-6 w-6 text-[#80ECF5]" />
            </div>

            <div>
              <p className="text-base font-black tracking-[0.17em]">
                EARTHSONIC
              </p>
              <p className="text-xs text-[#C8DEEB]">
                An EarthPulse experience
              </p>
            </div>
          </div>

          <div className="mt-auto max-w-[420px] rounded-[24px] border border-white/15 bg-[#030A17]/65 p-5 shadow-[0_16px_55px_rgba(0,0,0,0.38)] backdrop-blur-[3px] xl:p-7">
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-[#94F0F6]">
              <AudioLines className="h-4 w-4" />
              THE EARTH INFORMATION JUKEBOX
            </p>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
              A universe of data.
              <span className="block text-[#7DE7EC]">
                A new way to listen.
              </span>
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#DAE9F4]">
              Explore NASA Earth visualizations through interactive
              sound. Discover the Jukebox with an account or as a guest.
            </p>
          </div>
        </section>

        <section className="relative isolate w-full min-w-0 overflow-hidden rounded-[28px] border border-white/30 bg-[#071427]/25 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.52)] sm:p-9 min-[850px]:p-8 xl:p-10">

          <div
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0 bg-cover bg-[center_32%]"
              style={{
                backgroundImage: 'url(/earthsonic-auth-poster.webp)'
              }}
            />

            {!reduceMotion && (
              <video
                className="absolute inset-0 h-full w-full object-cover object-[center_32%] [filter:brightness(1.25)_contrast(1.08)_saturate(1.15)]"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/earthsonic-auth-poster.webp"
                aria-hidden="true"
                tabIndex={-1}
              >
                <source
                  src="/earthsonic-auth-bg.mp4"
                  type="video/mp4"
                />
              </video>
            )}

            <div className="absolute inset-0 bg-[#020814]/25" />

            <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/35 via-[#020814]/20 to-[#020814]/65" />
          </div>

          <div className="relative z-10">

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg text-xs font-medium text-[#C3D5E5] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78E4F0]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Earthsonic
            </button>

            <div className="mb-8 mt-8">
              <div className="mb-4 flex items-center gap-2 min-[850px]:hidden">
                <Globe2 className="h-6 w-6 text-[#7CE5F0]" />

                <span className="text-sm font-black tracking-[0.16em]">
                  EARTHSONIC
                </span>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#81E7F0]">
                {isSignup
                  ? 'START YOUR EXPLORATION'
                  : 'WELCOME BACK'}
              </p>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                {isSignup
                  ? 'Create your account'
                  : 'Sign in to Earthsonic'}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#BED0E1]">
                {isSignup
                  ? 'Your journey through Earth observation and sound starts here.'
                  : 'Continue your journey through Earth, data, and sound.'}
              </p>
            </div>

            <div
              className="mb-7 grid grid-cols-2 rounded-xl border border-white/15 bg-[#030D1C]/65 p-1"
              role="group"
              aria-label="Authentication mode"
            >
              <button
                type="button"
                onClick={() => switchMode('login')}
                disabled={loading}
                aria-pressed={!isSignup}
                className={`rounded-lg px-3 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#85E8F1] disabled:opacity-70 ${
                  !isSignup
                    ? 'bg-[#234358] text-[#A5F3FA] shadow-sm'
                    : 'text-[#BACCDD] hover:text-white'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => switchMode('signup')}
                disabled={loading}
                aria-pressed={isSignup}
                className={`rounded-lg px-3 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#85E8F1] disabled:opacity-70 ${
                  isSignup
                    ? 'bg-[#234358] text-[#A5F3FA] shadow-sm'
                    : 'text-[#BACCDD] hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="earthsonic-email"
                  className="mb-2 block text-sm font-semibold text-[#E4EEF8]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#92B0C5]" />

                  <input
                    id="earthsonic-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#416073]/70 bg-[#071528]/90 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-[#93AFC2] focus:border-[#85E8F1] focus:ring-2 focus:ring-[#85E8F1]/25 disabled:opacity-70"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="earthsonic-password"
                  className="mb-2 block text-sm font-semibold text-[#E4EEF8]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#92B0C5]" />

                  <input
                    id="earthsonic-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      isSignup
                        ? 'new-password'
                        : 'current-password'
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={isSignup ? 12 : 1}
                    maxLength={128}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#416073]/70 bg-[#071528]/90 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-[#93AFC2] focus:border-[#85E8F1] focus:ring-2 focus:ring-[#85E8F1]/25 disabled:opacity-70"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded text-[#B6CBDE] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#85E8F1]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {isSignup && (
                  <p className="mt-2 text-xs text-[#B7CAD9]">
                    Use at least 12 characters.
                  </p>
                )}
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-300/40 bg-rose-950/65 px-4 py-3 text-sm leading-6 text-rose-100"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#79E5F0] to-[#5CE1C4] px-5 py-4 text-sm font-extrabold text-[#04111F] shadow-[0_6px_24px_rgba(91,220,228,0.22)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9CF3FB] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}

                {loading
                  ? 'Please wait...'
                  : isSignup
                    ? 'Create Earthsonic Account'
                    : 'Sign In to Earthsonic'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#C4D4E3]">
              {isSignup
                ? 'Already have an account?'
                : "Don't have an account?"}
              {' '}

              <button
                type="button"
                onClick={() =>
                  switchMode(isSignup ? 'login' : 'signup')
                }
                disabled={loading}
                className="font-bold text-[#8AE7F0] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#85E8F1]"
              >
                {isSignup ? 'Sign In' : 'Create Account'}
              </button>
            </p>

            <div
              className="my-6 flex items-center gap-4"
              aria-hidden="true"
            >
              <div className="h-px flex-1 bg-white/20" />

              <span className="text-xs text-[#B7CAD9]">
                OR
              </span>

              <div className="h-px flex-1 bg-white/20" />
            </div>

            <button
              type="button"
              onClick={onBack}
              className="w-full rounded-xl border border-[#7894A8]/45 bg-white/5 px-5 py-3.5 text-sm font-semibold text-[#E0ECF5] transition hover:border-[#92E8F0] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#85E8F1]"
            >
              Back to public home
            </button>

            <p className="mt-7 text-center text-xs text-[#ABC1D3]">
              Team Vertex · Earthsonic
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
