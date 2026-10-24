import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BellRing, CalendarCheck, CalendarDays, Handshake, Inbox, MousePointerClick, Percent, Phone, Users } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { SiteHeader } from '@/components/admin/SiteHeader';
import { StatCard } from '@/components/admin/StatCard';
import { DailyChart } from '@/components/admin/DailyChart';
import { BarList } from '@/components/admin/BarList';
import { LeadTable } from '@/components/admin/LeadTable';
import { ConversionTable } from '@/components/admin/ConversionTable';
import { RangeTabs } from '@/components/admin/RangeTabs';
import { siteAnalytics, parseRange, rate, change } from '@/lib/admin/analytics';
import { db } from '@/lib/admin/supabase';
import { summarize, countBy, daysAgo } from '@/lib/admin/stats';
import { toParams } from '@/lib/admin/params';
import type { Lead, Site } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Sajt' };

export default async function SitePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = toParams(await searchParams);
  const { data: site } = /^[0-9a-f-]{36}$/.test(id)
    ? await db().from('sites').select('*').eq('id', id).maybeSingle<Site>()
    : { data: null };
  if (!site) redirect('/admin/sites');

  const range = parseRange(query.get('range'));
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
  const p = analytics.previous;
  const visitorsChange = change(t.visitors, p.visitors);
  const leadsChange = change(t.leads, p.leads);
  const callsChange = change(t.calls, p.calls);

  return (
    <>
      <PageHeading title={site.name} crumbs={[{ label: 'Sajtovi', href: '/admin/sites' }]} />
      <SiteHeader site={site} current="overview" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold">Posete, upiti i pozivi</h2>
        <RangeTabs current={range} path={`/admin/sites/${site.id}`} params={query} />
      </div>

      {!analytics.hasData && (
        <div className="alert alert-info">
          Još nema zabeleženih poseta za ovaj period. Posete se broje čim je{' '}
          <Link href={`/admin/sites/${site.id}/settings#kod`} className="font-semibold underline">
            kod za ugradnju
          </Link>{' '}
          na sajtu, a brojke se osvežavaju na svakih 15 minuta.
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard icon={Users} color="success" label="Posetioci" value={t.visitors.toLocaleString('sr-Latn-RS')} note={visitorsChange.text} tone={visitorsChange.tone} />
        <StatCard icon={MousePointerClick} color="warning" label="Posete" value={t.visits.toLocaleString('sr-Latn-RS')} />
        <StatCard icon={Inbox} color="info" label="Upiti" value={t.leads} note={leadsChange.text} tone={leadsChange.tone} />
        <StatCard icon={Phone} color="secondary" label="Pozivi" value={t.calls} note={callsChange.text} tone={callsChange.tone} />
        <StatCard icon={Percent} color="primary" label="Stopa konverzije" value={rate(t.contacts, t.visits)} note="upiti i pozivi na 100 poseta" />
      </div>

      <DailyChart
        title="Posetioci, upiti i pozivi po danu"
        note="osvežava se na 15 min"
        labels={analytics.daily.map((d) => d.day)}
        series={[
          { label: 'Posetioci', data: analytics.daily.map((d) => d.visitors) },
          { label: 'Upiti i pozivi', data: analytics.daily.map((d) => d.leads + d.calls), line: true },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-5">
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <BarList title="Uređaji" items={analytics.devices} />
        <BarList title="Zemlje" items={analytics.countries} />
        <BarList title="Klikovi za kontakt" items={analytics.clicks} empty="Još nema klikova na telefon, WhatsApp ili email." />
        <BarList title="Upiti po formi" items={countBy(leads, (l) => l.form_name)} />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
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
          <h2 className="card-title">Poslednji lidovi</h2>
        </div>
        <LeadTable leads={leads.slice(0, 10)} sites={new Map([[site.id, site]])} showSite={false} />
      </div>
    </>
  );
}
