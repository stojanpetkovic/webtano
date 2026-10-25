import { Lightbulb } from 'lucide-react';
import { headingId, type Block } from '@/content/blog';
import { DEFAULT_LANG, type Lang } from '@/lib/i18n';
import { Inline } from './Inline';

/** The article text, styled here rather than with a typography plugin. */
export function ArticleBody({ blocks, lang = DEFAULT_LANG }: { blocks: Block[]; lang?: Lang }) {
  return (
    <div className="text-[1.0625rem] leading-[1.8] text-zinc-700">
      {blocks.map((b, i) => {
        if ('h2' in b)
          return (
            <h2 key={i} id={headingId(b.h2)} className="mt-14 scroll-mt-28 font-display text-[1.65rem] leading-tight font-bold tracking-tight text-ink-950 first:mt-0 sm:text-3xl">
              {b.h2}
            </h2>
          );
        if ('h3' in b)
          return (
            <h3 key={i} className="mt-9 font-display text-xl font-semibold text-ink-950">
              {b.h3}
            </h3>
          );
        if ('p' in b)
          return (
            <p key={i} className="mt-5">
              <Inline lang={lang} text={b.p} />
            </p>
          );
        if ('ul' in b)
          return (
            <ul key={i} className="mt-5 space-y-3">
              {b.ul.map((item) => (
                <li key={item} className="relative pl-7">
                  <span className="absolute top-[0.7em] left-1 h-2 w-2 rounded-full bg-accent ring-4 ring-accent/15" aria-hidden />
                  <Inline lang={lang} text={item} />
                </li>
              ))}
            </ul>
          );
        if ('ol' in b)
          return (
            <ol key={i} className="mt-6 space-y-4">
              {b.ol.map((item, n) => (
                <li key={item} className="relative pl-11">
                  <span className="absolute top-0.5 left-0 flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 font-mono text-xs font-medium text-accent" aria-hidden>
                    {n + 1}
                  </span>
                  <Inline lang={lang} text={item} />
                </li>
              ))}
            </ol>
          );
        if ('tip' in b)
          return (
            <aside key={i} className="mt-8 flex gap-4 rounded-2xl bg-azure-50 p-5 ring-1 ring-azure-100 sm:p-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-azure-700 ring-1 ring-azure-100" aria-hidden>
                <Lightbulb className="h-4 w-4" />
              </span>
              <div className="text-base leading-relaxed">
                {b.title && <p className="font-display font-semibold text-ink-950">{b.title}</p>}
                <p className={b.title ? 'mt-1' : ''}>
                  <Inline lang={lang} text={b.tip} />
                </p>
              </div>
            </aside>
          );
        return (
          <div key={i} className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-zinc-200">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem] leading-snug">
              <thead className="bg-zinc-50 text-ink-950">
                <tr>
                  {b.table.head.map((h, k) => (
                    <th key={k} scope="col" className="border-b border-zinc-200 px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.table.rows.map((row, r) => (
                  <tr key={r} className="border-b border-zinc-100 last:border-0">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row" className="px-4 py-3 align-top font-medium text-ink-950">
                          <Inline lang={lang} text={cell} />
                        </th>
                      ) : (
                        <td key={c} className="px-4 py-3 align-top">
                          <Inline lang={lang} text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
