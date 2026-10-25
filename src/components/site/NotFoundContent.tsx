import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DEFAULT_LANG, localePath, translator, type Lang, type T } from '@/lib/i18n';

const links = (t: T) => [
  { href: '/', label: t('Home', 'Početna'), text: t('Websites, local SEO and Google Ads for local companies.', 'Sajtovi, lokalni SEO i Google Ads za lokalne firme.') },
  {
    href: '/work',
    label: t('Case studies', 'Studije slučaja'),
    text: t('What the work brought in, from the clients’ own tracking.', 'Šta je posao doneo, iz praćenja samih klijenata.'),
  },
  { href: '/pricing', label: t('Pricing', 'Cene'), text: t('Flat monthly plans and fixed website prices.', 'Fiksni mesečni paketi i fiksne cene sajtova.') },
  { href: '/blog', label: 'Blog', text: t('Guides on Google Ads, local SEO and lead tracking.', 'Vodiči za Google Ads, lokalni SEO i praćenje upita.') },
];

/** The 404 body, shared by the site's not-found page and the global one for unknown URLs. */
export function NotFoundContent({ lang = DEFAULT_LANG }: { lang?: Lang }) {
  const t = translator(lang);
  return (
    <section className="bg-spotlight relative overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <p className="font-mono text-sm tracking-[0.14em] text-accent uppercase">{t('Error 404', 'Greška 404')}</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">{t('This page isn’t here', 'Ova stranica ne postoji')}</h1>
        <p className="mt-5 max-w-2xl text-lg text-white/75">
          {t(
            'The link may be old or mistyped. One of these is probably what you were looking for.',
            'Link je možda star ili pogrešno ukucan. Verovatno ste tražili nešto od ovoga.',
          )}
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {links(t).map((l) => (
            <li key={l.href}>
              <Link href={localePath(lang, l.href)} className="group flex h-full items-start justify-between gap-4 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.07]">
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
