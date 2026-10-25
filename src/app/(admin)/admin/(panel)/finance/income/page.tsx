import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { Modal } from '@/components/admin/Modal';
import { Pagination } from '@/components/admin/Pagination';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { FinanceSetup, FinanceTabs } from '@/components/admin/finance/FinanceTabs';
import { IncomeForm } from '@/components/admin/finance/EntryForms';
import { db } from '@/lib/admin/supabase';
import { appSettings } from '@/lib/admin/settings';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { financeOptions } from '@/lib/admin/finance/options';
import { INCOME_CATEGORIES, INCOME_SOURCE, PERIODS, cash, periodRange, todayBelgrade, type Period } from '@/lib/admin/finance/labels';
import type { Income } from '@/lib/admin/finance/types';
import { deleteIncome } from '../actions';
import { LedgerFilters, Notice } from '../Ledger';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Prihodi' };

const SIZE = 50;

export default async function IncomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const period = ([...Object.keys(PERIODS), 'all'] as (Period | 'all')[]).find((p) => p === query.get('period')) ?? '12m';
  const category = query.get('category') && query.get('category')! in INCOME_CATEGORIES ? query.get('category')! : '';
  const q = (query.get('q') ?? '').trim().replace(/[%_,()]/g, '').slice(0, 100);
  const page = Math.max(1, Math.floor(Number(query.get('page')) || 1));
  const today = todayBelgrade();

  let list = db().from('fin_income').select('*', { count: 'exact' }).order('date', { ascending: false }).order('created_at', { ascending: false });
  let sums = db().from('fin_income').select('amount');
  if (period !== 'all') {
    const r = periodRange(period, today);
    list = list.gte('date', r.from).lte('date', r.to);
    sums = sums.gte('date', r.from).lte('date', r.to);
  }
  if (category) {
    list = list.eq('category', category);
    sums = sums.eq('category', category);
  }
  if (q) {
    list = list.ilike('description', `%${q}%`);
    sums = sums.ilike('description', `%${q}%`);
  }
  const [settings, options, { data, count, error }, { data: amounts }] = await Promise.all([
    appSettings(),
    financeOptions(),
    list.range((page - 1) * SIZE, page * SIZE - 1),
    sums.limit(50_000),
  ]);
  const currency = settings.proposals.currency || 'USD';
  const rows = (data ?? []) as Income[];
  const total = ((amounts ?? []) as { amount: number }[]).reduce((n, r) => n + Number(r.amount), 0);
  const editing = rows.find((r) => r.id === query.get('edit'));
  const here = `/admin/finance/income${query.toString() ? `?${new URLSearchParams([...query.entries()].filter(([k]) => !['edit', 'notice'].includes(k)))}` : ''}`;
  const pageHref = (n: number) => {
    const p = new URLSearchParams(query);
    p.delete('notice');
    p.delete('edit');
    if (n > 1) p.set('page', String(n));
    else p.delete('page');
    return `/admin/finance/income${p.size ? `?${p}` : ''}`;
  };

  return (
    <>
      <PageHeading title="Prihodi" crumbs={[{ label: 'Finansije', href: '/admin/finance' }]} description="Svaka uplata: ručno uneta, iz završenog projekta ili iz plaćenog računa.">
        <Modal
          label={
            <>
              <Plus className="size-4" /> Dodaj prihod
            </>
          }
          title="Novi prihod"
          description="Uplata koja nije stigla preko računa. Plaćeni računi se knjiže sami."
        >
          <IncomeForm customers={options.customers} projects={options.projects} currency={currency} today={today} returnTo={here} />
        </Modal>
      </PageHeading>
      <FinanceTabs active="/admin/finance/income" />
      <Notice code={query.get('notice')} />
      {error ? (
        <FinanceSetup />
      ) : (
        <div className="card">
          <LedgerFilters base="/admin/finance/income" period={period} category={category} q={q} categories={Object.entries(INCOME_CATEGORIES)} />
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-3 text-[13px]">
            <span className="text-muted">
              {count ?? 0} uplata · {period === 'all' ? 'svi unosi' : PERIODS[period].toLowerCase()}
            </span>
            <span>
              Ukupno <strong className="text-base text-emerald-600 tabular-nums">{cash(total, currency, total % 1 !== 0)}</strong>
            </span>
          </div>
          {rows.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">Nema prihoda za ove filtere.</p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Opis</th>
                    <th className="max-md:hidden">Klijent</th>
                    <th className="max-lg:hidden">Kategorija</th>
                    <th className="text-right">Iznos</th>
                    <th className="w-24" aria-label="Akcije" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap text-zinc-600">{formatDate(r.date)}</td>
                      <td>
                        <div className="max-w-[34ch] truncate font-medium text-ink">{r.description || INCOME_CATEGORIES[r.category]}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                          <span className="rounded bg-zinc-100 px-1.5 py-0.5">{INCOME_SOURCE[r.source]}</span>
                          {r.project_id && options.projectById.get(r.project_id) && (
                            <Link href={`/admin/crm/projects/${r.project_id}`} className="truncate hover:text-primary">
                              {options.projectById.get(r.project_id)}
                            </Link>
                          )}
                        </div>
                      </td>
                      <td className="max-w-[22ch] truncate max-md:hidden">{(r.customer_id && options.customerById.get(r.customer_id)) || '—'}</td>
                      <td className="whitespace-nowrap text-zinc-600 max-lg:hidden">{INCOME_CATEGORIES[r.category] ?? r.category}</td>
                      <td className="text-right font-semibold whitespace-nowrap text-emerald-600 tabular-nums">+{cash(Number(r.amount), currency, Number(r.amount) % 1 !== 0)}</td>
                      <td>
                        <div className="flex justify-end gap-1">
                          {r.invoice_id ? (
                            <Link href={`/admin/finance/invoices/${r.invoice_id}`} className="btn btn-sm btn-light" title="Otvori račun">
                              <FileText className="size-3.5" />
                            </Link>
                          ) : (
                            <Link href={`${here}${here.includes('?') ? '&' : '?'}edit=${r.id}`} className="btn btn-sm btn-light" title="Izmeni" scroll={false}>
                              <Pencil className="size-3.5" />
                            </Link>
                          )}
                          <form action={deleteIncome}>
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="return" value={here} />
                            <ConfirmSubmit
                              className="btn btn-sm btn-light hover:text-rose-600"
                              message={r.invoice_id ? 'Obrisati prihod? Račun se vraća na „Izdat“ (čeka uplatu).' : 'Obrisati ovaj prihod?'}
                            >
                              <Trash2 className="size-3.5" />
                              <span className="sr-only">Obriši</span>
                            </ConfirmSubmit>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={page} pageSize={SIZE} total={count ?? 0} href={pageHref} sizes={[SIZE]} noun="uplata" />
        </div>
      )}
      {editing && (
        <Modal title="Izmeni prihod" defaultOpen closeHref={here}>
          <IncomeForm income={editing} customers={options.customers} projects={options.projects} currency={currency} today={today} returnTo={here} />
        </Modal>
      )}
    </>
  );
}
