import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Plus } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { NewProject } from '@/components/admin/crm/NewProject';
import { db } from '@/lib/admin/supabase';
import { PROJECT_STATUS, money } from '@/lib/admin/crm/labels';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import type { Project, ProjectStatus } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Projekti' };

type Row = Project & { crm_customers: { company: string } | null; crm_tasks: { status: string; due_date: string | null }[] };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const filter = query.get('status') ?? 'active';
  const { data } = await db().from('crm_projects').select('*, crm_customers(company), crm_tasks(status, due_date)').order('created_at', { ascending: false });
  const all = (data ?? []) as Row[];
  const activeKeys: ProjectStatus[] = ['not_started', 'in_progress', 'on_hold'];
  const rows = filter === 'all' ? all : filter === 'active' ? all.filter((p) => activeKeys.includes(p.status)) : all.filter((p) => p.status === filter);
  const today = new Date().toISOString().slice(0, 10);
  const tabs = [
    ['active', 'Aktivni', all.filter((p) => activeKeys.includes(p.status)).length],
    ['done', 'Završeni', all.filter((p) => p.status === 'done').length],
    ['all', 'Svi', all.length],
  ] as const;

  return (
    <>
      <PageHeading title="Projekti" crumbs={[{ label: 'WebTano CRM' }]} description="Svaki projekat ima svoje zadatke na tabli.">
        <nav className="segmented" aria-label="Filter">
          {tabs.map(([k, label, n]) => (
            <Link key={k} href={`/admin/crm/projects?status=${k}`} aria-current={filter === k ? 'page' : undefined}>
              {label} <span className="ms-1 text-zinc-400 tabular-nums">{n}</span>
            </Link>
          ))}
        </nav>
        <NewProject
          label={
            <>
              <Plus className="size-4" /> Novi projekat
            </>
          }
          customerId={query.get('customer') ?? undefined}
          defaultOpen={query.get('new') === '1'}
          closeHref="/admin/crm/projects"
        />
      </PageHeading>

      {rows.length === 0 ? (
        <div className="card card-body py-14 text-center text-muted">Nema projekata. Pokreni ga iz prihvaćene ponude ili dodaj novi.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => {
            const total = p.crm_tasks.length;
            const done = p.crm_tasks.filter((t) => t.status === 'done').length;
            const overdue = p.crm_tasks.filter((t) => t.status !== 'done' && t.due_date && t.due_date < today).length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const late = p.deadline && p.deadline < today && p.status !== 'done';
            return (
              <article key={p.id} className="card relative p-5 transition hover:shadow-pop">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/admin/crm/projects/${p.id}`} className="block truncate text-[15px] font-semibold text-ink after:absolute after:inset-0">{p.name}</Link>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{p.crm_customers?.company ?? 'Bez klijenta'}</p>
                  </div>
                  <span className={`badge ${PROJECT_STATUS[p.status].badge}`}>{PROJECT_STATUS[p.status].label}</span>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>{done} od {total} zadataka</span>
                    <span className="font-medium text-ink tabular-nums">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 ${late ? 'bg-rose-50 text-rose-700' : 'bg-zinc-100 text-zinc-600'}`}>
                    <CalendarDays className="size-3.5" /> {p.deadline ? formatDate(p.deadline) : 'Bez roka'}
                  </span>
                  {overdue > 0 && <span className="rounded-md bg-rose-50 px-2 py-1 font-medium text-rose-700">{overdue} kasni</span>}
                  {p.budget != null && <span className="ms-auto font-semibold text-ink tabular-nums">{money(Number(p.budget))}</span>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
