import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, FolderKanban, Globe, Mail, MapPin, Phone, Trash2 } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { StatCard } from '@/components/admin/StatCard';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { ActivityFeed } from '@/components/admin/crm/ActivityFeed';
import { CustomerForm } from '@/components/admin/crm/CustomerForm';
import { NewProject } from '@/components/admin/crm/NewProject';
import { CustomerSites } from '@/components/admin/crm/CustomerSites';
import { ServicePills } from '@/components/admin/crm/ServicePills';
import { NewProposal } from '@/components/admin/crm/NewProposal';
import { deleteCustomer } from '../../actions';
import { db } from '@/lib/admin/supabase';
import { PROJECT_STATUS, PROPOSAL_STATUS, STAGE_LABEL, customerName, money, totals } from '@/lib/admin/crm/labels';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import type { Activity, Customer, Deal, Project, Proposal, ProposalItem } from '@/lib/admin/crm/types';
import { CircleDollarSign, Repeat } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Klijent' };

type ProposalWithItems = Proposal & { crm_proposal_items: ProposalItem[] };

export default async function CustomerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const notice = toParams(await searchParams).get('notice');
  if (!/^[0-9a-f-]{36}$/.test(id)) redirect('/admin/crm/customers');
  const { data: customer } = await db().from('crm_customers').select('*').eq('id', id).maybeSingle<Customer>();
  if (!customer) redirect('/admin/crm/customers');

  const [{ data: deals }, { data: proposals }, { data: projects }, { data: activity }] = await Promise.all([
    db().from('crm_deals').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
    db().from('crm_proposals').select('*, crm_proposal_items(*)').eq('customer_id', id).order('created_at', { ascending: false }),
    db().from('crm_projects').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
    db().from('crm_activity').select('*').eq('customer_id', id).order('created_at', { ascending: false }).limit(50),
  ]);
  const props = (proposals ?? []) as ProposalWithItems[];
  const accepted = props.filter((p) => p.status === 'accepted').map((p) => totals(p.crm_proposal_items, p.discount_pct));
  const oneTime = accepted.reduce((n, t) => n + t.oneTime, 0);
  const monthly = accepted.reduce((n, t) => n + t.monthly, 0);
  const activeProjects = ((projects ?? []) as Project[]).filter((p) => ['not_started', 'in_progress', 'on_hold'].includes(p.status));

  return (
    <>
      <PageHeading
        title={customerName(customer)}
        crumbs={[{ label: 'WebTano CRM' }, { label: 'Klijenti', href: '/admin/crm/customers' }]}
        description={[customer.contact_name ? customer.company : null, customer.industry].filter(Boolean).join(' · ') || undefined}
      >
        <NewProposal
          customerId={customer.id}
          buttonClassName="btn btn-outline"
          label={
            <>
              <FileText className="size-4" /> Nova ponuda
            </>
          }
        />
        <NewProject
          customerId={customer.id}
          label={
            <>
              <FolderKanban className="size-4" /> Novi projekat
            </>
          }
        />
      </PageHeading>

      {notice === 'saved' && <div className="alert alert-success">Sačuvano.</div>}
      {notice === 'converted' && <div className="alert alert-success">Lid je pretvoren u klijenta. Sledeći korak: ponuda ili projekat.</div>}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard icon={CircleDollarSign} color="success" label="Jednokratno (prihvaćeno)" value={money(oneTime)} />
        <StatCard icon={Repeat} color="primary" label="Mesečno (prihvaćeno)" value={money(monthly)} />
        <StatCard icon={FileText} color="info" label="Ponude" value={props.length} note={`${props.filter((p) => p.status === 'sent').length} čeka odgovor`} />
        <StatCard icon={FolderKanban} color="secondary" label="Aktivni projekti" value={activeProjects.length} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Projekti</h2>
            </div>
            <ul className="divide-y divide-line">
              {(projects ?? []).length === 0 && <li className="px-5 py-4 text-muted">Još nema projekata.</li>}
              {((projects ?? []) as Project[]).map((p) => (
                <li key={p.id} className="relative flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/crm/projects/${p.id}`} className="block truncate text-[13.5px] font-medium text-ink after:absolute after:inset-0">{p.name}</Link>
                    <span className="text-xs text-muted">{p.deadline ? `Rok ${formatDate(p.deadline)}` : 'Bez roka'}</span>
                  </div>
                  <span className={`badge ${PROJECT_STATUS[p.status].badge}`}>{PROJECT_STATUS[p.status].label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Ponude</h2>
            </div>
            <ul className="divide-y divide-line">
              {props.length === 0 && <li className="px-5 py-4 text-muted">Još nema ponuda.</li>}
              {props.map((p) => {
                const t = totals(p.crm_proposal_items, p.discount_pct);
                return (
                  <li key={p.id} className="relative flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <Link href={`/admin/crm/proposals/${p.id}`} className="block truncate text-[13.5px] font-medium text-ink after:absolute after:inset-0">#{p.number} {p.title}</Link>
                      <span className="text-xs text-muted tabular-nums">
                        {money(t.oneTime, p.currency)}
                        {t.monthly > 0 && ` + ${money(t.monthly, p.currency)}/mes`}
                      </span>
                    </div>
                    <span className={`badge ${PROPOSAL_STATUS[p.status].badge}`}>{PROPOSAL_STATUS[p.status].label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <ActivityFeed items={(activity ?? []) as Activity[]} target={{ customer_id: customer.id }} />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Kontakt</h2>
              {customer.status === 'active' ? <span className="badge badge-won">Aktivan</span> : <span className="badge badge-lost">Neaktivan</span>}
            </div>
            {customer.services?.length > 0 && (
              <div className="border-b border-line px-5 py-4">
                <div className="mb-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">Usluge</div>
                <ServicePills services={customer.services} />
              </div>
            )}
            <ul className="space-y-3 p-5 text-[13.5px]">
              {customer.email && (
                <li className="flex items-center gap-3"><Mail className="size-4 text-zinc-400" /><a className="truncate text-ink hover:text-primary" href={`mailto:${customer.email}`}>{customer.email}</a></li>
              )}
              {customer.phone && (
                <li className="flex items-center gap-3"><Phone className="size-4 text-zinc-400" /><a className="text-ink hover:text-primary" href={`tel:${customer.phone.replace(/[^\d+]/g, '')}`}>{customer.phone}</a></li>
              )}
              {customer.website && (
                <li className="flex items-center gap-3"><Globe className="size-4 text-zinc-400" /><a className="truncate text-ink hover:text-primary" href={`https://${customer.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener">{customer.website}</a></li>
              )}
              {(customer.address || customer.city) && (
                <li className="flex items-center gap-3"><MapPin className="size-4 text-zinc-400" /><span>{[customer.address, customer.city, customer.country].filter(Boolean).join(', ')}</span></li>
              )}
            </ul>
            {customer.notes && <p className="border-t border-line px-5 py-4 text-[13px] whitespace-pre-line text-zinc-600">{customer.notes}</p>}
          </div>

          <CustomerSites customerId={customer.id} />

          {(deals ?? []).length > 0 && (
            <div className="card">
              <div className="card-header"><h2 className="card-title">Lidovi</h2></div>
              <ul className="divide-y divide-line">
                {((deals ?? []) as Deal[]).map((d) => (
                  <li key={d.id} className="relative flex items-center justify-between gap-3 px-5 py-3">
                    <Link href={`/admin/crm/leads/${d.id}`} className="truncate text-[13.5px] font-medium text-ink after:absolute after:inset-0">{d.name}</Link>
                    <span className="text-xs text-muted">{STAGE_LABEL[d.stage]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <details className="card group">
            <summary className="card-header cursor-pointer list-none border-b-0 group-open:border-b">
              <h2 className="card-title">Izmeni podatke</h2>
              <span className="text-xs text-muted group-open:hidden">Otvori</span>
            </summary>
            <div className="card-body"><CustomerForm customer={customer} /></div>
          </details>

          <form action={deleteCustomer} className="text-right">
            <input type="hidden" name="id" value={customer.id} />
            <ConfirmSubmit className="btn btn-sm btn-danger" message="Obrisati klijenta? Ponude i projekti ostaju, ali bez klijenta.">
              <Trash2 className="size-4" /> Obriši klijenta
            </ConfirmSubmit>
          </form>
        </div>
      </div>
    </>
  );
}
