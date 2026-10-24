import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { CountUp } from '@/components/site/CountUp';
import { Reveal } from '@/components/site/Reveal';
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
      <header className="bg-spotlight relative overflow-hidden pt-12 pb-28 text-white sm:pt-16">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/work" className="group inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-sm text-white/75 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            All case studies
          </Link>
          <p className="mt-8 text-sm font-semibold tracking-widest text-lime uppercase">
            {item.sector} · {item.location}
          </p>
          <Reveal>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">{item.client}</h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-4 max-w-2xl text-lg text-white/75">{item.summary}</p>
          </Reveal>
          <ul className="mt-6 flex flex-wrap gap-2">
            {item.services.map((s) => (
              <li key={s} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="relative mx-auto -mt-16 max-w-6xl px-4 sm:px-6">
        <Reveal variant="scale" className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-float">
          <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 text-xs text-zinc-500 ring-1 ring-zinc-200">
              {item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </span>
          </div>
          <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(min-width: 1152px) 72rem, 100vw" className="h-auto w-full" />
        </Reveal>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[item.headline, ...item.stats].map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="flex flex-col-reverse rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <dt className="mt-1 text-sm text-zinc-600">{s.label}</dt>
              <dd className="font-display text-3xl font-bold text-forest-700">
                <CountUp value={s.value} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-12">
          <Reveal as="section">
            <h2 className="font-display text-2xl font-bold text-forest-950">The challenge</h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-zinc-700">
              {item.challenge.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal as="section">
            <h2 className="font-display text-2xl font-bold text-forest-950">What we did</h2>
            <ul className="mt-5 -mx-3 space-y-2">
              {item.work.map((w) => (
                <li key={w.title} className="flex gap-4 rounded-2xl border border-transparent p-3 transition hover:border-zinc-200 hover:bg-white hover:shadow-soft">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-700 text-lime shadow-soft">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-forest-950">{w.title}</h3>
                    <p className="mt-1 text-zinc-600">{w.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal as="section">
            <h2 className="font-display text-2xl font-bold text-forest-950">The result</h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-zinc-700">
              {item.outcome.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-soft">
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
            className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 font-semibold text-forest-950 shadow-soft transition hover:-translate-y-0.5 hover:border-forest-200 hover:shadow-lift"
          >
            Visit the live site
            <ExternalLink className="h-4 w-4 text-forest-700" aria-hidden />
          </a>
          <div className="relative overflow-hidden rounded-2xl bg-forest-950 p-6 text-white shadow-lift">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-lime/20 blur-2xl" aria-hidden />
            <h2 className="font-display text-lg font-bold">Want numbers like these?</h2>
            <p className="mt-2 text-sm text-white/75">Start with a free check of your current website.</p>
            <Link
              href="/#hero-form"
              className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-forest-950 shadow-glow transition hover:-translate-y-px hover:bg-lime-dark"
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
            {gallery.map((shot, i) => (
              <Reveal as="figure" key={shot.src} delay={(i % 2) * 100} className="group overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-soft transition hover:shadow-lift">
                <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(min-width: 768px) 34rem, 100vw" className="h-auto w-full" />
                <figcaption className="p-4 text-sm text-zinc-600">{shot.alt}</figcaption>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="Next case study" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href={`/work/${next.slug}`} className="group flex items-center justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-forest-200 hover:shadow-lift sm:p-8">
            <span>
              <span className="text-sm text-zinc-500">Next case study</span>
              <span className="mt-1 block font-display text-2xl font-bold text-forest-950">{next.client}</span>
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-700 ring-1 ring-forest-100 transition group-hover:bg-forest-700 group-hover:text-lime">
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
