import { addOns, monthlyPlans, websitePlans, type AddOn, type Plan } from '@/content/pricing';
import { db } from '@/lib/admin/supabase';

export interface Pricing {
  monthlyPlans: Plan[];
  websitePlans: Plan[];
  addOns: AddOn[];
}

/**
 * The plans with today's prices from the admin price list (crm_items), matched by
 * slug. A plan without a matching item, or a database that cannot be reached, keeps
 * the price from src/content/pricing.ts, so the page never shows an empty price.
 */
export async function livePricing(): Promise<Pricing> {
  let prices = new Map<string, number>();
  try {
    const { data } = await db().from('crm_items').select('slug, unit_price').not('slug', 'is', null);
    prices = new Map(((data ?? []) as { slug: string; unit_price: number }[]).map((r) => [r.slug, Number(r.unit_price)]));
  } catch {
    // No database settings (local build): use the prices in the content file.
  }
  const price = <T extends { id: string; price: number }>(p: T): T => {
    const live = prices.get(p.id);
    return live !== undefined && Number.isFinite(live) && live > 0 ? { ...p, price: live } : p;
  };
  return { monthlyPlans: monthlyPlans.map(price), websitePlans: websitePlans.map(price), addOns: addOns.map(price) };
}

/** Pages that show prices, refreshed whenever the price list changes. */
export const PRICED_PATHS = ['/', '/pricing'];
