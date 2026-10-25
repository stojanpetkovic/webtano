import type { Metadata } from 'next';
import { PageHeading } from '@/components/admin/PageHeading';
import { TaskBoard } from '@/components/admin/crm/TaskBoard';
import { db } from '@/lib/admin/supabase';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { Task } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Tasks', 'Zadaci') };
}

export default async function TasksPage() {
  const { t: tr } = await getAdminI18n();
  const [{ data: tasks }, { data: projects }] = await Promise.all([
    db().from('crm_tasks').select('*, crm_projects(name)').order('position'),
    db().from('crm_projects').select('id, name').in('status', ['not_started', 'in_progress', 'on_hold']).order('name'),
  ]);
  const list = ((tasks ?? []) as (Task & { crm_projects: { name: string } | null })[]).map(({ crm_projects, ...t }) => ({ ...t, projectName: crm_projects?.name ?? tr('No project', 'Bez projekta') }));
  const today = new Date().toISOString().slice(0, 10);
  const overdue = list.filter((t) => t.status !== 'done' && t.due_date && t.due_date < today).length;
  const dueToday = list.filter((t) => t.status !== 'done' && t.due_date === today).length;

  return (
    <>
      <PageHeading
        title={tr('Tasks', 'Zadaci')}
        crumbs={[{ label: 'WebTano CRM' }]}
        description={tr(
          `All tasks from all projects. ${dueToday} due today${overdue ? `, ${overdue} overdue` : ''}.`,
          `Svi zadaci sa svih projekata. ${dueToday} za danas${overdue ? `, ${overdue} kasni` : ''}.`,
        )}
      />
      <TaskBoard tasks={list} projects={(projects ?? []) as { id: string; name: string }[]} today={today} />
    </>
  );
}
