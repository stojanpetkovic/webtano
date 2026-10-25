import Link from 'next/link';
import type { ReactNode } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { PERIODS, type Period } from '@/lib/admin/finance/labels';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { L } from '@/lib/i18n';

/** Period chips, a category filter and a search box, shared by the income and expense lists. */
export async function LedgerFilters({
  base,
  period,
  category,
  q,
  categories,
}: {
  base: string;
  period: Period | 'all';
  category: string;
  q: string;
  categories: [string, string][];
}) {
  const { lang, t } = await getAdminI18n();
  const href = (changes: Record<string, string | null>) => {
    const p = new URLSearchParams({ ...(period !== '12m' ? { period } : {}), ...(category ? { category } : {}), ...(q ? { q } : {}) });
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === '' || (k === 'period' && v === '12m')) p.delete(k);
      else p.set(k, v);
    }
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };
  const periods: [Period | 'all', string][] = [...(Object.entries(PERIODS) as [Period, L][]).map(([k, v]) => [k, v[lang]] as [Period, string]), ['all', t('All', 'Sve')]];
  return (
    <div className="space-y-3 border-b border-line p-4">
      <nav className="flex flex-wrap gap-1.5" aria-label="Period">
        {periods.map(([p, label]) => (
          <Link
            key={p}
            href={href({ period: p })}
            aria-current={p === period ? 'page' : undefined}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${p === period ? 'bg-ink text-white' : 'bg-zinc-100 text-zinc-600 hover:text-ink'}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <form method="get" className="flex flex-wrap gap-2">
        {period !== '12m' && <input type="hidden" name="period" value={period} />}
        <div className="relative min-w-0 flex-1 basis-56">
          <label className="sr-only" htmlFor="q">
            {t('Search', 'Pretraga')}
          </label>
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input className="form-input ps-10" id="q" name="q" type="search" defaultValue={q} placeholder={t('Description or vendor', 'Opis ili dobavljač')} />
        </div>
        <label className="sr-only" htmlFor="category">
          {t('Category', 'Kategorija')}
        </label>
        <select className="form-input w-auto min-w-0 flex-1 basis-40 sm:flex-none" id="category" name="category" defaultValue={category}>
          <option value="">{t('All categories', 'Sve kategorije')}</option>
          {categories.map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit">
          {t('Filter', 'Filtriraj')}
        </button>
        {(q || category) && (
          <Link href={href({ q: null, category: null })} className="btn btn-light" title={t('Clear filters', 'Poništi filtere')}>
            <RotateCcw className="size-4" />
            <span className="sr-only">{t('Clear', 'Poništi')}</span>
          </Link>
        )}
      </form>
    </div>
  );
}

const NOTICES: Record<string, [string, L]> = {
  saved: ['alert-success', { en: 'Saved.', sr: 'Sačuvano.' }],
  deleted: ['alert-success', { en: 'Deleted.', sr: 'Obrisano.' }],
  amount: ['alert-danger', { en: 'The amount must be more than zero.', sr: 'Iznos mora biti veći od nule.' }],
};

export async function Notice({ code, extra }: { code: string | null; extra?: Record<string, [string, ReactNode]> }) {
  const { lang } = await getAdminI18n();
  const base = code ? NOTICES[code] : undefined;
  const n = code ? (extra?.[code] ?? (base ? [base[0], base[1][lang]] : null)) : null;
  return n ? <div className={`alert ${n[0]}`}>{n[1]}</div> : null;
}
