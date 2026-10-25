import type { Metadata } from 'next';
import { PageHeading } from '@/components/admin/PageHeading';
import { TaskBoard } from '@/components/admin/crm/TaskBoard';
import { db } from '@/lib/admin/supabase';
import type { Task } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Zadaci' };

export default async function TasksPage() {
  const [{ data: tasks }, { data: projects }] = await Promise.all([
    db().from('crm_tasks').select('*, crm_projects(name)').order('position'),
    db().from('crm_projects').select('id, name').in('status', ['not_started', 'in_progress', 'on_hold']).order('name'),
  ]);
  const list = ((tasks ?? []) as (Task & { crm_projects: { name: string } | null })[]).map(({ crm_projects, ...t }) => ({ ...t, projectName: crm_projects?.name ?? 'Bez projekta' }));
  const today = new Date().toISOString().slice(0, 10);
  const overdue = list.filter((t) => t.status !== 'done' && t.due_date && t.due_date < today).length;
  const dueToday = list.filter((t) => t.status !== 'done' && t.due_date === today).length;

  return (
    <>
      <PageHeading
        title="Zadaci"
        crumbs={[{ label: 'WebTano CRM' }]}
        description={`Svi zadaci sa svih projekata. ${dueToday} za danas${overdue ? `, ${overdue} kasni` : ''}.`}
      />
      <TaskBoard tasks={list} projects={(projects ?? []) as { id: string; name: string }[]} today={today} />
    </>
  );
}
