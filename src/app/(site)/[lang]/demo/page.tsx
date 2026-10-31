import type { Metadata } from 'next';
import { DemoTour } from '@/components/site/DemoTour';
import { Reveal } from '@/components/site/Reveal';
import { getI18n } from '@/lib/i18n-site';
import { alternates, ogImage } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t, lp } = await getI18n();
  return {
    title: t('Demo: what your website gets', 'Demo: šta dobija vaš sajt'),
    description: t(
      'A step-by-step walk through a sample small-business website: the first screen, reviews, service pages, the enquiry form, the code, SEO and call tracking, in plain language.',
      'Korak po korak kroz primer sajta male firme: prvi ekran, recenzije, stranice usluga, forma za upit, kod, SEO i praćenje poziva, jednostavnim jezikom.',
    ),
    alternates: alternates(lang, '/demo'),
    openGraph: { url: lp('/demo'), images: [ogImage(lang)] },
  };
}

export default async function DemoPage() {
  const { t } = await getI18n();
  return (
    <>
      <section className="bg-spotlight relative overflow-hidden pt-14 pb-20 text-white max-md:pt-8 max-md:pb-8 sm:pt-20">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-accent uppercase ring-1 ring-white/12">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden />
              {t('Interactive demo', 'Interaktivni demo')}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl text-balance sm:text-6xl">
              {t('See what your website', 'Pogledajte šta vaš sajt')} <span className="text-gradient">{t('should be doing', 'treba da radi')}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-pretty text-white/70 max-md:mt-3 max-md:text-[15px]">
              {t(
                'Nine short steps through a sample site we would build for a local business. Click around: every part is explained in plain language, along with what we usually find on sites that lose enquiries.',
                'Devet kratkih koraka kroz primer sajta kakav pravimo za lokalnu firmu. Slobodno klikćite: svaki deo je objašnjen jednostavnim jezikom, uz ono što najčešće zateknemo na sajtovima koji gube upite.',
              )}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="bg-results relative pt-12 pb-24 max-md:pt-5 max-md:pb-6">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <DemoTour />
        </div>
      </section>
    </>
  );
}
