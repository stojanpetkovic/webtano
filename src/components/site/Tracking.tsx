'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/** The IDs from Podešavanja → Praćenje. Empty strings are tools that are not used. */
export interface TrackingConfig {
  ga4: string;
  gtm: string;
  ads: string;
  adsLead: string;
  adsCall: string;
  pixel: string;
  consent: boolean;
}

/** What the visitor allowed. Necessary storage needs no consent and is always on. */
export interface Consent {
  analytics: boolean;
  marketing: boolean;
}
interface Saved extends Consent {
  v: 2;
  /** When the choice was made, as proof of consent and to ask again after a year. */
  ts: number;
}

const KEY = 'wt_consent';
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
const ALL: Consent = { analytics: true, marketing: true };
const NONE: Consent = { analytics: false, marketing: false };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      callMethod?: (...args: unknown[]) => void;
      push?: unknown;
    };
    _fbq?: unknown;
    /** Conversions the site reports: the check form calls lead(), a tap on a phone number call(). */
    wtTrack?: { lead: () => void; call: () => void };
    /** Opens the cookie preferences, from the footer link. */
    wtConsentReset?: () => void;
  }
}

function addScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Google Consent Mode v2 signals for a choice. */
const signals = (c: Consent) => ({
  analytics_storage: c.analytics ? 'granted' : 'denied',
  ad_storage: c.marketing ? 'granted' : 'denied',
  ad_user_data: c.marketing ? 'granted' : 'denied',
  ad_personalization: c.marketing ? 'granted' : 'denied',
});

// Which tags are already on the page, so a wider choice adds only what is new.
const started = { gtag: false, ga4: false, ads: false, gtm: false, pixel: false };

/**
 * Loads the tags a choice allows, in Consent Mode v2 basic mode: nothing from Google or Meta
 * runs before the visitor agrees, and Google gets the matching consent signals with every tag.
 */
function load(c: TrackingConfig, consent: Consent) {
  window.dataLayer = window.dataLayer || [];
  const google = (consent.analytics && c.ga4) || (consent.marketing && c.ads) || c.gtm;
  if (google && !started.gtag) {
    started.gtag = true;
    // gtag pushes its arguments object, as Google's snippet does.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag('consent', 'default', { ...signals(NONE), wait_for_update: 500 });
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('js', new Date());
  }
  window.gtag?.('consent', 'update', signals(consent));

  if (consent.analytics && c.ga4 && !started.ga4) {
    started.ga4 = true;
    window.gtag!('config', c.ga4);
  }
  if (consent.marketing && c.ads && !started.ads) {
    started.ads = true;
    window.gtag!('config', c.ads);
  }
  const tagId = (consent.analytics && c.ga4) || (consent.marketing && c.ads);
  if (tagId) addScript(`https://www.googletagmanager.com/gtag/js?id=${tagId}`);

  // GTM loads with any consent and reads the Consent Mode signals above for its own tags.
  if (c.gtm && (consent.analytics || consent.marketing) && !started.gtm) {
    started.gtm = true;
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    addScript(`https://www.googletagmanager.com/gtm.js?id=${c.gtm}`);
  }
  window.dataLayer.push({ event: 'wt_consent_update', analytics: consent.analytics, marketing: consent.marketing });

  if (consent.marketing && c.pixel && !started.pixel && !window.fbq) {
    started.pixel = true;
    const fbq: NonNullable<Window['fbq']> = Object.assign(
      (...args: unknown[]) => (fbq.callMethod ? fbq.callMethod(...args) : fbq.queue!.push(args)),
      { queue: [] as unknown[], loaded: true, version: '2.0' },
    );
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;
    addScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', c.pixel);
    window.fbq('track', 'PageView');
  }

  window.wtTrack = {
    lead() {
      if (consent.analytics && c.ga4) window.gtag?.('event', 'generate_lead', { form: 'website-check' });
      if (consent.marketing && c.ads && c.adsLead) window.gtag?.('event', 'conversion', { send_to: `${c.ads}/${c.adsLead}` });
      if (started.gtm) window.dataLayer!.push({ event: 'generate_lead', form: 'website-check' });
      if (consent.marketing) window.fbq?.('track', 'Lead');
    },
    call() {
      if (consent.analytics && c.ga4) window.gtag?.('event', 'phone_call_click');
      if (consent.marketing && c.ads && c.adsCall) window.gtag?.('event', 'conversion', { send_to: `${c.ads}/${c.adsCall}` });
      if (started.gtm) window.dataLayer!.push({ event: 'phone_call_click' });
      if (consent.marketing) window.fbq?.('track', 'Contact');
    },
  };
}

/** Global Privacy Control: the browser's "do not sell or share" signal, honoured as no marketing. */
const gpc = () => typeof navigator !== 'undefined' && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

