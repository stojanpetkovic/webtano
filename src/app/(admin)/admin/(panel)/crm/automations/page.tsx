import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Pause, Play, Send, SkipForward, UserRound, Users, Zap } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { db } from '@/lib/admin/supabase';
import { formatDateTime, timeAgo } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { AUTOMATIONS, type OutboxRow } from '@/lib/admin/automation/registry';
import { automationSettings } from '@/lib/admin/automation/run';
import { runNow, saveAutomation, sendOutbox, skipOutbox } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Automatizacija' };

const STATUS: Record<OutboxRow['status'], { label: string; badge: string }> = {
  pending: { label: 'Čeka odobrenje', badge: 'badge-new' },
  sending: { label: 'Šalje se', badge: 'badge-contacted' },
  sent: { label: 'Poslat', badge: 'badge-won' },
  skipped: { label: 'Preskočen', badge: 'badge-lost' },
  failed: { label: 'Greška', badge: 'badge-spam' },
};

const kindLabel = (kind: string) => (kind in AUTOMATIONS ? AUTOMATIONS[kind as keyof typeof AUTOMATIONS].label : kind);

export default async function AutomationsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const [settings, { data: waitingData }, { data: recentData }] = await Promise.all([
    automationSettings(),
    db().from('crm_outbox').select('*').in('status', ['pending', 'failed']).order('created_at', { ascending: false }).limit(50),
    db().from('crm_outbox').select('*').in('status', ['sent', 'skipped', 'sending']).order('created_at', { ascending: false }).limit(30),
  ]);
  const waiting = (waitingData ?? []) as OutboxRow[];
  const recent = (recentData ?? []) as OutboxRow[];
  const paused = !settings.all.enabled;
  const notice = query.get('notice');

  return (
    <>
      <PageHeading
        title="Automatizacija"
        crumbs={[{ label: 'WebTano CRM' }]}
        description="Cron svakog sata pokreće ove poslove. Svaki email ide kroz red ispod i nijedan ne ode dva puta."
      >
        <form action={saveAutomation}>
          <input type="hidden" name="key" value="all" />
          <input type="hidden" name="enabled" value={paused ? '1' : '0'} />
          <button type="submit" className="btn btn-outline">
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />} {paused ? 'Uključi sve' : 'Pauziraj sve'}
          </button>
        </form>
        <form action={runNow}>
          <button type="submit" className="btn btn-primary" disabled={paused}>
            <Zap className="size-4" /> Pokreni sada
          </button>
        </form>
      </PageHeading>

      {paused && (
        <div className="alert alert-danger">Sve automatizacije su pauzirane. Cron se i dalje pokreće, ali ništa ne radi dok ih ne uključiš.</div>
      )}
      {notice === 'ran' && (
        <div className="alert alert-success">
          Gotovo. Poslato: {query.get('sent') ?? 0}, čeka odobrenje: {query.get('pending') ?? 0}
          {Number(query.get('failed')) > 0 && `, grešaka: ${query.get('failed')}`}. Ako se ništa nije poslalo, nijedan posao nije bio na redu.
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(AUTOMATIONS).map(([key, a]) => {
          const s = settings[key];
          return (
            <article key={key} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-ink">{a.label}</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{a.description}</p>
                </div>
                <form action={saveAutomation} className="shrink-0">
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="enabled" value={s.enabled ? '0' : '1'} />
                  <button
                    type="submit"
                    role="switch"
                    aria-checked={s.enabled}
                    aria-label={s.enabled ? `Isključi: ${a.label}` : `Uključi: ${a.label}`}
                    className={`relative h-6 w-11 cursor-pointer rounded-full transition ${s.enabled ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${s.enabled ? 'left-[22px]' : 'left-0.5'}`}
                    />
                  </button>
                </form>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-4 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  {a.audience === 'owner' ? <UserRound className="size-3.5" /> : <Users className="size-3.5" />}
                  {a.audience === 'owner' ? 'Ide tebi' : 'Ide klijentu'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {s.last_run_at ? `Proveren ${timeAgo(s.last_run_at)}` : 'Još nije pokrenut'}
                </span>
                <form action={saveAutomation} className="segmented ms-auto">
                  <input type="hidden" name="key" value={key} />
                  <button type="submit" name="mode" value="auto" aria-current={s.mode === 'auto' ? 'true' : undefined} className="cursor-pointer">
                    Automatski
                  </button>
                  <button
                    type="submit"
                    name="mode"
                    value="approve"
                    aria-current={s.mode === 'approve' ? 'true' : undefined}
                    className="cursor-pointer"
                  >
                    Na odobrenje
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Čeka tebe</h2>
          <span className="text-xs text-muted">{waiting.length ? 'Emailovi na odobrenje i oni koji nisu prošli' : ''}</span>
        </div>
        <ul className="divide-y divide-line">
          {waiting.length === 0 && <li className="px-5 py-4 text-muted">Ništa ne čeka.</li>}
          {waiting.map((m) => (
            <li key={m.id} className="px-5 py-3">
              <details className="group">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium text-ink">{m.subject}</div>
                    <div className="mt-0.5 text-xs text-muted">
                      {kindLabel(m.kind)} · {m.to_email} · {formatDateTime(m.created_at)}
                    </div>
                    {m.error && <div className="mt-1 text-xs text-rose-600">{m.error}</div>}
                  </div>
                  <span className={`badge ${STATUS[m.status].badge}`}>{STATUS[m.status].label}</span>
                </summary>
                <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-zinc-50 p-4 font-sans text-[13px] leading-relaxed whitespace-pre-wrap text-zinc-700 ring-1 ring-line">
                  {m.text}
                </pre>
              </details>
              <div className="mt-2 flex gap-2">
                <form action={sendOutbox}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="btn btn-sm btn-primary">
                    <Send className="size-3.5" /> {m.status === 'failed' ? 'Pošalji ponovo' : 'Pošalji'}
                  </button>
                </form>
                <form action={skipOutbox}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="btn btn-sm btn-light">
                    <SkipForward className="size-3.5" /> Preskoči
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Poslednja slanja</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Vreme</th>
                <th>Automatizacija</th>
                <th>Email</th>
                <th>Kome</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    Još ništa nije poslato.
                  </td>
                </tr>
              )}
              {recent.map((m) => (
                <tr key={m.id}>
                  <td className="whitespace-nowrap text-muted">{formatDateTime(m.sent_at ?? m.created_at)}</td>
                  <td className="whitespace-nowrap">{kindLabel(m.kind)}</td>
                  <td className="max-w-[320px] truncate">
                    {m.deal_id ? (
                      <Link href={`/admin/crm/leads/${m.deal_id}`} className="hover:text-primary">
                        {m.subject}
                      </Link>
                    ) : (
                      m.subject
                    )}
                  </td>
                  <td className="text-muted">{m.to_email}</td>
                  <td>
                    <span className={`badge ${STATUS[m.status].badge}`}>{STATUS[m.status].label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
