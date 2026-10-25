import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ReportView, type ReportLead } from '@/components/admin/ReportView';
import { db } from '@/lib/admin/supabase';
import { analyzeDays } from '@/lib/admin/analytics';
import { dayKey } from '@/lib/admin/stats';
import { toParams } from '@/lib/admin/params';
import { T, reportPeriod } from '@/lib/admin/report';
import type { Site } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function load(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await db().from('sites').select('*').eq('id', id).maybeSingle<Site>();
  return data;
}

// Browsers use the title as the PDF's file name.
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const site = await load((await params).id);
  if (!site) return {};
  const { locale, period } = reportPeriod(site, toParams(await searchParams));
  return { title: { absolute: `${site.name} – ${T[locale].title} – ${period.label}` } };
}

export default async function ReportPage({ params: routeParams, searchParams }: Props) {
  const site = await load((await routeParams).id);
  if (!site) redirect('/admin/sites');
  const params = toParams(await searchParams);
  const { locale, all, period, customRejected } = reportPeriod(site, params);
  const analytics = await analyzeDays(site, period.current, period.previous, locale);

  const inPeriod = new Set(period.current);
  const { data: leadData } = await db()
    .from('leads')
    .select('created_at, visitor_name, visitor_email, form_name, utm_source, utm_medium, referrer, status')
    .eq('site_id', site.id)
    .eq('is_spam', false)
    .gte('created_at', new Date(Date.parse(`${period.current[0]}T00:00:00Z`) - 86_400_000).toISOString())
    .lt('created_at', new Date(Date.parse(`${period.current.at(-1)}T00:00:00Z`) + 2 * 86_400_000).toISOString())
    .order('created_at', { ascending: true });
  const leads = (
    (leadData ?? []) as ReportLead[]
  ).filter((l) => inPeriod.has(dayKey(new Date(l.created_at), site.timezone)));

  return (
    <ReportView
      site={site}
      analytics={analytics}
      leads={leads}
      params={params}
      locale={locale}
      all={all}
      period={period}
      customRejected={customRejected}
      back={{ href: `/admin/sites/${site.id}`, label: T[locale].back }}
    />
  );
}
