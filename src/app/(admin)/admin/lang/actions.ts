'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { isLang } from '@/lib/i18n';
import { ADMIN_LANG_COOKIE } from '@/lib/admin/i18n';

/** Saves the admin language for a year and redraws the page in it. */
export async function setAdminLang(form: FormData) {
  const lang = form.get('lang');
  if (!isLang(lang)) return;
  (await cookies()).set(ADMIN_LANG_COOKIE, lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  revalidatePath('/admin', 'layout');
}
