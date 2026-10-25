import { monthlyPlans, websitePlans } from '@/content/pricing';
import type { PriceListEntry } from '@/components/admin/crm/ProposalEditor';
import { db } from '@/lib/admin/supabase';
import type { CatalogItem } from './types';

/**
 * The price list offered in proposals: the active rows of crm_items, edited under
 * Cenovnik. Falls back to the webtano.com prices while the table does not exist.
 */
export async function priceList(): Promise<PriceListEntry[]> {
  const { data, error } = await db().from('crm_items').select('*').eq('active', true).order('position');
  if (error) return defaultPriceList();
  return ((data ?? []) as CatalogItem[]).map((i) => ({
    group: i.group_name,
    description: i.name,
    details: i.details ?? '',
    qty: 1,
    unit_price: Number(i.unit_price),
    recurring: i.recurring,
  }));
}

/** The webtano.com price list (src/content/pricing.ts) as proposal items. crm_items starts as a copy of it. */
export function defaultPriceList(): PriceListEntry[] {
  return [
    ...websitePlans.map((p) => ({
      group: 'Sajtovi',
      description: `${p.name}${p.from ? ' (from)' : ''}`,
      details: p.features.join(' · '),
      qty: 1,
      unit_price: p.price,
      recurring: false,
    })),
    ...monthlyPlans.map((p) => ({
      group: 'Mesečni planovi',
      description: `${p.name} plan`,
      details: p.features.join(' · '),
      qty: 1,
      unit_price: p.price,
      recurring: true,
    })),
    { group: 'Dodaci', description: 'Hosting and care', details: 'Hosting in your name, updates, backups, uptime monitoring and small edits.', qty: 1, unit_price: 99, recurring: true },
    { group: 'Dodaci', description: 'Local Services Ads management', details: 'Setup and management, with lead disputes handled for you.', qty: 1, unit_price: 300, recurring: true },
    { group: 'Dodaci', description: 'Blog article', details: 'Researched article written for your market, with images and FAQs.', qty: 1, unit_price: 350, recurring: false },
    { group: 'Dodaci', description: 'Extra page', details: 'Additional service or location page, written and designed to match your site.', qty: 1, unit_price: 250, recurring: false },
  ];
}

export const DEFAULT_INTRO =
  'Thank you for taking the time to talk with us. Below is what we propose for your business, what is included and what it costs. Every price is fixed: no surprises and no percentage of ad spend.';

export const DEFAULT_TERMS = [
  'Websites are paid 50% when we start and 50% at launch.',
  'Monthly plans run month to month and can be cancelled with 30 days’ notice.',
  'Ad spend is paid directly to Google from your own account and is not included.',
  'You own the domain, website, content and ad accounts from day one.',
  'This proposal is valid until the date shown above.',
].join('\n');
