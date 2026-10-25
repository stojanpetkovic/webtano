import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PageHeading } from '@/components/admin/PageHeading';
import { SiteHeader } from '@/components/admin/SiteHeader';
import { siteCustomer } from '@/lib/admin/crm/data';
import { RangeTabs } from '@/components/admin/RangeTabs';
import { parseRange } from '@/lib/admin/analytics';
import { SiteOverview } from '@/components/admin/SiteOverview';
import { db } from '@/lib/admin/supabase';
import { toParams } from '@/lib/admin/params';
import type { Site } from '@/lib/admin/types';
import { getAdminI18n } from '@/lib/admin/i18n';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Site', 'Sajt') };
}

export default async function SitePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, t } = await getAdminI18n();
  const { id } = await params;
  const query = toParams(await searchParams);
  const { data: site } = /^[0-9a-f-]{36}$/.test(id)
    ? await db().from('sites').select('*').eq('id', id).maybeSingle<Site>()
    : { data: null };
  if (!site) redirect('/admin/sites');

  const range = parseRange(query.get('range'));
  return (
    <>
      <PageHeading title={site.name} crumbs={[{ label: t('Sites', 'Sajtovi'), href: '/admin/sites' }]}>
        <RangeTabs current={range} path={`/admin/sites/${site.id}`} params={query} />
      </PageHeading>
      <SiteHeader site={site} customer={await siteCustomer(site.id, lang)} current="overview" />

      <SiteOverview site={site} range={range} />
    </>
  );
}
