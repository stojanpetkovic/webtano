import Link from 'next/link';
import { RANGES, type RangeDays } from '@/lib/admin/analytics';
import { getAdminI18n } from '@/lib/admin/i18n';

export async function RangeTabs({ current, path, params }: { current: RangeDays; path: string; params: URLSearchParams }) {
  const { t } = await getAdminI18n();
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
          {days} {t('days', 'dana')}
        </Link>
      ))}
    </nav>
  );
}
