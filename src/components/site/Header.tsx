'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { site } from '@/content/site';
import { Logo } from './Logo';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the phone menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled || open
          ? 'border-white/10 bg-forest-950/85 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.45)] backdrop-blur-xl'
          : 'border-transparent bg-forest-950'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="WebTano home" className="transition-opacity hover:opacity-90">
          <Logo light />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/#check"
            className="group inline-flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-sm font-semibold whitespace-nowrap text-forest-950 shadow-glow transition hover:-translate-y-px hover:bg-lime-dark"
          >
            <span className="hidden sm:inline">Free website check</span>
            <span className="sm:hidden">Free check</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0">
          <ul className="space-y-1 border-t border-white/10 px-4 py-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