// The visitor's choice, kept in localStorage and shared with the footer link.
const listeners = new Set<() => void>();
let memory: string | null = null; // When storage is blocked, the choice holds for this visit only.
let prefsOpen = false;
let askable = false;
let cache: { raw: string | null; value: Saved | null } = { raw: null, value: null };
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function parse(raw: string | null): Saved | null {
  if (!raw) return null;
  // The first version stored a single yes or no for everything.
  if (raw === 'granted' || raw === 'denied') return { v: 2, ts: 0, ...(raw === 'granted' ? ALL : NONE) };
  try {
    const v = JSON.parse(raw) as Partial<Saved>;
    if (v?.v !== 2 || typeof v.ts !== 'number') return null;
    if (Date.now() - v.ts > MAX_AGE_MS) return null;
    return { v: 2, ts: v.ts, analytics: v.analytics === true, marketing: v.marketing === true };
  } catch {
    return null;
  }
}
/** The same object while the stored text is unchanged, as useSyncExternalStore requires. */
function readChoice(): Saved | null {
  let raw = memory;
  try {
    raw = localStorage.getItem(KEY) ?? memory;
  } catch {
    // Storage blocked: fall back to this visit's choice.
  }
  if (raw !== cache.raw) cache = { raw, value: parse(raw) };
  return cache.value;
}
function storeChoice(value: Consent) {
  const raw = JSON.stringify({ v: 2, ts: Date.now(), analytics: value.analytics, marketing: value.marketing } satisfies Saved);
  memory = raw;
  prefsOpen = false;
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // Not stored: the choice holds for this visit only.
  }
  emit();
}
function openPrefs() {
  prefsOpen = true;
  emit();
}
function closePrefs() {
  prefsOpen = false;
  emit();
}

