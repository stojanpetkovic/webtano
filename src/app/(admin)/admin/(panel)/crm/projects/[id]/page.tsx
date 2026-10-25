import type { Metadata } from 'next';
import Link from 'next/link';
import { ServicePills } from '@/components/admin/crm/ServicePills';
import { redirect } from 'next/navigation';
import { CheckCircle2, FilePlus2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/admin/Modal';
import { CompleteProjectForm } from '@/components/admin/finance/CompleteProjectForm';
import { appSettings } from '@/lib/admin/settings';
import { INVOICE_STATUS, cash, categoryFor, invoiceNumber, invoiceTotals, todayBelgrade } from '@/lib/admin/finance/labels';
import type { Expense, Income, Invoice, InvoiceItem } from '@/lib/admin/finance/types';
import { PageHeading } from '@/components/admin/PageHeading';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { ActivityFeed } from '@/components/admin/crm/ActivityFeed';
import { ProjectForm } from '@/components/admin/crm/ProjectForm';
import { TaskBoard } from '@/components/admin/crm/TaskBoard';
import { deleteProject } from '../../actions';
import { db } from '@/lib/admin/supabase';
import { customerName } from '@/lib/admin/crm/labels';
import { PROJECT_STATUS, money } from '@/lib/admin/crm/labels';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import type { Activity, CustomerOption, Project, Task } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Projekat' };

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const notice = toParams(await searchParams).get('notice');
  if (!/^[0-9a-f-]{36}$/.test(id)) redirect('/admin/crm/projects');
  const { data: project } = await db().from('crm_projects').select('*').eq('id', id).maybeSingle<Project>();
  if (!project) redirect('/admin/crm/projects');
  const [{ data: tasks }, { data: activity }, { data: customers }, settings, incomeRes, expenseRes, invoiceRes, emailRes] = await Promise.all([
    db().from('crm_tasks').select('*').eq('project_id', id).order('position'),
    db().from('crm_activity').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    db().from('crm_customers').select('id, company, contact_name').order('contact_name'),
    appSettings(),
    // Finance tables may not exist yet; then the money card stays hidden.
    db().from('fin_income').select('amount').eq('project_id', id),
    db().from('fin_expenses').select('amount').eq('project_id', id),
    db().from('fin_invoices').select('*, fin_invoice_items(qty, unit_price)').eq('project_id', id).order('number', { ascending: false }),
    project.customer_id ? db().from('crm_customers').select('email').eq('id', project.customer_id).maybeSingle<{ email: string | null }>() : Promise.resolve({ data: null }),
  ]);
  const finance = !incomeRes.error && !expenseRes.error && !invoiceRes.error;
  const earned = ((incomeRes.data ?? []) as Pick<Income, 'amount'>[]).reduce((n, r) => n + Number(r.amount), 0);
  const costs = ((expenseRes.data ?? []) as Pick<Expense, 'amount'>[]).reduce((n, r) => n + Number(r.amount), 0);
  const invoices = ((invoiceRes.data ?? []) as (Invoice & { fin_invoice_items: Pick<InvoiceItem, 'qty' | 'unit_price'>[] })[]).map((i) => ({
    ...i,
    total: invoiceTotals(i.fin_invoice_items, i.discount_pct, i.tax_pct).total,
  }));
  const currency = settings.proposals.currency || 'USD';
  const list = (tasks ?? []) as Task[];
  const done = list.filter((t) => t.status === 'done').length;
  const pct = list.length ? Math.round((done / list.length) * 100) : 0;
  const customer = ((customers ?? []) as CustomerOption[]).find((c) => c.id === project.customer_id);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeading
        title={project.name}
        crumbs={[{ label: 'WebTano CRM' }, { label: 'Projekti', href: '/admin/crm/projects' }]}
        description={
          <>
            {customer ? <Link href={`/admin/crm/customers/${customer.id}`} className="text-primary hover:underline">{customerName(customer)}</Link> : 'Bez klijenta'}
            {project.deadline && ` · rok ${formatDate(project.deadline)}`}
            {project.budget != null && ` · ${money(Number(project.budget))}`}
          </>
        }
      >
        {finance && project.status !== 'done' && project.status !== 'cancelled' && (
          <Modal
            label={
              <>
                <CheckCircle2 className="size-4" /> Projekat završen
              </>
            }
            buttonClassName="btn btn-primary"
            title="Projekat je završen"
            description="Projekat se zatvara, a zarada se upisuje u Finansije."
          >
            <CompleteProjectForm
              projectId={project.id}
              name={project.name}
              amount={project.budget != null ? Number(project.budget) : null}
              category={categoryFor(project.services)}
              currency={currency}
              today={todayBelgrade()}
              customerEmail={(emailRes.data as { email: string | null } | null)?.email ?? null}
            />
          </Modal>
        )}
        <ServicePills services={project.services} />
        <span className={`badge ${PROJECT_STATUS[project.status].badge}`}>{PROJECT_STATUS[project.status].label}</span>
      </PageHeading>

      {notice === 'created' && <div className="alert alert-success">Projekat je otvoren, sa po jednim zadatkom za svaku stavku ponude.</div>}
      {notice === 'saved' && <div className="alert alert-success">Sačuvano.</div>}
      {notice === 'completed' && <div className="alert alert-success">Projekat je završen, a iznos je upisan u prihode.</div>}

      <div className="card card-body">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink">Napredak</span>
          <span className="text-zinc-500 tabular-nums">{done} od {list.length} zadataka · {pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <TaskBoard tasks={list} projectId={project.id} today={today} />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <ActivityFeed items={(activity ?? []) as Activity[]} target={{ project_id: project.id, customer_id: project.customer_id ?? undefined }} />
        </div>
        <div className="min-w-0 space-y-4">
          {finance && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Finansije projekta</h2>
                <Link href={`/admin/finance/invoices/new?project=${project.id}${project.customer_id ? `&customer=${project.customer_id}` : ''}`} className="btn btn-sm btn-light">
                  <FilePlus2 className="size-3.5" /> Račun
                </Link>
              </div>
              <div className="grid grid-cols-3 divide-x divide-line border-b border-line text-center">
                {[
                  ['Prihod', earned, 'text-emerald-600'],
                  ['Troškovi', costs, 'text-ink'],
                  ['Zarada', earned - costs, earned - costs < 0 ? 'text-rose-600' : 'text-ink'],
                ].map(([label, value, color]) => (
                  <div key={label as string} className="px-2 py-3">
                    <div className="text-[11px] text-muted">{label}</div>
                    <div className={`mt-0.5 font-semibold tabular-nums ${color}`}>{cash(value as number, currency)}</div>
                  </div>
                ))}
              </div>
              <ul className="divide-y divide-line">
                {invoices.length === 0 && <li className="px-5 py-3 text-[13px] text-muted">Još nema računa za ovaj projekat.</li>}
                {invoices.map((i) => (
                  <li key={i.id}>
                    <Link href={`/admin/finance/invoices/${i.id}`} className="flex items-center justify-between gap-3 px-5 py-2.5 text-[13px] transition hover:bg-zinc-50">
                      <span className="font-mono font-medium text-ink">{invoiceNumber(settings.invoices.prefix, i.number)}</span>
                      <span className={`badge ${INVOICE_STATUS[i.status].badge}`}>{INVOICE_STATUS[i.status].label}</span>
                      <span className="ms-auto font-semibold tabular-nums">{cash(i.total, currency, true)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <details className="card group">
            <summary className="card-header cursor-pointer list-none border-b-0 group-open:border-b">
              <h2 className="card-title">Izmeni projekat</h2>
              <span className="text-xs text-muted group-open:hidden">Otvori</span>
            </summary>
            <div className="card-body">
              <ProjectForm project={project} customers={(customers ?? []) as CustomerOption[]} />
            </div>
          </details>
          <form action={deleteProject} className="text-right">
            <input type="hidden" name="id" value={project.id} />
            <ConfirmSubmit className="btn btn-sm btn-danger" message="Obrisati projekat i sve njegove zadatke?">
              <Trash2 className="size-4" /> Obriši projekat
            </ConfirmSubmit>
          </form>
        </div>
      </div>
    </>
  );
}
