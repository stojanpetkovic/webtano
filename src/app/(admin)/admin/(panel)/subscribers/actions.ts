'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdminI18n } from '@/lib/admin/i18n';
import { db } from '@/lib/admin/supabase';
import { sendConfirmation, type Subscriber } from '@/lib/admin/newsletter';

const TABLE = 'newsletter_subscribers';
const idOf = (formData: FormData) => String(formData.get('id') ?? '');

export async function unsubscribeSubscriber(formData: FormData) {
  const now = new Date().toISOString();
  await db().from(TABLE).update({ status: 'unsubscribed', unsubscribed_at: now, updated_at: now }).eq('id', idOf(formData));
  revalidatePath('/admin/subscribers');
}

/** Deletes the row completely, for a "forget me" request. */
export async function deleteSubscriber(formData: FormData) {
  await db().from(TABLE).delete().eq('id', idOf(formData));
  revalidatePath('/admin/subscribers');
}

export async function resendConfirmation(formData: FormData) {
  const { data } = await db().from(TABLE).select('*').eq('id', idOf(formData)).eq('status', 'pending').maybeSingle<Subscriber>();
  if (data) await sendConfirmation(data).catch((err) => console.error('resend confirmation failed:', err));
  revalidatePath('/admin/subscribers');
}

const field = (formData: FormData, name: string, max: number) => String(formData.get(name) ?? '').trim().slice(0, max) || null;

/**
 * Turns a subscriber into a lead once Stojan has been in touch, with the details
 * learned then. A WebTano subscriber becomes a deal on the CRM board; one from a
 * client site becomes a lead on that site. The address stays on the list.
 */
export async function convertSubscriber(formData: FormData) {
  const { t } = await getAdminI18n();
  const { data: sub } = await db().from(TABLE).select('*').eq('id', idOf(formData)).maybeSingle<Subscriber>();
  if (!sub) redirect('/admin/subscribers');
  const back = sub.site_id ? `/admin/subscribers?list=${sub.site_id}` : '/admin/subscribers';
  if (sub.deal_id) redirect(`/admin/crm/leads/${sub.deal_id}`);
  if (sub.lead_id) redirect(`/admin/leads/${sub.lead_id}`);

  const name = field(formData, 'name', 200);
  const phone = field(formData, 'phone', 50);
  const company = field(formData, 'company', 200);
  const website = field(formData, 'website', 200)?.replace(/^https?:\/\//, '').replace(/\/$/, '') ?? null;
  const message = field(formData, 'message', 5000);
  const now = new Date().toISOString();

  if (!sub.site_id) {
    const { data: deal } = await db()
      .from('crm_deals')
      .insert({
        name: name ?? sub.email,
        company,
        email: sub.email,
        phone,
        website,
        source: 'Newsletter',
        stage: 'contacted',
        position: -Date.now() / 1000,
      })
      .select('id')
      .single<{ id: string }>();
    if (!deal) redirect(back);
    const note = t(`Turned into a lead from the newsletter list (signed up ${sub.created_at.slice(0, 10)}).`, `Pretvoren u lid sa liste pretplatnika (prijavljen ${sub.created_at.slice(0, 10)}).`);
    await db().from('crm_activity').insert({ deal_id: deal.id, kind: 'system', body: message ? `${note}\n\n„${message}”` : note });
    await db().from(TABLE).update({ deal_id: deal.id, converted_at: now, updated_at: now }).eq('id', sub.id);
    revalidatePath('/admin/subscribers');
    redirect(`/admin/crm/leads/${deal.id}`);
  }

  const data: Record<string, string> = { email: sub.email };
  if (name) data.name = name;
  if (phone) data.phone = phone;
  if (company) data.business = company;
  if (website) data.website = website;
  if (message) data.message = message;
  const { data: lead } = await db()
    .from('leads')
    .insert({
      site_id: sub.site_id,
      form_name: 'subscriber',
      page_url: sub.page_url,
      data,
      visitor_name: name,
      visitor_email: sub.email,
      visitor_phone: phone,
      status: 'contacted',
      is_spam: false,
    })
    .select('id')
    .single<{ id: string }>();
  if (!lead) redirect(back);
  await db().from(TABLE).update({ lead_id: lead.id, converted_at: now, updated_at: now }).eq('id', sub.id);
  revalidatePath('/admin/subscribers');
  redirect(`/admin/leads/${lead.id}`);
}
