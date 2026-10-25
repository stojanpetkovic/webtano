import { Resend } from 'resend';
import { db } from '../supabase';
import { env } from '../env';
import type { Mode, OutboxRow } from './registry';

export interface Message {
  kind: string;
  dedupeKey: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string | null;
  customerId?: string | null;
  dealId?: string | null;
}

export type QueueResult = 'sent' | 'pending' | 'failed' | 'duplicate';

/** True when an email with this key is already in the outbox, whatever its status. */
export async function alreadyQueued(dedupeKey: string): Promise<boolean> {
  const { data } = await db().from('crm_outbox').select('id').eq('dedupe_key', dedupeKey).maybeSingle();
  return Boolean(data);
}

/**
 * Puts one email in the outbox. The unique key refuses a second copy, even from two
 * cron runs at once. In auto mode it is sent right away; otherwise it waits for approval.
 */
export async function queue(message: Message, mode: Mode): Promise<QueueResult> {
  const { data, error } = await db()
    .from('crm_outbox')
    .insert({
      kind: message.kind,
      dedupe_key: message.dedupeKey,
      to_email: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo ?? null,
      customer_id: message.customerId ?? null,
      deal_id: message.dealId ?? null,
    })
    .select('id')
    .single<{ id: string }>();
  if (error) {
    if (error.code === '23505') return 'duplicate';
    throw new Error(`outbox insert failed: ${error.message}`);
  }
  return mode === 'auto' ? deliver(data.id) : 'pending';
}

/**
 * Sends one waiting email. It is claimed first (pending → sending), so a double
 * click or two runs at once can never send it twice.
 */
export async function deliver(id: string): Promise<'sent' | 'failed' | 'duplicate'> {
  const { data: row } = await db()
    .from('crm_outbox')
    .update({ status: 'sending' })
    .eq('id', id)
    .in('status', ['pending', 'failed'])
    .select('*')
    .maybeSingle<OutboxRow>();
  if (!row) return 'duplicate';

  try {
    if (!env.resendApiKey || !env.leadsFromEmail) throw new Error('RESEND_API_KEY ili LEADS_FROM_EMAIL nije podešen');
    const { data, error } = await new Resend(env.resendApiKey).emails.send({
      from: env.leadsFromEmail,
      to: row.to_email,
      subject: row.subject,
      html: row.html,
      text: row.text,
      replyTo: row.reply_to ?? undefined,
    });
    if (error) throw new Error(error.message);
    await db()
      .from('crm_outbox')
      .update({ status: 'sent', provider_id: data?.id ?? null, error: null, sent_at: new Date().toISOString() })
      .eq('id', id);
    return 'sent';
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`outbox email ${row.dedupe_key} failed:`, message);
    await db()
      .from('crm_outbox')
      .update({ status: 'failed', error: message.slice(0, 1000) })
      .eq('id', id);
    return 'failed';
  }
}
