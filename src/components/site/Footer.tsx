import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { site } from '@/content/site';
import { caseStudies } from '@/content/work';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-forest-975 text-white/70">
      <div className="h-px bg-gradient-to-r from-transparent via-lime/40 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-forest-700/30 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.tagline}</p>
          <Link
            href="/#hero-form"
            className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/10"
          >
            Free website check
            <ArrowRight className="h-4 w-4 text-lime transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Work</p>
          <ul className="mt-3 space-y-2 text-sm">
            {caseStudies.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`} className="transition hover:text-white">
                  {c.client}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">WebTano</p>
          <ul className="mt-3 space-y-2 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs sm:px-6">© {year} WebTano · webtano.com</p>
      </div>
    </footer>
  );
}
