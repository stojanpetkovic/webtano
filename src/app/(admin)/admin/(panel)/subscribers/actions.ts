'use server';

import { revalidatePath } from 'next/cache';
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
