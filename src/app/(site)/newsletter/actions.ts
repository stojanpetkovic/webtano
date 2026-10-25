'use server';

import { redirect } from 'next/navigation';
import { confirm, unsubscribe } from '@/lib/admin/newsletter';

const token = (formData: FormData) => String(formData.get('t') ?? '').slice(0, 100);

export async function confirmSubscription(formData: FormData) {
  const t = token(formData);
  const ok = await confirm(t).catch(() => false);
  redirect(`/newsletter/confirm?t=${encodeURIComponent(t)}&r=${ok ? 'ok' : 'invalid'}`);
}

export async function unsubscribeEmail(formData: FormData) {
  const t = token(formData);
  const ok = await unsubscribe(t).catch(() => false);
  redirect(`/newsletter/unsubscribe?t=${encodeURIComponent(t)}&r=${ok ? 'ok' : 'invalid'}`);
}
