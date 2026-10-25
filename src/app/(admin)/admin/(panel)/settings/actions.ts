'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/admin/supabase';
import { SETTINGS, readSection, type Section } from '@/lib/admin/settings';

/** Saves one section of Settings. */
export async function saveSettings(form: FormData) {
  const section = String(form.get('section') ?? '');
  if (!(section in SETTINGS)) redirect('/admin/settings');
  const { values: value, invalid } = readSection(section as Section, form);
  if (invalid.length) redirect(`/admin/settings?invalid=${encodeURIComponent(invalid.join(', '))}#${section}`);
  const { error } = await db().from('crm_settings').upsert({ key: section, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  // Tracking codes and the company name are on every page of the site: rebuild them now, not in an hour.
  if (!error && (section === 'tracking' || section === 'company' || section === 'newsletter')) revalidatePath('/', 'layout');
  redirect(`/admin/settings?${error ? 'error' : 'saved'}=${section}#${section}`);
}
