import { db } from '../supabase';
import { customerName } from '../crm/labels';
import type { CustomerOption } from '../crm/types';

/** Customers and projects for the finance pickers, and lookups by id for the tables. */
export async function financeOptions() {
  const [{ data: customers }, { data: projects }] = await Promise.all([
    db().from('crm_customers').select('id, company, contact_name').order('contact_name'),
    db().from('crm_projects').select('id, name, customer_id, services, budget').order('created_at', { ascending: false }),
  ]);
  const c = ((customers ?? []) as CustomerOption[]).map((x) => ({ id: x.id, label: customerName(x) }));
  const p = ((projects ?? []) as { id: string; name: string; customer_id: string | null; services: string[]; budget: number | null }[]).map((x) => ({
    id: x.id,
    label: x.name,
    customer_id: x.customer_id,
    services: x.services,
    budget: x.budget,
  }));
  return { customers: c, projects: p, customerById: new Map(c.map((x) => [x.id, x.label])), projectById: new Map(p.map((x) => [x.id, x.label])) };
}
