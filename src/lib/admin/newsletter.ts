import { randomBytes } from 'node:crypto';
import { Resend } from 'resend';
import { db } from './supabase';
import { env } from './env';
import { button, buttons, escape, shell } from './mail';

/*
 * Newsletter sign-ups with double opt-in. A sign-up is 'pending' until the
 * visitor uses the link in the confirmation email; every email after that
 * carries a one-click unsubscribe link. One address is one row.
 */

export type SubscriberStatus = 'pending' | 'confirmed' | 'unsubscribed';

export interface Subscriber {
  id: string;
  email: string;
  status: SubscriberStatus;
  source: string;
  page_url: string | null;
  consent_text: string | null;
  token: string;
  ip_hash: string | null;
  user_agent: string | null;
  confirm_sent_at: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const SUBSCRIBER_STATUS: Record<SubscriberStatus, string> = {
  pending: 'Čeka potvrdu',
  confirmed: 'Potvrđen',
  unsubscribed: 'Odjavljen',
};

export const SOURCES: Record<string, string> = { popup: 'Popup', footer: 'Futer', admin: 'Admin' };

/** What the visitor agrees to, stored with the sign-up as proof of consent. */
export const CONSENT_TEXT =
  'I agree to receive the WebTano newsletter (about one email a month with tips on websites, local SEO and Google Ads). I can unsubscribe at any time. Privacy notice: webtano.com/privacy';

const RATE_LIMIT = { max: 5, minutes: 10 };
const RESEND_AFTER_MS = 2 * 60_000;
/** Sign-ups never confirmed are deleted after this many days. */
export const PENDING_DAYS = 30;

const TABLE = 'newsletter_subscribers';
const newToken = () => randomBytes(24).toString('hex');
const confirmUrl = (token: string) => `${env.siteUrl}/newsletter/confirm?t=${token}`;
export const unsubscribeUrl = (token: string) => `${env.siteUrl}/newsletter/unsubscribe?t=${token}`;

export async function tooManySignups(ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT.minutes * 60_000).toISOString();
  const { count } = await db().from(TABLE).select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('updated_at', since);
  return (count ?? 0) >= RATE_LIMIT.max;
}

/**
 * Records a sign-up and sends the confirmation email. The visitor sees the same
 * answer whether the address is new, pending or already confirmed, so the form
 * never reveals who is on the list.
 */
export async function subscribe(input: { email: string; source: string; pageUrl: string | null; ipHash: string; userAgent: string | null }) {
  const email = input.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const { data: existing } = await db().from(TABLE).select('*').eq('email', email).maybeSingle<Subscriber>();

  if (existing?.status === 'confirmed') return;
  if (existing?.status === 'pending' && existing.confirm_sent_at && Date.now() - Date.parse(existing.confirm_sent_at) < RESEND_AFTER_MS) return;

  const fields = {
    source: input.source,
    page_url: input.pageUrl?.slice(0, 500) ?? null,
    consent_text: CONSENT_TEXT,
    ip_hash: input.ipHash,
    user_agent: input.userAgent?.slice(0, 500) ?? null,
    updated_at: now,
  };
  let row: Subscriber | null = null;
  if (existing) {
    // A pending or unsubscribed address signs up again: a fresh token, pending until confirmed.
    const { data, error } = await db()
      .from(TABLE)
      .update({ ...fields, status: 'pending', token: newToken(), unsubscribed_at: null })
      .eq('id', existing.id)
      .select('*')
      .single<Subscriber>();
    if (error) throw new Error(error.message);
    row = data;
  } else {
    const { data, error } = await db()
      .from(TABLE)
      .insert({ ...fields, email, status: 'pending', token: newToken() })
      .select('*')
      .single<Subscriber>();
    // Two sign-ups at once: the other request already sent the email.
    if (error?.code === '23505') return;
    if (error) throw new Error(error.message);
    row = data;
  }
  if (row) await sendConfirmation(row);
}

