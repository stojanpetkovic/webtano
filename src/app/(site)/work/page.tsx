import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CaseCard } from '@/components/site/CaseCard';
import { caseStudies } from '@/content/work';

export const metadata: Metadata = {
  title: 'Case studies',
  description: 'Websites, local SEO and Google Ads for tree services, a dental practice and a medical transport company, with the numbers from their own lead tracking.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <>
      <section className="bg-forest-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold tracking-widest text-lime uppercase">Case studies</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            The work, and what it brought in
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">
            Every figure comes from the client’s own lead tracking, ad account or a Lighthouse run on the live site.
          </p>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          {caseStudies.map((c) => (
            <CaseCard key={c.slug} item={c} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/#check"
            className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 font-semibold text-white transition hover:bg-forest-800"
          >
            Get a free website check
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
