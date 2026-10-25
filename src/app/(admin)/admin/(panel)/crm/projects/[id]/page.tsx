import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { ActivityFeed } from '@/components/admin/crm/ActivityFeed';
import { ProjectForm } from '@/components/admin/crm/ProjectForm';
import { TaskBoard } from '@/components/admin/crm/TaskBoard';
import { deleteProject } from '../../actions';
import { db } from '@/lib/admin/supabase';
import { PROJECT_STATUS, money } from '@/lib/admin/crm/labels';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import type { Activity, Customer, Project, Task } from '@/lib/admin/crm/types';

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
  const [{ data: tasks }, { data: activity }, { data: customers }] = await Promise.all([
    db().from('crm_tasks').select('*').eq('project_id', id).order('position'),
    db().from('crm_activity').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    db().from('crm_customers').select('id, company').order('company'),
  ]);
  const list = (tasks ?? []) as Task[];
  const done = list.filter((t) => t.status === 'done').length;
  const pct = list.length ? Math.round((done / list.length) * 100) : 0;
  const customer = ((customers ?? []) as Pick<Customer, 'id' | 'company'>[]).find((c) => c.id === project.customer_id);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeading
        title={project.name}
        crumbs={[{ label: 'WebTano CRM' }, { label: 'Projekti', href: '/admin/crm/projects' }]}
        description={
          <>
            {customer ? <Link href={`/admin/crm/customers/${customer.id}`} className="text-primary hover:underline">{customer.company}</Link> : 'Bez klijenta'}
            {project.deadline && ` · rok ${formatDate(project.deadline)}`}
            {project.budget != null && ` · ${money(Number(project.budget))}`}
          </>
        }
      >
        <span className={`badge ${PROJECT_STATUS[project.status].badge}`}>{PROJECT_STATUS[project.status].label}</span>
      </PageHeading>

      {notice === 'created' && <div className="alert alert-success">Projekat je otvoren, sa po jednim zadatkom za svaku stavku ponude.</div>}
      {notice === 'saved' && <div className="alert alert-success">Sačuvano.</div>}

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
          <details className="card group">
            <summary className="card-header cursor-pointer list-none border-b-0 group-open:border-b">
              <h2 className="card-title">Izmeni projekat</h2>
              <span className="text-xs text-muted group-open:hidden">Otvori</span>
            </summary>
            <div className="card-body">
              <ProjectForm project={project} customers={(customers ?? []) as Pick<Customer, 'id' | 'company'>[]} />
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
