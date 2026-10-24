import Link from 'next/link';
import { RANGES, type RangeDays } from '@/lib/admin/analytics';

const label = (days: number) => (days === 7 ? '7 dana' : days === 30 ? '30 dana' : '90 dana');

export function RangeTabs({ current, path, params }: { current: RangeDays; path: string; params: URLSearchParams }) {
  const hrefFor = (days: number) => {
    const next = new URLSearchParams(params);
    next.set('range', String(days));
    next.delete('created');
    return `${path}?${next}`;
  };
  return (
    <nav className="inline-flex rounded border border-line bg-white p-0.5" aria-label="Period">
      {RANGES.map((days) => (
        <Link
          key={days}
          href={hrefFor(days)}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
            days === current ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
          aria-current={days === current ? 'page' : undefined}
        >
          {label(days)}
        </Link>
      ))}
    </nav>
  );
}
