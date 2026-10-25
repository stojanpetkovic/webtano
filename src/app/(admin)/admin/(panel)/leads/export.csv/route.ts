import { db } from '@/lib/admin/supabase';
import { readFilters, leadQuery } from '@/lib/admin/leadQuery';
import { webtanoSiteId } from '@/lib/admin/crm/data';
import { leadSource } from '@/lib/admin/leads';
import { STATUS_LABELS } from '@/lib/admin/format';
import type { Lead, Site } from '@/lib/admin/types';

function cell(value: unknown): string {
  let text = value == null ? '' : String(value);
  // Neutralise spreadsheet formulas a visitor could have typed into a form.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const filters = { ...readFilters(new URL(request.url).searchParams), exclude: await webtanoSiteId() };
  const [{ data: sitesData }, { data: leadsData }] = await Promise.all([
    db().from('sites').select('id, name'),
    leadQuery(filters).limit(10_000),
  ]);
  const siteNames = new Map(((sitesData ?? []) as Pick<Site, 'id' | 'name'>[]).map((s) => [s.id, s.name]));
  const leads = (leadsData ?? []) as unknown as Lead[];

  const fieldKeys = [...new Set(leads.flatMap((l) => Object.keys(l.data)))];
  const header = ['Vreme', 'Sajt', 'Forma', 'Status', 'Ime', 'Email', 'Telefon', 'Izvor', 'Kampanja', 'Stranica', ...fieldKeys, 'Beleške'];
  const rows = leads.map((l) => [
    l.created_at,
    siteNames.get(l.site_id) ?? '',
    l.form_name,
    STATUS_LABELS[l.status],
    l.visitor_name,
    l.visitor_email,
    l.visitor_phone,
    leadSource(l),
    l.utm_campaign,
    l.page_url,
    ...fieldKeys.map((k) => l.data[k] ?? ''),
    l.notes,
  ]);

  // BOM so Excel opens the UTF-8 file with č, ć, š intact.
  const csv = '﻿' + [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="lidovi-${stamp}.csv"`,
    },
  });
}
