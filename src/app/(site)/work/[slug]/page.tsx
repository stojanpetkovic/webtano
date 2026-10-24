import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { caseStudies, findCase } from '@/content/work';

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const item = findCase(slug);
  if (!item) return {};
  return {
    title: `${item.client} case study`,
    description: `${item.sector} in ${item.location}: ${item.summary}`,
    alternates: { canonical: `/work/${item.slug}` },
    openGraph: { images: [item.shots[0].src] },
  };
}

export default async function CasePage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const item = findCase(slug);
  if (!item) notFound();

  const index = caseStudies.indexOf(item);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const [hero, ...gallery] = item.shots;
  const lighthouse = [
    { label: 'Performance', value: item.lighthouse.performance },
    { label: 'Accessibility', value: item.lighthouse.accessibility },
    { label: 'Best practices', value: item.lighthouse.bestPractices },
    { label: 'SEO', value: item.lighthouse.seo },
  ];

  return (
    <article>
      <header className="bg-forest-950 pt-12 pb-24 text-white sm:pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/work" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All case studies
          </Link>
          <p className="mt-8 text-sm font-semibold tracking-widest text-lime uppercase">
            {item.sector} · {item.location}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{item.client}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">{item.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {item.services.map((s) => (
              <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="mx-auto -mt-14 max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
          <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(min-width: 1152px) 72rem, 100vw" className="h-auto w-full" />
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[item.headline, ...item.stats].map((s) => (
            <div key={s.label} className="rounded-2xl border border-forest-100 bg-forest-50 p-5">
              <dd className="font-display text-3xl font-bold text-forest-700">{s.value}</dd>
              <dt className="mt-1 text-sm text-zinc-600">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-bold text-forest-950">The challenge</h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-zinc-700">
              {item.challenge.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-forest-950">What we did</h2>
            <ul className="mt-5 space-y-4">
              {item.work.map((w) => (
                <li key={w.title} className="flex gap-4">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-700 text-lime">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-forest-950">{w.title}</h3>
                    <p className="mt-1 text-zinc-600">{w.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-forest-950">The result</h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-zinc-700">
              {item.outcome.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="font-display text-lg font-bold text-forest-950">Lighthouse, live site</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {lighthouse.map((l) => (
                <li key={l.label} className="rounded-xl bg-forest-50 p-3 text-center">
                  <span className="block font-display text-2xl font-bold text-forest-700">{l.value}</span>
                  <span className="text-xs text-zinc-600">{l.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between rounded-2xl border border-zinc-200 p-5 font-semibold text-forest-950 transition hover:border-forest-700"
          >
            Visit the live site
            <ExternalLink className="h-4 w-4 text-forest-700" aria-hidden />
          </a>
          <div className="rounded-2xl bg-forest-950 p-6 text-white">
            <h2 className="font-display text-lg font-bold">Want numbers like these?</h2>
            <p className="mt-2 text-sm text-white/75">Start with a free check of your current website.</p>
            <Link
              href="/#check"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-forest-950 hover:bg-lime-dark"
            >
              Free website check
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </aside>
      </div>

      {gallery.length > 0 && (
        <section className="bg-forest-50 py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
            {gallery.map((shot) => (
              <figure key={shot.src} className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm">
                <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(min-width: 768px) 34rem, 100vw" className="h-auto w-full" />
                <figcaption className="p-4 text-sm text-zinc-600">{shot.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="Next case study" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href={`/work/${next.slug}`} className="group flex items-center justify-between rounded-3xl border border-zinc-200 p-6 transition hover:border-forest-700 sm:p-8">
            <span>
              <span className="text-sm text-zinc-500">Next case study</span>
              <span className="mt-1 block font-display text-2xl font-bold text-forest-950">{next.client}</span>
            </span>
            <ArrowRight className="h-6 w-6 text-forest-700 transition group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </nav>
    </article>
  );
}
