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
    <nav className="segmented" aria-label="Period">
      {RANGES.map((days) => (
        <Link key={days} href={hrefFor(days)} scroll={false} aria-current={days === current ? 'page' : undefined}>
          {label(days)}
        </Link>
      ))}
    </nav>
  );
}
