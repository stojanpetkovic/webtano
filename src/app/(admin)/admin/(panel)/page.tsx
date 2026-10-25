import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck, CalendarDays, CheckSquare, CircleDollarSign, FileText, Inbox, KanbanSquare, MoveRight, Users } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { StatCard } from '@/components/admin/StatCard';
import { DailyChart } from '@/components/admin/DailyChart';
import { DonutChart } from '@/components/admin/DonutChart';
import { SERIES } from '@/components/admin/chartColors';
import { LeadTable } from '@/components/admin/LeadTable';
import { db } from '@/lib/admin/supabase';
import { dailySeries, summarize, daysAgo } from '@/lib/admin/stats';
import { sitesOverview, rate } from '@/lib/admin/analytics';
import { STATUS_LABELS } from '@/lib/admin/format';
import type { Lead, Site } from '@/lib/admin/types';
import type { Deal } from '@/lib/admin/crm/types';
import { syncDeals, webtanoSiteId } from '@/lib/admin/crm/data';
import { money } from '@/lib/admin/crm/labels';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Kontrolna tabla' };

const DAYS = 30;

export default async function DashboardPage() {
  const since = daysAgo(60);
  await syncDeals();
  const webtanoId = await webtanoSiteId();
  let leadList = db().from('leads').select('*').eq('is_spam', false).gte('created_at', since).order('created_at', { ascending: false });
  if (webtanoId) leadList = leadList.neq('site_id', webtanoId);
  const todayKey = new Date().toISOString().slice(0, 10);
  const [{ data: sitesData }, { data: leadsData }, { data: dealData }, { count: proposalsOut }, { data: taskData }] = await Promise.all([
    db().from('sites').select('*').order('name'),
    leadList,
    db().from('crm_deals').select('stage, value').eq('archived', false),
    db().from('crm_proposals').select('id', { count: 'exact', head: true }).eq('status', 'sent'),
    db().from('crm_tasks').select('due_date').neq('status', 'done').not('due_date', 'is', null).lte('due_date', todayKey),
  ]);

  // The client sites only: WebTano's own leads live in the CRM.
  const sites = ((sitesData ?? []) as Site[]).filter((s) => s.id !== webtanoId);
  const leads = (leadsData ?? []) as Lead[];
  const deals = (dealData ?? []) as Pick<Deal, 'stage' | 'value'>[];
  const openDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  const tasksDue = (taskData ?? []) as { due_date: string }[];
  const siteMap = new Map(sites.map((s) => [s.id, s]));
  const stats = summarize(leads);

  const labels = dailySeries([], DAYS, 'Europe/Belgrade').map((d) => d.day);
  // Each site keeps its colour slot (its place in the alphabetical list), even when another site has no leads.
  const series = sites
    .map((site, slot) => ({
      label: site.name,
      slot,
      data: dailySeries(leads.filter((l) => l.site_id === site.id), DAYS, 'Europe/Belgrade').map((d) => d.count),
    }))
    .filter((s) => s.data.some((n) => n > 0));
  const allDaily = dailySeries(leads, DAYS, 'Europe/Belgrade').map((d) => d.count);
  const cutoff = daysAgo(DAYS);
  const last30 = leads.filter((l) => l.created_at >= cutoff);
  const statusColors = { new: '#2a78d6', contacted: '#eda100', won: '#1baf7a', lost: '#a1a1aa' } as const;
  const byStatus = (Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[]).map((status) => ({
    label: STATUS_LABELS[status],
    count: last30.filter((l) => l.status === status).length,
    color: statusColors[status],
  }));
  const bySource = summarize(last30).bySource;
  const newCount = leads.filter((l) => l.status === 'new').length;

  const overview = (await sitesOverview(sites, 30)).sort((a, b) => b.visitors - a.visitors || b.contacts - a.contacts);
  const visitors30 = overview.reduce((n, o) => n + o.visitors, 0);
  const changeNote =
    stats.change === null ? 'nema podataka za prethodni period' : `${stats.change >= 0 ? '+' : ''}${stats.change}% u odnosu na prethodnih 30 dana`;
  const today = new Intl.DateTimeFormat('sr-Latn-RS', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Belgrade' }).format(new Date());

  return (
    <>
      <PageHeading
        title="Kontrolna tabla"
        description={
          <>
            <span className="inline-block first-letter:uppercase">{today}</span>
            {newCount > 0 && (
              <>
                {' · '}
                <Link href="/admin/leads?status=new" className="font-medium text-primary hover:underline">
                  {newCount} {newCount === 1 ? 'novi lid čeka' : 'novih lidova sa sajtova čeka'} odgovor
                </Link>
              </>
            )}
          </>
        }
      >
        <Link href="/admin/sites" className="btn btn-outline">
          <FileText className="size-4" /> Izveštaji
        </Link>
        <Link href="/admin/leads" className="btn btn-primary">
          <Inbox className="size-4" /> Lidovi sa sajtova
        </Link>
      </PageHeading>
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

      <section className="relative overflow-hidden rounded-2xl bg-ink-975 p-5 text-white sm:p-6">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 80% at 100% 0%, rgb(1 175 233 / 0.18), transparent 70%)' }} aria-hidden="true" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] tracking-[0.16em] text-accent uppercase">WebTano CRM</div>
            <h2 className="mt-1 text-[17px] font-semibold text-white">Tvoja prodaja i projekti</h2>
          </div>
          <Link href="/admin/crm/leads" className="btn btn-sm btn-accent">
            <KanbanSquare className="size-4" /> Otvori tablu
          </Link>
        </div>
        <div className="relative mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: Inbox, label: 'Novi lidovi', value: String(deals.filter((d) => d.stage === 'new').length), href: '/admin/crm/leads' },
            { icon: CircleDollarSign, label: 'Vrednost u toku', value: money(openDeals.reduce((n, d) => n + Number(d.value || 0), 0)), href: '/admin/crm/leads' },
            { icon: FileText, label: 'Ponude čekaju odgovor', value: String(proposalsOut ?? 0), href: '/admin/crm/proposals?status=sent' },
            {
              icon: CheckSquare,
              label: 'Zadaci za danas i kasne',
              value: String(tasksDue.length),
              href: '/admin/crm/tasks',
            },
          ].map((k) => (
            <Link key={k.label} href={k.href} className="rounded-xl bg-white/[0.05] p-4 ring-1 ring-white/[0.08] transition hover:bg-white/[0.08]">
              <k.icon className="size-4 text-accent" />
              <div className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{k.value}</div>
              <div className="mt-0.5 text-xs text-white/55">{k.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3 pt-2">
        <h2 className="text-[15px] font-semibold">Klijentski sajtovi</h2>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard icon={CalendarCheck} color="success" label="Upiti danas" value={stats.today} trend={allDaily.slice(-14)} />
        <StatCard icon={CalendarDays} color="warning" label="Upiti, 7 dana" value={stats.last7} trend={allDaily.slice(-7)} />
        <StatCard
          icon={Inbox}
          color="secondary"
          label="Upiti, 30 dana"
          value={stats.last30}
          note={changeNote}
          tone={stats.change === null ? 'neutral' : stats.change >= 0 ? 'up' : 'down'}
          trend={allDaily}
        />
        <StatCard
          icon={Users}
          color="info"
          label="Posetioci, 30 dana"
          value={visitors30.toLocaleString('sr-Latn-RS')}
          note={`na ${sites.filter((s) => s.active).length} aktivnih sajtova`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <DailyChart
            title="Lidovi po danu"
            total={`${stats.last30} lidova`}
            note="30 dana, po sajtu"
            labels={labels}
            series={series.length ? series : [{ label: 'Lidovi', data: labels.map(() => 0) }]}
          />
        </div>
        <DonutChart title="Status lidova" sub="Poslednjih 30 dana" items={byStatus} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="card-header">
            <div>
              <h2 className="card-title">Sajtovi</h2>
              <p className="card-sub">Posete i kontakti, poslednjih 30 dana</p>
            </div>
            <Link href="/admin/sites" className="btn btn-sm btn-light">
              Svi sajtovi <MoveRight className="size-4" />
            </Link>
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
                  <tr key={o.site.id} className="relative">
                    <td>
                      <span className="flex items-center gap-2.5">
                        <span className="size-2 shrink-0 rounded-full" style={{ background: SERIES[sites.indexOf(o.site) % SERIES.length] }} />
                        <Link href={`/admin/sites/${o.site.id}`} className="font-medium text-ink after:absolute after:inset-0 hover:text-primary">
                          {o.site.name}
                        </Link>
                      </span>
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
        <DonutChart title="Odakle dolaze lidovi" sub="Izvor, poslednjih 30 dana" items={bySource} />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Poslednji lidovi</h2>
            <p className="card-sub">Deset najnovijih upita sa svih sajtova</p>
          </div>
          <Link href="/admin/leads" className="btn btn-sm btn-light">
            Svi lidovi <MoveRight className="size-4" />
          </Link>
        </div>
        <LeadTable leads={leads.slice(0, 10)} sites={siteMap} />
      </div>
    </>
  );
}
