import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { site } from '@/content/site';
import { caseStudies } from '@/content/work';
import { DEFAULT_LANG, localePath, translator, type Lang } from '@/lib/i18n';
import { Logo } from './Logo';
import { CookieSettingsLink } from './Tracking';
import { NewsletterForm } from './Newsletter';

function columns(lang: Lang) {
  const t = translator(lang);
  return [
    {
      title: t('Services', 'Usluge'),
      links: [
        { href: '/#services', label: t('Websites', 'Sajtovi') },
        { href: '/#services', label: t('SEO', 'SEO optimizacija') },
        { href: '/#services', label: 'Google Ads' },
        { href: '/#report', label: t('Call tracking', 'Praćenje poziva') },
      ],
    },
    {
      title: t('Work', 'Radovi'),
      links: [
        ...caseStudies.map((c) => ({ href: `/work/${c.slug}`, label: c.client })),
        { href: '/work', label: t('All case studies', 'Sve studije slučaja') },
      ],
    },
    {
      title: t('Company', 'Firma'),
      links: [
        { href: '/pricing', label: t('Pricing', 'Cene') },
        { href: '/#process', label: t('How it works', 'Kako radimo') },
        { href: '/blog', label: 'Blog' },
        { href: '/#faq', label: t('FAQ', 'Pitanja') },
        { href: '/demo/report', label: t('Demo report', 'Primer izveštaja') },
        { href: '/privacy', label: t('Privacy', 'Privatnost') },
        { href: '/terms', label: t('Terms', 'Uslovi') },
      ],
    },
  ];
}

// Phones get one short row of links instead of the three columns.
function mobileLinks(lang: Lang) {
  const t = translator(lang);
  return [
    { href: '/work', label: t('Work', 'Radovi') },
    { href: '/pricing', label: t('Pricing', 'Cene') },
    { href: '/blog', label: 'Blog' },
    { href: '/#faq', label: t('FAQ', 'Pitanja') },
    { href: '/privacy', label: t('Privacy', 'Privatnost') },
    { href: '/terms', label: t('Terms', 'Uslovi') },
  ];
}

export function Footer({ newsletter = true, lang = DEFAULT_LANG }: { newsletter?: boolean; lang?: Lang }) {
  const t = translator(lang);
  // The demo report is the admin's public page and has no Serbian address.
  const lp = (href: string) => (href === '/demo/report' ? href : localePath(lang, href));
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink-975 text-white/65">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Newsletter sign-up, above the links. */}
        {newsletter && (
        <div className="grid gap-5 border-t border-white/10 py-10 max-md:border-0 max-md:pt-7 max-md:pb-2 md:grid-cols-[1.3fr_2fr] md:items-center md:gap-16">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-accent uppercase">{t('The WebTano newsletter', 'WebTano bilten')}</p>
            <p className="mt-2 font-display text-xl font-bold text-white max-md:text-lg">{t('One useful email a month', 'Jedan koristan email mesečno')}</p>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed max-md:hidden">
              {t(
                'Practical tips on getting more customers from your website, SEO and Google Ads.',
                'Praktični saveti kako da preko sajta, SEO-a i Google oglasa dobijete više kupaca.',
              )}
            </p>
          </div>
          <div className="md:max-w-lg">
            <NewsletterForm source="footer" dark />
          </div>
        </div>
        )}
        <div className="grid gap-12 border-t border-white/10 py-14 max-md:gap-6 max-md:border-0 max-md:py-7 md:grid-cols-[1.3fr_2fr] md:gap-16">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.tagline[lang]}</p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.04] max-md:hidden px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-white/70 uppercase ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden />
              {t('Reply within one business day', 'Odgovor u roku od jednog radnog dana')}
            </p>
            <div className="mt-6 max-md:hidden">
              <Link
                href={lp('/#hero-form')}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-accent-dark"
              >
                {t('Free website audit', 'Besplatna analiza sajta')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
          <nav aria-label={t('Footer', 'Podnožje')} className="grid grid-cols-2 gap-10 max-md:hidden sm:grid-cols-3">
            {columns(lang).map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">{col.title}</p>
                <ul className="mt-3 space-y-0.5 text-sm sm:mt-4 sm:space-y-1">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={lp(l.href)} className="group inline-flex items-center gap-1 py-1.5 transition hover:text-white sm:py-0.5">
                        {l.label}
                        {l.href === '/demo/report' && (
                          <ArrowUpRight className="h-3.5 w-3.5 text-accent/70 transition group-hover:text-accent" aria-hidden />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <nav aria-label={t('Footer links', 'Linkovi u podnožju')} className="md:hidden">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {mobileLinks(lang).map((l) => (
                <li key={l.href}>
                  <Link href={lp(l.href)} className="py-1 transition active:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* A large faded wordmark to close the page. */}
      <div className="pointer-events-none relative mx-auto max-w-6xl px-4 select-none max-md:hidden sm:px-6" aria-hidden>
        <p className="text-center bg-gradient-to-b from-white/[0.09] to-white/[0.015] bg-clip-text text-transparent font-display text-[19vw] leading-[0.8] tracking-[-0.06em] lg:text-[15.5rem] mb-[-0.12em]">WebTano</p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 py-6 pr-20 pl-4 text-xs max-md:py-4 max-md:pr-4 sm:flex-row sm:items-center sm:justify-between sm:pr-24 sm:pl-6 xl:pr-6">
          <p>
            © {year} WebTano · webtano.com
            <CookieSettingsLink className="ms-3 underline-offset-2 hover:text-white hover:underline" />
          </p>
          <p className="max-md:hidden">
            {t('Websites, SEO and Google Ads for small and local businesses, with every result measured.', 'Izrada sajtova, SEO i Google oglašavanje za male i lokalne firme, sa merljivim rezultatima.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
