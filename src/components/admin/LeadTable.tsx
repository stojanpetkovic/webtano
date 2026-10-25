import Link from 'next/link';
import { ChevronRight, Inbox } from 'lucide-react';
import { STATUS_LABELS, timeAgo, formatDateTime } from '@/lib/admin/format';
import { leadSource } from '@/lib/admin/leads';
import type { Lead, Site } from '@/lib/admin/types';

// Soft avatar tints, picked from the name so a contact keeps its colour.
const tints = [
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

function initials(name: string) {
  const parts = name
    .replace(/[@.].*$/, '')
    .split(/\s+/)
    .filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function tintOf(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return tints[h % tints.length];
}

export function LeadTable({
  leads,
  sites,
  showSite = true,
  empty = 'Još nema lidova.',
}: {
  leads: Lead[];
  sites: Map<string, Site>;
  showSite?: boolean;
  empty?: string;
}) {
  if (leads.length === 0)
    return (
      <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
        <span className="grid size-11 place-items-center rounded-2xl bg-zinc-100 text-zinc-400">
          <Inbox className="size-5" />
        </span>
        <p className="text-[13.5px] text-zinc-500">{empty}</p>
      </div>
    );

  return (
    <>
      {/* Phones: one tappable row per lead instead of a wide table. */}
      <ul className="divide-y divide-line md:hidden">
        {leads.map((lead) => {
          const name = lead.visitor_name || lead.visitor_email || lead.visitor_phone || 'Bez imena';
          return (
            <li key={lead.id}>
              <Link href={`/admin/leads/${lead.id}`} className="flex items-center gap-3 px-4 py-3.5 transition active:bg-zinc-50">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-semibold ${tintOf(name)}`}>
                  {initials(name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium text-ink">{name}</span>
                    <span className="shrink-0 text-xs text-zinc-400 tabular-nums">{timeAgo(lead.created_at)}</span>
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                    {lead.is_spam ? (
                      <span className="badge badge-spam">Spam</span>
                    ) : (
                      <span className={`badge badge-${lead.status}`}>{STATUS_LABELS[lead.status]}</span>
                    )}
                    <span className="truncate">
                      {[showSite ? sites.get(lead.site_id)?.name : null, leadSource(lead)].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="overflow-x-auto max-md:hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Kontakt</th>
              {showSite && <th>Sajt</th>}
              <th>Forma</th>
              <th>Izvor</th>
              <th>Status</th>
              <th className="text-right">Vreme</th>
              <th className="w-8" aria-label="Otvori" />
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const name = lead.visitor_name || lead.visitor_email || lead.visitor_phone || 'Bez imena';
              return (
                <tr key={lead.id} className="group relative">
                  <td>
                    <div className="flex items-center gap-3">
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${tintOf(name)}`}>
                        {initials(name)}
                      </span>
                      <div className="min-w-0">
                        <Link href={`/admin/leads/${lead.id}`} className="font-medium text-ink after:absolute after:inset-0 hover:text-primary">
                          {name}
                        </Link>
                        <div className="max-w-[28ch] truncate text-xs text-muted">
                          {[lead.visitor_email, lead.visitor_phone].filter(Boolean).join(' · ') || '—'}
                        </div>
                      </div>
                    </div>
                  </td>
                  {showSite && <td className="whitespace-nowrap">{sites.get(lead.site_id)?.name ?? '—'}</td>}
                  <td className="max-w-[18ch] truncate">{lead.form_name}</td>
                  <td className="whitespace-nowrap">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600">{leadSource(lead)}</span>
                  </td>
                  <td>
                    {lead.is_spam ? (
                      <span className="badge badge-spam">Spam</span>
                    ) : (
                      <span className={`badge badge-${lead.status}`}>{STATUS_LABELS[lead.status]}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap text-right text-muted tabular-nums" title={formatDateTime(lead.created_at)}>
                    {timeAgo(lead.created_at)}
                  </td>
                  <td className="pe-4">
                    <ChevronRight className="size-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-500" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
