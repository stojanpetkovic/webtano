import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { LeadTable } from '@/components/admin/LeadTable';
import { Pagination } from '@/components/admin/Pagination';
import { db } from '@/lib/admin/supabase';
import { readFilters, leadQuery } from '@/lib/admin/leadQuery';
import { STATUS_LABELS } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import type { Lead, LeadStatus, Site } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lidovi' };

const SIZES = [25, 50, 100];

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const filters = readFilters(query);
  const size = SIZES.includes(Number(query.get('size'))) ? Number(query.get('size')) : SIZES[0];
  const requested = Math.max(1, Math.floor(Number(query.get('page')) || 1));

  // How many leads each status tab holds under the other filters.
  const statuses: ('' | LeadStatus)[] = ['', 'new', 'contacted', 'won', 'lost'];
  const [{ data: sitesData }, ...tabCounts] = await Promise.all([
    db().from('sites').select('*').order('name'),
    ...statuses.map((status) => leadQuery({ ...filters, status }, 'id', true).limit(1)),
  ]);
  const total = tabCounts[statuses.indexOf(filters.status)].count ?? 0;
  const pages = Math.max(1, Math.ceil(total / size));
  const page = Math.min(requested, pages);
  const { data: leadsData } = await leadQuery(filters, '*', false).range((page - 1) * size, page * size - 1);

  const sites = (sitesData ?? []) as Site[];
  const leads = (leadsData ?? []) as unknown as Lead[];

  const base = new URLSearchParams(query);
  base.delete('page');
  const link = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(base);
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    }
    const s = next.toString();
    return s ? `/admin/leads?${s}` : '/admin/leads';
  };
  const pageHref = (n: number, s?: number) => link({ page: n > 1 ? String(n) : null, ...(s ? { size: s === SIZES[0] ? null : String(s) } : {}) });
  const exportParams = new URLSearchParams(base);
  exportParams.delete('size');
  const exportHref = `/admin/leads/export.csv?${exportParams}`;
  const filtered = Boolean(filters.q || filters.site || filters.from || filters.to || filters.spam);

  return (
    <>
      <PageHeading title="Lidovi" description="Svi upiti sa svih sajtova, najnoviji prvi.">
        <a href={exportHref} className="btn btn-outline">
          <Download className="size-4" /> Izvezi CSV
        </a>
      </PageHeading>

      <div className="card">
        {/* Status tabs with their counts. */}
        <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-2" aria-label="Status">
          {statuses.map((status, i) => {
            const active = status === filters.status;
            return (
              <Link
                key={status || 'all'}
                href={link({ status: status || null })}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-medium transition ${
                  active ? 'border-ink text-ink' : 'border-transparent text-zinc-500 hover:text-ink'
                }`}
              >
                {status ? STATUS_LABELS[status] : 'Svi'}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[10.5px] leading-none tabular-nums ${
                    active ? 'bg-ink text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {tabCounts[i].count ?? 0}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Filters. */}
        <form method="get" className="grid grid-cols-2 items-end gap-3 border-b border-line p-4 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]">
          {filters.status && <input type="hidden" name="status" value={filters.status} />}
          {size !== SIZES[0] && <input type="hidden" name="size" value={size} />}
          <div className="relative col-span-2 lg:col-span-1">
            <label className="sr-only" htmlFor="q">
              Pretraga
            </label>
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input className="form-input ps-10" id="q" name="q" type="search" defaultValue={filters.q} placeholder="Ime, email ili telefon" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="sr-only" htmlFor="site">
              Sajt
            </label>
            <select className="form-input" id="site" name="site" defaultValue={filters.site}>
              <option value="">Svi sajtovi</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="from">
              Od
            </label>
            <input className="form-input" type="date" id="from" name="from" defaultValue={filters.from} title="Od datuma" />
          </div>
          <div>
            <label className="sr-only" htmlFor="to">
              Do
            </label>
            <input className="form-input" type="date" id="to" name="to" defaultValue={filters.to} title="Do datuma" />
          </div>
          <div className="col-span-2 flex gap-2 sm:col-span-1">
            <button className="btn btn-primary flex-1 lg:flex-none" type="submit">
              <SlidersHorizontal className="size-4" /> Filtriraj
            </button>
            {filtered && (
              <Link href={link({ q: null, site: null, from: null, to: null, spam: null })} className="btn btn-light" title="Poništi filtere">
                <RotateCcw className="size-4" />
                <span className="sr-only">Poništi</span>
              </Link>
            )}
          </div>
          <label className="col-span-2 inline-flex items-center gap-2 text-[13px] text-zinc-600 lg:col-span-5">
            <input type="checkbox" name="spam" value="1" defaultChecked={filters.spam} className="size-4 rounded accent-ink-950" />
            Prikaži samo spam
          </label>
        </form>

        <LeadTable leads={leads} sites={new Map(sites.map((s) => [s.id, s]))} empty="Nema lidova za ove filtere." />
        <Pagination page={page} pageSize={size} total={total} href={pageHref} sizes={SIZES} noun={total === 1 ? 'lida' : 'lidova'} />
      </div>
    </>
  );
}
