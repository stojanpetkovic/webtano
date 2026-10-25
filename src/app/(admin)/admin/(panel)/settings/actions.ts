'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/admin/supabase';
import { SETTINGS, readSection, type Section } from '@/lib/admin/settings';

/** Saves one section of Podešavanja. */
export async function saveSettings(form: FormData) {
  const section = String(form.get('section') ?? '');
  if (!(section in SETTINGS)) redirect('/admin/settings');
  const value = readSection(section as Section, form);
  const { error } = await db().from('crm_settings').upsert({ key: section, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  redirect(`/admin/settings?${error ? 'error' : 'saved'}=${section}#${section}`);
}
