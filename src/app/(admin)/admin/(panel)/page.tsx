import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck, CalendarDays, Inbox, MoveRight, Users } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { StatCard } from '@/components/admin/StatCard';
import { DailyChart } from '@/components/admin/DailyChart';
import { BarList } from '@/components/admin/BarList';
import { LeadTable } from '@/components/admin/LeadTable';
import { db } from '@/lib/admin/supabase';
import { dailySeries, summarize, daysAgo } from '@/lib/admin/stats';
import { sitesOverview, rate } from '@/lib/admin/analytics';
import type { Lead, Site } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Kontrolna tabla' };

const DAYS = 30;

export default async function DashboardPage() {
  const since = daysAgo(60);
  const [{ data: sitesData }, { data: leadsData }] = await Promise.all([
    db().from('sites').select('*').order('name'),
    db().from('leads').select('*').eq('is_spam', false).gte('created_at', since).order('created_at', { ascending: false }),
  ]);

  const sites = (sitesData ?? []) as Site[];
  const leads = (leadsData ?? []) as Lead[];
  const siteMap = new Map(sites.map((s) => [s.id, s]));
  const stats = summarize(leads);

  const labels = dailySeries([], DAYS, 'Europe/Belgrade').map((d) => d.day);
  const series = sites
    .map((site) => ({
      label: site.name,
      data: dailySeries(leads.filter((l) => l.site_id === site.id), DAYS, 'Europe/Belgrade').map((d) => d.count),
    }))
    .filter((s) => s.data.some((n) => n > 0));

  const overview = (await sitesOverview(sites, 30)).sort((a, b) => b.visitors - a.visitors || b.contacts - a.contacts);
  const visitors30 = overview.reduce((n, o) => n + o.visitors, 0);
  const changeNote =
    stats.change === null ? 'nema podataka za prethodni period' : `${stats.change >= 0 ? '+' : ''}${stats.change}% u odnosu na prethodnih 30 dana`;

  return (
    <>
      <PageHeading title="Kontrolna tabla" />
      {sites.length === 0 && (
        <div className="card card-body flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="card-title">Dodaj prvi sajt</h2>
            <p className="text-muted mt-1">Svaki sajt dobija svoj ključ i jednu liniju koda koja šalje forme ovde.</p>
          </div>
          <Link href="/admin/sites" className="btn btn-primary">
            Dodaj sajt
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={CalendarCheck} color="success" label="Upiti danas" value={stats.today} />
        <StatCard icon={CalendarDays} color="warning" label="Upiti, 7 dana" value={stats.last7} />
        <StatCard
          icon={Inbox}
          color="secondary"
          label="Upiti, 30 dana"
          value={stats.last30}
          note={changeNote}
          tone={stats.change === null ? 'neutral' : stats.change >= 0 ? 'up' : 'down'}
        />
        <StatCard
          icon={Users}
          color="info"
          label="Posetioci, 30 dana"
          value={visitors30.toLocaleString('sr-Latn-RS')}
          note={`na ${sites.filter((s) => s.active).length} aktivnih sajtova`}
        />
      </div>

      <DailyChart
        title="Lidovi po danu (30 dana)"
        labels={labels}
        series={series.length ? series : [{ label: 'Lidovi', data: labels.map(() => 0) }]}
      />

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Sajtovi, 30 dana</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Sajt</th>
                  <th className="text-right">Posetioci</th>
                  <th className="text-right">Upiti</th>
                  <th className="text-right">Pozivi</th>
                  <th className="text-right">Stopa</th>
                </tr>
              </thead>
              <tbody>
                {overview.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-6">
                      Još nema sajtova.
                    </td>
                  </tr>
                )}
                {overview.map((o) => (
                  <tr key={o.site.id}>
                    <td>
                      <Link href={`/admin/sites/${o.site.id}`} className="font-medium text-ink hover:text-primary">
                        {o.site.name}
                      </Link>
                    </td>
                    <td className="text-right tabular-nums">{o.visitors.toLocaleString('sr-Latn-RS')}</td>
                    <td className="text-right tabular-nums font-semibold text-ink">{o.leads}</td>
                    <td className="text-right tabular-nums font-semibold text-ink">{o.calls}</td>
                    <td className="text-right tabular-nums text-muted">{rate(o.contacts, o.visits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <BarList title="Po izvoru (60 dana)" items={stats.bySource} />
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Poslednji lidovi</h2>
          <Link href="/admin/leads" className="btn btn-sm btn-soft">
            Svi lidovi <MoveRight className="size-4" />
          </Link>
        </div>
        <LeadTable leads={leads.slice(0, 10)} sites={siteMap} />
      </div>
    </>
  );
}
