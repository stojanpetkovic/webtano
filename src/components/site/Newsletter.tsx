'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail, X } from 'lucide-react';
import { subscribeNewsletter, type NewsletterState } from '@/app/(site)/[lang]/actions';
import { useLang, useLocalePath, useT } from '@/components/i18n/LangProvider';
import { splitPath } from '@/lib/i18n';

// What the visitor did with the popup, so it is not shown again too soon.
const KEY = 'wt_newsletter';
const DISMISS_DAYS = 30;
const SHOWN_KEY = 'wt_newsletter_shown';

function remember(value: 'dismissed' | 'subscribed') {
  try {
    localStorage.setItem(KEY, JSON.stringify({ s: value, ts: Date.now() }));
  } catch {
    // Storage blocked: the popup may come back on the next visit.
  }
}

function mayShow(): boolean {
  try {
    if (sessionStorage.getItem(SHOWN_KEY)) return false;
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null') as { s: string; ts: number } | null;
    if (saved?.s === 'subscribed') return false;
    if (saved?.s === 'dismissed' && Date.now() - saved.ts < DISMISS_DAYS * 86_400_000) return false;
    return true;
  } catch {
    return false;
  }
}

/** The sign-up form, dark for the footer and light for the popup. */
export function NewsletterForm({ source, dark = false, onDone }: { source: 'popup' | 'footer'; dark?: boolean; onDone?: () => void }) {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribeNewsletter, { ok: false });
  const lang = useLang();
  const t = useT();
  const lp = useLocalePath();

  useEffect(() => {
    if (!state.ok) return;
    remember('subscribed');
    onDone?.();
  }, [state.ok, onDone]);

  if (state.ok)
    return (
      <p role="status" className={`flex items-start gap-2.5 text-sm leading-relaxed ${dark ? 'text-white/80' : 'text-zinc-700'}`}>
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
        <span>
          <strong className={dark ? 'text-white' : 'text-ink-950'}>{t('Almost done.', 'Još samo korak.')}</strong>{' '}
          {t('We sent you an email. Click the link inside to confirm your subscription.', 'Poslali smo vam email. Kliknite na link u njemu da potvrdite prijavu.')}
        </span>
      </p>
    );

  const id = `nl-${source}`;
  return (
    <form action={action} noValidate>
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="lang" value={lang} />
      <div className="hidden" aria-hidden>
        <label>
          Company URL
          <input name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label htmlFor={id} className="sr-only">
        Email
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          enterKeyHint="send"
          placeholder={t('you@company.com', 'vi@firma.rs')}
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? `${id}-error` : undefined}
          className={`min-h-12 w-full min-w-0 flex-1 rounded-full px-4 text-[16px] transition focus:outline-none ${
            dark
              ? 'bg-white/[0.06] text-white ring-1 ring-white/15 placeholder:text-white/40 focus:ring-2 focus:ring-accent'
              : 'bg-[#f2f2f7] text-ink-950 ring-1 ring-transparent placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-accent'
          }`}
        />
        <button
          type="submit"
          disabled={pending}
          className={`inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:opacity-70 ${
            dark ? 'bg-accent text-ink-975 hover:bg-white' : 'bg-ink-950 text-white hover:bg-ink-800'
          }`}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {pending ? t('Sending…', 'Šaljem…') : t('Subscribe', 'Prijavi me')}
          {!pending && <ArrowRight className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      {state.error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-rose-500">
          {state.error}
        </p>
      )}
      <p className={`mt-2.5 text-xs leading-relaxed ${dark ? 'text-white/45' : 'text-zinc-500'}`}>
        {t('About one email a month. Unsubscribe in one click. See our', 'Otprilike jedan email mesečno. Odjava jednim klikom. Pogledajte naše')}{' '}
        <Link href={lp('/privacy#newsletter')} className="underline underline-offset-2">
          {t('privacy notice', 'obaveštenje o privatnosti')}
        </Link>
        .
      </p>
    </form>
  );
}

