import type { Metadata } from 'next';
import Link from 'next/link';
import { Pencil, Plus, Repeat, Trash2 } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { Modal } from '@/components/admin/Modal';
import { Pagination } from '@/components/admin/Pagination';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { FinanceSetup, FinanceTabs } from '@/components/admin/finance/FinanceTabs';
import { ExpenseForm } from '@/components/admin/finance/EntryForms';
import { db } from '@/lib/admin/supabase';
import { appSettings } from '@/lib/admin/settings';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { financeOptions } from '@/lib/admin/finance/options';
import { EXPENSE_CATEGORIES, PERIODS, cash, periodRange, todayBelgrade, type Period } from '@/lib/admin/finance/labels';
import type { Expense } from '@/lib/admin/finance/types';
import { deleteExpense, repeatExpense } from '../actions';
import { LedgerFilters, Notice } from '../Ledger';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Rashodi' };

const SIZE = 50;

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const period = ([...Object.keys(PERIODS), 'all'] as (Period | 'all')[]).find((p) => p === query.get('period')) ?? '12m';
  const category = query.get('category') && query.get('category')! in EXPENSE_CATEGORIES ? query.get('category')! : '';
  const q = (query.get('q') ?? '').trim().replace(/[%_,()]/g, '').slice(0, 100);
  const page = Math.max(1, Math.floor(Number(query.get('page')) || 1));
  const today = todayBelgrade();

  let list = db().from('fin_expenses').select('*', { count: 'exact' }).order('date', { ascending: false }).order('created_at', { ascending: false });
  let sums = db().from('fin_expenses').select('amount, category');
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
    list = list.or(`description.ilike.%${q}%,vendor.ilike.%${q}%`);
    sums = sums.or(`description.ilike.%${q}%,vendor.ilike.%${q}%`);
  }
  const [settings, options, { data, count, error }, { data: amounts }] = await Promise.all([
    appSettings(),
    financeOptions(),
    list.range((page - 1) * SIZE, page * SIZE - 1),
    sums.limit(50_000),
  ]);
  const currency = settings.proposals.currency || 'USD';
  const rows = (data ?? []) as Expense[];
  const all = (amounts ?? []) as { amount: number; category: string }[];
  const total = all.reduce((n, r) => n + Number(r.amount), 0);
  const opex = all.filter((r) => EXPENSE_CATEGORIES[r.category]?.operating ?? true).reduce((n, r) => n + Number(r.amount), 0);
  const editing = rows.find((r) => r.id === query.get('edit'));
  const here = `/admin/finance/expenses${query.toString() ? `?${new URLSearchParams([...query.entries()].filter(([k]) => !['edit', 'notice'].includes(k)))}` : ''}`;
  const pageHref = (n: number) => {
    const p = new URLSearchParams(query);
    p.delete('notice');
    p.delete('edit');
    if (n > 1) p.set('page', String(n));
    else p.delete('page');
    return `/admin/finance/expenses${p.size ? `?${p}` : ''}`;
  };

  return (
    <>
      <PageHeading title="Rashodi" crumbs={[{ label: 'Finansije', href: '/admin/finance' }]} description="Svi troškovi. Porezi, kamate i amortizacija se vode ispod EBITDA.">
        <Modal
          label={
            <>
              <Plus className="size-4" /> Dodaj rashod
            </>
          }
          title="Novi rashod"
          description="Trošak ulazi u rashode i, ako je operativni, smanjuje EBITDA."
        >
          <ExpenseForm projects={options.projects} currency={currency} today={today} returnTo={here} />
        </Modal>
      </PageHeading>
      <FinanceTabs active="/admin/finance/expenses" />
      <Notice code={query.get('notice')} />
      {error ? (
        <FinanceSetup />
      ) : (
        <div className="card">
          <LedgerFilters base="/admin/finance/expenses" period={period} category={category} q={q} categories={Object.entries(EXPENSE_CATEGORIES).map(([k, c]) => [k, c.label])} />
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-3 text-[13px]">
            <span className="text-muted">
              {count ?? 0} troškova · {period === 'all' ? 'svi unosi' : PERIODS[period].toLowerCase()}
            </span>
            <span className="flex flex-wrap items-baseline justify-end gap-x-4">
              <span className="text-muted max-sm:hidden">
                Operativni <strong className="text-ink tabular-nums">{cash(opex, currency)}</strong>
              </span>
              <span>
                Ukupno <strong className="text-base text-ink tabular-nums">{cash(total, currency, total % 1 !== 0)}</strong>
              </span>
            </span>
          </div>
          {rows.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">Nema rashoda za ove filtere.</p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Dobavljač i opis</th>
                    <th className="max-md:hidden">Kategorija</th>
                    <th className="max-lg:hidden">Projekat</th>
                    <th className="text-right">Iznos</th>
                    <th className="w-24" aria-label="Akcije" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap text-zinc-600">{formatDate(r.date)}</td>
                      <td>
                        <div className="max-w-[34ch] truncate font-medium text-ink">{r.vendor || r.description || EXPENSE_CATEGORIES[r.category]?.label}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                          {r.recurring && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-sky-700">Mesečno</span>}
                          {r.vendor && r.description && <span className="max-w-[30ch] truncate">{r.description}</span>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap max-md:hidden">
                        <span className="text-zinc-700">{EXPENSE_CATEGORIES[r.category]?.label ?? r.category}</span>
                        {EXPENSE_CATEGORIES[r.category] && !EXPENSE_CATEGORIES[r.category].operating && <div className="text-xs text-muted">ispod EBITDA</div>}
                      </td>
                      <td className="max-w-[22ch] truncate text-zinc-600 max-lg:hidden">
                        {r.project_id && options.projectById.get(r.project_id) ? (
                          <Link href={`/admin/crm/projects/${r.project_id}`} className="hover:text-primary">
                            {options.projectById.get(r.project_id)}
                          </Link>
                        ) : (
                          'Opšti'
                        )}
                      </td>
                      <td className="text-right font-semibold whitespace-nowrap text-ink tabular-nums">−{cash(Number(r.amount), currency, Number(r.amount) % 1 !== 0)}</td>
                      <td>
                        <div className="flex justify-end gap-1">
                          {r.recurring && (
                            <form action={repeatExpense}>
                              <input type="hidden" name="id" value={r.id} />
                              <input type="hidden" name="return" value={here} />
                              <button type="submit" className="btn btn-sm btn-light" title="Upiši isti trošak sa današnjim datumom">
                                <Repeat className="size-3.5" />
                              </button>
                            </form>
                          )}
                          <Link href={`${here}${here.includes('?') ? '&' : '?'}edit=${r.id}`} className="btn btn-sm btn-light" title="Izmeni" scroll={false}>
                            <Pencil className="size-3.5" />
                          </Link>
                          <form action={deleteExpense}>
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="return" value={here} />
                            <ConfirmSubmit
                              className="btn btn-sm btn-light hover:text-rose-600"
                              message="Obrisati ovaj rashod?"
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
          <Pagination page={page} pageSize={SIZE} total={count ?? 0} href={pageHref} sizes={[SIZE]} noun="troškova" />
        </div>
      )}
      {editing && (
        <Modal title="Izmeni rashod" defaultOpen closeHref={here}>
          <ExpenseForm expense={editing} projects={options.projects} currency={currency} today={today} returnTo={here} />
        </Modal>
      )}
    </>
  );
}
