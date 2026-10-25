'use server';

import { headers } from 'next/headers';
import { findSite, isRateLimited, recordLead, visitorHash } from '@/lib/admin/ingest';
import { site } from '@/content/site';
import { env } from '@/lib/admin/env';
import { hashIp } from '@/lib/admin/leads';
import { subscribe, tooManySignups } from '@/lib/admin/newsletter';

export interface CheckState {
  ok: boolean;
  error?: string;
}

const FIELDS = ['website', 'business', 'timeline', 'name', 'email', 'phone', 'message'] as const;

const SERVICE_KEYS = ['new-website', 'redesign', 'seo', 'ads', 'other'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The free website check form. It goes straight into the lead admin as a lead
 * of the webtano.com site, so it arrives like any client site's enquiry: one
 * record in /admin and one notification email.
 */
export async function submitCheck(_prev: CheckState, formData: FormData): Promise<CheckState> {
  const fields: Record<string, string> = {};
  // Several services can be picked; they are stored as one comma list, like the other fields.
  const services = [...new Set(formData.getAll('service').map(String))].filter((s) => SERVICE_KEYS.includes(s));
  if (services.length) fields.service = services.join(', ');
  for (const key of FIELDS) {
    const value = formData.get(key)?.toString().trim().slice(0, key === 'message' ? 5000 : 200) ?? '';
    if (value) fields[key] = value;
  }

  if (!fields.name || fields.name.length < 2 || !fields.email || !EMAIL.test(fields.email)) {
    return { ok: false, error: 'Please fill in your name and a valid email.' };
  }

  // Bots fill the hidden field; tell them it worked and keep the lead out of the inbox.
  const spam = Boolean(formData.get('company_url')?.toString());

  try {
    const target = await findSite(site.leadsSiteKey);
    if (!target) throw new Error('webtano.com site missing in the lead admin');

    const h = await headers();
    const request = new Request(site.url, { headers: h });
    const ipHash = visitorHash(request, h.get('x-real-ip') ?? undefined, target);
    if (await isRateLimited(target, ipHash)) {
      return { ok: false, error: 'Too many requests. Please try again in a few minutes.' };
    }

    // The campaign the visitor first arrived with, as leads.js remembered it.
    const pageUrl = h.get('referer');
    let utm: unknown = {};
    try {
      utm = JSON.parse(formData.get('utm')?.toString() || '{}');
    } catch {
      // Malformed: store the lead without campaign data.
    }

    const lead = await recordLead({
      site: target,
      fields,
      spam,
      form: 'website-check',
      pageUrl,
      referrer: formData.get('referrer')?.toString() || null,
      utm,
      userAgent: h.get('user-agent'),
      ipHash,
    });
    if (!lead) throw new Error('lead insert failed');
    return { ok: true };
  } catch (error) {
    console.error('Website check form failed:', error);
    return { ok: false, error: 'Something went wrong. Please try again in a minute.' };
  }
}

export interface NewsletterState {
  ok: boolean;
  error?: string;
}

const SOURCES = ['popup', 'footer'];

/** Newsletter sign-up from the popup or the footer: stores it as pending and sends the confirmation email. */
export async function subscribeNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = formData.get('email')?.toString().trim().slice(0, 200) ?? '';
  if (!EMAIL.test(email)) return { ok: false, error: 'Please enter a valid email.' };
  // Bots fill the hidden field; tell them it worked and store nothing.
  if (formData.get('company_url')?.toString()) return { ok: true };
  const source = SOURCES.includes(String(formData.get('source'))) ? String(formData.get('source')) : 'footer';

  try {
    const h = await headers();
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
    const ipHash = hashIp(ip, env.ipHashSalt || 'newsletter');
    if (await tooManySignups(ipHash)) return { ok: false, error: 'Too many requests. Please try again in a few minutes.' };
    await subscribe({ email, source, pageUrl: h.get('referer'), ipHash, userAgent: h.get('user-agent') });
    return { ok: true };
  } catch (error) {
    console.error('Newsletter sign-up failed:', error);
    return { ok: false, error: 'Something went wrong. Please try again in a minute.' };
  }
}
