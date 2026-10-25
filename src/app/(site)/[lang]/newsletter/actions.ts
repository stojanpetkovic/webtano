'use server';

import { redirect } from 'next/navigation';
import { confirm, unsubscribe } from '@/lib/admin/newsletter';
import { isLang, localePath } from '@/lib/i18n';

const token = (formData: FormData) => String(formData.get('t') ?? '').slice(0, 100);
// Back to the page in the language it was opened in.
const path = (formData: FormData, page: string) => {
  const lang = formData.get('lang');
  return localePath(isLang(lang) ? lang : 'en', page);
};

export async function confirmSubscription(formData: FormData) {
  const t = token(formData);
  const ok = await confirm(t).catch(() => false);
  redirect(`${path(formData, '/newsletter/confirm')}?t=${encodeURIComponent(t)}&r=${ok ? 'ok' : 'invalid'}`);
}

export async function unsubscribeEmail(formData: FormData) {
  const t = token(formData);
  const ok = await unsubscribe(t).catch(() => false);
  redirect(`${path(formData, '/newsletter/unsubscribe')}?t=${encodeURIComponent(t)}&r=${ok ? 'ok' : 'invalid'}`);
}
