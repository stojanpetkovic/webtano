import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Plus, Search } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import { CustomerForm } from '@/components/admin/crm/CustomerForm';
import { ServicePills } from '@/components/admin/crm/ServicePills';
import { db } from '@/lib/admin/supabase';
import { customerName, money } from '@/lib/admin/crm/labels';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import type { Customer } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Klijenti' };

const PAGE_SIZE = 25;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const q = (query.get('q') ?? '').trim().slice(0, 100).replace(/[%,()*\\]/g, ' ').trim();
  const requested = Math.max(1, Math.floor(Number(query.get('page')) || 1));

  let list = db().from('crm_customers').select('*', { count: 'exact' }).order('contact_name');
  if (q) list = list.or(`company.ilike.%${q}%,contact_name.ilike.%${q}%,email.ilike.%${q}%`);
  const { data, count } = await list.range((requested - 1) * PAGE_SIZE, requested * PAGE_SIZE - 1);
  const customers = (data ?? []) as Customer[];
  const total = count ?? 0;

  // Accepted proposal totals and open projects per customer, for the table.
  const ids = customers.map((c) => c.id);
  const [{ data: props }, { data: projects }, { data: siteLinks }] = ids.length
    ? await Promise.all([
        db().from('crm_proposals').select('id, customer_id, discount_pct, crm_proposal_items(qty, unit_price)').eq('status', 'accepted').in('customer_id', ids),
        db().from('crm_projects').select('customer_id, status').in('customer_id', ids).in('status', ['not_started', 'in_progress', 'on_hold']),
        db().from('crm_customer_sites').select('customer_id, sites(domain)').in('customer_id', ids),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];
  const domains = new Map<string, string[]>();
  for (const l of (siteLinks ?? []) as unknown as { customer_id: string; sites: { domain: string } | null }[])
    if (l.sites) domains.set(l.customer_id, [...(domains.get(l.customer_id) ?? []), l.sites.domain]);
  const revenue = new Map<string, number>();
  for (const p of (props ?? []) as { customer_id: string; discount_pct: number; crm_proposal_items: { qty: number; unit_price: number }[] }[]) {
    const sum = p.crm_proposal_items.reduce((n, i) => n + Number(i.qty) * Number(i.unit_price), 0) * (1 - Number(p.discount_pct) / 100);
    revenue.set(p.customer_id, (revenue.get(p.customer_id) ?? 0) + sum);
  }
  const openProjects = new Map<string, number>();
  for (const p of (projects ?? []) as { customer_id: string }[]) openProjects.set(p.customer_id, (openProjects.get(p.customer_id) ?? 0) + 1);

  const href = (n: number) => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (n > 1) next.set('page', String(n));
    const s = next.toString();
    return s ? `/admin/crm/customers?${s}` : '/admin/crm/customers';
  };

  return (
    <>
      <PageHeading title="Klijenti" crumbs={[{ label: 'WebTano CRM' }]} description="Ljudi sa kojima radiš. Firme i sajtovi se vezuju za svakog klijenta.">
        <Modal
          label={
            <>
              <Plus className="size-4" /> Novi klijent
            </>
          }
          title="Novi klijent"
          defaultOpen={query.get('new') === '1'}
          closeHref="/admin/crm/customers"
        >
          <CustomerForm />
        </Modal>
      </PageHeading>

      <div className="card">
        <form method="get" className="flex gap-2 border-b border-line p-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input className="form-input ps-10" name="q" type="search" defaultValue={q} placeholder="Ime, firma ili email" aria-label="Pretraga klijenata" />
          </div>
          <button className="btn btn-outline" type="submit">Traži</button>
        </form>

        {customers.length === 0 ? (
          <div className="px-5 py-14 text-center text-muted">
            {q ? 'Nema klijenata za ovu pretragu.' : 'Još nema klijenata. Pretvori lid u klijenta ili dodaj novog.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Klijent</th>
                  <th>Usluge</th>
                  <th>Firma i kontakt</th>
                  <th className="text-right">Prihvaćene ponude</th>
                  <th className="text-right">Aktivni projekti</th>
                  <th>Status</th>
                  <th className="text-right">Od</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="relative">
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-800 to-ink-975 text-xs font-semibold text-white">
                          {initials(customerName(c))}
                        </span>
                        <div className="min-w-0">
                          <Link href={`/admin/crm/customers/${c.id}`} className="font-medium text-ink after:absolute after:inset-0 hover:text-primary">
                            {customerName(c)}
                          </Link>
                          <div className="text-xs text-muted">
                            {domains.get(c.id)?.length ? (
                              <span className="inline-flex items-center gap-1">
                                <Globe className="size-3 text-accent" /> {domains.get(c.id)!.join(', ')}
                              </span>
                            ) : (
                              (c.website ?? c.city ?? '—')
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <ServicePills services={c.services} className="max-w-[220px]" />
                    </td>
                    <td>
                      <div className="text-ink">{c.company && c.contact_name ? c.company : '—'}</div>
                      <div className="text-xs text-muted">{c.email ?? c.phone ?? ''}</div>
                    </td>
                    <td className="text-right font-semibold text-ink tabular-nums">{revenue.get(c.id) ? money(revenue.get(c.id)!) : '—'}</td>
                    <td className="text-right tabular-nums">{openProjects.get(c.id) ?? 0}</td>
                    <td>{c.status === 'active' ? <span className="badge badge-won">Aktivan</span> : <span className="badge badge-lost">Neaktivan</span>}</td>
                    <td className="text-right whitespace-nowrap text-muted">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 0 && <Pagination page={requested} pageSize={PAGE_SIZE} total={total} href={href} sizes={[]} noun="klijenata" />}
      </div>
    </>
  );
}