export function Tracking({ config }: { config: TrackingConfig }) {
  const hasAnalytics = Boolean(config.ga4 || config.gtm);
  const hasMarketing = Boolean(config.ads || config.pixel || config.gtm);
  const used = hasAnalytics || hasMarketing;
  // The server and the first render see 'unknown', so the HTML never differs; the stored choice comes right after.
  const stored = useSyncExternalStore<Saved | null | 'unknown'>(subscribe, readChoice, () => 'unknown');
  const prefs = useSyncExternalStore(subscribe, () => prefsOpen, () => false);
  const choice: Consent | null | 'unknown' = config.consent ? stored : ALL;
  const loaded = useRef<Consent | null>(null);
  const path = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!used || !config.consent) return;
    window.wtConsentReset = openPrefs;
    askable = true;
    emit();
  }, [used, config.consent]);

  useEffect(() => {
    if (!used || !choice || choice === 'unknown' || (!choice.analytics && !choice.marketing)) return;
    loaded.current = { analytics: choice.analytics || !!loaded.current?.analytics, marketing: choice.marketing || !!loaded.current?.marketing };
    load(config, choice);
  }, [used, choice, config]);

  // A tap on any phone number counts as a call conversion.
  useEffect(() => {
    if (!used) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a[href^="tel:"]')) window.wtTrack?.call();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [used]);

  // Client-side navigations: GA4 sees them on its own, the Pixel needs a PageView.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [path]);

  function decide(value: Consent) {
    const before = loaded.current;
    storeChoice(value);
    // Scripts already on the page cannot be unloaded; a reload drops whatever was withdrawn.
    if (before && ((before.analytics && !value.analytics) || (before.marketing && !value.marketing))) {
      window.gtag?.('consent', 'update', signals(value));
      location.reload();
    }
  }

  if (!used || !config.consent || choice === 'unknown') return null;
  const current = choice ?? { analytics: false, marketing: false };
  return (
    <>
      {choice === null && !prefs && (
        <Banner
          onAccept={() => decide(gpc() ? { analytics: true, marketing: false } : ALL)}
          onReject={() => decide(NONE)}
          onCustomize={openPrefs}
          gpc={gpc()}
        />
      )}
      {prefs && (
        <Preferences
          config={config}
          hasAnalytics={hasAnalytics}
          hasMarketing={hasMarketing}
          initial={choice ? current : { analytics: false, marketing: false }}
          canClose={choice !== null}
          onSave={decide}
          onClose={closePrefs}
        />
      )}
    </>
  );
}

const btn =
  'inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full px-5 text-sm font-semibold transition sm:flex-none';

function Banner({ onAccept, onReject, onCustomize, gpc }: { onAccept: () => void; onReject: () => void; onCustomize: () => void; gpc: boolean }) {
  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-2xl rounded-[22px] bg-ink-975 p-4 text-white shadow-float ring-1 ring-white/10 sm:p-6 md:bottom-6"
    >
      <p className="font-display text-base font-bold max-md:text-[15px]">Your privacy, your choice</p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/75 md:hidden">
        Analytics and ad cookies run only if you allow them. We never sell your data.{' '}
        <Link href="/privacy#cookies" className="font-medium text-accent">
          Details
        </Link>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/75 max-md:hidden">
        We use necessary storage to run this site. With your permission we also use analytics and advertising cookies to see which pages and ads
        bring enquiries. We never sell your data. You can change your choice at any time under Cookie settings.{' '}
        <Link href="/privacy#cookies" className="font-medium text-accent underline-offset-2 hover:underline">
          Cookie details
        </Link>
      </p>
      {gpc && (
        <p className="mt-2 text-xs leading-relaxed text-white/60">Your browser sends a Global Privacy Control signal, so advertising cookies stay off.</p>
      )}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:mt-4">
        <button type="button" onClick={onAccept} className={`${btn} bg-accent text-ink-975 hover:bg-white`}>
          Accept all
        </button>
        <button type="button" onClick={onReject} className={`${btn} bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20`}>
          Reject all
        </button>
        <button
          type="button"
          onClick={onCustomize}
          className="min-h-9 w-full cursor-pointer px-3 text-sm font-medium text-white/75 underline-offset-2 transition hover:text-white hover:underline sm:ms-auto sm:w-auto"
        >
          Customize
        </button>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange?: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition disabled:cursor-not-allowed ${
        checked ? 'bg-accent' : 'bg-zinc-300'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transition ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Preferences({
  config,
  hasAnalytics,
  hasMarketing,
  initial,
  canClose,
  onSave,
  onClose,
}: {
  config: TrackingConfig;
  hasAnalytics: boolean;
  hasMarketing: boolean;
  initial: Consent;
  canClose: boolean;
  onSave: (c: Consent) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initial);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const analyticsTools = [config.ga4 && 'Google Analytics 4', config.gtm && 'Google Tag Manager'].filter(Boolean).join(', ');
  const marketingTools = [config.ads && 'Google Ads', config.pixel && 'Meta Pixel', config.gtm && 'Google Tag Manager'].filter(Boolean).join(', ');
  const rows = [
    {
      key: 'necessary' as const,
      title: 'Necessary',
      text: 'Keeps the site working and secure, remembers this cookie choice, and links a form you send to the page and campaign you came from. Set by us, never used for ads.',
      tools: 'WebTano (first party), Cloudflare',
    },
    hasAnalytics && {
      key: 'analytics' as const,
      title: 'Analytics',
      text: 'Counts visits and shows which pages are used, so we can improve the site. Data is aggregated.',
      tools: analyticsTools,
    },
    hasMarketing && {
      key: 'marketing' as const,
      title: 'Advertising',
      text: 'Measures which ads bring enquiries and lets ad platforms show relevant ads. Data is shared with the platforms named here.',
      tools: marketingTools,
    },
  ].filter(Boolean) as { key: 'necessary' | 'analytics' | 'marketing'; title: string; text: string; tools: string }[];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-975/50 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-prefs-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-ink-950 shadow-float outline-none sm:rounded-3xl sm:pb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="cookie-prefs-title" className="font-display text-xl font-bold">
            Cookie settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={canClose ? 'Close' : 'Back'}
            className="-me-2 -mt-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-ink-950"
          >
            <span aria-hidden className="text-xl leading-none">×</span>
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Choose what you allow. Nothing beyond necessary storage runs until you agree, and you can change this at any time from the footer. See the{' '}
          <Link href="/privacy#cookies" className="font-medium text-ink-950 underline underline-offset-2" onClick={onClose}>
            privacy notice
          </Link>{' '}
          for details.
        </p>
        <ul className="mt-5 divide-y divide-zinc-200 rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
          {rows.map((r) => (
            <li key={r.key} className="flex gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">{r.text}</p>
                {r.tools && <p className="mt-1.5 text-xs text-zinc-500">Tools: {r.tools}</p>}
              </div>
              {r.key === 'necessary' ? (
                <span className="shrink-0 pt-0.5 text-xs font-semibold text-zinc-500">Always on</span>
              ) : (
                <Toggle
                  label={r.title}
                  checked={value[r.key]}
                  onChange={(v) => setValue((s) => ({ ...s, [r.key]: v }))}
                />
              )}
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <button type="button" onClick={() => onSave(NONE)} className={`${btn} bg-zinc-100 text-ink-950 hover:bg-zinc-200`}>
            Reject all
          </button>
          <button type="button" onClick={() => onSave(value)} className={`${btn} bg-zinc-100 text-ink-950 hover:bg-zinc-200`}>
            Save choices
          </button>
          <button type="button" onClick={() => onSave(ALL)} className={`${btn} bg-ink-950 text-white hover:bg-ink-800`}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

/** "Cookie settings" in the footer, shown only when the site asks for consent. */
export function CookieSettingsLink({ className }: { className?: string }) {
  const show = useSyncExternalStore(
    subscribe,
    () => askable,
    () => false,
  );
  if (!show) return null;
  return (
    <button type="button" onClick={openPrefs} className={`cursor-pointer ${className ?? ''}`}>
      Cookie settings
    </button>
  );
}
