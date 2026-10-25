'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronRight, Menu, Star, X } from 'lucide-react';
import { site } from '@/content/site';
import { Logo } from './Logo';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // While the drawer is open: no page scroll behind it, Escape closes it, focus starts inside it.
  useEffect(() => {
    if (!open) return;
    const menuButton = menuButtonRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      menuButton?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 max-md:bg-[#f2f2f7]/80 max-md:shadow-none max-md:backdrop-blur-xl max-md:backdrop-saturate-150 ${
          scrolled
            ? 'border-white/10 bg-ink-975/80 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl max-md:border-black/[0.08]'
            : 'border-transparent bg-ink-975'
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-300 max-md:h-14 sm:px-6 ${scrolled ? 'h-16' : 'h-[4.5rem]'}`}
        >
          <Link href="/" aria-label="WebTano home" className="shrink-0 transition-opacity hover:opacity-90">
            {/* Phones get a light, app style bar, so the dark wordmark. */}
            <Logo light className="hidden h-9 w-auto md:block" />
            <Logo className="h-7 w-auto md:hidden" />
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
              {site.nav.map((item) => {
                const active = !item.href.includes('#') && pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`block rounded-full px-4 py-1.5 text-sm font-medium transition duration-200 ${
                        active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/#hero-form"
              className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-ink-950 shadow-glow transition hover:-translate-y-px hover:bg-accent-dark max-md:py-1.5 max-md:shadow-none sm:px-4"
            >
              <span className="sm:hidden">Free check</span>
              <span className="hidden sm:inline">Free website check</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-ink-950 transition active:bg-black/10 md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Phone menu: a panel that slides in from the right over a dimmed page. */}
      <div className={`fixed inset-0 z-[60] md:hidden ${open ? '' : 'pointer-events-none'}`}>
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          inert={!open}
          className={`absolute inset-y-2 right-2 flex w-[86%] max-w-sm flex-col overflow-hidden rounded-[28px] bg-[#f2f2f7] text-ink-950 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]'
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5">
            <Logo className="h-7 w-auto" />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] transition active:bg-black/10"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <ul className="mx-3 mt-1 min-h-0 overflow-y-auto rounded-2xl bg-white">
            {site.nav.map((item, i) => (
              <li
                key={item.href}
                className={`transition duration-500 ease-out ${open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 transition active:bg-black/[0.04] ${i ? 'border-t border-black/[0.06]' : ''}`}
                >
                  <span className="flex-1 text-[17px] font-medium">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-zinc-400" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={`mt-auto shrink-0 space-y-4 p-5 transition duration-500 ease-out ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: open ? '380ms' : '0ms' }}
          >
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
              <span className="flex gap-0.5 text-amber-400" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </span>
              <p className="text-xs text-zinc-600">
                Our clients on Google: <span className="font-semibold text-ink-950">4.9 and 5.0</span>
              </p>
            </div>
            <Link
              href="/#hero-form"
              onClick={() => setOpen(false)}
              className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-[17px] font-semibold text-ink-950 transition active:bg-accent-dark"
            >
              Get a free website check
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <p className="text-center text-xs text-zinc-500">Reply within one business day</p>
          </div>
        </nav>
      </div>
    </>
  );
}
