'use server';

import { redirect } from 'next/navigation';
import { refresh, revalidatePath } from 'next/cache';
import { db } from '@/lib/admin/supabase';
import { PROPOSAL_STATUS, SERVICES, STAGE_LABEL } from '@/lib/admin/crm/labels';
import { PRICED_PATHS } from '@/lib/pricing';
import type { DealStage, TaskStatus } from '@/lib/admin/crm/types';

const UUID = /^[0-9a-f-]{36}$/;
const STAGES: DealStage[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const TASK_STATUSES: TaskStatus[] = ['todo', 'doing', 'review', 'done'];

// Form readers: trimmed, length-capped, empty becomes null.
const str = (f: FormData, k: string, max = 500) => String(f.get(k) ?? '').trim().slice(0, max) || null;
const num = (f: FormData, k: string) => {
  const n = Number(String(f.get(k) ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
const date = (f: FormData, k: string) => (/^\d{4}-\d{2}-\d{2}$/.test(String(f.get(k))) ? String(f.get(k)) : null);
const oneOf = <T extends string>(v: unknown, list: readonly T[], fallback: T): T => (list.includes(v as T) ? (v as T) : fallback);
const id = (f: FormData, k = 'id') => {
  const v = String(f.get(k) ?? '');
  return UUID.test(v) ? v : null;
};

async function log(row: { deal_id?: string | null; customer_id?: string | null; project_id?: string | null; kind?: string; body: string }) {
  await db().from('crm_activity').insert({ kind: 'system', ...row });
}

/* ── Deals ─────────────────────────────────────────────────────────────── */

export async function moveDeal(dealId: string, stage: string, position: number) {
  if (!UUID.test(dealId) || !STAGES.includes(stage as DealStage) || !Number.isFinite(position)) return;
  const { data: before } = await db().from('crm_deals').select('stage').eq('id', dealId).single<{ stage: DealStage }>();
  await db().from('crm_deals').update({ stage, position, updated_at: new Date().toISOString() }).eq('id', dealId);
  if (before && before.stage !== stage) await log({ deal_id: dealId, body: `Faza: ${STAGE_LABEL[before.stage]} → ${STAGE_LABEL[stage as DealStage]}` });
  refresh();
}

export async function setDealStage(form: FormData) {
  const dealId = id(form);
  const stage = oneOf(form.get('stage'), STAGES, 'new');
  if (!dealId) return;
  const { data: before } = await db().from('crm_deals').select('stage').eq('id', dealId).single<{ stage: DealStage }>();
  if (!before || before.stage === stage) return;
  await db().from('crm_deals').update({ stage, updated_at: new Date().toISOString() }).eq('id', dealId);
  await log({ deal_id: dealId, body: `Faza: ${STAGE_LABEL[before.stage]} → ${STAGE_LABEL[stage]}` });
  refresh();
}

export async function saveDeal(form: FormData) {
  const dealId = id(form);
  const values = {
    name: str(form, 'name', 200) ?? 'Bez imena',
    company: str(form, 'company', 200),
    email: str(form, 'email', 200),
    phone: str(form, 'phone', 60),
    website: str(form, 'website', 200),
    service: str(form, 'service', 60),
    source: str(form, 'source', 100),
    value: Math.max(0, num(form, 'value')),
    stage: oneOf(form.get('stage'), STAGES, 'new'),
    next_step: str(form, 'next_step', 300),
    next_step_at: date(form, 'next_step_at'),
    lost_reason: str(form, 'lost_reason', 300),
    updated_at: new Date().toISOString(),
  };
  if (dealId) {
    await db().from('crm_deals').update(values).eq('id', dealId);
    redirect(`/admin/crm/leads/${dealId}?notice=saved`);
  }
  const { data } = await db()
    .from('crm_deals')
    .insert({ ...values, position: -Date.now() / 1000 })
    .select('id')
    .single<{ id: string }>();
  if (data) await log({ deal_id: data.id, body: 'Lid dodat ručno.' });
  redirect(data ? `/admin/crm/leads/${data.id}` : '/admin/crm/leads');
}

export async function deleteDeal(form: FormData) {
  const dealId = id(form);
  if (dealId) {
    // Form leads are only hidden: deleting them would make the next sync copy them in again.
    const { data } = await db().from('crm_deals').select('lead_id').eq('id', dealId).single<{ lead_id: string | null }>();
    if (data?.lead_id) await db().from('crm_deals').update({ archived: true }).eq('id', dealId);
    else await db().from('crm_deals').delete().eq('id', dealId);
  }
  redirect('/admin/crm/leads?notice=deleted');
}

/** Turns a deal into a customer (or links the existing one with the same email) and opens it. */
export async function convertDeal(form: FormData) {
  const dealId = id(form);
  if (!dealId) redirect('/admin/crm/leads');
  const { data: deal } = await db().from('crm_deals').select('*').eq('id', dealId).single();
  if (!deal) redirect('/admin/crm/leads');
  if (deal.customer_id) redirect(`/admin/crm/customers/${deal.customer_id}`);

  let customerId: string | null = null;
  if (deal.email) {
    const { data: match } = await db().from('crm_customers').select('id').ilike('email', deal.email).maybeSingle<{ id: string }>();
    customerId = match?.id ?? null;
  }
  if (!customerId) {
    const { data: created } = await db()
      .from('crm_customers')
      .insert({
        company: deal.company || null,
        contact_name: deal.name,
        email: deal.email,
        phone: deal.phone,
        website: deal.website,
        services: deal.service && deal.service in SERVICES ? [deal.service] : [],
      })
      .select('id')
      .single<{ id: string }>();
    customerId = created?.id ?? null;
  }
  if (!customerId) redirect(`/admin/crm/leads/${dealId}`);
  await db().from('crm_deals').update({ customer_id: customerId, updated_at: new Date().toISOString() }).eq('id', dealId);
  await log({ deal_id: dealId, customer_id: customerId, body: `Lid pretvoren u klijenta: ${deal.name}` });
  redirect(`/admin/crm/customers/${customerId}?notice=converted`);
}

/* ── Activity ──────────────────────────────────────────────────────────── */

export async function addActivity(form: FormData) {
  const body = str(form, 'body', 5000);
  const kind = oneOf(form.get('kind'), ['note', 'call', 'email', 'meeting'] as const, 'note');
  const row = { deal_id: id(form, 'deal_id'), customer_id: id(form, 'customer_id'), project_id: id(form, 'project_id') };
  if (body && (row.deal_id || row.customer_id || row.project_id)) await db().from('crm_activity').insert({ ...row, kind, body });
  refresh();
}

/* ── Customers ─────────────────────────────────────────────────────────── */

export async function saveCustomer(form: FormData) {
  const customerId = id(form);
  const values = {
    contact_name: str(form, 'contact_name', 200) ?? 'Bez imena',
    company: str(form, 'company', 200),
    email: str(form, 'email', 200),
    phone: str(form, 'phone', 60),
    website: str(form, 'website', 200),
    address: str(form, 'address', 300),
    city: str(form, 'city', 100),
    country: str(form, 'country', 100),
    industry: str(form, 'industry', 100),
    services: form.getAll('services').map(String).filter((k) => k in SERVICES),
    status: oneOf(form.get('status'), ['active', 'inactive'] as const, 'active'),
    notes: str(form, 'notes', 5000),
  };
  if (customerId) {
    await db().from('crm_customers').update(values).eq('id', customerId);
    redirect(`/admin/crm/customers/${customerId}?notice=saved`);
  }
  const { data } = await db().from('crm_customers').insert(values).select('id').single<{ id: string }>();
  redirect(data ? `/admin/crm/customers/${data.id}` : '/admin/crm/customers');
}

export async function deleteCustomer(form: FormData) {
  const customerId = id(form);
  if (customerId) await db().from('crm_customers').delete().eq('id', customerId);
  redirect('/admin/crm/customers?notice=deleted');
}

/* ── Proposals ─────────────────────────────────────────────────────────── */

interface ItemInput {
  description: string;
  details?: string;
  qty: number;
  unit_price: number;
  recurring?: boolean;
}

export async function saveProposal(form: FormData) {
  const proposalId = id(form);
  let items: ItemInput[] = [];
  try {
    items = (JSON.parse(String(form.get('items') ?? '[]')) as ItemInput[])
      .filter((i) => String(i.description ?? '').trim())
      .slice(0, 100);
  } catch {
    // Keep the items as they were if the editor sent something unreadable.
  }
  const values = {
    title: str(form, 'title', 200) ?? 'Ponuda',
    customer_id: id(form, 'customer_id'),
    deal_id: id(form, 'deal_id'),
    status: oneOf(form.get('status'), ['draft', 'sent', 'accepted', 'declined'] as const, 'draft'),
    currency: oneOf(form.get('currency'), ['USD', 'EUR', 'RSD'] as const, 'USD'),
    issue_date: date(form, 'issue_date') ?? new Date().toISOString().slice(0, 10),
    valid_until: date(form, 'valid_until'),
    discount_pct: Math.min(100, Math.max(0, num(form, 'discount_pct'))),
    intro: str(form, 'intro', 5000),
    terms: str(form, 'terms', 5000),
    updated_at: new Date().toISOString(),
  };

  let target = proposalId;
  if (target) {
    await db().from('crm_proposals').update(values).eq('id', target);
  } else {
    const { data } = await db().from('crm_proposals').insert(values).select('id, number').single<{ id: string; number: number }>();
    target = data?.id ?? null;
    if (data && values.deal_id) await log({ deal_id: values.deal_id, body: `Napravljena ponuda #${data.number}: ${values.title}` });
  }
  if (!target) redirect('/admin/crm/proposals');

  await db().from('crm_proposal_items').delete().eq('proposal_id', target);
  if (items.length)
    await db()
      .from('crm_proposal_items')
      .insert(
        items.map((i, position) => ({
          proposal_id: target,
          position,
          description: String(i.description).trim().slice(0, 300),
          details: String(i.details ?? '').trim().slice(0, 2000) || null,
          qty: Math.max(0, Number(i.qty) || 0),
          unit_price: Math.max(0, Number(i.unit_price) || 0),
          recurring: Boolean(i.recurring),
        })),
      );
  // A sent proposal moves its deal to the "Ponuda poslata" column.
  if (values.deal_id && values.status === 'sent')
    await db().from('crm_deals').update({ stage: 'proposal' }).eq('id', values.deal_id).in('stage', ['new', 'contacted', 'qualified']);
  if (values.deal_id && values.status === 'accepted') await db().from('crm_deals').update({ stage: 'won' }).eq('id', values.deal_id);
  redirect(`/admin/crm/proposals/${target}?notice=saved`);
}

export async function setProposalStatus(form: FormData) {
  const proposalId = id(form);
  const status = oneOf(form.get('status'), ['draft', 'sent', 'accepted', 'declined'] as const, 'draft');
  if (!proposalId) redirect('/admin/crm/proposals');
  const { data } = await db().from('crm_proposals').update({ status, updated_at: new Date().toISOString() }).eq('id', proposalId).select('deal_id, number').single<{ deal_id: string | null; number: number }>();
  if (data?.deal_id) {
    if (status === 'sent') await db().from('crm_deals').update({ stage: 'proposal' }).eq('id', data.deal_id).in('stage', ['new', 'contacted', 'qualified']);
    if (status === 'accepted') await db().from('crm_deals').update({ stage: 'won' }).eq('id', data.deal_id);
    await log({ deal_id: data.deal_id, body: `Ponuda #${data.number}: ${PROPOSAL_STATUS[status].label.toLowerCase()}` });
  }
  refresh();
}

export async function deleteProposal(form: FormData) {
  const proposalId = id(form);
  if (proposalId) await db().from('crm_proposals').delete().eq('id', proposalId);
  redirect('/admin/crm/proposals?notice=deleted');
}

/** Starts a project from an accepted proposal, with one task per proposal item. */
export async function projectFromProposal(form: FormData) {
  const proposalId = id(form);
  if (!proposalId) redirect('/admin/crm/proposals');
  const [{ data: p }, { data: items }] = await Promise.all([
    db().from('crm_proposals').select('*').eq('id', proposalId).single(),
    db().from('crm_proposal_items').select('description, position').eq('proposal_id', proposalId).order('position'),
  ]);
  if (!p) redirect('/admin/crm/proposals');
  const { data: project } = await db()
    .from('crm_projects')
    .insert({ name: String(p.title).replace(/^proposal for\s+/i, ''), customer_id: p.customer_id, proposal_id: p.id, status: 'not_started', start_date: new Date().toISOString().slice(0, 10) })
    .select('id')
    .single<{ id: string }>();
  if (!project) redirect(`/admin/crm/proposals/${proposalId}`);
  if (items?.length)
    await db()
      .from('crm_tasks')
      .insert(items.map((i: { description: string }, n: number) => ({ project_id: project.id, title: i.description, position: n })));
  await log({ project_id: project.id, customer_id: p.customer_id, body: `Projekat otvoren iz ponude #${p.number}.` });
  redirect(`/admin/crm/projects/${project.id}?notice=created`);
}

/* ── Projects and tasks ────────────────────────────────────────────────── */

export async function saveProject(form: FormData) {
  const projectId = id(form);
  const values = {
    name: str(form, 'name', 200) ?? 'Projekat',
    customer_id: id(form, 'customer_id'),
    status: oneOf(form.get('status'), ['not_started', 'in_progress', 'on_hold', 'done', 'cancelled'] as const, 'not_started'),
    start_date: date(form, 'start_date'),
    deadline: date(form, 'deadline'),
    budget: str(form, 'budget') ? Math.max(0, num(form, 'budget')) : null,
    description: str(form, 'description', 5000),
  };
  if (projectId) {
    await db().from('crm_projects').update(values).eq('id', projectId);
    redirect(`/admin/crm/projects/${projectId}?notice=saved`);
  }
  const { data } = await db().from('crm_projects').insert(values).select('id').single<{ id: string }>();
  redirect(data ? `/admin/crm/projects/${data.id}` : '/admin/crm/projects');
}

export async function deleteProject(form: FormData) {
  const projectId = id(form);
  if (projectId) await db().from('crm_projects').delete().eq('id', projectId);
  redirect('/admin/crm/projects?notice=deleted');
}

export async function saveTask(form: FormData) {
  const taskId = id(form);
  const status = oneOf(form.get('status'), TASK_STATUSES, 'todo');
  const values = {
    title: str(form, 'title', 300) ?? 'Zadatak',
    description: str(form, 'description', 5000),
    project_id: id(form, 'project_id'),
    status,
    priority: oneOf(form.get('priority'), ['low', 'medium', 'high', 'urgent'] as const, 'medium'),
    due_date: date(form, 'due_date'),
    completed_at: status === 'done' ? new Date().toISOString() : null,
  };
  if (taskId) await db().from('crm_tasks').update(values).eq('id', taskId);
  else await db().from('crm_tasks').insert({ ...values, position: Date.now() / 1000 });
  refresh();
}

export async function moveTask(taskId: string, status: string, position: number) {
  if (!UUID.test(taskId) || !TASK_STATUSES.includes(status as TaskStatus) || !Number.isFinite(position)) return;
  await db()
    .from('crm_tasks')
    .update({ status, position, completed_at: status === 'done' ? new Date().toISOString() : null })
    .eq('id', taskId);
  refresh();
}

export async function deleteTask(form: FormData) {
  const taskId = id(form);
  if (taskId) await db().from('crm_tasks').delete().eq('id', taskId);
  refresh();
}

/* ── Price list ────────────────────────────────────────────────────────── */

// The site shows prices from the price list, so it is rebuilt after each change.
const refreshSitePrices = () => PRICED_PATHS.forEach((path) => revalidatePath(path));

async function lastItemPosition() {
  const { data } = await db().from('crm_items').select('position').order('position', { ascending: false }).limit(1).maybeSingle<{ position: number }>();
  return Number(data?.position ?? 0);
}

export async function saveItem(form: FormData) {
  const itemId = id(form);
  const values = {
    group_name: str(form, 'group_name', 80) ?? 'Ostalo',
    name: str(form, 'name', 300) ?? 'Stavka',
    details: str(form, 'details', 2000),
    unit_price: Math.max(0, num(form, 'unit_price')),
    recurring: form.get('recurring') === 'on',
    active: form.get('active') === 'on',
    updated_at: new Date().toISOString(),
  };
  if (itemId) await db().from('crm_items').update(values).eq('id', itemId);
  else await db().from('crm_items').insert({ ...values, position: (await lastItemPosition()) + 10 });
  refreshSitePrices();
  redirect('/admin/crm/items?notice=saved');
}

export async function toggleItem(form: FormData) {
  const itemId = id(form);
  if (!itemId) return;
  await db().from('crm_items').update({ active: form.get('active') === '1', updated_at: new Date().toISOString() }).eq('id', itemId);
  refresh();
}

/** Swaps an item with its neighbour above or below in the list. */
export async function moveItem(form: FormData) {
  const itemId = id(form);
  if (!itemId) return;
  const { data } = await db().from('crm_items').select('id, position').order('position');
  const list = (data ?? []) as { id: string; position: number }[];
  const i = list.findIndex((r) => r.id === itemId);
  const j = form.get('dir') === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;
  await Promise.all([
    db().from('crm_items').update({ position: list[j].position }).eq('id', list[i].id),
    db().from('crm_items').update({ position: list[i].position }).eq('id', list[j].id),
  ]);
  refresh();
}

export async function deleteItem(form: FormData) {
  const itemId = id(form);
  if (itemId) await db().from('crm_items').delete().eq('id', itemId);
  refreshSitePrices();
  redirect('/admin/crm/items?notice=deleted');
}

/** "Sačuvaj u cenovnik" on a proposal line: adds it to the price list for next time. */
export async function addItemFromProposal(item: ItemInput): Promise<boolean> {
  const name = String(item?.description ?? '').trim().slice(0, 300);
  if (!name) return false;
  const { error } = await db()
    .from('crm_items')
    .insert({
      group_name: 'Ostalo',
      name,
      details: String(item.details ?? '').trim().slice(0, 2000) || null,
      unit_price: Math.max(0, Number(item.unit_price) || 0),
      recurring: Boolean(item.recurring),
      position: (await lastItemPosition()) + 10,
    });
  return !error;
}

/* ── Customer websites ─────────────────────────────────────────────────── */

export async function linkSite(form: FormData) {
  const customerId = id(form, 'customer_id');
  const siteId = id(form, 'site_id');
  if (!customerId || !siteId) return;
  await db().from('crm_customer_sites').upsert({ site_id: siteId, customer_id: customerId }, { onConflict: 'site_id' });
  refresh();
}

export async function unlinkSite(form: FormData) {
  const siteId = id(form, 'site_id');
  if (siteId) await db().from('crm_customer_sites').delete().eq('site_id', siteId);
  refresh();
}
