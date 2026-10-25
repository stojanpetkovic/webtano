import Link from 'next/link';
import { FileText, LayoutDashboard, TrendingDown, TrendingUp } from 'lucide-react';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { T } from '@/lib/i18n';

const tabs = (t: T) => [
  { href: '/admin/finance', label: t('Overview', 'Pregled'), icon: LayoutDashboard },
  { href: '/admin/finance/invoices', label: t('Invoices', 'Računi'), icon: FileText },
  { href: '/admin/finance/income', label: t('Income', 'Prihodi'), icon: TrendingUp },
  { href: '/admin/finance/expenses', label: t('Expenses', 'Rashodi'), icon: TrendingDown },
];

/** The four finance pages, as tabs under the heading. */
export async function FinanceTabs({ active }: { active: string }) {
  const { t } = await getAdminI18n();
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" aria-label={t('Finance', 'Finansije')}>
      {tabs(t).map((tab) => {
        const on = tab.href === active;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={on ? 'page' : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition ${
              on ? 'bg-ink text-white shadow-sm' : 'bg-white text-zinc-600 ring-1 ring-line hover:text-ink'
            }`}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Shown on finance pages until the migration has been run. */
export async function FinanceSetup() {
  const { t } = await getAdminI18n();
  return (
    <div className="card card-body">
      <p className="font-semibold text-ink">{t('The Finance tables do not exist yet', 'Tabele za Finansije još ne postoje')}</p>
      <p className="mt-1 text-sm text-muted">
        {t('Run the SQL from', 'Pokreni SQL iz')} <code className="font-mono">supabase/migrations/20261025_finance.sql</code>{' '}
        {t('in the Supabase SQL Editor, then refresh the page.', 'u Supabase SQL Editoru, pa osveži stranicu.')}
      </p>
    </div>
  );
}
