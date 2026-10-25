import { Bot, CalendarDays, Mail, MessageSquare, Phone } from 'lucide-react';
import { addActivity } from '@/app/(admin)/admin/(panel)/crm/actions';
import { ACTIVITY } from '@/lib/admin/crm/labels';
import { formatDateTime, timeAgo } from '@/lib/admin/format';
import type { Activity, ActivityKind } from '@/lib/admin/crm/types';

const ICON: Record<ActivityKind, typeof Bot> = { note: MessageSquare, call: Phone, email: Mail, meeting: CalendarDays, system: Bot };
const TINT: Record<ActivityKind, string> = {
  note: 'bg-sky-50 text-sky-600',
  call: 'bg-emerald-50 text-emerald-600',
  email: 'bg-violet-50 text-violet-600',
  meeting: 'bg-amber-50 text-amber-600',
  system: 'bg-zinc-100 text-zinc-500',
};

/** A note form and the timeline under it. `target` says what the note belongs to. */
export function ActivityFeed({ items, target }: { items: Activity[]; target: { deal_id?: string; customer_id?: string; project_id?: string } }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Aktivnost</h2>
        <span className="text-xs text-muted">{items.length} zapisa</span>
      </div>
      <form action={addActivity} className="border-b border-line p-4">
        {Object.entries(target).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
        <textarea name="body" rows={2} required className="form-input resize-y" placeholder="Šta se desilo? Npr. „Pozvao, traži ponudu za redizajn do petka.”" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="segmented" role="radiogroup" aria-label="Vrsta">
            {(['note', 'call', 'email', 'meeting'] as const).map((k, i) => (
              <label key={k} className="cursor-pointer has-[:checked]:bg-white has-[:checked]:text-ink has-[:checked]:shadow-[0_1px_2px_rgb(10_14_30/0.08),0_0_0_1px_rgb(10_14_30/0.04)]">
                <input type="radio" name="kind" value={k} defaultChecked={i === 0} className="sr-only" />
                {ACTIVITY[k]}
              </label>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" type="submit">Dodaj</button>
        </div>
      </form>
      <ol className="relative space-y-5 p-5 before:absolute before:top-7 before:bottom-7 before:left-[37px] before:w-px before:bg-line">
        {items.length === 0 && <li className="text-muted">Još nema zapisa.</li>}
        {items.map((a) => {
          const Icon = ICON[a.kind];
          return (
            <li key={a.id} className="relative flex gap-3">
              <span className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-white ${TINT[a.kind]}`}>
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-baseline gap-x-2 text-xs">
                  <span className="font-medium text-ink">{ACTIVITY[a.kind]}</span>
                  <span className="text-zinc-400" title={formatDateTime(a.created_at)}>{timeAgo(a.created_at)}</span>
                </div>
                <p className="mt-1 text-[13.5px] whitespace-pre-line text-zinc-700">{a.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
