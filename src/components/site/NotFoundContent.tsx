import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', text: 'Websites, local SEO and Google Ads for local companies.' },
  { href: '/work', label: 'Case studies', text: 'What the work brought in, from the clients’ own tracking.' },
  { href: '/pricing', label: 'Pricing', text: 'Flat monthly plans and fixed website prices.' },
  { href: '/blog', label: 'Blog', text: 'Guides on Google Ads, local SEO and lead tracking.' },
];

/** The 404 body, shared by the site's not-found page and the global one for unknown URLs. */
export function NotFoundContent() {
  return (
    <section className="bg-spotlight relative overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <p className="font-mono text-sm tracking-[0.14em] text-accent uppercase">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">This page isn’t here</h1>
        <p className="mt-5 max-w-2xl text-lg text-white/75">The link may be old or mistyped. One of these is probably what you were looking for.</p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex h-full items-start justify-between gap-4 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.07]">
                <span>
                  <span className="block font-display text-lg font-semibold">{l.label}</span>
                  <span className="mt-1 block text-sm text-white/65">{l.text}</span>
                </span>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-accent transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
