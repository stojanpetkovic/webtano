import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Ban, CheckCircle2, Download, ExternalLink, Mail, RotateCcw, Trash2 } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { Modal } from '@/components/admin/Modal';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { InvoiceEditor } from '@/components/admin/finance/InvoiceEditor';
import { db } from '@/lib/admin/supabase';
import { appSettings } from '@/lib/admin/settings';
import { priceList } from '@/lib/admin/crm/priceList';
import { formatDate, formatDateTime } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { loadInvoice } from '@/lib/admin/finance/data';
import { financeOptions } from '@/lib/admin/finance/options';
import { INCOME_CATEGORIES, INVOICE_STATUS, cash, invoiceNumber, invoiceTotals, todayBelgrade } from '@/lib/admin/finance/labels';
import { deleteInvoice, emailInvoice, markInvoicePaid, setInvoiceStatus } from '../../actions';
import { Notice } from '../../Ledger';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Račun' };

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = toParams(await searchParams);
  const found = await loadInvoice(id);
  if (!found) redirect('/admin/finance/invoices');
  const { invoice, items } = found;
  const [settings, options, prices, { data: income }] = await Promise.all([
    appSettings(),
    financeOptions(),
    priceList(),
    db().from('fin_income').select('id, date').eq('invoice_id', id).maybeSingle<{ id: string; date: string }>(),
  ]);
  const currency = invoice.currency || settings.proposals.currency || 'USD';
  const number = invoiceNumber(settings.invoices.prefix, invoice.number);
  const totals = invoiceTotals(items, invoice.discount_pct, invoice.tax_pct);
  const today = todayBelgrade();
  const late = invoice.status === 'issued' && !!invoice.due_date && invoice.due_date < today;
  const editable = invoice.status === 'draft' || invoice.status === 'issued';
  const who = invoice.bill_to?.company || invoice.bill_to?.name || 'Bez klijenta';
  const error = query.get('error');

  const notices: Record<string, [string, React.ReactNode]> = {
    created: ['alert-success', `Račun ${number} je napravljen.`],
    saved: ['alert-success', 'Račun je sačuvan.'],
    sent: ['alert-success', `Račun je poslat na ${invoice.sent_to}, sa PDF-om u prilogu.`],
    send_failed: ['alert-danger', `Slanje nije uspelo${error ? `: ${error}` : ''}.`],
    bad_email: ['alert-danger', 'Upiši ispravnu email adresu.'],
    paid: ['alert-success', 'Račun je plaćen, a iznos je upisan u prihode.'],
    issued: ['alert-success', 'Račun je izdat.'],
    void: ['alert-success', 'Račun je storniran i ne računa se u nenaplaćeno.'],
    draft: ['alert-success', 'Račun je vraćen u nacrt.'],
    locked: ['alert-danger', 'Plaćen ili storniran račun ne može da se menja.'],
    items: ['alert-danger', 'Dodaj bar jednu stavku sa opisom.'],
    completed: ['alert-success', 'Projekat je završen i račun je izdat.'],
    completed_sent: ['alert-success', `Projekat je završen, a račun je poslat klijentu na ${invoice.sent_to}.`],
    completed_no_email: ['alert-info', 'Projekat je završen i račun je izdat. Klijent nema email, pa račun nije poslat.'],
    completed_send_failed: ['alert-danger', 'Projekat je završen i račun je izdat, ali slanje emailom nije uspelo. Pokušaj ponovo dugmetom „Pošalji emailom“.'],
  };

  return (
    <>
      <PageHeading
        title={`Račun ${number}`}
        crumbs={[{ label: 'Finansije', href: '/admin/finance' }, { label: 'Računi', href: '/admin/finance/invoices' }]}
        description={
          <>
            {invoice.customer_id ? (
              <Link href={`/admin/crm/customers/${invoice.customer_id}`} className="text-primary hover:underline">
                {who}
              </Link>
            ) : (
              who
            )}
            {' · '}
            {cash(totals.total, currency, true)}
          </>
        }
      >
        <span className={`badge ${late ? 'badge-spam' : INVOICE_STATUS[invoice.status].badge}`}>{late ? 'Kasni sa uplatom' : INVOICE_STATUS[invoice.status].label}</span>
      </PageHeading>

      <Notice code={query.get('notice')} extra={notices} />

      <div className="flex flex-wrap gap-2">
        <a href={`/admin/finance/invoices/${id}/pdf?download=1`} className="btn btn-primary">
          <Download className="size-4" /> Preuzmi PDF
        </a>
        <a href={`/admin/finance/invoices/${id}/pdf`} target="_blank" rel="noopener" className="btn btn-outline">
          <ExternalLink className="size-4" /> Otvori PDF
        </a>
        {invoice.status !== 'void' && (
          <Modal
            label={
              <>
                <Mail className="size-4" /> {invoice.sent_at ? 'Pošalji ponovo' : 'Pošalji emailom'}
              </>
            }
            buttonClassName="btn btn-outline"
            title={`Pošalji račun ${number}`}
            description={invoice.status === 'paid' ? 'Klijent dobija potvrdu o uplati sa PDF-om u prilogu.' : 'Klijent dobija email na engleskom sa PDF-om u prilogu. Nacrt postaje izdat.'}
          >
            <form action={emailInvoice} className="space-y-4">
              <input type="hidden" name="id" value={id} />
              <div>
                <label className="form-label" htmlFor="send-to">
                  Prima
                </label>
                <input className="form-input" type="email" id="send-to" name="to" required defaultValue={invoice.sent_to || invoice.bill_to?.email || ''} />
              </div>
              <div>
                <label className="form-label" htmlFor="send-note">
                  Poruka <span className="font-normal text-muted">(nije obavezno, na engleskom)</span>
                </label>
                <textarea className="form-input" id="send-note" name="note" rows={4} maxLength={3000} placeholder="Thanks again for working with us. Let me know if you have any questions." />
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-zinc-700">
                <input type="checkbox" name="copy_me" defaultChecked className="size-4 accent-ink" />
                Pošalji i meni kopiju (skriveno)
              </label>
              <div className="flex justify-end border-t border-line pt-4">
                <button className="btn btn-primary" type="submit">
                  <Mail className="size-4" /> Pošalji
                </button>
              </div>
            </form>
          </Modal>
        )}
        {invoice.status === 'issued' && (
          <Modal
            label={
              <>
                <CheckCircle2 className="size-4" /> Označi kao plaćen
              </>
            }
            buttonClassName="btn btn-outline"
            title="Uplata je stigla"
            description={`${cash(totals.total, currency, true)} ulazi u prihode na dan uplate.`}
          >
            <form action={markInvoicePaid} className="space-y-4">
              <input type="hidden" name="id" value={id} />
              <div>
                <label className="form-label" htmlFor="paid-at">
                  Datum uplate
                </label>
                <input className="form-input" type="date" id="paid-at" name="paid_at" required defaultValue={today} max={today} />
              </div>
              <div className="flex justify-end border-t border-line pt-4">
                <button className="btn btn-primary" type="submit">
                  Potvrdi uplatu
                </button>
              </div>
            </form>
          </Modal>
        )}
        {invoice.status === 'draft' && (
          <form action={setInvoiceStatus}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value="issued" />
            <button className="btn btn-outline" type="submit">
              Izdaj bez slanja
            </button>
          </form>
        )}
        {(invoice.status === 'draft' || invoice.status === 'issued') && (
          <form action={setInvoiceStatus}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value="void" />
            <ConfirmSubmit className="btn btn-light" message={`Stornirati račun ${number}? Ostaje u listi kao storniran.`}>
              <Ban className="size-4" /> Storniraj
            </ConfirmSubmit>
          </form>
        )}
        {invoice.status === 'void' && (
          <form action={setInvoiceStatus}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value="draft" />
            <button className="btn btn-light" type="submit">
              <RotateCcw className="size-4" /> Vrati u nacrt
            </button>
          </form>
        )}
        {(invoice.status === 'draft' || invoice.status === 'void') && (
          <form action={deleteInvoice}>
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmit className="btn btn-light hover:text-rose-600" message={`Trajno obrisati račun ${number}?`}>
              <Trash2 className="size-4" /> Obriši
            </ConfirmSubmit>
          </form>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card overflow-hidden xl:col-span-2">
          <iframe src={`/admin/finance/invoices/${id}/pdf#toolbar=0&view=FitH`} title={`Račun ${number}`} className="h-[70vh] min-h-[520px] w-full bg-zinc-100 max-md:hidden" />
          <div className="card-body md:hidden">
            <p className="text-sm text-muted">Pregled PDF-a je na većem ekranu. Na telefonu ga otvori dugmetom „Otvori PDF“.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Detalji</h2>
            </div>
            <dl className="divide-y divide-line text-[13.5px]">
              {[
                ['Klijent', who],
                ['Email', invoice.bill_to?.email || '—'],
                ['Vrsta prihoda', INCOME_CATEGORIES[invoice.category] ?? invoice.category],
                ['Izdat', formatDate(invoice.issue_date)],
                ['Rok plaćanja', invoice.due_date ? formatDate(invoice.due_date) : '—'],
                ['Plaćen', invoice.paid_at ? formatDate(invoice.paid_at) : '—'],
                ['Poslat', invoice.sent_at ? `${formatDateTime(invoice.sent_at)} · ${invoice.sent_to}` : 'Nije poslat'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-5 py-2.5">
                  <dt className="shrink-0 text-muted">{k}</dt>
                  <dd className={`min-w-0 text-right break-words ${k === 'Rok plaćanja' && late ? 'font-medium text-rose-600' : 'text-ink'}`}>{v}</dd>
                </div>
              ))}
              {invoice.project_id && options.projectById.get(invoice.project_id) && (
                <div className="flex justify-between gap-4 px-5 py-2.5">
                  <dt className="text-muted">Projekat</dt>
                  <dd className="text-right">
                    <Link href={`/admin/crm/projects/${invoice.project_id}`} className="text-primary hover:underline">
                      {options.projectById.get(invoice.project_id)}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div className="card card-body space-y-2 text-[13.5px]">
            <div className="flex justify-between">
              <span className="text-muted">Osnovica</span>
              <span className="tabular-nums">{cash(totals.subtotal, currency, true)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Popust {Number(invoice.discount_pct)}%</span>
                <span className="tabular-nums">−{cash(totals.discount, currency, true)}</span>
              </div>
            )}
            {Number(invoice.tax_pct) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Porez {Number(invoice.tax_pct)}%</span>
                <span className="tabular-nums">{cash(totals.tax, currency, true)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-ink">
              <span>Ukupno</span>
              <span className="tabular-nums">{cash(totals.total, currency, true)}</span>
            </div>
            {income && (
              <p className="pt-1 text-xs text-emerald-700">
                Upisano u prihode {formatDate(income.date)}.{' '}
                <Link href="/admin/finance/income" className="underline">
                  Prihodi
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {editable && (
        <details className="group" open={invoice.status === 'draft' || query.get('notice') === 'items'}>
          <summary className="card card-header cursor-pointer list-none">
            <h2 className="card-title">Izmeni račun</h2>
            <span className="text-xs text-muted group-open:hidden">Otvori</span>
          </summary>
          <div className="mt-4">
            <InvoiceEditor
              invoice={invoice}
              items={items}
              customers={options.customers}
              projects={options.projects}
              priceList={prices.map((p) => ({ group: p.group, description: p.description, unit_price: p.unit_price }))}
              defaults={{ today, dueDays: settings.invoices.due_days, taxPct: settings.invoices.tax_pct, currency }}
            />
          </div>
        </details>
      )}
    </>
  );
}
