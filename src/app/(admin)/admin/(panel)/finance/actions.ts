'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/admin/supabase';
import { appSettings } from '@/lib/admin/settings';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, categoryFor, todayBelgrade } from '@/lib/admin/finance/labels';
import { UUID, createInvoice, loadInvoice, markPaid, saveItems, sendInvoice, billTo } from '@/lib/admin/finance/data';
import type { Project } from '@/lib/admin/crm/types';

// Form readers: trimmed, length-capped, empty becomes null.
const str = (f: FormData, k: string, max = 500) => String(f.get(k) ?? '').trim().slice(0, max) || null;
const money = (f: FormData, k: string) => {
  const n = Number(String(f.get(k) ?? '').replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? Math.round(Math.max(0, n) * 100) / 100 : 0;
};
const pct = (f: FormData, k: string) => Math.min(100, money(f, k));
const day = (f: FormData, k: string) => (/^\d{4}-\d{2}-\d{2}$/.test(String(f.get(k))) ? String(f.get(k)) : null);
const uuid = (f: FormData, k = 'id') => (UUID.test(String(f.get(k) ?? '')) ? String(f.get(k)) : null);
const pick = (v: unknown, list: Record<string, unknown>, fallback: string) => (typeof v === 'string' && v in list ? v : fallback);
const on = (f: FormData, k: string) => f.get(k) === 'on';

/** Where to go after a save: a page of the admin, never another site. */
function back(f: FormData, fallback: string, notice: string) {
  const to = String(f.get('return') ?? '');
  const base = /^\/admin\/(finance|crm)[\w\-/?=&.%]*$/.test(to) ? to : fallback;
  return `${base}${base.includes('?') ? '&' : '?'}notice=${notice}`;
}

const refresh = () => revalidatePath('/admin/finance', 'layout');

/* ── Income and expenses ───────────────────────────────────────────────── */

export async function saveIncome(form: FormData) {
  const id = uuid(form);
  const amount = money(form, 'amount');
  if (amount <= 0) redirect(back(form, '/admin/finance/income', 'amount'));
  const { proposals } = await appSettings();
  const values = {
    date: day(form, 'date') ?? todayBelgrade(),
    amount,
    currency: proposals.currency || 'USD',
    category: pick(form.get('category'), INCOME_CATEGORIES, 'other'),
    description: str(form, 'description', 500),
    customer_id: uuid(form, 'customer_id'),
    project_id: uuid(form, 'project_id'),
  };
  if (id) await db().from('fin_income').update(values).eq('id', id);
  else await db().from('fin_income').insert({ ...values, source: 'manual' });
  refresh();
  redirect(back(form, '/admin/finance/income', 'saved'));
}

export async function deleteIncome(form: FormData) {
  const id = uuid(form);
  if (id) {
    const { data } = await db().from('fin_income').select('invoice_id').eq('id', id).maybeSingle<{ invoice_id: string | null }>();
    await db().from('fin_income').delete().eq('id', id);
    // Income from a paid invoice: the invoice goes back to waiting for payment.
    if (data?.invoice_id) await db().from('fin_invoices').update({ status: 'issued', paid_at: null }).eq('id', data.invoice_id).eq('status', 'paid');
  }
  refresh();
  redirect(back(form, '/admin/finance/income', 'deleted'));
}

export async function saveExpense(form: FormData) {
  const id = uuid(form);
  const amount = money(form, 'amount');
  if (amount <= 0) redirect(back(form, '/admin/finance/expenses', 'amount'));
  const { proposals } = await appSettings();
  const values = {
    date: day(form, 'date') ?? todayBelgrade(),
    amount,
    currency: proposals.currency || 'USD',
    category: pick(form.get('category'), EXPENSE_CATEGORIES, 'other'),
    vendor: str(form, 'vendor', 200),
    description: str(form, 'description', 500),
    recurring: on(form, 'recurring'),
    project_id: uuid(form, 'project_id'),
  };
  if (id) await db().from('fin_expenses').update(values).eq('id', id);
  else await db().from('fin_expenses').insert(values);
  refresh();
  redirect(back(form, '/admin/finance/expenses', 'saved'));
}

export async function deleteExpense(form: FormData) {
  const id = uuid(form);
  if (id) await db().from('fin_expenses').delete().eq('id', id);
  refresh();
  redirect(back(form, '/admin/finance/expenses', 'deleted'));
}

/** Copies a monthly expense into the current month, dated today. */
export async function repeatExpense(form: FormData) {
  const id = uuid(form);
  if (id) {
    const { data } = await db().from('fin_expenses').select('*').eq('id', id).maybeSingle();
    if (data) {
      const { id: _id, created_at: _c, ...rest } = data as Record<string, unknown>;
      void _id;
      void _c;
      await db().from('fin_expenses').insert({ ...rest, date: todayBelgrade() });
    }
  }
  refresh();
  redirect(back(form, '/admin/finance/expenses', 'saved'));
}

/* ── Invoices ──────────────────────────────────────────────────────────── */

function readItems(form: FormData) {
  try {
    const raw = JSON.parse(String(form.get('items') ?? '[]')) as { description?: unknown; qty?: unknown; unit_price?: unknown }[];
    return raw
      .map((i) => ({
        description: String(i.description ?? '').trim().slice(0, 1000),
        qty: Math.max(0, Math.round(Number(i.qty) * 100) / 100 || 0),
        unit_price: Math.round(Number(i.unit_price) * 100) / 100 || 0,
      }))
      .filter((i) => i.description)
      .slice(0, 100);
  } catch {
    return [];
  }
}

export async function saveInvoice(form: FormData) {
  const id = uuid(form);
  const items = readItems(form);
  const issue = form.get('intent') === 'issue';
  if (!items.length) redirect(id ? `/admin/finance/invoices/${id}?notice=items` : '/admin/finance/invoices/new?notice=items');
  const values = {
    customer_id: uuid(form, 'customer_id'),
    project_id: uuid(form, 'project_id'),
    category: pick(form.get('category'), INCOME_CATEGORIES, 'other'),
    issue_date: day(form, 'issue_date') ?? todayBelgrade(),
    due_date: day(form, 'due_date'),
    discount_pct: pct(form, 'discount_pct'),
    tax_pct: pct(form, 'tax_pct'),
    notes: str(form, 'notes', 3000),
  };
  if (id) {
    const current = await loadInvoice(id);
    if (!current || current.invoice.status === 'paid' || current.invoice.status === 'void') redirect(`/admin/finance/invoices/${id}?notice=locked`);
    await db()
      .from('fin_invoices')
      .update({
        ...values,
        bill_to: await billTo(values.customer_id),
        status: issue ? 'issued' : current.invoice.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    await saveItems(id, items);
    refresh();
    redirect(`/admin/finance/invoices/${id}?notice=saved`);
  }
  const invoice = await createInvoice({ ...values, items, status: issue ? 'issued' : 'draft' });
  refresh();
  redirect(`/admin/finance/invoices/${invoice.id}?notice=created`);
}

export async function setInvoiceStatus(form: FormData) {
  const id = uuid(form);
  const status = String(form.get('status'));
  if (!id) redirect('/admin/finance/invoices');
  const found = await loadInvoice(id);
  if (!found) redirect('/admin/finance/invoices');
  if (status === 'issued' && found.invoice.status === 'draft') await db().from('fin_invoices').update({ status: 'issued' }).eq('id', id);
  if (status === 'void' && found.invoice.status !== 'paid') await db().from('fin_invoices').update({ status: 'void' }).eq('id', id);
  if (status === 'draft' && found.invoice.status === 'void') await db().from('fin_invoices').update({ status: 'draft' }).eq('id', id);
  refresh();
  redirect(`/admin/finance/invoices/${id}?notice=${status}`);
}

export async function markInvoicePaid(form: FormData) {
  const id = uuid(form);
  const found = id ? await loadInvoice(id) : null;
  if (!found || found.invoice.status === 'void') redirect('/admin/finance/invoices');
  await markPaid(found.invoice, found.items, day(form, 'paid_at') ?? todayBelgrade());
  refresh();
  redirect(`/admin/finance/invoices/${id}?notice=paid`);
}

export async function deleteInvoice(form: FormData) {
  const id = uuid(form);
  if (id) await db().from('fin_invoices').delete().eq('id', id).in('status', ['draft', 'void']);
  refresh();
  redirect('/admin/finance/invoices?notice=deleted');
}

export async function emailInvoice(form: FormData) {
  const id = uuid(form);
  const found = id ? await loadInvoice(id) : null;
  if (!found) redirect('/admin/finance/invoices');
  const to = String(form.get('to') ?? '').trim();
  if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(to)) redirect(`/admin/finance/invoices/${id}?notice=bad_email`);
  let error: string | null = null;
  try {
    await sendInvoice(found.invoice, found.items, to, str(form, 'note', 3000), on(form, 'copy_me'));
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    console.error('invoice email failed:', error);
  }
  refresh();
  redirect(`/admin/finance/invoices/${id}?notice=${error ? `send_failed&error=${encodeURIComponent(error.slice(0, 200))}` : 'sent'}`);
}

/* ── A finished project ────────────────────────────────────────────────── */

/**
 * "Projekat završen": closes the project and books what it earned. With an
 * invoice, the income is booked when the invoice is paid (now, if it already
 * is); without one, the amount is booked as income right away.
 */
export async function completeProject(form: FormData) {
  const projectId = uuid(form);
  if (!projectId) redirect('/admin/crm/projects');
  const { data: project } = await db().from('crm_projects').select('*').eq('id', projectId).maybeSingle<Project>();
  if (!project) redirect('/admin/crm/projects');

  const amount = money(form, 'amount');
  const withInvoice = on(form, 'invoice');
  const paid = on(form, 'paid') || !withInvoice;
  const send = withInvoice && on(form, 'send');
  const date = day(form, 'date') ?? todayBelgrade();
  const category = pick(form.get('category'), INCOME_CATEGORIES, categoryFor(project.services));
  const description = str(form, 'description', 500) ?? project.name;

  await db().from('crm_projects').update({ status: 'done' }).eq('id', projectId);
  await db().from('crm_activity').insert({ kind: 'system', project_id: projectId, customer_id: project.customer_id, body: 'Projekat je označen kao završen.' });

  let invoiceId: string | null = null;
  let notice = 'completed';
  if (amount > 0 && withInvoice) {
    const invoice = await createInvoice({
      customer_id: project.customer_id,
      project_id: projectId,
      category,
      status: 'issued',
      issue_date: date,
      items: [{ description, qty: 1, unit_price: amount }],
    });
    invoiceId = invoice.id;
    const found = await loadInvoice(invoice.id);
    if (found && paid) await markPaid(found.invoice, found.items, date);
    if (found && send) {
      const to = found.invoice.bill_to?.email;
      if (to) {
        const fresh = (await loadInvoice(invoice.id)) ?? found;
        try {
          await sendInvoice(fresh.invoice, fresh.items, to, null, false);
          notice = 'completed_sent';
        } catch (err) {
          console.error('invoice email after project failed:', err);
          notice = 'completed_send_failed';
        }
      } else notice = 'completed_no_email';
    }
  } else if (amount > 0) {
    const { proposals } = await appSettings();
    await db().from('fin_income').insert({
      date,
      amount,
      currency: proposals.currency || 'USD',
      category,
      description,
      customer_id: project.customer_id,
      project_id: projectId,
      source: 'project',
    });
  }
  refresh();
  revalidatePath(`/admin/crm/projects/${projectId}`);
  redirect(invoiceId ? `/admin/finance/invoices/${invoiceId}?notice=${notice}` : `/admin/crm/projects/${projectId}?notice=${notice}`);
}
