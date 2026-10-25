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
import { getAdminI18n } from '@/lib/admin/i18n';
import type { Expense } from '@/lib/admin/finance/types';
import { deleteExpense, repeatExpense } from '../actions';
import { LedgerFilters, Notice } from '../Ledger';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Expenses', 'Rashodi') };
}

const SIZE = 50;

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t } = await getAdminI18n();
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
    financeOptions(lang),
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
      <PageHeading
        title={t('Expenses', 'Rashodi')}
        crumbs={[{ label: t('Finance', 'Finansije'), href: '/admin/finance' }]}
        description={t('All costs. Taxes, interest and depreciation are counted below EBITDA.', 'Svi troškovi. Porezi, kamate i amortizacija se vode ispod EBITDA.')}
      >
        <Modal
          label={
            <>
              <Plus className="size-4" /> {t('Add expense', 'Dodaj rashod')}
            </>
          }
          title={t('New expense', 'Novi rashod')}
          description={t('The cost is added to expenses and, if it is operating, lowers EBITDA.', 'Trošak ulazi u rashode i, ako je operativni, smanjuje EBITDA.')}
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
          <LedgerFilters base="/admin/finance/expenses" period={period} category={category} q={q} categories={Object.entries(EXPENSE_CATEGORIES).map(([k, c]) => [k, c.label[lang]] as [string, string])} />
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-3 text-[13px]">
            <span className="text-muted">
              {t(`${count ?? 0} costs`, `${count ?? 0} troškova`)} · {period === 'all' ? t('all entries', 'svi unosi') : PERIODS[period][lang].toLowerCase()}
            </span>
            <span className="flex flex-wrap items-baseline justify-end gap-x-4">
              <span className="text-muted max-sm:hidden">
                {t('Operating', 'Operativni')} <strong className="text-ink tabular-nums">{cash(opex, currency)}</strong>
              </span>
              <span>
                {t('Total', 'Ukupno')} <strong className="text-base text-ink tabular-nums">{cash(total, currency, total % 1 !== 0)}</strong>
              </span>
            </span>
          </div>
          {rows.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">{t('No expenses for these filters.', 'Nema rashoda za ove filtere.')}</p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('Date', 'Datum')}</th>
                    <th>{t('Vendor and description', 'Dobavljač i opis')}</th>
                    <th className="max-md:hidden">{t('Category', 'Kategorija')}</th>
                    <th className="max-lg:hidden">{t('Project', 'Projekat')}</th>
                    <th className="text-right">{t('Amount', 'Iznos')}</th>
                    <th className="w-24" aria-label={t('Actions', 'Akcije')} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap text-zinc-600">{formatDate(r.date, lang)}</td>
                      <td>
                        <div className="max-w-[34ch] truncate font-medium text-ink">{r.vendor || r.description || EXPENSE_CATEGORIES[r.category]?.label[lang]}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                          {r.recurring && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-sky-700">{t('Monthly', 'Mesečno')}</span>}
                          {r.vendor && r.description && <span className="max-w-[30ch] truncate">{r.description}</span>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap max-md:hidden">
                        <span className="text-zinc-700">{EXPENSE_CATEGORIES[r.category]?.label[lang] ?? r.category}</span>
                        {EXPENSE_CATEGORIES[r.category] && !EXPENSE_CATEGORIES[r.category].operating && <div className="text-xs text-muted">{t('below EBITDA', 'ispod EBITDA')}</div>}
                      </td>
                      <td className="max-w-[22ch] truncate text-zinc-600 max-lg:hidden">
                        {r.project_id && options.projectById.get(r.project_id) ? (
                          <Link href={`/admin/crm/projects/${r.project_id}`} className="hover:text-primary">
                            {options.projectById.get(r.project_id)}
                          </Link>
                        ) : (
                          t('General', 'Opšti')
                        )}
                      </td>
                      <td className="text-right font-semibold whitespace-nowrap text-ink tabular-nums">−{cash(Number(r.amount), currency, Number(r.amount) % 1 !== 0)}</td>
                      <td>
                        <div className="flex justify-end gap-1">
                          {r.recurring && (
                            <form action={repeatExpense}>
                              <input type="hidden" name="id" value={r.id} />
                              <input type="hidden" name="return" value={here} />
                              <button type="submit" className="btn btn-sm btn-light" title={t('Add the same cost with today’s date', 'Upiši isti trošak sa današnjim datumom')}>
                                <Repeat className="size-3.5" />
                              </button>
                            </form>
                          )}
                          <Link href={`${here}${here.includes('?') ? '&' : '?'}edit=${r.id}`} className="btn btn-sm btn-light" title={t('Edit', 'Izmeni')} scroll={false}>
                            <Pencil className="size-3.5" />
                          </Link>
                          <form action={deleteExpense}>
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="return" value={here} />
                            <ConfirmSubmit
                              className="btn btn-sm btn-light hover:text-rose-600"
                              message={t('Delete this expense?', 'Obrisati ovaj rashod?')}
                            >
                              <Trash2 className="size-3.5" />
                              <span className="sr-only">{t('Delete', 'Obriši')}</span>
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
          <Pagination page={page} pageSize={SIZE} total={count ?? 0} href={pageHref} sizes={[SIZE]} noun={t('costs', 'troškova')} />
        </div>
      )}
      {editing && (
        <Modal title={t('Edit expense', 'Izmeni rashod')} defaultOpen closeHref={here}>
          <ExpenseForm expense={editing} projects={options.projects} currency={currency} today={today} returnTo={here} />
        </Modal>
      )}
    </>
  );
}
