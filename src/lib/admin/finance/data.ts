import { Resend } from 'resend';
import { db } from '../supabase';
import { env } from '../env';
import { appSettings, ownerEmail, type AppSettings } from '../settings';
import { button, buttons, escape, facts, shell } from '../mail';
import type { Customer } from '../crm/types';
import { addDays, invoiceNumber, invoiceTotals, todayBelgrade } from './labels';
import { invoicePdf } from './pdf';
import type { BillTo, Invoice, InvoiceItem } from './types';

export const UUID = /^[0-9a-f-]{36}$/;

export async function loadInvoice(id: string): Promise<{ invoice: Invoice; items: InvoiceItem[] } | null> {
  if (!UUID.test(id)) return null;
  const [{ data: invoice }, { data: items }] = await Promise.all([
    db().from('fin_invoices').select('*').eq('id', id).maybeSingle<Invoice>(),
    db().from('fin_invoice_items').select('*').eq('invoice_id', id).order('position'),
  ]);
  return invoice ? { invoice, items: (items ?? []) as InvoiceItem[] } : null;
}

/** The customer's name and address as the invoice prints it, frozen when the invoice is made. */
export async function billTo(customerId: string | null): Promise<BillTo> {
  if (!customerId) return {};
  const { data } = await db().from('crm_customers').select('*').eq('id', customerId).maybeSingle<Customer>();
  if (!data) return {};
  return { name: data.contact_name, company: data.company, email: data.email, address: data.address, city: data.city, country: data.country };
}

export interface NewInvoice {
  customer_id: string | null;
  project_id?: string | null;
  category: string;
  status?: 'draft' | 'issued' | 'paid';
  issue_date?: string;
  due_date?: string | null;
  discount_pct?: number;
  tax_pct?: number;
  notes?: string | null;
  items: { description: string; qty: number; unit_price: number }[];
}

/** Creates an invoice with the next free number; a clash with a parallel save just takes the one after. */
export async function createInvoice(input: NewInvoice, settings?: AppSettings): Promise<Invoice> {
  const s = settings ?? (await appSettings());
  const issue = input.issue_date ?? todayBelgrade();
  const values = {
    customer_id: input.customer_id,
    project_id: input.project_id ?? null,
    category: input.category,
    status: input.status ?? 'draft',
    currency: s.proposals.currency || 'USD',
    issue_date: issue,
    due_date: input.due_date === undefined ? addDays(issue, s.invoices.due_days) : input.due_date,
    discount_pct: input.discount_pct ?? 0,
    tax_pct: input.tax_pct ?? s.invoices.tax_pct,
    notes: input.notes ?? null,
    bill_to: await billTo(input.customer_id),
    paid_at: input.status === 'paid' ? issue : null,
  };
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: last } = await db().from('fin_invoices').select('number').order('number', { ascending: false }).limit(1).maybeSingle<{ number: number }>();
    const { data, error } = await db()
      .from('fin_invoices')
      .insert({ ...values, number: (last?.number ?? 0) + 1 })
      .select('*')
      .single<Invoice>();
    if (error?.code === '23505') continue;
    if (error || !data) throw new Error(error?.message ?? 'invoice insert failed');
    await saveItems(data.id, input.items);
    return data;
  }
  throw new Error('Could not get a free invoice number');
}

export async function saveItems(invoiceId: string, items: NewInvoice['items']) {
  await db().from('fin_invoice_items').delete().eq('invoice_id', invoiceId);
  const rows = items
    .filter((i) => i.description.trim())
    .map((i, position) => ({ invoice_id: invoiceId, position, description: i.description.trim().slice(0, 1000), qty: i.qty, unit_price: i.unit_price }));
  if (rows.length) {
    const { error } = await db().from('fin_invoice_items').insert(rows);
    if (error) throw new Error(error.message);
  }
}

/** Marks an invoice paid and books its total as income, once. */
export async function markPaid(invoice: Invoice, items: InvoiceItem[], paidOn: string) {
  const { total } = invoiceTotals(items, invoice.discount_pct, invoice.tax_pct);
  await db().from('fin_invoices').update({ status: 'paid', paid_at: paidOn, updated_at: new Date().toISOString() }).eq('id', invoice.id);
  const settings = await appSettings();
  const { error } = await db().from('fin_income').upsert(
    {
      invoice_id: invoice.id,
      date: paidOn,
      amount: total,
      currency: invoice.currency,
      category: invoice.category,
      description: `Račun ${invoiceNumber(settings.invoices.prefix, invoice.number)}`,
      customer_id: invoice.customer_id,
      project_id: invoice.project_id,
      source: 'invoice',
    },
    { onConflict: 'invoice_id' },
  );
  if (error) throw new Error(error.message);
}

