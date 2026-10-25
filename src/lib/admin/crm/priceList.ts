import { monthlyPlans, websitePlans } from '@/content/pricing';
import type { PriceListEntry } from '@/components/admin/crm/ProposalEditor';

/** The webtano.com price list as proposal items, so prices stay in one place (src/content/pricing.ts). */
export function priceList(): PriceListEntry[] {
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
