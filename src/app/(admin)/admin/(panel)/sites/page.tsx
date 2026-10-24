import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeading } from '@/components/admin/PageHeading';
import { db } from '@/lib/admin/supabase';
import { timeAgo } from '@/lib/admin/format';
import { daysAgo } from '@/lib/admin/stats';
import type { Site } from '@/lib/admin/types';
import { NewSiteForm } from './SiteForms';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Sajtovi' };

export default async function SitesPage() {
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
  const sites = (sitesData ?? []) as Site[];
  const counts = new Map<string, { n: number; last: string }>();
  for (const row of (recent ?? []) as { site_id: string; created_at: string }[]) {
    const c = counts.get(row.site_id);
    if (c) c.n++;
    else counts.set(row.site_id, { n: 1, last: row.created_at });
  }

  return (
    <>
      <PageHeading title="Sajtovi" />
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Sajtovi ({sites.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Sajt</th>
                <th>Klijent</th>
                <th>Lidovi (30 dana)</th>
                <th>Poslednji lid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sites.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-8">
                    Još nema sajtova. Dodaj prvi ispod.
                  </td>
                </tr>
              )}
              {sites.map((site) => {
                const c = counts.get(site.id);
                return (
                  <tr key={site.id}>
                    <td>
                      <Link href={`/admin/sites/${site.id}`} className="font-medium text-ink hover:text-primary">
                        {site.name}
                      </Link>
                      <div className="text-xs text-muted">{site.domain}</div>
                    </td>
                    <td>{site.client_name ?? '—'}</td>
                    <td className="tabular-nums font-semibold text-ink">{c?.n ?? 0}</td>
                    <td className="text-muted whitespace-nowrap">{c ? timeAgo(c.last) : '—'}</td>
                    <td>{site.active ? <span className="badge badge-won">Aktivan</span> : <span className="badge badge-lost">Pauziran</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewSiteForm />
    </>
  );
}
