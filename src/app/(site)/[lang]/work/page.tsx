import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CaseCard } from '@/components/site/CaseCard';
import { Reveal } from '@/components/site/Reveal';
import { caseStudiesIn } from '@/content/work';
import { site } from '@/content/site';
import { getI18n } from '@/lib/i18n-site';
import { alternates, jsonLd, ogImage } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t, lp } = await getI18n();
  return {
    title: t('Case studies', 'Studije slučaja'),
    description: t(
      'Real projects: websites, SEO and Google Ads for a dental practice, a medical transport company and home-service firms, with the numbers from their own call and enquiry tracking.',
      'Pravi projekti: sajtovi, SEO i Google oglašavanje za stomatološku ordinaciju, sanitetski prevoz i uslužne firme, sa brojkama iz njihovog praćenja poziva i upita.',
    ),
    alternates: alternates(lang, '/work'),
    openGraph: { url: lp('/work'), images: [ogImage(lang)] },
  };
}

export default async function WorkPage() {
  const { lang, t, lp } = await getI18n();
  const caseStudies = caseStudiesIn(lang);
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${site.url}${lp('/work')}#page`,
        name: t('Case studies', 'Studije slučaja'),
        url: `${site.url}${lp('/work')}`,
        inLanguage: lang === 'sr' ? 'sr-Latn-RS' : 'en-US',
        isPartOf: { '@id': `${site.url}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: caseStudies.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t(`${c.client} case study`, `${c.client} studija slučaja`),
            url: `${site.url}${lp(`/work/${c.slug}`)}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('Home', 'Početna'), item: `${site.url}${lp('/')}` },
          { '@type': 'ListItem', position: 2, name: t('Case studies', 'Studije slučaja'), item: `${site.url}${lp('/work')}` },
        ],
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <section className="bg-spotlight relative overflow-hidden py-16 text-white sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t('Case studies', 'Studije slučaja')}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              {t('Our work, and', 'Naši projekti i')} <span className="text-gradient">{t('what it brought in', 'šta su doneli')}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-2xl text-lg text-white/75">
              {t(
                'Every figure comes from the client’s own call tracking, ad account or a Lighthouse test of the live site.',
                'Svaka brojka potiče iz klijentovog praćenja poziva, Google Ads naloga ili Lighthouse testa sajta.',
              )}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="bg-zinc-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 2) * 100}>
              <CaseCard item={c} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href={lp('/#hero-form')}
            className="group inline-flex items-center gap-2 rounded-full bg-azure-700 px-6 py-3.5 font-semibold text-white shadow-[0_10px_24px_-10px_rgb(37_99_235/0.7)] transition hover:-translate-y-px hover:bg-ink-800"
          >
            {t('Get a free website audit', 'Zatražite besplatnu analizu')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