/** Emails the invoice PDF to the customer, with an optional note, and records when and to whom. */
export async function sendInvoice(invoice: Invoice, items: InvoiceItem[], to: string, note: string | null, copyMe: boolean) {
  if (!env.resendApiKey || !env.invoicesFromEmail) throw new Error('RESEND_API_KEY ili LEADS_FROM_EMAIL nije podešen na serveru.');
  const settings = await appSettings();
  const number = invoiceNumber(settings.invoices.prefix, invoice.number);
  const { total } = invoiceTotals(items, invoice.discount_pct, invoice.tax_pct);
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || 'USD' }).format(total);
  const due = invoice.due_date
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${invoice.due_date}T00:00:00Z`))
    : null;
  const paid = invoice.status === 'paid';
  const who = invoice.bill_to?.name?.split(/\s+/)[0];
  const pdf = await invoicePdf(invoice, items, settings);
  const company = settings.company.name || 'WebTano';
  const replyTo = settings.company.email || ownerEmail(settings) || undefined;

  const intro = paid
    ? `${who ? `Hi ${who}, t` : 'T'}hank you for your payment. Your receipt for invoice ${number} is attached.`
    : `${who ? `Hi ${who}, p` : 'P'}lease find invoice ${number} attached${due ? `, due ${due}` : ''}.`;
  const html = shell({
    lang: 'en',
    eyebrow: `${company} · invoice`,
    heading: paid ? `Receipt for invoice ${number}` : `Invoice ${number}`,
    intro,
    preheader: paid ? `Payment received: ${money}` : `${money}${due ? ` due ${due}` : ''}`,
    body: `${note ? `<p style="margin:20px 0 0;font-size:15px;line-height:23px;color:#0b0d14;white-space:pre-wrap">${escape(note)}</p>` : ''}
      <div style="margin:22px 0 4px">${facts([
        { label: 'Invoice', value: number },
        { label: paid ? 'Paid' : 'Amount due', value: money },
        ...(due && !paid ? [{ label: 'Due date', value: due }] : []),
      ])}</div>
      ${!paid && settings.invoices.payment_details ? `<p style="margin:18px 0 0;font-size:13px;line-height:20px;color:#4b5263;white-space:pre-wrap"><strong style="color:#0b0d14">How to pay</strong><br>${escape(settings.invoices.payment_details)}</p>` : ''}
      ${replyTo ? `<div style="margin:22px 0 0">${buttons([button('Reply with a question', `mailto:${replyTo}?subject=${encodeURIComponent(`Invoice ${number}`)}`, true)])}</div>` : ''}`,
    footer: `${company} · the PDF is attached to this email.`,
  });
  const text = `${intro}\n\n${note ? `${note}\n\n` : ''}Invoice: ${number}\n${paid ? 'Paid' : 'Amount due'}: ${money}${due && !paid ? `\nDue date: ${due}` : ''}${
    !paid && settings.invoices.payment_details ? `\n\nHow to pay:\n${settings.invoices.payment_details}` : ''
  }`;

  const { error } = await new Resend(env.resendApiKey).emails.send({
    from: env.invoicesFromEmail,
    to,
    ...(copyMe && ownerEmail(settings) ? { bcc: ownerEmail(settings) } : {}),
    replyTo,
    subject: paid ? `Receipt for invoice ${number} from ${company}` : `Invoice ${number} from ${company}: ${money}${due ? ` due ${due}` : ''}`,
    html,
    text,
    // Base64 text is what the Resend API documents for attachment content.
    attachments: [{ filename: `${number}.pdf`, content: Buffer.from(pdf).toString('base64'), contentType: 'application/pdf' }],
  });
  if (error) throw new Error(error.message);
  await db()
    .from('fin_invoices')
    .update({ sent_at: new Date().toISOString(), sent_to: to, status: invoice.status === 'draft' ? 'issued' : invoice.status, updated_at: new Date().toISOString() })
    .eq('id', invoice.id);
}
