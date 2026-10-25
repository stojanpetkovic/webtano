import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Page numbers to show: the first, the last and two around the current one, with gaps as null. */
export function pageList(page: number, pages: number): (number | null)[] {
  const keep = new Set([1, pages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (page >= pages - 2) [pages - 1, pages - 2, pages - 3].forEach((n) => keep.add(n));
  const list = [...keep].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  list.forEach((n, i) => {
    if (i && n - list[i - 1] > 1) out.push(null);
    out.push(n);
  });
  return out;
}

/**
 * The footer under a paged table: "Prikaz 1–25 od 186", the page size and the
 * numbered pages. Plain links, so it works without JavaScript.
 */
export function Pagination({
  page,
  pageSize,
  total,
  href,
  sizes = [25, 50, 100],
  noun = 'stavki',
}: {
  page: number;
  pageSize: number;
  total: number;
  /** Link to a page, with an optional new page size. */
  href: (page: number, size?: number) => string;
  sizes?: number[];
  noun?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);
  const base = 'grid h-8 min-w-8 place-items-center rounded-lg px-2 text-[13px] font-medium tabular-nums transition';

  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-zinc-500">
        <span>
          Prikaz <span className="font-medium text-ink tabular-nums">{first}–{last}</span> od{' '}
          <span className="font-medium text-ink tabular-nums">{total.toLocaleString('sr-Latn-RS')}</span> {noun}
        </span>
        {sizes.length > 1 && (
          <span className="flex items-center gap-1.5">
            Po strani:
            <span className="segmented p-0.5">
              {sizes.map((s) => (
                <Link key={s} href={href(1, s)} aria-current={s === pageSize ? 'true' : undefined} className="!px-2 !py-1">
                  {s}
                </Link>
              ))}
            </span>
          </span>
        )}
      </div>

      {pages > 1 && (
        <nav className="flex items-center gap-1" aria-label="Strane">
          {page > 1 ? (
            <Link href={href(page - 1)} className={`${base} text-zinc-600 hover:bg-zinc-100`} aria-label="Prethodna strana">
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span className={`${base} text-zinc-300`} aria-hidden="true">
              <ChevronLeft className="size-4" />
            </span>
          )}
          {pageList(page, pages).map((n, i) =>
            n === null ? (
              <span key={`gap-${i}`} className="px-1 text-zinc-400">
                …
              </span>
            ) : n === page ? (
              <span key={n} className={`${base} bg-ink-950 text-white shadow-sm`} aria-current="page">
                {n}
              </span>
            ) : (
              <Link key={n} href={href(n)} className={`${base} text-zinc-600 hover:bg-zinc-100`}>
                {n}
              </Link>
            ),
          )}
          {page < pages ? (
            <Link href={href(page + 1)} className={`${base} text-zinc-600 hover:bg-zinc-100`} aria-label="Sledeća strana">
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span className={`${base} text-zinc-300`} aria-hidden="true">
              <ChevronRight className="size-4" />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
