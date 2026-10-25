import { Resend } from 'resend';
import { db } from './supabase';
import { env } from './env';
import { leadSource } from './leads';
import { appSettings, ownerEmail } from './settings';
import { CYAN, INK, button, buttons, escape, facts, kicker, panel, shell } from './mail';
import type { Lead, Site } from './types';

const copy = {
  sr: {
    subject: (site: string, who: string | null) => (who ? `Novi upit: ${who} · ${site}` : `Novi upit sa sajta ${site}`),
    eyebrow: (site: string) => `${site} · novi upit`,
    heading: (who: string | null) => (who ? `Novi upit: ${who}` : 'Stigao je novi upit'),
    intro: (form: string, site: string, time: string) => `Preko forme „${form}" na sajtu ${site}, ${time}.`,
    contact: 'Kontakt',
    reply: 'Odgovori emailom',
    call: 'Pozovi',
    replyHint: 'Možete i samo da odgovorite na ovaj email: odgovor ide direktno posetiocu.',
    message: 'Poruka',
    fields: 'Ostali podaci iz forme',
    details: 'Detalji',
    page: 'Stranica',
    source: 'Izvor',
    time: 'Vreme',
    admin: 'Otvori u adminu',
    preheader: (msg: string | null, site: string) => msg ?? `Novi upit sa sajta ${site}`,
    footer: 'Ovaj email je automatski poslat sa WebTano sistema za upite.',
    locale: 'sr-Latn-RS',
  },
  en: {
    subject: (site: string, who: string | null) => (who ? `New inquiry: ${who} · ${site}` : `New inquiry from ${site}`),
    eyebrow: (site: string) => `${site} · new inquiry`,
    heading: (who: string | null) => (who ? `New inquiry from ${who}` : 'You have a new inquiry'),
    intro: (form: string, site: string, time: string) => `Through the "${form}" form on ${site}, ${time}.`,
    contact: 'Contact',
    reply: 'Reply by email',
    call: 'Call',
    replyHint: 'You can also just reply to this email: your answer goes straight to the visitor.',
    message: 'Message',
    fields: 'Other form details',
    details: 'Details',
    page: 'Page',
    source: 'Source',
    time: 'Time',
    admin: 'Open in admin',
    preheader: (msg: string | null, site: string) => msg ?? `New inquiry from ${site}`,
    footer: 'This email was sent automatically by the WebTano lead system.',
    locale: 'en-US',
  },
} as const;

