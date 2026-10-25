import Link from 'next/link';
import { Fragment } from 'react';

const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders the two bits of inline markup posts use: **bold** and [text](href). */
export function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(
        <strong key={m.index} className="font-semibold text-ink-950">
          {m[1]}
        </strong>,
      );
    } else {
      const href = m[3];
      const cls = 'font-medium text-azure-700 underline decoration-azure-200 decoration-2 underline-offset-[3px] transition hover:decoration-azure-700';
      out.push(
        href.startsWith('/') ? (
          <Link key={m.index} href={href} className={cls}>
            {m[2]}
          </Link>
        ) : (
          <a key={m.index} href={href} target="_blank" rel="noopener" className={cls}>
            {m[2]}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}
