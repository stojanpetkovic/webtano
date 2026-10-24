'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/admin/supabase';
import { sendLeadEmails } from '@/lib/admin/email';
import { STATUS_LABELS } from '@/lib/admin/format';
import type { Lead, LeadStatus, Site } from '@/lib/admin/types';

const UUID = /^[0-9a-f-]{36}$/;

async function loadLead(form: FormData): Promise<Lead> {
  const id = String(form.get('id') ?? '');
  if (!UUID.test(id)) redirect('/admin/leads');
  const { data } = await db().from('leads').select('*').eq('id', id).maybeSingle<Lead>();
  if (!data) redirect('/admin/leads');
  return data;
}

const back = (lead: Lead, notice: string) => redirect(`/admin/leads/${lead.id}?notice=${notice}`);

export async function updateLead(form: FormData) {
  const lead = await loadLead(form);
  const status = String(form.get('status')) as LeadStatus;
  await db()
    .from('leads')
    .update({
      status: status in STATUS_LABELS ? status : lead.status,
      notes: String(form.get('notes') ?? '').slice(0, 5000) || null,
    })
    .eq('id', lead.id);
  back(lead, 'saved');
}

export async function resendLead(form: FormData) {
  const lead = await loadLead(form);
  const { data: site } = await db().from('sites').select('*').eq('id', lead.site_id).single<Site>();
  if (site) await sendLeadEmails(site, lead, form.get('to') === 'client' ? 'client' : 'owner');
  back(lead, 'resent');
}

export async function toggleSpam(form: FormData) {
  const lead = await loadLead(form);
  await db().from('leads').update({ is_spam: !lead.is_spam }).eq('id', lead.id);
  back(lead, lead.is_spam ? 'not-spam' : 'spam');
}

export async function deleteLead(form: FormData) {
  const lead = await loadLead(form);
  await db().from('leads').delete().eq('id', lead.id);
  redirect('/admin/leads');
}
