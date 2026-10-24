import { db } from './supabase';
import type { LeadStatus } from './types';

export interface LeadFilters {
  site: string;
  status: LeadStatus | '';
  q: string;
  spam: boolean;
  from: string;
  to: string;
}

export function readFilters(params: URLSearchParams): LeadFilters {
  const status = params.get('status') ?? '';
  return {
    site: params.get('site') ?? '',
    status: (['new', 'contacted', 'won', 'lost'].includes(status) ? status : '') as LeadStatus | '',
    q: (params.get('q') ?? '').trim().slice(0, 100),
    spam: params.get('spam') === '1',
    from: /^\d{4}-\d{2}-\d{2}$/.test(params.get('from') ?? '') ? params.get('from')! : '',
    to: /^\d{4}-\d{2}-\d{2}$/.test(params.get('to') ?? '') ? params.get('to')! : '',
  };
}

export function leadQuery(f: LeadFilters, columns = '*', count = false) {
  let query = db()
    .from('leads')
    .select(columns, count ? { count: 'exact' } : undefined)
    .eq('is_spam', f.spam)
    .order('created_at', { ascending: false });
  if (/^[0-9a-f-]{36}$/.test(f.site)) query = query.eq('site_id', f.site);
  if (f.status) query = query.eq('status', f.status);
  if (f.from) query = query.gte('created_at', `${f.from}T00:00:00Z`);
  if (f.to) query = query.lte('created_at', `${f.to}T23:59:59Z`);
  if (f.q) {
    // Strip characters that have meaning inside a PostgREST or() filter.
    const term = f.q.replace(/[%,()*\\]/g, ' ').trim();
    if (term)
      query = query.or(`visitor_name.ilike.%${term}%,visitor_email.ilike.%${term}%,visitor_phone.ilike.%${term}%`);
  }
  return query;
}
