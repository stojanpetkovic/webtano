import Link from 'next/link';
import { BellRing, CalendarCheck, CalendarDays, Handshake, Inbox, MousePointerClick, Percent, Phone, Users } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { DailyChart } from '@/components/admin/DailyChart';
import { BarList } from '@/components/admin/BarList';
import { DonutChart } from '@/components/admin/DonutChart';
import { LeadTable } from '@/components/admin/LeadTable';
import { ConversionTable } from '@/components/admin/ConversionTable';
import { siteAnalytics, rate, change, type RangeDays } from '@/lib/admin/analytics';
import { db } from '@/lib/admin/supabase';
import { summarize, countBy, daysAgo } from '@/lib/admin/stats';
import type { Lead, Site } from '@/lib/admin/types';

/** One site's numbers for a period: visitors, contacts, sources, pages and the latest leads. */
export async function SiteOverview({ site, range }: { site: Site; range: RangeDays }) {
  const [{ data: leadsData }, analytics] = await Promise.all([
    db()
      .from('leads')
      .select('*')
      .eq('site_id', site.id)
      .eq('is_spam', false)
      .gte('created_at', daysAgo(range))
      .order('created_at', { ascending: false }),
    siteAnalytics(site, range),
  ]);
  const leads = (leadsData ?? []) as Lead[];
  const stats = summarize(leads);
  const t = analytics.totals;
  const daily = analytics.daily;
  const p = analytics.previous;
  const visitorsChange = change(t.visitors, p.visitors);
  const leadsChange = change(t.leads, p.leads);
  const callsChange = change(t.calls, p.calls);

  return (
    <>
      {!analytics.hasData && (
        <div className="alert alert-info">
          Još nema zabeleženih poseta za ovaj period. Posete se broje čim je{' '}
          <Link href={`/admin/sites/${site.id}/settings#kod`} className="font-semibold underline">
            kod za ugradnju
          </Link>{' '}
          na sajtu, a brojke se osvežavaju na svakih 15 minuta.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        <StatCard icon={Users} color="success" label="Posetioci" value={t.visitors.toLocaleString('sr-Latn-RS')} note={visitorsChange.text} tone={visitorsChange.tone} trend={daily.map((d) => d.visitors)} />
        <StatCard icon={MousePointerClick} color="warning" label="Posete" value={t.visits.toLocaleString('sr-Latn-RS')} />
        <StatCard icon={Inbox} color="info" label="Upiti" value={t.leads} note={leadsChange.text} tone={leadsChange.tone} trend={daily.map((d) => d.leads)} />
        <StatCard icon={Phone} color="secondary" label="Pozivi" value={t.calls} note={callsChange.text} tone={callsChange.tone} trend={daily.map((d) => d.calls)} />
        <StatCard className="col-span-2 xl:col-span-1" icon={Percent} color="primary" label="Stopa konverzije" value={rate(t.contacts, t.visits)} note="upiti i pozivi na 100 poseta" />
      </div>

      {/* Two charts rather than one with two scales: visitors run in hundreds, contacts in units. */}
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <DailyChart
            title="Posetioci po danu"
            total={t.visitors.toLocaleString('sr-Latn-RS')}
            note="osvežava se na 15 min"
            variant="area"
            labels={daily.map((d) => d.day)}
            series={[{ label: 'Posetioci', data: daily.map((d) => d.visitors) }]}
          />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <DailyChart
            title="Upiti i pozivi po danu"
            total={`${t.leads + t.calls} kontakata`}
            labels={daily.map((d) => d.day)}
            series={[
              { label: 'Upiti', data: daily.map((d) => d.leads) },
              { label: 'Pozivi', data: daily.map((d) => d.calls), slot: 2 },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ConversionTable
          title="Odakle dolaze"
          columnLabel="Izvor"
          countLabel="Posete"
          rows={analytics.channels.map((c) => ({ label: c.label, count: c.visits, leads: c.leads, calls: c.calls }))}
        />
        <ConversionTable
          title="Najposećenije stranice"
          columnLabel="Stranica"
          countLabel="Pregledi"
          rows={analytics.pages.map((pg) => ({ label: pg.label, count: pg.views, leads: pg.leads, calls: pg.calls }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DonutChart title="Uređaji" items={analytics.devices} />
        <BarList title="Zemlje" items={analytics.countries} />
        <BarList title="Klikovi za kontakt" items={analytics.clicks} empty="Još nema klikova na telefon, WhatsApp ili email." />
        <BarList title="Upiti po formi" items={countBy(leads, (l) => l.form_name)} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard icon={CalendarCheck} color="success" label="Upiti danas" value={stats.today} />
        <StatCard icon={CalendarDays} color="warning" label="Upiti, 7 dana" value={stats.last7} />
        <StatCard
          icon={Handshake}
          color="secondary"
          label="Stopa dogovora"
          value={stats.winRate === null ? '—' : `${stats.winRate}%`}
          note="od lidova označenih kao dogovoren/izgubljen"
        />
        <StatCard icon={BellRing} color="info" label="Novi, neobrađeni" value={leads.filter((l) => l.status === 'new').length} />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Poslednji lidovi</h2>
            <p className="card-sub">Deset najnovijih upita sa ovog sajta</p>
          </div>
          <Link href={`/admin/leads?site=${site.id}`} className="btn btn-sm btn-light">
            Svi lidovi
          </Link>
        </div>
        <LeadTable leads={leads.slice(0, 10)} sites={new Map([[site.id, site]])} showSite={false} />
      </div>
    </>
  );
}
