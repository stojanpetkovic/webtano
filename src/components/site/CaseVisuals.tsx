import { Star } from 'lucide-react';
import type { CaseStudy } from '@/content/work';

// Floating cards for the homepage case studies. They show each site's real
// Lighthouse scores and Google rating, and animate once their case is revealed.

const LABELS = [
  ['performance', 'Speed'],
  ['accessibility', 'Access'],
  ['bestPractices', 'Quality'],
  ['seo', 'SEO'],
] as const;

/** The four Lighthouse scores of the live site as small filling rings. */
export function LighthouseCard({ scores }: { scores: CaseStudy['lighthouse'] }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <div className="rounded-2xl bg-white/95 p-4 shadow-soft ring-1 ring-zinc-200/70 backdrop-blur">
      <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">Lighthouse · live site</p>
      <ul className="mt-3 grid grid-cols-4 gap-3">
        {LABELS.map(([key, label]) => {
          const score = scores[key];
          const color = score >= 90 ? '#1f9d55' : '#e8a317';
          return (
            <li key={key} className="flex flex-col items-center">
              <span className="relative h-11 w-11">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden>
                  <circle cx="18" cy="18" r={r} fill="none" stroke="rgb(6 35 26 / 0.08)" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    className="svc-gauge"
                    style={{ '--gauge-full': c, '--gauge-to': c * (1 - score / 100) } as React.CSSProperties}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-semibold text-forest-950">
                  {score}
                </span>
              </span>
              <span className="mt-1.5 text-[10px] text-zinc-500">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The Google rating, when the case has one among its stats. */
export function RatingChip({ stats }: { stats: CaseStudy['stats'] }) {
  const rating = stats.find((s) => s.value.endsWith('★'));
  if (!rating) return null;
  return (
    <div className="flex items-center gap-2.5 rounded-full bg-white/95 py-2 pr-4 pl-2.5 shadow-soft ring-1 ring-zinc-200/70 backdrop-blur">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-200">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
      </span>
      <span className="text-xs leading-tight text-zinc-500">
        <span className="block font-display text-base text-forest-950">{rating.value.replace('★', '')} out of 5</span>
        {rating.label}
      </span>
    </div>
  );
}
