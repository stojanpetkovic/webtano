import { db } from '@/lib/admin/supabase';
import { getAdminI18n } from '@/lib/admin/i18n';
import { SOURCES, SUBSCRIBER_STATUS, type Subscriber, type SubscriberStatus } from '@/lib/admin/newsletter';

function cell(value: unknown): string {
  let text = value == null ? '' : String(value);
  // Neutralise spreadsheet formulas a visitor could have typed into a form.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** The list as CSV, for importing into Resend, Mailchimp or a spreadsheet. Defaults to confirmed addresses. */
export async function GET(request: Request) {
  const { lang, t } = await getAdminI18n();
  const params = new URL(request.url).searchParams;
  const status = params.get('status') ?? 'confirmed';
  let query = db().from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).limit(50_000);
  if (status !== 'all' && status in SUBSCRIBER_STATUS) query = query.eq('status', status);
  const q = params.get('q')?.trim().toLowerCase();
  if (q) query = query.ilike('email', `%${q.replace(/[%_,()]/g, '')}%`);
  const { data } = await query;
  const rows = ((data ?? []) as Subscriber[]).map((s) => [
    s.email,
    SUBSCRIBER_STATUS[s.status as SubscriberStatus][lang],
    SOURCES[s.source]?.[lang] ?? s.source,
    s.created_at,
    s.confirmed_at,
    s.unsubscribed_at,
    s.page_url,
  ]);
  const header = [
    'Email',
    'Status',
    t('Source', 'Izvor'),
    t('Signed up', 'Prijavljen'),
    t('Confirmed', 'Potvrđen'),
    t('Unsubscribed', 'Odjavljen'),
    t('Page', 'Stranica'),
  ];
  // BOM so Excel opens the UTF-8 file with č, ć, š intact.
  const csv = '﻿' + [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${t('subscribers', 'pretplatnici')}-${stamp}.csv"` },
  });
}
