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
  return (
    <>
      <PageHeading title={site.name} crumbs={[{ label: 'Sajtovi', href: '/admin/sites' }]}>
        <RangeTabs current={range} path={`/admin/sites/${site.id}`} params={query} />
      </PageHeading>
      <SiteHeader site={site} customer={await siteCustomer(site.id)} current="overview" />

      <SiteOverview site={site} range={range} />
    </>
  );
}
