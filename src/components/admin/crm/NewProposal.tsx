import { Modal } from '@/components/admin/Modal';
import { ProposalForm } from './ProposalForm';
import { db } from '@/lib/admin/supabase';
import { priceList } from '@/lib/admin/crm/priceList';
import { appSettings } from '@/lib/admin/settings';
import { dealServices } from '@/lib/admin/crm/labels';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { CustomerOption, Deal } from '@/lib/admin/crm/types';

// What a lead asked for, as the first lines of its proposal.
const SERVICE_ITEM: Record<string, string> = {
  'new-website': 'Starter site',
  redesign: 'Starter site',
  seo: 'Local SEO plan',
  ads: 'Google Ads plan',
};

/** "New proposal" as a pop-up, prefilled from a lead or a customer when given. */
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
  const [{ data: customers }, { data: deals }, catalog, settings, { t }] = await Promise.all([
    db().from('crm_customers').select('id, company, contact_name').order('contact_name'),
    db().from('crm_deals').select('*').eq('archived', false).not('stage', 'in', '(won,lost)').order('created_at', { ascending: false }),
    priceList(),
    appSettings(),
    getAdminI18n(),
  ]);
  const dealList = (deals ?? []) as Deal[];
  const deal = dealList.find((d) => d.id === dealId);
  const names = new Set(deal ? dealServices(deal).map((k) => SERVICE_ITEM[k]) : []);
  const asked = catalog.filter((p) => names.has(p.description));

  return (
    <Modal
      label={label}
      title={t('New proposal', 'Nova ponuda')}
      description={t('Pick the items from your price list; you can change the prices in the proposal.', 'Stavke biraš iz svog cenovnika, a cene u ponudi možeš da menjaš.')}
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
        defaults={settings.proposals}
        preset={{
          customer_id: customerId ?? deal?.customer_id ?? undefined,
          deal_id: deal?.id,
          title: deal ? `Proposal for ${deal.company ?? deal.name}` : undefined,
          items: asked.map((p) => ({ description: p.description, details: p.details, qty: 1, unit_price: p.unit_price, recurring: p.recurring })),
        }}
      />
    </Modal>
  );
}
