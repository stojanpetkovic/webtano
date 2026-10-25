'use client';

import { useId, useState } from 'react';

/**
 * The FAQ as an accordion: one answer open at a time, opening and closing with
 * a height and fade animation. Answers stay in the HTML, so search engines and
 * the page's structured data see them even when closed.
 */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="divide-y divide-zinc-200">
      {items.map((f, i) => {
        const isOpen = open === i;
        const button = `${base}-q${i}`;
        const panel = `${base}-a${i}`;
        return (
          <li key={f.q} className="group" data-open={isOpen || undefined}>
            <h3>
              <button
                id={button}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center gap-4 py-6 text-left"
              >
                <span className="font-mono text-xs text-zinc-400 transition-colors duration-300 group-data-open:text-azure-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-display text-[1.08rem] text-ink-950 transition-colors duration-300 group-hover:text-azure-700 sm:text-lg">
                  {f.q}
                </span>
                <span
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ink-950 ring-1 ring-zinc-200 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ring-zinc-300 group-data-open:rotate-180 group-data-open:bg-ink-950 group-data-open:text-accent group-data-open:ring-ink-950"
                  aria-hidden
                >
                  <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                  <span className="absolute h-3.5 w-0.5 rounded-full bg-current transition duration-500 group-data-open:scale-y-0" />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={button}
              inert={!isOpen}
              className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-open:grid-rows-[1fr]"
            >
              <div className="overflow-hidden">
                <p className="translate-y-2 pr-2 pb-6 pl-9 leading-relaxed text-zinc-600 opacity-0 transition duration-500 ease-out group-data-open:translate-y-0 group-data-open:opacity-100 group-data-open:delay-100 sm:pr-12">
                  {f.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
