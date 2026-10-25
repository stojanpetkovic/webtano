import type { Metadata } from 'next';
import { PageHeading } from '@/components/admin/PageHeading';
import { ProposalForm } from '@/components/admin/crm/ProposalForm';
import { db } from '@/lib/admin/supabase';
import { priceList } from '@/lib/admin/crm/priceList';
import { toParams } from '@/lib/admin/params';
import type { Customer, Deal } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Nova ponuda' };

// What a form lead asked for, as the first line of its proposal.
const SERVICE_ITEM: Record<string, string> = {
  'new-website': 'Starter site',
  redesign: 'Starter site',
  seo: 'Local SEO plan',
  ads: 'Google Ads plan',
};

export default async function NewProposalPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const [{ data: customers }, { data: deals }] = await Promise.all([
    db().from('crm_customers').select('id, company').order('company'),
    db().from('crm_deals').select('*').eq('archived', false).not('stage', 'in', '(won,lost)').order('created_at', { ascending: false }),
  ]);
  const dealList = (deals ?? []) as Deal[];
  const deal = dealList.find((d) => d.id === query.get('deal'));
  const customerId = query.get('customer') ?? deal?.customer_id ?? undefined;
  const first = deal?.service ? priceList().find((p) => p.description === SERVICE_ITEM[deal.service!]) : undefined;

  return (
    <>
      <PageHeading title="Nova ponuda" crumbs={[{ label: 'WebTano CRM' }, { label: 'Ponude', href: '/admin/crm/proposals' }]} description="Stavke iz cenovnika se dodaju sa cenama sa webtano.com/pricing." />
      <ProposalForm
        customers={(customers ?? []) as Pick<Customer, 'id' | 'company'>[]}
        deals={dealList}
        preset={{
          customer_id: customerId,
          deal_id: deal?.id,
          title: deal ? `Proposal for ${deal.company ?? deal.name}` : undefined,
          items: first ? [{ description: first.description, details: first.details, qty: 1, unit_price: first.unit_price, recurring: first.recurring }] : [],
        }}
      />
    </>
  );
}
