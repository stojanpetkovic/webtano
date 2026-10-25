import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Banknote, FilePlus2, Hourglass, Landmark, Plus, Receipt, Wallet } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { StatCard } from '@/components/admin/StatCard';
import { DonutChart } from '@/components/admin/DonutChart';
import { BarList } from '@/components/admin/BarList';
import { Modal } from '@/components/admin/Modal';
import { FinanceChart } from '@/components/admin/finance/FinanceChart';
import { FinanceSetup, FinanceTabs } from '@/components/admin/finance/FinanceTabs';
import { ExpenseForm, IncomeForm } from '@/components/admin/finance/EntryForms';
import { db } from '@/lib/admin/supabase';
import { appSettings } from '@/lib/admin/settings';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { financeOptions } from '@/lib/admin/finance/options';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PERIODS,
  cash,
  invoiceNumber,
  invoiceTotals,
  monthsBetween,
  periodRange,
  shortMonth,
  todayBelgrade,
  type Period,
} from '@/lib/admin/finance/labels';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { Expense, Income, Invoice, InvoiceItem } from '@/lib/admin/finance/types';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Finance', 'Finansije') };
}

const pctOf = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

export default async function FinancePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t } = await getAdminI18n();
  const query = toParams(await searchParams);
  const period = (Object.keys(PERIODS) as Period[]).find((p) => p === query.get('period')) ?? '12m';
  const today = todayBelgrade();
  const range = periodRange(period, today);
  // The chart shows months: the period itself when it spans a year, otherwise the last 12 months.
  const chartRange = ['ytd', 'last_year', '12m'].includes(period) ? range : periodRange('12m', today);
  const from = range.from < chartRange.from ? range.from : chartRange.from;
  const to = range.to > chartRange.to ? range.to : chartRange.to;

  const [settings, options, incomeRes, expenseRes, openRes] = await Promise.all([
    appSettings(),
    financeOptions(lang),
    db().from('fin_income').select('*').gte('date', from).lte('date', to).order('date', { ascending: false }).limit(20_000),
    db().from('fin_expenses').select('*').gte('date', from).lte('date', to).order('date', { ascending: false }).limit(20_000),
    db().from('fin_invoices').select('*, fin_invoice_items(*)').eq('status', 'issued').order('due_date'),
  ]);
  const currency = settings.proposals.currency || 'USD';

  if (incomeRes.error || expenseRes.error)
    return (
      <>
        <PageHeading title={t('Finance', 'Finansije')} crumbs={[{ label: t('Finance', 'Finansije') }]} />
        <FinanceTabs active="/admin/finance" />
        <FinanceSetup />
      </>
    );

  const allIncome = (incomeRes.data ?? []) as Income[];
  const allExpenses = (expenseRes.data ?? []) as Expense[];
  const inRange = <T extends { date: string }>(rows: T[], r: { from: string; to: string }) => rows.filter((x) => x.date >= r.from && x.date <= r.to);
  const income = inRange(allIncome, range);
  const expenses = inRange(allExpenses, range);
  const sum = (rows: { amount: number }[]) => rows.reduce((n, r) => n + Number(r.amount), 0);
  const operating = (e: Expense) => EXPENSE_CATEGORIES[e.category]?.operating ?? true;

  const revenue = sum(income);
  const spent = sum(expenses);
  const opex = sum(expenses.filter(operating));
  const ebitda = revenue - opex;
  const net = revenue - spent;

  const open = ((openRes.data ?? []) as (Invoice & { fin_invoice_items: InvoiceItem[] })[]).map((i) => ({
    ...i,
    total: invoiceTotals(i.fin_invoice_items, i.discount_pct, i.tax_pct).total,
  }));
  const outstanding = open.reduce((n, i) => n + i.total, 0);
  const overdue = open.filter((i) => i.due_date && i.due_date < today);

  // Monthly series for the chart.
  const months = monthsBetween(chartRange.from, chartRange.to);
  const byMonth = (rows: { date: string; amount: number }[]) => months.map((m) => Math.round(sum(rows.filter((r) => r.date.startsWith(m)))));
  const chartIncome = byMonth(inRange(allIncome, chartRange));
  const chartExpenses = byMonth(inRange(allExpenses, chartRange));
  const chartOpex = byMonth(inRange(allExpenses, chartRange).filter(operating));
  const chartEbitda = chartIncome.map((v, i) => v - chartOpex[i]);

  const group = <T,>(rows: T[], key: (r: T) => string, amount: (r: T) => number) => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + amount(r));
    return [...m.entries()].map(([label, count]) => ({ label, count: Math.round(count) })).sort((a, b) => b.count - a.count);
  };
  const expenseSlices = group(expenses, (e) => EXPENSE_CATEGORIES[e.category]?.label[lang] ?? t('Other', 'Ostalo'), (e) => Number(e.amount)).slice(0, 7);
  const byCustomer = group(income, (i) => (i.customer_id && options.customerById.get(i.customer_id)) || t('No client', 'Bez klijenta'), (i) => Number(i.amount)).slice(0, 8);
  const byCategory = group(income, (i) => INCOME_CATEGORIES[i.category]?.[lang] ?? t('Other', 'Ostalo'), (i) => Number(i.amount));

  const recent = [
    ...income.map((i) => ({ kind: 'in' as const, id: i.id, date: i.date, amount: Number(i.amount), title: i.description || INCOME_CATEGORIES[i.category]?.[lang], sub: i.customer_id ? options.customerById.get(i.customer_id) : null })),
    ...expenses.map((e) => ({ kind: 'out' as const, id: e.id, date: e.date, amount: Number(e.amount), title: e.vendor || e.description || EXPENSE_CATEGORIES[e.category]?.label[lang], sub: EXPENSE_CATEGORIES[e.category]?.label[lang] })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  const label = PERIODS[period][lang].toLowerCase();
  return (
    <>
      <PageHeading
        title={t('Finance', 'Finansije')}
        crumbs={[{ label: t('Finance', 'Finansije') }]}
        description={t(
          `Income, expenses and EBITDA for ${label}, in ${currency}. Income is recorded when the money arrives.`,
          `Prihodi, rashodi i EBITDA za ${label}, u ${currency}. Prihod se knjiži kad je novac stigao.`,
        )}
      >
        <Modal
          label={
            <>
              <Plus className="size-4" /> {t('Expense', 'Rashod')}
            </>
          }
          buttonClassName="btn btn-outline"
          title={t('New expense', 'Novi rashod')}
          description={t('The cost is added to expenses and, if it is operating, lowers EBITDA.', 'Trošak ulazi u rashode i, ako je operativni, smanjuje EBITDA.')}
        >
          <ExpenseForm projects={options.projects} currency={currency} today={today} returnTo="/admin/finance" />
        </Modal>
        <Modal
          label={
            <>
              <Plus className="size-4" /> {t('Income', 'Prihod')}
            </>
          }
          buttonClassName="btn btn-outline"
          title={t('New income', 'Novi prihod')}
          description={t('A payment that did not come through an invoice. Paid invoices are recorded on their own.', 'Uplata koja nije stigla preko računa. Plaćeni računi se knjiže sami.')}
        >
          <IncomeForm customers={options.customers} projects={options.projects} currency={currency} today={today} returnTo="/admin/finance" />
        </Modal>
        <Link href="/admin/finance/invoices/new" className="btn btn-primary">
          <FilePlus2 className="size-4" /> {t('New invoice', 'Novi račun')}
        </Link>
      </PageHeading>

      <FinanceTabs active="/admin/finance" />

      <nav className="flex flex-wrap gap-1.5" aria-label="Period">
        {(Object.keys(PERIODS) as Period[]).map((p) => (
          <Link
            key={p}
            href={p === '12m' ? '/admin/finance' : `/admin/finance?period=${p}`}
            aria-current={p === period ? 'page' : undefined}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${p === period ? 'bg-ink text-white' : 'bg-zinc-100 text-zinc-600 hover:text-ink'}`}
          >
            {PERIODS[p][lang]}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-5">
        <StatCard label={t('Income', 'Prihodi')} value={cash(revenue, currency)} icon={Banknote} color="success" note={t(`${income.length} payments`, `${income.length} uplata`)} trend={chartIncome} />
        <StatCard label={t('Expenses', 'Rashodi')} value={cash(spent, currency)} icon={Receipt} color="danger" note={t(`${expenses.length} costs`, `${expenses.length} troškova`)} trend={chartExpenses} />
        <StatCard
          label="EBITDA"
          value={cash(ebitda, currency)}
          icon={Landmark}
          color="primary"
          tone={ebitda < 0 ? 'down' : 'up'}
          note={revenue ? t(`${pctOf(ebitda, revenue)}% margin`, `${pctOf(ebitda, revenue)}% marža`) : t('no income', 'nema prihoda')}
          trend={chartEbitda}
        />
        <StatCard
          label={t('Net profit', 'Neto dobit')}
          value={cash(net, currency)}
          icon={Wallet}
          color="secondary"
          note={revenue ? t(`${pctOf(net, revenue)}% after tax and interest`, `${pctOf(net, revenue)}% posle poreza i kamata`) : t('after tax and interest', 'posle poreza i kamata')}
        />
        <StatCard
          label={t('Unpaid', 'Nenaplaćeno')}
          value={cash(outstanding, currency)}
          icon={Hourglass}
          color="warning"
          note={overdue.length ? t(`${overdue.length} overdue`, `${overdue.length} kasni sa uplatom`) : t(`${open.length} open invoices`, `${open.length} otvorenih računa`)}
          className="max-2xl:col-span-2 max-lg:col-span-2 lg:max-2xl:col-span-1"
        />
      </div>

      <div className="card">
        <div className="card-header border-b-0 pb-0">
          <div>
            <h2 className="card-title">{t('Income, expenses and EBITDA', 'Prihodi, rashodi i EBITDA')}</h2>
            <p className="card-sub">{t('By month', 'Po mesecima')}, {shortMonth(months[0], lang)} – {shortMonth(months[months.length - 1], lang)}</p>
          </div>
        </div>
        <div className="card-body">
          <div className="h-64 sm:h-80">
            <FinanceChart labels={months.map((m) => shortMonth(m, lang))} income={chartIncome} expenses={chartExpenses} ebitda={chartEbitda} currency={currency} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DonutChart title={t('Expenses by category', 'Rashodi po kategoriji')} sub={PERIODS[period][lang]} items={expenseSlices} currency={currency} empty={t('No expenses in this period.', 'Nema rashoda u ovom periodu.')} />
        <BarList title={t('Income by client', 'Prihodi po klijentu')} sub={PERIODS[period][lang]} items={byCustomer} currency={currency} empty={t('No income in this period.', 'Nema prihoda u ovom periodu.')} />
        <div className="card lg:col-span-2 xl:col-span-1">
          <div className="card-header">
            <div>
              <h2 className="card-title">{t('Open invoices', 'Otvoreni računi')}</h2>
              <p className="card-sub">{t('Issued but not paid yet', 'Izdati, a još nisu plaćeni')}</p>
            </div>
            <Link href="/admin/finance/invoices?status=issued" className="text-xs font-medium text-primary hover:underline">
              {t('All', 'Svi')}
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {open.length === 0 && <li className="px-5 py-6 text-center text-sm text-muted">{t('Everything is paid.', 'Sve je naplaćeno.')}</li>}
            {open.slice(0, 6).map((i) => {
              const late = i.due_date && i.due_date < today;
              return (
                <li key={i.id}>
                  <Link href={`/admin/finance/invoices/${i.id}`} className="flex items-center gap-3 px-5 py-3 transition hover:bg-zinc-50">
                    {late ? <AlertTriangle className="size-4 shrink-0 text-rose-500" /> : <Hourglass className="size-4 shrink-0 text-amber-500" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-ink">
                        {invoiceNumber(settings.invoices.prefix, i.number)} · {i.bill_to?.company || i.bill_to?.name || t('No client', 'Bez klijenta')}
                      </span>
                      <span className={`text-xs ${late ? 'text-rose-600' : 'text-muted'}`}>{i.due_date ? `${late ? t('Overdue since', 'Kasni od') : t('Due', 'Rok')} ${formatDate(i.due_date, lang)}` : t('No due date', 'Bez roka')}</span>
                    </span>
                    <span className="font-semibold text-ink tabular-nums">{cash(i.total, currency)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="card-header">
            <div>
              <h2 className="card-title">{t('Latest entries', 'Poslednje promene')}</h2>
              <p className="card-sub">{t('Payments and costs in the period', 'Uplate i troškovi u periodu')}</p>
            </div>
          </div>
          <ul className="divide-y divide-line">
            {recent.length === 0 && <li className="px-5 py-6 text-center text-sm text-muted">{t('No entries yet. Add the first income or expense at the top right.', 'Još nema unosa. Dodaj prvi prihod ili rashod gore desno.')}</li>}
            {recent.map((r) => (
              <li key={`${r.kind}-${r.id}`} className="flex items-center gap-3 px-5 py-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full ${r.kind === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {r.kind === 'in' ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink">{r.title}</span>
                  <span className="text-xs text-muted">
                    {formatDate(r.date, lang)}
                    {r.sub ? ` · ${r.sub}` : ''}
                  </span>
                </span>
                <span className={`font-semibold tabular-nums ${r.kind === 'in' ? 'text-emerald-600' : 'text-ink'}`}>
                  {r.kind === 'in' ? '+' : '−'}
                  {cash(r.amount, currency, r.amount % 1 !== 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <BarList title={t('Income by service', 'Prihodi po usluzi')} sub={PERIODS[period][lang]} items={byCategory} currency={currency} empty={t('No income in this period.', 'Nema prihoda u ovom periodu.')} />
      </div>
    </>
  );
}
