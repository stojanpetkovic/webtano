import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Plus } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { Pagination } from '@/components/admin/Pagination';
import { Sparkline } from '@/components/admin/Sparkline';
import { db } from '@/lib/admin/supabase';
import { timeAgo } from '@/lib/admin/format';
import { dailySeries, daysAgo } from '@/lib/admin/stats';
import { toParams } from '@/lib/admin/params';
import type { Site } from '@/lib/admin/types';
import { NewSiteForm } from './SiteForms';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Sajtovi' };

const PAGE_SIZE = 10;

export default async function SitesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const since = daysAgo(30);
  const [{ data: sitesData }, { data: recent }] = await Promise.all([
    db().from('sites').select('*').order('name'),
    db()
      .from('leads')
      .select('site_id, created_at')
      .eq('is_spam', false)
      .gte('created_at', since)
      .order('created_at', { ascending: false }),
  ]);
  const allSites = (sitesData ?? []) as Site[];
  const rows = (recent ?? []) as { site_id: string; created_at: string }[];
  const counts = new Map<string, { n: number; last: string }>();
  for (const row of rows) {
    const c = counts.get(row.site_id);
    if (c) c.n++;
    else counts.set(row.site_id, { n: 1, last: row.created_at });
  }

  const pages = Math.max(1, Math.ceil(allSites.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(query.get('page')) || 1)));
  const sites = allSites.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const active = allSites.filter((s) => s.active).length;

  return (
    <>
      <PageHeading title="Sajtovi" description={`${allSites.length} sajtova, ${active} aktivnih. Lidovi i posete za poslednjih 30 dana.`}>
        <a href="#novi" className="btn btn-primary">
          <Plus className="size-4" /> Dodaj sajt
        </a>
      </PageHeading>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Sajt</th>
                <th>Klijent</th>
                <th className="text-right">Lidovi, 30 dana</th>
                <th className="hidden md:table-cell">Trend</th>
                <th>Poslednji lid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sites.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-8">
                    Još nema sajtova. Dodaj prvi ispod.
                  </td>
                </tr>
              )}
              {sites.map((site) => {
                const c = counts.get(site.id);
                return (
                  <tr key={site.id} className="relative">
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-100 text-zinc-500 ring-1 ring-zinc-900/5 ring-inset">
                          <Globe className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <Link href={`/admin/sites/${site.id}`} className="font-medium text-ink after:absolute after:inset-0 hover:text-primary">
                            {site.name}
                          </Link>
                          <div className="text-xs text-muted">{site.domain}</div>
                        </div>
                      </div>
                    </td>
                    <td>{site.client_name ?? '—'}</td>
                    <td className="text-right font-semibold text-ink tabular-nums">{c?.n ?? 0}</td>
                    <td className="hidden md:table-cell">
                      <Sparkline
                        data={dailySeries(rows.filter((r) => r.site_id === site.id), 30, 'Europe/Belgrade').map((d) => d.count)}
                        className="h-8 w-28"
                      />
                    </td>
                    <td className="text-muted whitespace-nowrap">{c ? timeAgo(c.last) : '—'}</td>
                    <td>{site.active ? <span className="badge badge-won">Aktivan</span> : <span className="badge badge-lost">Pauziran</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {allSites.length > PAGE_SIZE && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={allSites.length}
            href={(n) => (n > 1 ? `/admin/sites?page=${n}` : '/admin/sites')}
            sizes={[]}
            noun="sajtova"
          />
        )}
      </div>

      <NewSiteForm />
    </>
  );
}
