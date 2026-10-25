'use client';

import { useRef, useState } from 'react';
import { CalendarDays, Trash2, X } from 'lucide-react';
import { Board } from './Board';
import { deleteTask, moveTask, saveTask } from '@/app/(admin)/admin/(panel)/crm/actions';
import { PRIORITY, TASK_COLUMNS } from '@/lib/admin/crm/labels';
import type { Task } from '@/lib/admin/crm/types';
import { useLang } from '@/components/i18n/LangProvider';
import { HTML_LANG, translator, type Lang } from '@/lib/i18n';

type Card = Task & { column: string; projectName?: string };

const dueLabel = (d: string, lang: Lang) => new Intl.DateTimeFormat(HTML_LANG[lang], { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(d));

/** Tasks as a board, with a dialog to edit one. Also used on the all-tasks page with project names. */
export function TaskBoard({ tasks, projectId, projects, today }: { tasks: (Task & { projectName?: string })[]; projectId?: string; projects?: { id: string; name: string }[]; today: string }) {
  const lang = useLang();
  const tr = translator(lang);
  const dialog = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Card | null>(null);
  const open = (t: Card | null) => {
    setEditing(t);
    dialog.current?.showModal();
  };

  return (
    <>
      <Board<Card>
        columns={TASK_COLUMNS.map((c) => ({ ...c, label: c.label[lang] }))}
        items={tasks.map((t) => ({ ...t, column: t.status }))}
        onMove={moveTask}
        empty={tr('No tasks', 'Nema zadataka')}
        renderCard={(t, picker) => {
          const overdue = t.due_date && t.status !== 'done' && t.due_date < today;
          return (
            <article
              className={`rounded-xl bg-white p-3 shadow-card ring-1 ring-zinc-900/[0.06] transition hover:shadow-pop ${t.status === 'done' ? 'opacity-70' : ''}`}
              onClick={() => open(t)}
            >
              <div className="flex items-start gap-2">
                <p className={`flex-1 text-[13px] font-medium text-ink ${t.status === 'done' ? 'line-through decoration-zinc-400' : ''}`}>{t.title}</p>
              </div>
              {t.projectName && <p className="mt-1 truncate text-[11px] text-zinc-500">{t.projectName}</p>}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-medium ${PRIORITY[t.priority].cls}`}>{PRIORITY[t.priority].label[lang]}</span>
                {t.due_date && (
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] ${overdue ? 'bg-rose-50 font-medium text-rose-700' : 'bg-zinc-100 text-zinc-600'}`}>
                    <CalendarDays className="size-3" /> {dueLabel(t.due_date, lang)}
                  </span>
                )}
                <span className="ms-auto">{picker}</span>
              </div>
            </article>
          );
        }}
      />

      <button type="button" className="btn btn-outline" onClick={() => open(null)}>
        + {tr('New task', 'Novi zadatak')}
      </button>

      <dialog
        ref={dialog}
        className="m-auto w-[min(520px,calc(100vw-2rem))] rounded-2xl bg-white p-0 shadow-pop backdrop:bg-ink-975/40 backdrop:backdrop-blur-[2px]"
        onClose={() => setEditing(null)}
      >
        <form
          key={editing?.id ?? 'new'}
          action={async (form) => {
            await saveTask(form);
            dialog.current?.close();
          }}
          className="space-y-4 p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink">{editing ? tr('Edit task', 'Izmeni zadatak') : tr('New task', 'Novi zadatak')}</h2>
            <button type="button" onClick={() => dialog.current?.close()} className="grid size-8 cursor-pointer place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100" aria-label={tr('Close', 'Zatvori')}>
              <X className="size-4" />
            </button>
          </div>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          {projectId ? (
            <input type="hidden" name="project_id" value={projectId} />
          ) : (
            projects && (
              <div>
                <label className="form-label" htmlFor="t-project">
                  {tr('Project', 'Projekat')}
                </label>
                <select className="form-input" id="t-project" name="project_id" defaultValue={editing?.project_id ?? ''}>
                  <option value="">{tr('No project', 'Bez projekta')}</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )
          )}
          <div>
            <label className="form-label" htmlFor="t-title">
              {tr('Title', 'Naslov')}
            </label>
            <input className="form-input" id="t-title" name="title" required defaultValue={editing?.title ?? ''} autoFocus />
          </div>
          <div>
            <label className="form-label" htmlFor="t-desc">
              {tr('Description', 'Opis')}
            </label>
            <textarea className="form-input" id="t-desc" name="description" rows={3} defaultValue={editing?.description ?? ''} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label" htmlFor="t-status">Status</label>
              <select className="form-input" id="t-status" name="status" defaultValue={editing?.status ?? 'todo'}>
                {TASK_COLUMNS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label[lang]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="t-priority">
                {tr('Priority', 'Prioritet')}
              </label>
              <select className="form-input" id="t-priority" name="priority" defaultValue={editing?.priority ?? 'medium'}>
                {Object.entries(PRIORITY).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label[lang]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="t-due">
                {tr('Due', 'Rok')}
              </label>
              <input className="form-input" id="t-due" name="due_date" type="date" defaultValue={editing?.due_date ?? ''} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            {editing ? (
              <button
                type="submit"
                formAction={async (form) => {
                  if (!confirm(tr('Delete this task?', 'Obrisati zadatak?'))) return;
                  await deleteTask(form);
                  dialog.current?.close();
                }}
                formNoValidate
                className="btn btn-sm btn-danger"
              >
                <Trash2 className="size-4" /> {tr('Delete', 'Obriši')}
              </button>
            ) : (
              <span />
            )}
            <button className="btn btn-primary" type="submit">
              {tr('Save', 'Sačuvaj')}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
