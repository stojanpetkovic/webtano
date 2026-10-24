import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeading } from '@/components/admin/PageHeading';
import { LeadTable } from '@/components/admin/LeadTable';
import { db } from '@/lib/admin/supabase';
import { readFilters, leadQuery } from '@/lib/admin/leadQuery';
import { STATUS_LABELS } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import type { Lead, Site } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lidovi' };

const PAGE_SIZE = 50;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const filters = readFilters(query);
  const page = Math.max(1, Number(query.get('page')) || 1);

  const [{ data: sitesData }, { data: leadsData, count }] = await Promise.all([
    db().from('sites').select('*').order('name'),
    leadQuery(filters, '*', true).range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1),
  ]);
  const sites = (sitesData ?? []) as Site[];
  const leads = (leadsData ?? []) as unknown as Lead[];
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const params = new URLSearchParams(query);
  params.delete('page');
  const pageHref = (n: number) => `/admin/leads?${new URLSearchParams({ ...Object.fromEntries(params), page: String(n) })}`;
  const exportHref = `/admin/leads/export.csv?${params}`;

  return (
    <>
      <PageHeading title="Lidovi" />
      <form method="get" className="card card-body grid sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
        <div className="lg:col-span-2">
          <label className="form-label" htmlFor="q">Pretraga</label>
          <input className="form-input" id="q" name="q" defaultValue={filters.q} placeholder="Ime, email ili telefon" />
        </div>
        <div>
          <label className="form-label" htmlFor="site">Sajt</label>
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
          <label className="form-label" htmlFor="status">Status</label>
          <select className="form-input" id="status" name="status" defaultValue={filters.status}>
            <option value="">Svi</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="from">Od</label>
          <input className="form-input" type="date" id="from" name="from" defaultValue={filters.from} />
        </div>
        <div>
          <label className="form-label" htmlFor="to">Do</label>
          <input className="form-input" type="date" id="to" name="to" defaultValue={filters.to} />
        </div>
        <div className="lg:col-span-6 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-[13px] text-zinc-700">
            <input type="checkbox" name="spam" value="1" defaultChecked={filters.spam} className="size-4 accent-primary" />
            Prikaži samo spam
          </label>
          <div className="ml-auto flex gap-2">
            <Link href="/admin/leads" className="btn btn-light">
              Poništi
            </Link>
            <a href={exportHref} className="btn btn-outline">
              Izvezi CSV
            </a>
            <button className="btn btn-primary" type="submit">
              Filtriraj
            </button>
          </div>
        </div>
      </form>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {total} {total === 1 ? 'lid' : 'lidova'}
          </h2>
          <span className="text-muted text-xs">
            Strana {page} od {pages}
          </span>
        </div>
        <LeadTable leads={leads} sites={new Map(sites.map((s) => [s.id, s]))} empty="Nema lidova za ove filtere." />
        {pages > 1 && (
          <div className="flex justify-between gap-3 border-t border-line px-5 py-3">
            {page > 1 ? (
              <Link className="btn btn-light btn-sm" href={pageHref(page - 1)}>
                ← Novije
              </Link>
            ) : (
              <span />
            )}
            {page < pages ? (
              <Link className="btn btn-light btn-sm" href={pageHref(page + 1)}>
                Starije →
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>
    </>
  );
}
