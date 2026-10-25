'use client';

import { useState, type ReactNode } from 'react';
import { useLang, useT } from '@/components/i18n/LangProvider';
import { categoryLabel, type Category } from '@/content/blog';

/**
 * Category filter over the post grid. Every card is rendered on the server and
 * stays in the HTML; filtering only hides the ones outside the chosen category.
 */
export function BlogGrid({ categories, cards }: { categories: { name: Category; count: number }[]; cards: { category: Category; node: ReactNode }[] }) {
  const [active, setActive] = useState<Category | null>(null);
  const lang = useLang();
  const t = useT();
  const total = cards.length;

  return (
    <>
      <div role="group" aria-label={t('Filter by topic', 'Filtriraj po temi')} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ name: null, count: total }, ...categories].map((c) => {
          const on = active === c.name;
          return (
            <button
              key={c.name ?? 'all'}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c.name)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition duration-200 ${
                on ? 'bg-ink-950 text-white ring-ink-950' : 'bg-white text-zinc-600 ring-zinc-200 hover:text-ink-950 hover:ring-zinc-300'
              }`}
            >
              {c.name ? categoryLabel(lang, c.name) : t('All posts', 'Svi tekstovi')}
              <span className={`font-mono text-[11px] ${on ? 'text-accent' : 'text-zinc-400'}`}>{c.count}</span>
            </button>
          );
        })}
      </div>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <li key={i} hidden={active !== null && c.category !== active}>
            {c.node}
          </li>
        ))}
      </ul>
    </>
  );
}
