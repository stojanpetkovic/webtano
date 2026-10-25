'use client';

import Link from 'next/link';
import { CalendarClock, Globe, Mail, Phone } from 'lucide-react';
import { Board } from './Board';
import { moveDeal } from '@/app/(admin)/admin/(panel)/crm/actions';
import { SERVICES, STAGES, dealServices, money } from '@/lib/admin/crm/labels';
import type { Deal } from '@/lib/admin/crm/types';

type Card = Deal & { column: string };

function daysSince(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? 'danas' : d === 1 ? 'juče' : `pre ${d} d`;
}

export function DealBoard({ deals }: { deals: Deal[] }) {
  const items: Card[] = deals.map((d) => ({ ...d, column: d.stage }));
  return (
    <Board<Card>
      columns={STAGES.map((s) => ({
        ...s,
        meta: (list) => {
          const total = (list as Card[]).reduce((n, d) => n + Number(d.value || 0), 0);
          return total ? money(total) : null;
        },
      }))}
      items={items}
      onMove={moveDeal}
      renderCard={(d, picker) => {
        const overdue = d.next_step_at && d.next_step_at < new Date().toISOString().slice(0, 10);
        return (
          <article className="group relative rounded-xl bg-white p-3.5 shadow-card ring-1 ring-zinc-900/[0.06] transition hover:shadow-pop hover:ring-zinc-900/10">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/admin/crm/leads/${d.id}`} className="block truncate text-[13.5px] font-semibold text-ink after:absolute after:inset-0" draggable={false}>
                  {d.name}
                </Link>
                {d.company && <p className="mt-0.5 truncate text-xs text-zinc-500">{d.company}</p>}
              </div>
              {Number(d.value) > 0 && <span className="shrink-0 text-[13px] font-semibold text-ink tabular-nums">{money(Number(d.value))}</span>}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {dealServices(d).map((k) => (
                <span key={k} className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">{SERVICES[k]}</span>
              ))}
              {d.source && <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600">{d.source}</span>}
            </div>
            {d.next_step && (
              <p className={`mt-2.5 flex items-center gap-1.5 text-xs ${overdue ? 'text-rose-600' : 'text-zinc-600'}`}>
                <CalendarClock className="size-3.5 shrink-0" />
                <span className="truncate">{d.next_step}</span>
              </p>
            )}
            <div className="mt-3 flex items-center gap-2 border-t border-line pt-2.5 text-zinc-400">
              {d.phone && <Phone className="size-3.5" aria-label="Ima telefon" />}
              {d.email && <Mail className="size-3.5" aria-label="Ima email" />}
              {d.website && <Globe className="size-3.5" aria-label="Ima sajt" />}
              <span className="ms-auto text-[11px] tabular-nums">{daysSince(d.created_at)}</span>
              {picker}
            </div>
          </article>
        );
      }}
    />
  );
}
