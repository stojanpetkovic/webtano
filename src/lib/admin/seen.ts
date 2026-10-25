import { cookies } from 'next/headers';
import { db } from './supabase';
import { webtanoSiteId } from './crm/data';

/**
 * When the admin last looked at each lead list, so the badges count only what
 * came in since. "crm" is WebTano's own leads, "sites" the client sites' leads.
 */
export type SeenScope = 'crm' | 'sites';
export const SEEN_COOKIE: Record<SeenScope, string> = { sites: 'wt_leads_seen', crm: 'wt_crm_seen' };

async function seenAt(scope: SeenScope): Promise<string | null> {
  const value = (await cookies()).get(SEEN_COOKIE[scope])?.value ?? '';
  return /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(value) ? value : null;
}

/** Leads that arrived after the last visit to that list (or the unhandled ones, before the first visit). */
export async function unseenLeadCount(scope: SeenScope): Promise<number> {
  const [seen, siteId] = await Promise.all([seenAt(scope), webtanoSiteId()]);
  let query = db().from('leads').select('id', { count: 'exact', head: true }).eq('is_spam', false);
  if (siteId) query = scope === 'crm' ? query.eq('site_id', siteId) : query.neq('site_id', siteId);
  else if (scope === 'crm') return 0;
  query = seen ? query.gt('created_at', seen) : query.eq('status', 'new');
  const { count } = await query;
  return count ?? 0;
}
