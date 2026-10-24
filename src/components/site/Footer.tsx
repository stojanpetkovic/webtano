import Link from 'next/link';
import { site } from '@/content/site';
import { caseStudies } from '@/content/work';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest-950 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Work</p>
          <ul className="mt-3 space-y-2 text-sm">
            {caseStudies.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`} className="hover:text-white">
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
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs sm:px-6">© {year} WebTano · webtano.com</p>
      </div>
    </footer>
  );
}
