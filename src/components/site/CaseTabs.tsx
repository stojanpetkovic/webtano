'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Database, MapPin, ShieldCheck, Star } from 'lucide-react';
import { useLang, useLocalePath, useT } from '@/components/i18n/LangProvider';
import type { CaseStudy } from '@/content/work';
import type { T } from '@/lib/i18n';
import { CountUp } from './CountUp';

const scores = (t: T) =>
  [
    ['performance', t('Speed', 'Brzina')],
    ['accessibility', t('Accessibility', 'Pristupačnost')],
    ['bestPractices', 'Best practices'],
    ['seo', 'SEO'],
  ] as const;

/**
 * The homepage case studies as tabs: one client at a time with every figure,
 * what we did and where the numbers come from. All panels are in the HTML;
 * only the chosen one is shown.
 */
export function CaseTabs({ cases }: { cases: CaseStudy[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = useT();

  const select = (i: number) => {
    const next = (i + cases.length) % cases.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={t('Case studies', 'Studije slučaja')}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {cases.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${base}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${base}-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') select(i + 1);
                if (e.key === 'ArrowLeft') select(i - 1);
              }}
              className={`group relative flex min-w-0 items-center gap-3 rounded-2xl bg-white p-3 text-left ring-1 transition duration-300 max-md:gap-2 max-md:p-2.5 ${
                on ? 'shadow-soft ring-accent' : 'ring-zinc-200 hover:ring-zinc-300'
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-50 p-1.5 ring-1 ring-zinc-100 max-md:h-9 max-md:w-9 max-md:p-1">
                <Image src={`/clients/${c.slug}.webp`} alt="" width={96} height={96} className="h-full w-full object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-[15px] text-ink-950 max-md:text-sm">{c.client}</span>
                <span className="block truncate text-xs text-zinc-500 max-md:hidden">{c.sector}</span>
              </span>
              <span
                className={`absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-accent to-azure-600 transition duration-300 ${on ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {cases.map((c, i) => (
        <CasePanel key={c.slug} c={c} id={`${base}-panel-${i}`} labelledBy={`${base}-tab-${i}`} hidden={i !== active} />
      ))}
    </div>
  );
}

function CasePanel({ c, id, labelledBy, hidden }: { c: CaseStudy; id: string; labelledBy: string; hidden: boolean }) {
  const [shot, setShot] = useState(0);
  const lang = useLang();
  const t = useT();
  const lp = useLocalePath();
  const rating = c.stats.find((s) => s.value.endsWith('★'));
  const stats = c.stats.filter((s) => s !== rating);
  const host = c.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <article
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      className="case-panel mt-5 overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1px_2px_rgb(10_14_30/0.04),0_8px_24px_-12px_rgb(10_14_30/0.10)] ring-1 ring-zinc-200/80"
    >
      {/* Client header: who, where, what we did and the live site. */}
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-zinc-200/80 px-6 py-5 max-md:px-4 max-md:py-4 sm:px-8">
        <div className="min-w-0 flex-1 basis-full sm:basis-auto">
          <h3 className="font-display text-2xl text-ink-950 sm:text-[1.75rem]">{c.client}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
            <span>{c.sector}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {c.location}
            </span>
            {rating && (
              <span className="inline-flex items-center gap-1 text-ink-950">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                <span className="font-semibold">{rating.value.replace('★', '')}</span>
                <span className="text-zinc-500">
                  {lang === 'sr'
                    ? rating.label.startsWith('iz ')
                      ? rating.label
                      : 'na Google-u'
                    : rating.label.startsWith('across')
                      ? rating.label.replace('across', 'from')
                      : 'on Google'}
                </span>
              </span>
            )}
          </p>
        </div>
        <ul className="flex flex-wrap gap-1.5 max-md:hidden">
          {c.services.map((s) => (
            <li key={s} className="rounded-full bg-azure-50 px-2.5 py-1 text-xs font-medium text-azure-700 ring-1 ring-azure-100">
              {s}
            </li>
          ))}
        </ul>
      </header>

      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* The site: screenshots to flip through and its live Lighthouse scores. */}
        <div className="border-b border-zinc-200/80 bg-zinc-50/70 p-5 max-md:hidden sm:p-8 lg:border-r lg:border-b-0">
          <div className="overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200 shadow-[0_1px_2px_rgb(10_14_30/0.04),0_6px_16px_-8px_rgb(10_14_30/0.12)]">
            <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-zinc-300" aria-hidden />
              <span className="h-2 w-2 rounded-full bg-zinc-300" aria-hidden />
              <span className="h-2 w-2 rounded-full bg-zinc-300" aria-hidden />
              <a
                href={c.url}
                target="_blank"
                rel="noopener"
                className="ml-2 inline-flex min-w-0 items-center gap-1 truncate rounded-md bg-white px-2.5 py-0.5 text-[11px] text-zinc-500 ring-1 ring-zinc-200 transition hover:text-azure-700"
              >
                <ShieldCheck className="h-3 w-3 shrink-0 text-azure-600" aria-hidden />
                {host}
                <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden />
              </a>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
              {c.shots.map((s, k) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  className={`object-cover object-top transition duration-500 ${k === shot ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-2" role="group" aria-label={t(`${c.client} screenshots`, `${c.client} snimci ekrana`)}>
            {c.shots.map((s, k) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setShot(k)}
                aria-label={t(`Show screenshot ${k + 1}`, `Prikaži snimak ${k + 1}`)}
                aria-pressed={k === shot}
                className={`relative aspect-[16/10] w-20 overflow-hidden rounded-lg ring-1 transition sm:w-24 ${
                  k === shot ? 'ring-2 ring-accent' : 'opacity-70 ring-zinc-200 hover:opacity-100'
                }`}
              >
                <Image src={s.src} alt="" fill sizes="6rem" className="object-cover object-top" />
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">{t('Lighthouse · live site, mobile', 'Lighthouse · živ sajt, telefon')}</p>
            <ul className="mt-3 grid grid-cols-4 gap-2">
              {scores(t).map(([key, label]) => {
                const v = c.lighthouse[key];
                const good = v >= 90;
                return (
                  <li key={key} className="rounded-xl bg-white px-2 py-3 text-center ring-1 ring-zinc-200/80">
                    <p className={`font-display text-xl ${good ? 'text-emerald-600' : 'text-amber-600'}`}>{v}</p>
                    <p className="mt-0.5 text-[10px] leading-tight text-zinc-500">{label}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-zinc-200/80">
            <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">{t('The problem', 'Problem')}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{c.challenge.at(-1)}</p>
          </div>
        </div>

        {/* The numbers, the problem and what we did about it. */}
        <div className="flex flex-col p-6 max-md:p-4 sm:p-8">
          <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase max-md:hidden">{t('Results', 'Rezultati')}</p>
          <div className="mt-3 rounded-2xl bg-ink-950 p-5 text-white max-md:mt-0 max-md:p-4">
            <p className="font-display text-5xl leading-none text-accent sm:text-[3.25rem]">
              <CountUp value={c.headline.value} />
            </p>
            <p className="mt-2 text-sm text-white/70">{c.headline.label}</p>
          </div>
          <dl className={`mt-3 grid gap-3 ${stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {stats.map((m) => (
              <div key={m.label} className="flex flex-col-reverse justify-end rounded-2xl bg-zinc-50 p-3.5 ring-1 ring-zinc-200/70 sm:p-4">
                <dt className="mt-1 text-xs leading-snug text-zinc-500">{m.label}</dt>
                <dd className="font-display text-2xl text-ink-950">
                  <CountUp value={m.value} />
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 max-md:hidden">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">{t('What we did', 'Šta smo uradili')}</p>
              <ul className="mt-2 space-y-2">
                {c.work.map((w) => (
                  <li key={w.title} className="flex gap-2 text-sm leading-snug">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-azure-600" aria-hidden />
                    <span>
                      <span className="font-semibold text-ink-950">{w.title}.</span> <span className="text-zinc-600">{w.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/80 pt-5 max-md:mt-4 max-md:border-0 max-md:pt-0 max-md:[&>a]:w-full max-md:[&>a]:justify-center lg:mt-8">
            <p className="flex max-w-xs items-start gap-1.5 text-[11px] leading-snug text-zinc-500 max-md:hidden">
              <Database className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                {t('Source:', 'Izvor:')} {c.source}
              </span>
            </p>
            <Link
              href={lp(`/work/${c.slug}`)}
              className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-ink-800"
            >
              {t('Full case study', 'Cela studija slučaja')}
              <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