// Pages where a popup would get in the way of what the visitor came to do.
const QUIET = ['/thank-you', '/privacy', '/terms', '/newsletter', '/demo'];

/**
 * The sign-up popup. It waits for real interest (time on the site, scrolling, or
 * the pointer leaving for the tab bar on a desktop), never covers the cookie
 * banner, shows once per visit, and stays away for a month after it is closed.
 * On phones it is a small card above the tab bar instead of a full screen.
 */
export function NewsletterPopup() {
  const path = splitPath(usePathname()).path;
  const t = useT();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const quiet = QUIET.some((p) => path === p || path.startsWith(p + '/'));

  useEffect(() => {
    if (open || quiet || !mayShow()) return;
    const phone = window.matchMedia('(max-width: 767px)').matches;
    const start = Date.now();
    const minDelay = phone ? 20_000 : 12_000;
    const blocked = () =>
      Boolean(document.querySelector('[aria-label="Cookie consent"], #cookie-prefs-title, [role=dialog][aria-modal=true]')) ||
      (document.getElementById('nav-toggle') as HTMLInputElement | null)?.checked ||
      document.activeElement?.closest('form') != null;
    const show = () => {
      if (Date.now() - start < minDelay || blocked() || !mayShow()) return;
      try {
        sessionStorage.setItem(SHOWN_KEY, '1');
      } catch {
        // Storage blocked: shows at most once while this page is open.
      }
      setOpen(true);
      cleanup();
    };
    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth > (phone ? 0.7 : 0.5)) show();
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    const timer = window.setInterval(() => {
      if (Date.now() - start > (phone ? 45_000 : 30_000)) show();
    }, 2_000);
    window.addEventListener('scroll', onScroll, { passive: true });
    if (!phone) document.documentElement.addEventListener('mouseleave', onLeave);
    function cleanup() {
      window.clearInterval(timer);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    }
    return cleanup;
  }, [open, quiet, path]);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    if (!done) remember('dismissed');
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center md:items-center md:bg-ink-975/45 md:p-6 md:backdrop-blur-sm max-md:pointer-events-none" onClick={close}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nl-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white text-ink-950 outline-none max-md:pointer-events-auto max-md:mx-3 max-md:mb-[calc(5.75rem+env(safe-area-inset-bottom))] max-md:rounded-[22px] max-md:p-5 max-md:shadow-[0_8px_30px_rgb(0_0_0/0.12)] max-md:ring-1 max-md:ring-black/5 md:overflow-hidden md:rounded-3xl md:shadow-float"
      >
        <button
          type="button"
          onClick={close}
          aria-label={t('Close', 'Zatvori')}
          className="absolute end-3 top-3 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-ink-950 md:text-white/70 md:hover:bg-white/10 md:hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        {/* A dark header with the brand glow, on larger screens only. */}
        <div
          className="relative bg-ink-975 px-7 pt-8 pb-7 text-white max-md:hidden"
          style={{ backgroundImage: 'radial-gradient(90% 80% at 15% 0%, rgb(1 175 233 / 0.22), transparent 70%)' }}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/30">
            <Mail className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-4 font-mono text-[10px] tracking-[0.14em] text-accent uppercase">{t('The WebTano newsletter', 'WebTano bilten')}</p>
        </div>
        <div className="md:px-7 md:pt-6 md:pb-7">
          <h2 id="nl-title" className="pe-8 font-display text-lg font-bold tracking-tight md:text-2xl">
            {t('Get more customers from your website', 'Više kupaca preko vašeg sajta')}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 md:hidden">{t('One short email a month. No spam.', 'Jedan kratak email mesečno. Bez spama.')}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 max-md:hidden">
            {t(
              'One short email a month with practical tips on websites, SEO and Google Ads for small businesses. No spam.',
              'Jedan kratak email mesečno sa praktičnim savetima o sajtovima, SEO-u i Google oglašavanju za male firme. Bez spama.',
            )}
          </p>
          <div className="mt-3.5 md:mt-5">
            <NewsletterForm source="popup" onDone={() => setDone(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
