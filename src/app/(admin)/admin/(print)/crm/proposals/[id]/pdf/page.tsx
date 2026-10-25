import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ProposalSheet } from '@/components/admin/crm/ProposalSheet';
import { db } from '@/lib/admin/supabase';
import type { Customer, Deal, Proposal, ProposalItem } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await db().from('crm_proposals').select('*').eq('id', id).maybeSingle<Proposal>();
  return data;
}

// Browsers use the title as the PDF's file name.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).id);
  return p ? { title: { absolute: `WebTano proposal ${String(p.number).padStart(4, '0')} – ${p.title}` } } : {};
}

export default async function ProposalPdfPage({ params }: Props) {
  const proposal = await load((await params).id);
  if (!proposal) redirect('/admin/crm/proposals');
  const [{ data: items }, { data: customer }, { data: deal }] = await Promise.all([
    db().from('crm_proposal_items').select('*').eq('proposal_id', proposal.id).order('position'),
    proposal.customer_id ? db().from('crm_customers').select('*').eq('id', proposal.customer_id).maybeSingle<Customer>() : Promise.resolve({ data: null }),
    proposal.deal_id ? db().from('crm_deals').select('*').eq('id', proposal.deal_id).maybeSingle<Deal>() : Promise.resolve({ data: null }),
  ]);
  return <ProposalSheet proposal={proposal} items={(items ?? []) as ProposalItem[]} customer={customer as Customer | null} deal={deal as Deal | null} />;
}
