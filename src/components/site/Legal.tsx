import type { ReactNode } from 'react';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** The shared page for the privacy notice and the terms: title, date, contents and numbered sections. */
export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: ReactNode; sections: LegalSection[] }) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-950">{title}</h1>
        <p className="mt-3 text-sm text-zinc-500">Last updated {updated}</p>
        <div className="mt-6 text-lg leading-relaxed text-zinc-700">{intro}</div>

        <nav aria-label="Contents" className="mt-8 rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200 max-md:hidden">
          <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">Contents</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-zinc-700 underline-offset-2 hover:text-ink-950 hover:underline">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <div key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-display text-xl font-bold text-ink-950 sm:text-2xl">
                {i + 1}. {s.title}
              </h2>
              <div className="legal mt-3 space-y-3 text-base leading-relaxed text-zinc-700 sm:text-[17px]">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A plain bulleted list inside a section. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 ps-5 marker:text-zinc-400">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** A small table that scrolls sideways on its own when it is wider than a phone. */
export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-zinc-200">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-zinc-50 text-xs text-zinc-500 uppercase">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-2.5 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
