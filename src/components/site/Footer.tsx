import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { site } from '@/content/site';
import { caseStudies } from '@/content/work';
import { Logo } from './Logo';

const columns = [
  {
    title: 'Services',
    links: [
      { href: '/#services', label: 'Websites' },
      { href: '/#services', label: 'Local SEO' },
      { href: '/#services', label: 'Google Ads' },
      { href: '/#report', label: 'Lead tracking' },
    ],
  },
  {
    title: 'Work',
    links: [...caseStudies.map((c) => ({ href: `/work/${c.slug}`, label: c.client })), { href: '/work', label: 'All case studies' }],
  },
  {
    title: 'Company',
    links: [
      { href: '/#process', label: 'How it works' },
      { href: '/#faq', label: 'FAQ' },
      { href: '/demo/report', label: 'Demo report' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-forest-975 text-white/65">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 border-t border-white/10 py-14 md:grid-cols-[1.3fr_2fr] md:gap-16">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.tagline}</p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-white/70 uppercase ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime" aria-hidden />
              Reply within one business day
            </p>
            <div className="mt-6">
              <Link
                href="/#hero-form"
                className="group inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-forest-950 shadow-glow transition hover:bg-lime-dark"
              >
                Free website check
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">{col.title}</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="group inline-flex items-center gap-1 transition hover:text-white">
                        {l.label}
                        {l.href === '/demo/report' && (
                          <ArrowUpRight className="h-3.5 w-3.5 text-lime/70 transition group-hover:text-lime" aria-hidden />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* A large faded wordmark to close the page. */}
      <div className="pointer-events-none relative mx-auto max-w-6xl px-4 select-none sm:px-6" aria-hidden>
        <p className="footer-wordmark font-display text-[19vw] leading-[0.8] tracking-[-0.06em] lg:text-[15.5rem]">WebTano</p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 py-6 pr-20 pl-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:pr-24 sm:pl-6 xl:pr-6">
          <p>© {year} WebTano · webtano.com</p>
          <p>Websites, local SEO and Google Ads, measured by our own tracking.</p>
        </div>
      </div>
    </footer>
  );
}
