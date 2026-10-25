import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PrintButton } from './PrintButton';
import { money, totals } from '@/lib/admin/crm/labels';
import type { Customer, Deal, Proposal, ProposalItem } from '@/lib/admin/crm/types';
import type { AppSettings } from '@/lib/admin/settings';
import { getAdminI18n } from '@/lib/admin/i18n';

const day = (iso: string) => new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));

/** The client-facing proposal, in English, laid out for one or two A4 pages. */
export async function ProposalSheet({
  proposal,
  items,
  customer,
  deal,
  company,
}: {
  proposal: Proposal;
  items: ProposalItem[];
  customer: Customer | null;
  deal: Deal | null;
  company: AppSettings['company'];
}) {
  const { t: tr } = await getAdminI18n();
  const t = totals(items, proposal.discount_pct);
  const c = proposal.currency;
  const to = {
    company: customer?.company ?? deal?.company ?? null,
    name: customer?.contact_name ?? deal?.name ?? null,
    email: customer?.email ?? deal?.email ?? null,
    website: customer?.website ?? deal?.website ?? null,
  };
  const number = String(proposal.number).padStart(4, '0');
  const terms = (proposal.terms ?? '').split('\n').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-zinc-100 print:bg-white">
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-[210mm] items-center gap-3 px-4 py-3">
          <Link href={`/admin/crm/proposals/${proposal.id}`} className="btn btn-sm btn-light">
            <ArrowLeft className="size-4" /> {tr('Back to the proposal', 'Nazad na ponudu')}
          </Link>
          <PrintButton />
        </div>
      </div>

      <article className="report-sheet mx-auto my-6 max-w-[210mm] bg-white px-[14mm] py-[16mm] text-[13px] text-zinc-700 shadow-card ring-1 ring-zinc-900/5 print:my-0 print:p-0 print:shadow-none print:ring-0">
        <header className="flex items-start justify-between gap-6 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/webtano-mark.svg" alt="" width={34} height={34} className="size-[34px] rounded-[10px]" />
            <div>
              <div className="text-[17px] font-semibold tracking-tight text-ink">{company.name}</div>
              <div className="text-[11px] text-zinc-500">{[company.tagline, company.website].filter(Boolean).join(' · ')}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-[0.16em] text-accent uppercase">Proposal</div>
            <div className="mt-1 text-[15px] font-semibold text-ink">#{number}</div>
            <div className="mt-1 text-xs text-zinc-500">{day(proposal.issue_date)}</div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-6 py-6">
          <div>
            <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Prepared for</div>
            <div className="mt-1.5 text-[14px] font-semibold text-ink">{to.company ?? to.name ?? '—'}</div>
            {to.company && to.name && <div>{to.name}</div>}
            {to.email && <div>{to.email}</div>}
            {to.website && <div>{to.website}</div>}
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Valid until</div>
            <div className="mt-1.5 text-[14px] font-semibold text-ink">{proposal.valid_until ? day(proposal.valid_until) : '—'}</div>
          </div>
        </section>

        <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink">{proposal.title}</h1>
        {proposal.intro && <p className="mt-3 leading-relaxed whitespace-pre-line">{proposal.intro}</p>}

        <table className="mt-7 w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink text-[10.5px] tracking-wider text-zinc-500 uppercase">
              <th className="py-2 pe-3 font-medium">Item</th>
              <th className="py-2 px-3 text-right font-medium">Qty</th>
              <th className="py-2 px-3 text-right font-medium">Price</th>
              <th className="py-2 ps-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="avoid-break border-b border-zinc-200 align-top">
                <td className="py-3 pe-3">
                  <div className="font-medium text-ink">
                    {i.description}
                    {i.recurring && <span className="ms-2 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">Monthly</span>}
                  </div>
                  {i.details && <div className="mt-1 text-xs leading-relaxed text-zinc-500">{i.details}</div>}
                </td>
                <td className="py-3 px-3 text-right tabular-nums">{Number(i.qty)}</td>
                <td className="py-3 px-3 text-right tabular-nums whitespace-nowrap">{money(Number(i.unit_price), c)}</td>
                <td className="py-3 ps-3 text-right font-medium text-ink tabular-nums whitespace-nowrap">
                  {money(Number(i.qty) * Number(i.unit_price), c)}
                  {i.recurring && <span className="text-zinc-400">/mo</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="avoid-break mt-5 ms-auto w-72 space-y-1.5">
          {t.oneTimeGross > 0 && <div className="flex justify-between"><span>One-time</span><span className="tabular-nums">{money(t.oneTimeGross, c)}</span></div>}
          {t.monthlyGross > 0 && <div className="flex justify-between"><span>Monthly</span><span className="tabular-nums">{money(t.monthlyGross, c)}/mo</span></div>}
          {t.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount {Number(proposal.discount_pct)}%</span><span className="tabular-nums">−{money(t.discount, c)}</span></div>}
          <div className="flex items-baseline justify-between rounded-lg bg-zinc-50 px-3 py-2.5 text-ink">
            <span className="font-semibold">Total</span>
            <span className="text-right">
              {t.oneTime > 0 && <span className="block text-[17px] font-semibold tabular-nums">{money(t.oneTime, c)}</span>}
              {t.monthly > 0 && <span className="block text-[13px] font-medium tabular-nums">{t.oneTime > 0 ? '+ ' : ''}{money(t.monthly, c)}/mo</span>}
            </span>
          </div>
        </div>

        {terms.length > 0 && (
          <section className="avoid-break mt-8">
            <h2 className="text-[13px] font-semibold text-ink">Terms</h2>
            <ul className="mt-2 list-disc space-y-1 ps-5 text-xs leading-relaxed text-zinc-600">
              {terms.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>
        )}

        <section className="avoid-break mt-10 grid grid-cols-2 gap-10 text-xs text-zinc-500">
          <div>
            <div className="h-10 border-b border-zinc-300" />
            <div className="mt-1.5">Accepted by (name and signature)</div>
          </div>
          <div>
            <div className="h-10 border-b border-zinc-300" />
            <div className="mt-1.5">Date</div>
          </div>
        </section>

        <footer className="mt-10 border-t border-zinc-200 pt-4 text-center text-[11px] text-zinc-400">
          {[company.name, company.website, company.email, company.phone].filter(Boolean).join(' · ')}
        </footer>
      </article>
    </div>
  );
}
