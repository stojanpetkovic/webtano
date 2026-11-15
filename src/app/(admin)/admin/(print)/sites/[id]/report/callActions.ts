'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/admin/supabase';
import { AdsCallsError, parseAdsCallsCsv } from '@/lib/admin/adsCallsCsv';

const MAX_BYTES = 2_000_000;

/** Back to the site dashboard the form was on, keeping its range, with a notice for the calls panel. */
function back(form: FormData, siteId: string, notice: string): never {
  const raw = String(form.get('back') ?? '');
  const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : '');
  params.set('calls', notice);
  redirect(`/admin/sites/${siteId}?${params}#google-ads-pozivi`);
}

function siteIdOf(form: FormData): string {
  const id = String(form.get('site_id') ?? '');
  if (!/^[0-9a-f-]{36}$/.test(id)) redirect('/admin/sites');
  return id;
}

export async function uploadAdCalls(form: FormData) {
  const siteId = siteIdOf(form);
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) back(form, siteId, 'empty');
  if (file.size > MAX_BYTES) back(form, siteId, 'too-big');

  let parsed;
  try {
    parsed = parseAdsCallsCsv(new Uint8Array(await file.arrayBuffer()));
  } catch (err) {
    back(form, siteId, err instanceof AdsCallsError ? err.message : 'unreadable');
  }

  const { error } = await db().from('site_ad_call_reports').insert({
    site_id: siteId,
    file_name: file.name.slice(0, 200),
    date_from: parsed.from,
    date_to: parsed.to,
    total: parsed.calls.length,
    calls: parsed.calls,
  });
  if (error) {
    console.error('site_ad_call_reports insert failed', error.message);
    back(form, siteId, 'db');
  }
  revalidatePath(`/admin/sites/${siteId}`, 'layout');
  back(form, siteId, 'added');
}

export async function deleteAdCalls(form: FormData) {
  const siteId = siteIdOf(form);
  const id = String(form.get('id') ?? '');
  if (/^[0-9a-f-]{36}$/.test(id)) await db().from('site_ad_call_reports').delete().eq('id', id).eq('site_id', siteId);
  revalidatePath(`/admin/sites/${siteId}`, 'layout');
  back(form, siteId, 'deleted');
}
