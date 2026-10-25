import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Clock, FileText, Inbox, MessageSquare, ShieldCheck } from 'lucide-react';
import { CaseCard } from '@/components/site/CaseCard';
import { PostCard } from '@/components/blog/PostCard';
import { Reveal } from '@/components/site/Reveal';
import { ThankYouName } from '@/components/site/ThankYouName';
import { posts } from '@/content/blog';
import { caseStudies } from '@/content/work';
import { appSettings } from '@/lib/admin/settings';

// Reached only after the check form is sent, so it stays out of search results and the sitemap.
export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Your free website check request is in. Here is what happens next.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/thank-you' },
};

const steps = [
  { icon: Check, when: 'Done', title: 'Your request is in', text: 'It reached us the moment you pressed send. Nothing else is needed from you.' },
  {
    icon: FileText,
    when: 'Within 1 business day',
    title: 'Your review, by email',
    text: 'We look at your site, your Google Business Profile and your top local competitors, and write down the few fixes that would bring the most calls.',
  },
  {
    icon: MessageSquare,
    when: 'Then, only if you want',
    title: 'A short call to go through it',
    text: 'Fifteen minutes to answer questions. No pressure and no long contract: the review is yours to keep either way.',
  },
];

const guideSlugs = ['tree-service-website-that-converts', 'google-ads-for-tree-services', 'speed-to-lead-home-services'];

export default async function ThankYouPage() {
  const { company } = await appSettings();
  const guides = guideSlugs.map((s) => posts.find((p) => p.slug === s)).filter((p) => p !== undefined);
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
              <p className="mt-8 font-mono text-sm tracking-[0.14em] text-accent uppercase">Request received</p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                Thanks
                <ThankYouName />. <span className="text-gradient">We’re on it.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-lg text-white/75">
                A real person, not a bot, reviews your website and the companies you compete with. You get the findings by email within one business
                day.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" aria-hidden /> Reply within 1 business day
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" aria-hidden /> Free, no obligation
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8">
              <h2 className="font-display text-xl font-semibold">What happens next</h2>
              <ol className="mt-6 space-y-6">
                {steps.map((s, i) => (
                  <li key={s.title} className="relative flex gap-4">
                    {i < steps.length - 1 && <span className="absolute top-11 bottom-[-1.25rem] left-5 w-px bg-white/10" aria-hidden />}
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
                  Watch your inbox, and the spam or promotions folder just in case.
                  {company.email ? (
                    <>
                      {' '}
                      Our reply comes from{' '}
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
            <p className="text-sm font-semibold tracking-widest text-azure-700 uppercase">While you wait</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
                What the work brought other local companies
              </h2>
              <Link href="/work" className="inline-flex items-center gap-1 text-sm font-semibold text-azure-700 hover:underline">
                All case studies <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.slice(0, 3).map((c, i) => (
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
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Three short guides worth reading first</h2>
            <p className="mt-3 max-w-2xl text-zinc-600">They answer the questions we hear most on the first call.</p>
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
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
            >
              Back to the homepage <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