async function send(to: string, message: { subject: string; html: string; text: string }, unsubscribe?: string) {
  if (!env.resendApiKey || !env.newsletterFromEmail) throw new Error('RESEND_API_KEY or LEADS_FROM_EMAIL is not set');
  const { error } = await new Resend(env.resendApiKey).emails.send({
    from: env.newsletterFromEmail,
    to,
    ...message,
    headers: unsubscribe
      ? {
          'List-Unsubscribe': `<${unsubscribe.replace('/newsletter/unsubscribe', '/api/newsletter/unsubscribe')}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        }
      : undefined,
  });
  if (error) throw new Error(error.message);
}

export async function sendConfirmation(row: Subscriber) {
  const link = confirmUrl(row.token);
  const html = shell({
    lang: 'en',
    eyebrow: 'WebTano newsletter',
    heading: 'Confirm your subscription',
    intro: 'You (or someone using your address) asked to receive the WebTano newsletter. Please confirm that it was you.',
    body: `<div style="margin:24px 0 8px">${buttons([button('Yes, subscribe me', link)])}</div>
      <p style="margin:16px 0 0;font-size:13px;line-height:20px;color:#6b7280">If you did not ask for this, ignore this email: you will not be added, and the request is deleted after ${PENDING_DAYS} days.</p>
      <p style="margin:12px 0 0;font-size:12px;line-height:18px;color:#9aa0ab;word-break:break-all">Button not working? Open this link: ${escape(link)}</p>`,
    footer: 'WebTano · websites, local SEO and Google Ads for local businesses.',
    preheader: 'One click to confirm your WebTano newsletter subscription.',
  });
  const text = `Confirm your WebTano newsletter subscription:\n${link}\n\nIf you did not ask for this, ignore this email.`;
  await send(row.email, { subject: 'Confirm your WebTano newsletter subscription', html, text });
  await db().from(TABLE).update({ confirm_sent_at: new Date().toISOString() }).eq('id', row.id);
}

async function sendWelcome(row: Subscriber) {
  const unsub = unsubscribeUrl(row.token);
  const html = shell({
    lang: 'en',
    eyebrow: 'WebTano newsletter',
    heading: 'You are subscribed',
    intro: 'Thanks for confirming. About once a month you will get one short, practical email on getting more calls from your website, local SEO and Google Ads.',
    body: `<div style="margin:24px 0 8px">${buttons([button('Get a free website check', `${env.siteUrl}/#hero-form`), button('Read the blog', `${env.siteUrl}/blog`, true)])}</div>`,
    footer: 'You receive this because you subscribed on webtano.com.',
    preheader: 'Your WebTano newsletter subscription is confirmed.',
    unsubscribe: unsub,
  });
  const text = `You are subscribed to the WebTano newsletter.\n\nUnsubscribe at any time: ${unsub}`;
  await send(row.email, { subject: 'Welcome to the WebTano newsletter', html, text }, unsub);
}

const validToken = (token: string) => /^[a-f0-9]{48}$/.test(token);

export async function findByToken(token: string): Promise<Subscriber | null> {
  if (!validToken(token)) return null;
  const { data } = await db().from(TABLE).select('*').eq('token', token).maybeSingle<Subscriber>();
  return data ?? null;
}

/** Confirms a pending sign-up; true when the address is now confirmed. */
export async function confirm(token: string): Promise<boolean> {
  const row = await findByToken(token);
  if (!row || row.status === 'unsubscribed') return false;
  if (row.status === 'confirmed') return true;
  const now = new Date().toISOString();
  const { data, error } = await db()
    .from(TABLE)
    .update({ status: 'confirmed', confirmed_at: now, updated_at: now })
    .eq('id', row.id)
    .select('*')
    .single<Subscriber>();
  if (error || !data) return false;
  await sendWelcome(data).catch((err) => console.error('newsletter welcome email failed:', err));
  return true;
}

/** Unsubscribes by token; true when the token belonged to someone. */
export async function unsubscribe(token: string): Promise<boolean> {
  const row = await findByToken(token);
  if (!row) return false;
  if (row.status !== 'unsubscribed') {
    const now = new Date().toISOString();
    await db().from(TABLE).update({ status: 'unsubscribed', unsubscribed_at: now, updated_at: now }).eq('id', row.id);
  }
  return true;
}

/** Deletes sign-ups that were never confirmed, as the privacy notice promises. */
export async function purgeUnconfirmed(now = new Date()) {
  const before = new Date(now.getTime() - PENDING_DAYS * 86_400_000).toISOString();
  const { error } = await db().from(TABLE).delete().eq('status', 'pending').lt('created_at', before);
  if (error) throw new Error(error.message);
}
