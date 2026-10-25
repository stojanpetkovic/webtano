import { db } from '../supabase';
import { leadSource } from '../leads';
import { site as siteConfig } from '@/content/site';
import { monthlyPlans, websitePlans } from '@/content/pricing';
import type { Lead } from '../types';
import type { Deal } from './types';
import { customerName } from './labels';

/** The sites row the webtano.com form writes to. Its leads belong to the CRM, not to the client lists. */
export async function webtanoSiteId(): Promise<string | null> {
  const { data } = await db().from('sites').select('id').eq('site_key', siteConfig.leadsSiteKey).maybeSingle<{ id: string }>();
  return data?.id ?? null;
}

// A first guess at what a deal is worth, from the service picked on the form and the price list.
const price = (id: string) => [...monthlyPlans, ...websitePlans].find((p) => p.id === id)?.price ?? 0;
const ESTIMATE: Record<string, number> = {
  'new-website': price('starter-site'),
  redesign: price('starter-site'),
  seo: price('local-seo'),
  ads: price('google-ads'),
};

/**
 * Copies webtano.com form leads that are not on the board yet into crm_deals.
 * Runs when a CRM page opens, so the form itself stays exactly as it is.
 */
export async function syncDeals(): Promise<void> {
  const siteId = await webtanoSiteId();
  if (!siteId) return;
  const [{ data: leads }, { data: existing }] = await Promise.all([
    db().from('leads').select('*').eq('site_id', siteId).eq('is_spam', false).order('created_at', { ascending: true }),
    db().from('crm_deals').select('lead_id').not('lead_id', 'is', null),
  ]);
  const known = new Set((existing ?? []).map((d: { lead_id: string }) => d.lead_id));
  const fresh = ((leads ?? []) as Lead[]).filter((l) => !known.has(l.id));
  if (!fresh.length) return;

  const rows = fresh.map((l) => {
    const service = l.data?.service ?? null;
    let website = (l.data?.website ?? '').trim() || null;
    if (website) website = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return {
      lead_id: l.id,
      name: l.visitor_name || l.visitor_email || 'Bez imena',
      company: (l.data?.business ?? '').trim() || null,
      email: l.visitor_email,
      phone: l.visitor_phone,
      website,
      source: leadSource(l),
      service,
      value: ESTIMATE[service ?? ''] ?? 0,
      stage: 'new',
      // Newest on top of the column.
      position: -new Date(l.created_at).getTime() / 1000,
      created_at: l.created_at,
      updated_at: l.created_at,
    };
  });
  const { data: inserted } = await db().from('crm_deals').upsert(rows, { onConflict: 'lead_id', ignoreDuplicates: true }).select('id, lead_id');
  const byLead = new Map(fresh.map((l) => [l.id, l]));
  const notes = ((inserted ?? []) as Pick<Deal, 'id' | 'lead_id'>[]).map((d) => {
    const l = byLead.get(d.lead_id!);
    const message = (l?.data?.message ?? '').trim();
    return {
      deal_id: d.id,
      kind: 'system',
      body: `Upit sa webtano.com forme.${message ? `\n\n„${message}”` : ''}`,
      created_at: l?.created_at,
    };
  });
  if (notes.length) await db().from('crm_activity').insert(notes);
}

/** The CRM customer a client site is linked to, if any. */
export async function siteCustomer(siteId: string): Promise<{ id: string; name: string } | null> {
  const { data } = await db().from('crm_customer_sites').select('crm_customers(id, company, contact_name)').eq('site_id', siteId).maybeSingle();
  const c = (data as unknown as { crm_customers: { id: string; company: string | null; contact_name: string | null } | null } | null)?.crm_customers;
  return c ? { id: c.id, name: customerName(c) } : null;
}
