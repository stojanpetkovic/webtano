import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FilePlus2 } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { FinanceSetup, FinanceTabs } from '@/components/admin/finance/FinanceTabs';
import { db } from '@/lib/admin/supabase';
import { appSettings } from '@/lib/admin/settings';
import { formatDate } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { INVOICE_STATUS, cash, invoiceNumber, invoiceTotals, todayBelgrade } from '@/lib/admin/finance/labels';
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/lib/admin/finance/types';
import { Notice } from '../Ledger';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Računi' };

type Tab = '' | InvoiceStatus | 'overdue';

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const tab = (['draft', 'issued', 'overdue', 'paid', 'void'] as Tab[]).find((t) => t === query.get('status')) ?? '';
  const today = todayBelgrade();
  const [settings, { data, error }] = await Promise.all([
    appSettings(),
    db().from('fin_invoices').select('*, fin_invoice_items(qty, unit_price)').order('number', { ascending: false }).limit(2000),
  ]);
  const currency = settings.proposals.currency || 'USD';
  const all = ((data ?? []) as (Invoice & { fin_invoice_items: Pick<InvoiceItem, 'qty' | 'unit_price'>[] })[]).map((i) => ({
    ...i,
    total: invoiceTotals(i.fin_invoice_items, i.discount_pct, i.tax_pct).total,
    late: i.status === 'issued' && !!i.due_date && i.due_date < today,
  }));
  const shown = all.filter((i) => (tab === 'overdue' ? i.late : !tab || i.status === tab));
  const sum = (rows: typeof all) => rows.reduce((n, i) => n + i.total, 0);
  const tabs: { key: Tab; label: string; rows: typeof all }[] = [
    { key: '', label: 'Svi', rows: all },
    { key: 'draft', label: 'Nacrti', rows: all.filter((i) => i.status === 'draft') },
    { key: 'issued', label: 'Čekaju uplatu', rows: all.filter((i) => i.status === 'issued') },
    { key: 'overdue', label: 'Kasne', rows: all.filter((i) => i.late) },
    { key: 'paid', label: 'Plaćeni', rows: all.filter((i) => i.status === 'paid') },
    { key: 'void', label: 'Stornirani', rows: all.filter((i) => i.status === 'void') },
  ];

  return (
    <>
      <PageHeading title="Računi" crumbs={[{ label: 'Finansije', href: '/admin/finance' }]} description="Računi klijentima, kao PDF za preuzimanje i slanje emailom.">
        <Link href="/admin/finance/invoices/new" className="btn btn-primary">
          <FilePlus2 className="size-4" /> Novi račun
        </Link>
      </PageHeading>
      <FinanceTabs active="/admin/finance/invoices" />
      <Notice code={query.get('notice')} />
      {error ? (
        <FinanceSetup />
      ) : (
        <div className="card">
          <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-2" aria-label="Status">
            {tabs.map((t) => {
              const active = t.key === tab;
              return (
                <Link
                  key={t.key || 'all'}
                  href={t.key ? `/admin/finance/invoices?status=${t.key}` : '/admin/finance/invoices'}
                  aria-current={active ? 'page' : undefined}
                  className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-medium transition ${
                    active ? 'border-ink text-ink' : 'border-transparent text-zinc-500 hover:text-ink'
                  } ${t.key === 'overdue' && t.rows.length ? 'text-rose-600' : ''}`}
                >
                  {t.label}
                  <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10.5px] leading-none tabular-nums ${active ? 'bg-ink text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                    {t.rows.length}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-baseline justify-between border-b border-line px-5 py-3 text-[13px]">
            <span className="text-muted">{shown.length} računa</span>
            <span>
              Ukupno <strong className="text-base text-ink tabular-nums">{cash(sum(shown), currency, true)}</strong>
            </span>
          </div>
          {shown.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">
              {all.length ? 'Nema računa u ovoj grupi.' : 'Još nema računa. Napravi prvi ili označi projekat kao završen.'}
            </p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Broj</th>
                    <th>Klijent</th>
                    <th className="max-md:hidden">Izdat</th>
                    <th className="max-md:hidden">Rok</th>
                    <th>Status</th>
                    <th className="text-right">Iznos</th>
                    <th className="w-10" aria-label="PDF" />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((i) => (
                    <tr key={i.id} className="group relative">
                      <td className="font-mono text-[13px] whitespace-nowrap">
                        <Link href={`/admin/finance/invoices/${i.id}`} className="font-semibold text-ink after:absolute after:inset-0 hover:text-primary">
                          {invoiceNumber(settings.invoices.prefix, i.number)}
                        </Link>
                      </td>
                      <td className="max-w-[26ch] truncate">{i.bill_to?.company || i.bill_to?.name || '—'}</td>
                      <td className="whitespace-nowrap text-zinc-600 max-md:hidden">{formatDate(i.issue_date)}</td>
                      <td className={`whitespace-nowrap max-md:hidden ${i.late ? 'font-medium text-rose-600' : 'text-zinc-600'}`}>{i.due_date ? formatDate(i.due_date) : '—'}</td>
                      <td>
                        <span className={`badge ${i.late ? 'badge-spam' : INVOICE_STATUS[i.status].badge}`}>{i.late ? 'Kasni' : INVOICE_STATUS[i.status].label}</span>
                      </td>
                      <td className="text-right font-semibold whitespace-nowrap text-ink tabular-nums">{cash(i.total, i.currency || currency, true)}</td>
                      <td className="relative z-10">
                        <a href={`/admin/finance/invoices/${i.id}/pdf?download=1`} className="btn btn-sm btn-light" title="Preuzmi PDF">
                          <Download className="size-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
