import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { Pagination } from '@/components/admin/Pagination';
import { NewProposal } from '@/components/admin/crm/NewProposal';
import { db } from '@/lib/admin/supabase';
import { PROPOSAL_STATUS, money, totals } from '@/lib/admin/crm/labels';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { Proposal, ProposalItem, ProposalStatus } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Proposals', 'Ponude') };
}

const PAGE_SIZE = 25;
type Row = Proposal & { crm_proposal_items: ProposalItem[]; crm_customers: { company: string } | null; crm_deals: { name: string } | null };

export default async function ProposalsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t: tr } = await getAdminI18n();
  const query = toParams(await searchParams);
  const status = (Object.keys(PROPOSAL_STATUS) as ProposalStatus[]).find((s) => s === query.get('status')) ?? '';
  const page = Math.max(1, Math.floor(Number(query.get('page')) || 1));

  let list = db()
    .from('crm_proposals')
    .select('*, crm_proposal_items(qty, unit_price, recurring), crm_customers(company), crm_deals(name)', { count: 'exact' })
    .order('number', { ascending: false });
  if (status) list = list.eq('status', status);
  const [{ data, count }, { data: all }] = await Promise.all([
    list.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1),
    db().from('crm_proposals').select('status'),
  ]);
  const rows = (data ?? []) as Row[];
  const counts = new Map<string, number>();
  for (const r of (all ?? []) as { status: string }[]) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);
  const href = (n: number) => `/admin/crm/proposals?${new URLSearchParams({ ...(status ? { status } : {}), ...(n > 1 ? { page: String(n) } : {}) })}`;

  return (
    <>
      <PageHeading title={tr('Proposals', 'Ponude')} crumbs={[{ label: 'WebTano CRM' }]} description={tr('Proposals built from your price list, ready as a PDF.', 'Ponude sa stavkama iz cenovnika, spremne za PDF.')}>
        <NewProposal
          label={
            <>
              <Plus className="size-4" /> {tr('New proposal', 'Nova ponuda')}
            </>
          }
          dealId={query.get('deal') ?? undefined}
          customerId={query.get('customer') ?? undefined}
          defaultOpen={query.get('new') === '1'}
          closeHref="/admin/crm/proposals"
        />
      </PageHeading>

      <div className="card">
        <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-2" aria-label="Status">
          {[['', tr('All', 'Sve')] as const, ...Object.entries(PROPOSAL_STATUS).map(([k, v]) => [k, v.label[lang]] as const)].map(([key, label]) => {
            const active = key === status;
            const n = key ? (counts.get(key) ?? 0) : (all ?? []).length;
            return (
              <Link
                key={key || 'all'}
                href={key ? `/admin/crm/proposals?status=${key}` : '/admin/crm/proposals'}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-medium transition ${active ? 'border-ink text-ink' : 'border-transparent text-zinc-500 hover:text-ink'}`}
              >
                {label}
                <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10.5px] leading-none ${active ? 'bg-ink text-white' : 'bg-zinc-100 text-zinc-500'}`}>{n}</span>
              </Link>
            );
          })}
        </nav>
        {rows.length === 0 ? (
          <p className="px-5 py-14 text-center text-muted">{tr('No proposals yet.', 'Nema ponuda.')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>{tr('No.', 'Broj')}</th>
                  <th>{tr('Proposal', 'Ponuda')}</th>
                  <th>{tr('For', 'Za')}</th>
                  <th className="text-right">{tr('One-time', 'Jednokratno')}</th>
                  <th className="text-right">{tr('Monthly', 'Mesečno')}</th>
                  <th>Status</th>
                  <th className="text-right">{tr('Valid until', 'Važi do')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const t = totals(p.crm_proposal_items, p.discount_pct);
                  return (
                    <tr key={p.id} className="relative">
                      <td className="font-mono text-xs text-zinc-500">#{String(p.number).padStart(4, '0')}</td>
                      <td className="min-w-[220px]">
                        <Link href={`/admin/crm/proposals/${p.id}`} className="font-medium text-ink after:absolute after:inset-0 hover:text-primary">{p.title}</Link>
                      </td>
                      <td className="whitespace-nowrap">{p.crm_customers?.company ?? p.crm_deals?.name ?? '—'}</td>
                      <td className="text-right font-semibold text-ink tabular-nums">{money(t.oneTime, p.currency)}</td>
                      <td className="text-right tabular-nums">{t.monthly ? `${money(t.monthly, p.currency)}${tr('/mo', '/mes')}` : '—'}</td>
                      <td><span className={`badge ${PROPOSAL_STATUS[p.status].badge}`}>{PROPOSAL_STATUS[p.status].label[lang]}</span></td>
                      <td className="text-right whitespace-nowrap text-muted">{p.valid_until ? formatDate(p.valid_until, lang) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {(count ?? 0) > 0 && <Pagination page={page} pageSize={PAGE_SIZE} total={count ?? 0} href={href} sizes={[]} noun={tr('proposals', 'ponuda')} />}
      </div>
    </>
  );
}
