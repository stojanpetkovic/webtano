import { cookies } from 'next/headers';
import { db } from './supabase';

/** When the admin last looked at the leads, so the bell counts only what came in since. */
export const SEEN_COOKIE = 'wt_leads_seen';

export async function leadsSeenAt(): Promise<string | null> {
  const value = (await cookies()).get(SEEN_COOKIE)?.value ?? '';
  return /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(value) ? value : null;
}

/** Leads that arrived after the last visit to the lead list (or ever, before the first one). */
export async function unseenLeadCount(): Promise<number> {
  const seen = await leadsSeenAt();
  let query = db().from('leads').select('id', { count: 'exact', head: true }).eq('is_spam', false);
  if (seen) query = query.gt('created_at', seen);
  else query = query.eq('status', 'new');
  const { count } = await query;
  return count ?? 0;
}