function label(key: string): string {
  const spaced = key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// Form fields that hold the visitor's own words, shown as the message block.
const MESSAGE_KEY = /message|poruk|comment|komentar|napomen|opis|pitanj|details|detalj|note|upit|inquiry|question/i;

/** Splits the form into the visitor's message and the rest, leaving out what the contact block already shows. */
function splitFields(lead: Lead) {
  const entries = Object.entries(lead.data).filter(([, v]) => v.trim() !== '');
  const messages = entries.filter(([k]) => MESSAGE_KEY.test(k)).sort((a, b) => b[1].length - a[1].length);
  const message = messages[0] ?? null;
  const shown = new Set([lead.visitor_name, lead.visitor_email, lead.visitor_phone].filter(Boolean).map((v) => v!.trim()));
  const rest = entries.filter(([k, v]) => k !== message?.[0] && !shown.has(v.trim()));
  return { message: message?.[1] ?? null, rest };
}

const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

export function render(site: Site, lead: Lead, lang: 'sr' | 'en', adminLink: string | null) {
  const t = copy[lang];
  const time = new Intl.DateTimeFormat(t.locale, {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: site.timezone || 'Europe/Belgrade',
  }).format(new Date(lead.created_at));
  const who = lead.visitor_name?.trim() || null;
  const { message, rest } = splitFields(lead);
  const subjectLine = `${t.subject(site.name, who)}`;

  const contactLines = [
    who && `<div style="font-size:17px;line-height:24px;font-weight:700;color:${INK}">${escape(who)}</div>`,
    lead.visitor_email &&
      `<div style="font-size:14px;line-height:22px"><a href="mailto:${escape(lead.visitor_email)}" style="color:${INK};text-decoration:underline;text-decoration-color:${CYAN}">${escape(lead.visitor_email)}</a></div>`,
    lead.visitor_phone &&
      `<div style="font-size:14px;line-height:22px"><a href="${tel(lead.visitor_phone)}" style="color:${INK};text-decoration:underline;text-decoration-color:${CYAN}">${escape(lead.visitor_phone)}</a></div>`,
  ].filter(Boolean);
  const actions = buttons(
    [
      lead.visitor_email && button(t.reply, `mailto:${lead.visitor_email}?subject=${encodeURIComponent(`Re: ${site.name}`)}`),
      lead.visitor_phone && button(t.call, tel(lead.visitor_phone), Boolean(lead.visitor_email)),
    ].filter((b): b is string => Boolean(b)),
  );

  const body = [
    contactLines.length
      ? `<div style="margin:24px 0 0">${panel(`${kicker(t.contact)}<div style="margin:8px 0 ${actions ? '14px' : '0'}">${contactLines.join('')}</div>${actions}`)}</div>`
      : '',
    message
      ? `<div style="margin:26px 0 0">${kicker(t.message)}
        <div style="margin:10px 0 0;padding:4px 0 4px 16px;border-left:3px solid ${CYAN};font-size:15px;line-height:24px;color:${INK};white-space:pre-wrap;word-break:break-word">${escape(message)}</div></div>`
      : '',
    rest.length
      ? `<div style="margin:26px 0 0">${kicker(t.fields)}<div style="margin:4px 0 0">${facts(rest.map(([k, v]) => ({ label: label(k), value: v })))}</div></div>`
      : '',
    `<div style="margin:26px 0 0">${kicker(t.details)}<div style="margin:4px 0 0">${facts(
      [
        lead.page_url ? { label: t.page, value: lead.page_url.replace(/^https?:\/\//, ''), href: lead.page_url } : null,
        { label: t.source, value: leadSource(lead) },
        { label: t.time, value: time },
      ].filter((r) => r !== null),
    )}</div></div>`,
    lead.visitor_email ? `<p style="margin:22px 0 0;font-size:13px;line-height:20px;color:#6b7280">${escape(t.replyHint)}</p>` : '',
    adminLink ? `<div style="margin:24px 0 0">${buttons([button(t.admin, adminLink)])}</div>` : '',
  ].join('');

  const html = shell({
    lang,
    eyebrow: t.eyebrow(site.name),
    heading: t.heading(who),
    intro: t.intro(lead.form_name, site.name, time),
    body,
    footer: t.footer,
    preheader: t.preheader(message ? message.slice(0, 120) : null, site.name),
  });

  const text = [
    t.heading(who),
    t.intro(lead.form_name, site.name, time),
    '',
    who ? `${who}` : '',
    lead.visitor_email ?? '',
    lead.visitor_phone ?? '',
    message ? `\n${t.message}:\n${message}` : '',
    rest.length ? `\n${rest.map(([k, v]) => `${label(k)}: ${v}`).join('\n')}` : '',
    '',
    lead.page_url ? `${t.page}: ${lead.page_url}` : '',
    `${t.source}: ${leadSource(lead)}`,
    `${t.time}: ${time}`,
    adminLink ? `\n${t.admin}: ${adminLink}` : '',
  ]
    .filter((line) => line !== '')
    .join('\n');

  return { subject: subjectLine, html, text };
}

async function log(entry: {
  lead_id: string;
  recipient: string;
  kind: 'client' | 'owner';
  status: 'sent' | 'failed';
  provider_id?: string | null;
  error?: string | null;
}) {
  const { error } = await db().from('email_log').insert(entry);
  if (error) console.error('email_log insert failed', error.message);
}

async function sendOne(
  resend: Resend,
  lead: Lead,
  to: string,
  kind: 'client' | 'owner',
  message: ReturnType<typeof render>,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: env.leadsFromEmail,
      to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: lead.visitor_email ?? undefined,
    });
    if (error) throw new Error(error.message);
    await log({
      lead_id: lead.id,
      recipient: to,
      kind,
      status: 'sent',
      provider_id: data?.id ?? null,
    });
  } catch (err) {
    const message_ = err instanceof Error ? err.message : String(err);
    console.error(`lead email to ${to} failed:`, message_);
    await log({
      lead_id: lead.id,
      recipient: to,
      kind,
      status: 'failed',
      error: message_.slice(0, 1000),
    });
  }
}

/** Emails the lead to the site's client addresses and to the owner, logging every attempt. */
export async function sendLeadEmails(site: Site, lead: Lead, only?: 'client' | 'owner') {
  // The owner address set in Podešavanja wins over OWNER_EMAIL.
  const owner = ownerEmail(await appSettings());
  const wantOwner = only !== 'client' && site.notify_owner && owner;
  if (!env.resendApiKey || !env.leadsFromEmail) {
    const missing = !env.resendApiKey ? 'RESEND_API_KEY' : 'LEADS_FROM_EMAIL';
    console.error(`${missing} missing; lead emails not sent`);
    // Logged as failed so the lead page shows why nothing arrived.
    const recipients = [
      ...(only !== 'owner' ? site.client_emails.map((to) => ({ to, kind: 'client' as const })) : []),
      ...(wantOwner ? [{ to: owner, kind: 'owner' as const }] : []),
    ];
    await Promise.all(
      recipients.map(({ to, kind }) =>
        log({ lead_id: lead.id, recipient: to, kind, status: 'failed', error: `${missing} is not set on the server` }),
      ),
    );
    return;
  }
  const resend = new Resend(env.resendApiKey);
  const jobs: Promise<void>[] = [];

  if (only !== 'owner') {
    const clientMessage = render(site, lead, site.email_language, null);
    for (const to of site.client_emails) jobs.push(sendOne(resend, lead, to, 'client', clientMessage));
  }
  if (wantOwner) {
    const ownerMessage = render(site, lead, 'sr', `${env.siteUrl}/admin/leads/${lead.id}`);
    jobs.push(sendOne(resend, lead, owner, 'owner', ownerMessage));
  }
  await Promise.all(jobs);
}
