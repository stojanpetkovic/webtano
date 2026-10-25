import Link from 'next/link';
import { FileText, LayoutDashboard, TrendingDown, TrendingUp } from 'lucide-react';

const TABS = [
  { href: '/admin/finance', label: 'Pregled', icon: LayoutDashboard },
  { href: '/admin/finance/invoices', label: 'Računi', icon: FileText },
  { href: '/admin/finance/income', label: 'Prihodi', icon: TrendingUp },
  { href: '/admin/finance/expenses', label: 'Rashodi', icon: TrendingDown },
];

/** The four finance pages, as tabs under the heading. */
export function FinanceTabs({ active }: { active: string }) {
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" aria-label="Finansije">
      {TABS.map((t) => {
        const on = t.href === active;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={on ? 'page' : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition ${
              on ? 'bg-ink text-white shadow-sm' : 'bg-white text-zinc-600 ring-1 ring-line hover:text-ink'
            }`}
          >
            <t.icon className="size-4" />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Shown on finance pages until the migration has been run. */
export function FinanceSetup() {
  return (
    <div className="card card-body">
      <p className="font-semibold text-ink">Tabele za Finansije još ne postoje</p>
      <p className="mt-1 text-sm text-muted">
        Pokreni SQL iz <code className="font-mono">supabase/migrations/20261025_finance.sql</code> u Supabase SQL Editoru, pa osveži stranicu.
      </p>
    </div>
  );
}
