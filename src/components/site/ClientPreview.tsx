'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Lock, Maximize2, Minimize2, Monitor, Smartphone, X } from 'lucide-react';
import { useLocalePath, useT } from '@/components/i18n/LangProvider';

export type PreviewPage = { file: string; label: string; path: string };

const noop = () => () => {};

/**
 * A client's new site shown inside the WebTano frame: our top bar, the client's
 * pages as tabs, a computer/phone switch, and the site itself in a browser
 * window. The site is static HTML under /public, loaded in an iframe from our
 * own domain.
 */
export function ClientPreview({ base, domain, client, pages }: { base: string; domain: string; client: string; pages: PreviewPage[] }) {
  const t = useT();
  const lp = useLocalePath();
  const [file, setFile] = useState(pages[0].file);
  const [shown, setShown] = useState(pages[0].file);
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop');
  const [small, setSmall] = useState(false);
  const [full, setFull] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [host] = useState(() => (typeof document === 'undefined' ? null : document.createElement('div')));
  const phone = small || device === 'phone';

  useEffect(() => {
    if (!host) return;
    document.body.appendChild(host);
    return () => host.remove();
  }, [host]);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const query = window.matchMedia('(max-width: 639px)');
    const onSize = () => setSmall(query.matches);
    const onFull = () => setFull(Boolean(document.fullscreenElement));
    onSize();
    query.addEventListener('change', onSize);
    document.addEventListener('fullscreenchange', onFull);
    return () => {
      document.body.style.overflow = overflow;
      query.removeEventListener('change', onSize);
      document.removeEventListener('fullscreenchange', onFull);
    };
  }, []);

  const open = (next: string) => {
    if (next === shown) return;
    setLoading(true);
    setFile(next);
    setNav((n) => n + 1);
  };

  // Links clicked inside the site (menu, cart, buttons) move the tabs and the address bar too.
  const onLoad = () => {
    setLoading(false);
    try {
      const name = frame.current?.contentWindow?.location.pathname.split('/').pop() || pages[0].file;
      setShown(name);
    } catch {
      setShown(file);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  const current = pages.find((p) => p.file === shown) ?? pages.find((p) => p.file === 'cart.html' && shown.startsWith('cart')) ?? pages[0];
  const src = `${base}/${file}`;

  if (!mounted || !host) return null;
  return createPortal(
    <div translate="no" role="dialog" aria-modal="true" aria-label={`${client}: ${t('website preview', 'pregled sajta')}`} className="fixed inset-0 z-[80] flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-2 bg-ink-950 px-3 text-white sm:gap-5 sm:px-5">
        <span className="flex shrink-0 items-center gap-2 font-display text-[15px]">
          WebTano
          <span className="max-sm:hidden rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-accent uppercase ring-1 ring-accent/30">{t('Preview', 'Pregled')}</span>
        </span>
        <span className="truncate text-sm font-semibold text-white/80 max-md:hidden">{client}</span>

        <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] sm:justify-center" aria-label={t('Pages', 'Strane')}>
          {pages.map((p) => {
            const on = p.file === current.file;
            return (
              <button
                key={p.file}
                type="button"
                onClick={() => open(p.file)}
                aria-current={on ? 'page' : undefined}
                className={`shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition sm:px-4 sm:text-xs ${on ? 'bg-white text-ink-950' : 'text-white/60 hover:bg-white/[0.06] hover:text-white'}`}
              >
                {p.label}
              </button>
            );
          })}
        </nav>

        {!small && (
          <div className="flex shrink-0 rounded-full bg-white/[0.06] p-0.5 text-xs font-semibold ring-1 ring-white/10">
            {(
              [
                ['desktop', Monitor, t('Computer', 'Računar')],
                ['phone', Smartphone, t('Phone', 'Telefon')],
              ] as const
            ).map(([value, Icon, label]) => {
              const on = (value === 'phone') === phone;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDevice(value)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${on ? 'bg-white text-ink-950' : 'text-white/60 hover:text-white'}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  <span className="max-lg:hidden">{label}</span>
                </button>
              );
            })}
          </div>
        )}
        <a
          href={`${base}/${current.file}`}
          target="_blank"
          rel="noopener"
          aria-label={t('Open in a new tab', 'Otvori u novom tabu')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 transition hover:text-white max-sm:hidden"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={t('Full screen', 'Ceo ekran')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 transition hover:text-white max-sm:hidden"
        >
          {full ? <Minimize2 className="h-4 w-4" aria-hidden /> : <Maximize2 className="h-4 w-4" aria-hidden />}
        </button>
        <Link
          href={lp('/')}
          aria-label={t('Close the preview', 'Zatvori pregled')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 transition hover:text-white max-sm:hidden"
        >
          <X className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {/* Stage */}
      <div className={`relative min-h-0 flex-1 ${phone && !small ? 'bg-ink-900' : 'bg-zinc-100'} ${small ? '' : phone ? 'p-6' : 'p-5'}`}>
        <div
          className={`mx-auto flex h-full flex-col overflow-hidden ${
            small
              ? 'bg-[#07070a]'
              : phone
                ? 'max-h-[820px] max-w-[400px] rounded-[2.4rem] bg-ink-950 p-2 shadow-float ring-1 ring-white/10'
                : 'max-w-[1440px] rounded-2xl bg-white shadow-lift ring-1 ring-zinc-200'
          }`}
        >
          <div className={`flex min-h-0 flex-1 flex-col ${phone && !small ? 'overflow-hidden rounded-[2rem] bg-[#07070a]' : ''}`}>
            {/* Browser bar */}
            <div className={`flex shrink-0 items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 ${small ? 'hidden' : ''}`}>
              {!phone && (
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
              )}
              <span className="flex min-w-0 flex-1 items-center justify-center gap-1 truncate rounded-md bg-white px-2.5 py-1 text-[11px] text-zinc-500 ring-1 ring-zinc-200">
                <Lock className="h-3 w-3 shrink-0 text-emerald-600" aria-hidden />
                <span className="truncate">
                  {domain}
                  {current.path}
                </span>
              </span>
            </div>
            <div className="relative min-h-0 flex-1 bg-[#07070a]">
              <iframe
                ref={frame}
                key={`${src}-${nav}`}
                src={src}
                title={`${client}: ${current.label}`}
                onLoad={onLoad}
                className="h-full w-full border-0"
              />
              <div className={`pointer-events-none absolute inset-0 grid place-items-center bg-[#07070a] transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0'}`} aria-hidden>
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#d4a73a]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    host,
  );
}
