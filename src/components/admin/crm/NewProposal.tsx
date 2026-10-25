import { Modal } from '@/components/admin/Modal';
import { ProposalForm } from './ProposalForm';
import { db } from '@/lib/admin/supabase';
import { priceList } from '@/lib/admin/crm/priceList';
import type { CustomerOption, Deal } from '@/lib/admin/crm/types';

// What a form lead asked for, as the first line of its proposal.
const SERVICE_ITEM: Record<string, string> = {
  'new-website': 'Starter site',
  redesign: 'Starter site',
  seo: 'Local SEO plan',
  ads: 'Google Ads plan',
};

/** "Nova ponuda" as a pop-up, prefilled from a lead or a customer when given. */
export async function NewProposal({
  dealId,
  customerId,
  label,
  buttonClassName,
  defaultOpen,
  closeHref,
}: {
  dealId?: string;
  customerId?: string;
  label?: React.ReactNode;
  buttonClassName?: string;
  defaultOpen?: boolean;
  closeHref?: string;
}) {
  const [{ data: customers }, { data: deals }, catalog] = await Promise.all([
    db().from('crm_customers').select('id, company, contact_name').order('contact_name'),
    db().from('crm_deals').select('*').eq('archived', false).not('stage', 'in', '(won,lost)').order('created_at', { ascending: false }),
    priceList(),
  ]);
  const dealList = (deals ?? []) as Deal[];
  const deal = dealList.find((d) => d.id === dealId);
  const first = deal?.service ? catalog.find((p) => p.description === SERVICE_ITEM[deal.service!]) : undefined;

  return (
    <Modal
      label={label}
      title="Nova ponuda"
      description="Stavke biraš iz svog cenovnika, a cene u ponudi možeš da menjaš."
      size="xl"
      buttonClassName={buttonClassName}
      defaultOpen={defaultOpen}
      closeHref={closeHref}
    >
      <ProposalForm
        inModal
        customers={(customers ?? []) as CustomerOption[]}
        deals={dealList}
        priceList={catalog}
        preset={{
          customer_id: customerId ?? deal?.customer_id ?? undefined,
          deal_id: deal?.id,
          title: deal ? `Proposal for ${deal.company ?? deal.name}` : undefined,
          items: first ? [{ description: first.description, details: first.details, qty: 1, unit_price: first.unit_price, recurring: first.recurring }] : [],
        }}
      />
    </Modal>
  );
}
