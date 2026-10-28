import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Clock, FileText, Inbox, MessageSquare, ShieldCheck } from 'lucide-react';
import { CaseCard } from '@/components/site/CaseCard';
import { PostCard } from '@/components/blog/PostCard';
import { Reveal } from '@/components/site/Reveal';
import { ThankYouName } from '@/components/site/ThankYouName';
import { postsIn } from '@/content/blog';
import { caseStudiesIn } from '@/content/work';
import { appSettings } from '@/lib/admin/settings';
import type { T } from '@/lib/i18n';
import { getI18n } from '@/lib/i18n-site';

// Reached only after the check form is sent, so it stays out of search results and the sitemap.
export async function generateMetadata(): Promise<Metadata> {
  const { t, lp } = await getI18n();
  return {
    title: t('Thank you', 'Hvala'),
    description: t('Your free website audit request is in. Here is what happens next.', 'Vaš zahtev za besplatnu analizu sajta je primljen. Evo šta sledi.'),
    robots: { index: false, follow: true },
    alternates: { canonical: lp('/thank-you') },
  };
}

const steps = (t: T) => [
  {
    icon: Check,
    when: t('Done', 'Gotovo'),
    title: t('Your request is in', 'Zahtev je primljen'),
    text: t('It reached us the moment you pressed send. Nothing else is needed from you.', 'Stigao je čim ste ga poslali. Od vas ne treba ništa više.'),
  },
  {
    icon: FileText,
    when: t('Within 1 business day', 'U roku od 1 radnog dana'),
    title: t('Your audit, by email', 'Analiza stiže na vaš email'),
    text: t(
      'We look at your site, your Google Business Profile and your top local competitors, and write down the few fixes that would bring the most calls.',
      'Pregledamo vaš sajt, Google Business profil i glavnu lokalnu konkurenciju i izdvojimo nekoliko izmena koje bi vam donele najviše poziva.',
    ),
  },
  {
    icon: MessageSquare,
    when: t('Then, only if you want', 'Zatim, samo ako želite'),
    title: t('A short call to go through it', 'Kratak razgovor o rezultatima'),
    text: t(
      'Fifteen minutes to answer your questions. No pressure and no long contract: the audit is yours to keep either way.',
      'Petnaest minuta za vaša pitanja. Bez pritiska i bez dugoročnog ugovora: analiza ostaje vama šta god odlučili.',
    ),
  },
];

const guideSlugs = ['website-speed-core-web-vitals-local-business', 'call-tracking-for-contractors', 'speed-to-lead-home-services'];

export default async function ThankYouPage() {
  const { lang, t, lp } = await getI18n();
  const { company } = await appSettings();
  const posts = postsIn(lang);
  const guides = guideSlugs.map((s) => posts.find((p) => p.slug === s)).filter((p) => p !== undefined);
  const stepList = steps(t);
  return (
    <>
      <section className="bg-spotlight relative overflow-hidden py-16 text-white sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <span className="relative flex h-16 w-16 items-center justify-center" aria-hidden>
                <span className="ring-wave absolute inset-0 rounded-full ring-1 ring-accent/40" />
                <span className="ring-wave absolute inset-0 rounded-full ring-1 ring-accent/40 [animation-delay:0.8s]" />
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink-975">
                  <Check className="h-7 w-7" strokeWidth={2.75} />
                </span>
              </span>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-8 font-mono text-sm tracking-[0.14em] text-accent uppercase">{t('Request received', 'Zahtev primljen')}</p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                {t('Thanks', 'Hvala')}
                <ThankYouName />. <span className="text-gradient">{t('We’re on it.', 'Već radimo na tome.')}</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-lg text-white/75">
                {t(
                  'A real person, not a bot, reviews your website and the companies you compete with. You get the findings by email within one business day.',
                  'Vaš sajt i konkurenciju pregleda pravi čovek, ne bot. Rezultate dobijate emailom u roku od jednog radnog dana.',
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" aria-hidden /> {t('Reply within 1 business day', 'Odgovor u roku od 1 radnog dana')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" aria-hidden /> {t('Free, no obligation', 'Besplatno, bez obaveze')}
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8">
              <h2 className="font-display text-xl font-semibold">{t('What happens next', 'Šta sledi')}</h2>
              <ol className="mt-6 space-y-6">
                {stepList.map((s, i) => (
                  <li key={s.title} className="relative flex gap-4">
                    {i < stepList.length - 1 && <span className="absolute top-11 bottom-[-1.25rem] left-5 w-px bg-white/10" aria-hidden />}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${
                        i === 0 ? 'bg-accent text-ink-975 ring-accent' : 'bg-white/[0.06] text-accent ring-white/15'
                      }`}
                    >
                      <s.icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] tracking-[0.14em] text-white/50 uppercase">{s.when}</p>
                      <p className="mt-0.5 font-semibold">{s.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/65">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-7 flex gap-3 rounded-2xl bg-white/[0.04] p-4 text-sm text-white/70 ring-1 ring-white/10">
                <Inbox className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <p>
                  {t('Watch your inbox, and the spam or promotions folder just in case.', 'Pratite inbox, a za svaki slučaj i folder za spam ili promocije.')}
                  {company.email ? (
                    <>
                      {' '}
                      {t('Our reply comes from', 'Naš odgovor stiže sa')}{' '}
                      <a href={`mailto:${company.email}`} className="font-medium text-white underline-offset-2 hover:underline">
                        {company.email}
                      </a>
                      .
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="text-sm font-semibold tracking-widest text-azure-700 uppercase">{t('While you wait', 'Dok čekate')}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
                {t('What our work brought other local businesses', 'Šta smo postigli za druge firme')}
              </h2>
              <Link href={lp('/work')} className="inline-flex items-center gap-1 text-sm font-semibold text-azure-700 hover:underline">
                {t('All case studies', 'Sve studije slučaja')} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudiesIn(lang).slice(0, 3).map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <CaseCard item={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200/70 bg-zinc-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
              {t('Three short guides worth reading first', 'Tri kratka vodiča koja vredi pročitati')}
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-600">{t('They answer the questions we hear most on the first call.', 'Odgovaraju na pitanja koja najčešće čujemo na prvom razgovoru.')}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href={lp('/')}
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
            >
              {t('Back to the homepage', 'Nazad na početnu')} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
