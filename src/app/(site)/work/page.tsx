import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CaseCard } from '@/components/site/CaseCard';
import { Reveal } from '@/components/site/Reveal';
import { caseStudies } from '@/content/work';

export const metadata: Metadata = {
  title: 'Case studies',
  description: 'Websites, local SEO and Google Ads for tree services, a dental practice and a medical transport company, with the numbers from their own lead tracking.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <>
      <section className="bg-spotlight relative overflow-hidden py-16 text-white sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="text-sm font-semibold tracking-widest text-accent uppercase">Case studies</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              The work, and <span className="text-gradient">what it brought in</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-2xl text-lg text-white/75">
              Every figure comes from the client’s own lead tracking, ad account or a Lighthouse run on the live site.
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
            href="/#hero-form"
            className="group inline-flex items-center gap-2 rounded-full bg-azure-700 px-6 py-3.5 font-semibold text-white shadow-[0_10px_24px_-10px_rgb(37_99_235/0.7)] transition hover:-translate-y-px hover:bg-ink-800"
          >
            Get a free website check
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
