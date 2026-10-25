'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/admin/supabase';
import { readSiteForm } from '@/lib/admin/siteForm';
import type { Site } from '@/lib/admin/types';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { T } from '@/lib/i18n';

export interface SiteFormState {
  errors: string[];
  draft?: Partial<Site>;
}

const duplicate = (t: T, code: string | undefined, message: string) =>
  code === '23505' ? t('A site with that domain already exists.', 'Sajt sa tim domenom već postoji.') : message;

/** A new site always belongs to a customer, so it is only added from the customer's page. */
export async function createSite(_prev: SiteFormState, form: FormData): Promise<SiteFormState> {
  const { t } = await getAdminI18n();
  const customerId = String(form.get('customer_id') ?? '');
  if (!/^[0-9a-f-]{36}$/.test(customerId)) return { errors: [t('Sites are added from a customer’s page.', 'Sajt se dodaje kod klijenta.')] };
  const { errors, values } = readSiteForm(form, t);
  if (errors.length) return { errors, draft: values as Partial<Site> };
  const { data, error } = await db().from('sites').insert(values).select('id').single();
  if (error) return { errors: [duplicate(t, error.code, error.message)], draft: values as Partial<Site> };
  await db().from('crm_customer_sites').insert({ site_id: data.id, customer_id: customerId });
  redirect(`/admin/sites/${data.id}/settings?notice=created`);
}

async function loadSite(form: FormData): Promise<Site> {
  const id = String(form.get('id') ?? '');
  const { data } = /^[0-9a-f-]{36}$/.test(id)
    ? await db().from('sites').select('*').eq('id', id).maybeSingle<Site>()
    : { data: null };
  if (!data) redirect('/admin/sites');
  return data;
}

export async function saveSite(_prev: SiteFormState, form: FormData): Promise<SiteFormState> {
  const site = await loadSite(form);
  const { t } = await getAdminI18n();
  const { errors, values } = readSiteForm(form, t);
  if (errors.length) return { errors };
  const { error } = await db().from('sites').update(values).eq('id', site.id);
  if (error) return { errors: [duplicate(t, error.code, error.message)] };
  redirect(`/admin/sites/${site.id}/settings?notice=saved`);
}

export async function rotateKey(form: FormData) {
  const site = await loadSite(form);
  const key = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
  await db().from('sites').update({ site_key: key }).eq('id', site.id);
  redirect(`/admin/sites/${site.id}/settings?notice=rotated`);
}

export async function deleteSite(_prev: SiteFormState, form: FormData): Promise<SiteFormState> {
  const site = await loadSite(form);
  if (String(form.get('confirm') ?? '').trim().toLowerCase() !== site.domain) {
    const { t } = await getAdminI18n();
    return { errors: [t('To delete, type the site’s exact domain.', 'Za brisanje upiši tačan domen sajta.')] };
  }
  await db().from('sites').delete().eq('id', site.id);
  redirect('/admin/sites');
}
