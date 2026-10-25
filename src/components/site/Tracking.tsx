'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useSyncExternalStore } from 'react';

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

type Choice = 'granted' | 'denied';
const KEY = 'wt_consent';

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
    /** Opens the cookie choice again, from the footer link. */
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

/** Loads Google and Meta tags once the visitor agrees (or right away when no consent is asked). */
function load(c: TrackingConfig) {
  window.dataLayer = window.dataLayer || [];
  if (c.ga4 || c.ads) {
    // gtag pushes its arguments object, as Google's snippet does.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date());
    if (c.ga4) window.gtag('config', c.ga4);
    if (c.ads) window.gtag('config', c.ads);
    addScript(`https://www.googletagmanager.com/gtag/js?id=${c.ga4 || c.ads}`);
  }
  if (c.gtm) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    addScript(`https://www.googletagmanager.com/gtm.js?id=${c.gtm}`);
  }
  if (c.pixel && !window.fbq) {
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
      window.gtag?.('event', 'generate_lead', { form: 'website-check' });
      if (c.ads && c.adsLead) window.gtag?.('event', 'conversion', { send_to: `${c.ads}/${c.adsLead}` });
      if (c.gtm) window.dataLayer!.push({ event: 'generate_lead', form: 'website-check' });
      window.fbq?.('track', 'Lead');
    },
    call() {
      window.gtag?.('event', 'phone_call_click');
      if (c.ads && c.adsCall) window.gtag?.('event', 'conversion', { send_to: `${c.ads}/${c.adsCall}` });
      if (c.gtm) window.dataLayer!.push({ event: 'phone_call_click' });
      window.fbq?.('track', 'Contact');
    },
  };
}

// The visitor's choice, kept in localStorage and shared with the footer link.
const listeners = new Set<() => void>();
let memory: Choice | null = null; // When storage is blocked, the choice holds for this visit only.
let reopened = false;
let askable = false;
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
function readChoice(): Choice | null {
  if (reopened) return null;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'granted' || saved === 'denied') return saved;
  } catch {
    // Storage blocked: fall back to this visit's choice.
  }
  return memory;
}
function storeChoice(value: Choice) {
  memory = value;
  reopened = false;
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Not stored: the choice holds for this visit only.
  }
  emit();
}
function reopen() {
  reopened = true;
  emit();
}

export function Tracking({ config }: { config: TrackingConfig }) {
  const used = Boolean(config.ga4 || config.gtm || config.ads || config.pixel);
  // The server and the first render see 'unknown', so the HTML never differs; the stored choice comes right after.
  const stored = useSyncExternalStore(subscribe, readChoice, () => 'unknown' as const);
  const choice = config.consent ? stored : 'granted';
  const loaded = useRef(false);
  const path = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!used || !config.consent) return;
    window.wtConsentReset = reopen;
    askable = true;
    emit();
  }, [used, config.consent]);

  useEffect(() => {
    if (!used || choice !== 'granted' || loaded.current) return;
    loaded.current = true;
    load(config);
    // A tap on any phone number counts as a call conversion.
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a[href^="tel:"]')) window.wtTrack?.call();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [used, choice, config]);

  // Client-side navigations: GA4 sees them on its own, the Pixel needs a PageView.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [path]);

  function decide(value: Choice) {
    storeChoice(value);
    // Scripts already on the page cannot be unloaded; a reload drops them.
    if (value === 'denied' && loaded.current) location.reload();
  }

  if (!used || choice !== null) return null;
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie choice"
      className="fixed inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-xl rounded-2xl bg-ink-975 p-5 text-white shadow-float ring-1 ring-white/10 md:bottom-6"
    >
      <p className="text-sm leading-relaxed text-white/80">
        We use cookies for analytics and ads, to see which pages and ads bring calls. Your details are never sold.{' '}
        <Link href="/privacy" className="font-medium text-accent underline-offset-2 hover:underline">
          Privacy notice
        </Link>
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => decide('granted')}
          className="cursor-pointer rounded-full bg-accent px-5 py-2 text-sm font-semibold text-ink-975 transition hover:bg-accent-dark hover:text-white"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide('denied')}
          className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-white/80 ring-1 ring-white/20 transition hover:bg-white/10 hover:text-white"
        >
          Decline
        </button>
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
    <button type="button" onClick={reopen} className={`cursor-pointer ${className ?? ''}`}>
      Cookie settings
    </button>
  );
}
