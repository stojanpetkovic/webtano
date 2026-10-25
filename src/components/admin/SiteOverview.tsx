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
import { getAdminI18n } from '@/lib/admin/i18n';
import { channelLabel } from '@/lib/admin/channels';
import { HTML_LANG } from '@/lib/i18n';

/** One site's numbers for a period: visitors, contacts, sources, pages and the latest leads. */
export async function SiteOverview({ site, range }: { site: Site; range: RangeDays }) {
  const { lang, t: tr } = await getAdminI18n();
  const num = (n: number) => n.toLocaleString(HTML_LANG[lang]);
  const [{ data: leadsData }, analytics] = await Promise.all([
    db()
      .from('leads')
      .select('*')
      .eq('site_id', site.id)
      .eq('is_spam', false)
      .gte('created_at', daysAgo(range))
      .order('created_at', { ascending: false }),
    siteAnalytics(site, range, lang),
  ]);
  const leads = (leadsData ?? []) as Lead[];
  const stats = summarize(leads);
  const t = analytics.totals;
  const daily = analytics.daily;
  const p = analytics.previous;
  const visitorsChange = change(t.visitors, p.visitors, lang);
  const leadsChange = change(t.leads, p.leads, lang);
  const callsChange = change(t.calls, p.calls, lang);

  return (
    <>
      {!analytics.hasData && (
        <div className="alert alert-info">
          {tr('No visits recorded for this period yet. Visits are counted as soon as the', 'Još nema zabeleženih poseta za ovaj period. Posete se broje čim je')}{' '}
          <Link href={`/admin/sites/${site.id}/settings#kod`} className="font-semibold underline">
            {tr('embed code', 'kod za ugradnju')}
          </Link>{' '}
          {tr('is on the site, and the numbers refresh every 15 minutes.', 'na sajtu, a brojke se osvežavaju na svakih 15 minuta.')}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        <StatCard icon={Users} color="success" label={tr('Visitors', 'Posetioci')} value={num(t.visitors)} note={visitorsChange.text} tone={visitorsChange.tone} trend={daily.map((d) => d.visitors)} />
        <StatCard icon={MousePointerClick} color="warning" label={tr('Visits', 'Posete')} value={num(t.visits)} />
        <StatCard icon={Inbox} color="info" label={tr('Inquiries', 'Upiti')} value={t.leads} note={leadsChange.text} tone={leadsChange.tone} trend={daily.map((d) => d.leads)} />
        <StatCard icon={Phone} color="secondary" label={tr('Calls', 'Pozivi')} value={t.calls} note={callsChange.text} tone={callsChange.tone} trend={daily.map((d) => d.calls)} />
        <StatCard className="col-span-2 xl:col-span-1" icon={Percent} color="primary" label={tr('Conversion rate', 'Stopa konverzije')}
          value={rate(t.contacts, t.visits, lang)}
          note={tr('inquiries and calls per 100 visits', 'upiti i pozivi na 100 poseta')}
        />
      </div>

      {/* Two charts rather than one with two scales: visitors run in hundreds, contacts in units. */}
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <DailyChart
            title={tr('Visitors per day', 'Posetioci po danu')}
            total={num(t.visitors)}
            note={tr('refreshes every 15 min', 'osvežava se na 15 min')}
            variant="area"
            labels={daily.map((d) => d.day)}
            series={[{ label: tr('Visitors', 'Posetioci'), data: daily.map((d) => d.visitors) }]}
          />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <DailyChart
            title={tr('Inquiries and calls per day', 'Upiti i pozivi po danu')}
            total={`${t.leads + t.calls} ${tr('contacts', 'kontakata')}`}
            labels={daily.map((d) => d.day)}
            series={[
              { label: tr('Inquiries', 'Upiti'), data: daily.map((d) => d.leads) },
              { label: tr('Calls', 'Pozivi'), data: daily.map((d) => d.calls), slot: 2 },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ConversionTable
          title={tr('Where they come from', 'Odakle dolaze')}
          columnLabel={tr('Source', 'Izvor')}
          countLabel={tr('Visits', 'Posete')}
          rows={analytics.channels.map((c) => ({ label: channelLabel(c.label, lang), count: c.visits, leads: c.leads, calls: c.calls }))}
        />
        <ConversionTable
          title={tr('Most visited pages', 'Najposećenije stranice')}
          columnLabel={tr('Page', 'Stranica')}
          countLabel={tr('Views', 'Pregledi')}
          rows={analytics.pages.map((pg) => ({ label: pg.label, count: pg.views, leads: pg.leads, calls: pg.calls }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DonutChart title={tr('Devices', 'Uređaji')} items={analytics.devices} />
        <BarList title={tr('Countries', 'Zemlje')} items={analytics.countries} />
        <BarList
          title={tr('Contact clicks', 'Klikovi za kontakt')}
          items={analytics.clicks}
          empty={tr('No clicks on phone, WhatsApp or email yet.', 'Još nema klikova na telefon, WhatsApp ili email.')}
        />
        <BarList title={tr('Inquiries by form', 'Upiti po formi')} items={countBy(leads, (l) => l.form_name)} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard icon={CalendarCheck} color="success" label={tr('Inquiries today', 'Upiti danas')} value={stats.today} />
        <StatCard icon={CalendarDays} color="warning" label={tr('Inquiries, 7 days', 'Upiti, 7 dana')} value={stats.last7} />
        <StatCard
          icon={Handshake}
          color="secondary"
          label={tr('Win rate', 'Stopa dogovora')}
          value={stats.winRate === null ? '—' : `${stats.winRate}%`}
          note={tr('of leads marked won/lost', 'od lidova označenih kao dogovoren/izgubljen')}
        />
        <StatCard icon={BellRing} color="info" label={tr('New, not handled', 'Novi, neobrađeni')} value={leads.filter((l) => l.status === 'new').length} />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{tr('Latest leads', 'Poslednji lidovi')}</h2>
            <p className="card-sub">{tr('The ten newest inquiries from this site', 'Deset najnovijih upita sa ovog sajta')}</p>
          </div>
          <Link href={`/admin/leads?site=${site.id}`} className="btn btn-sm btn-light">
            {tr('All leads', 'Svi lidovi')}
          </Link>
        </div>
        <LeadTable leads={leads.slice(0, 10)} sites={new Map([[site.id, site]])} showSite={false} />
      </div>
    </>
  );
}
