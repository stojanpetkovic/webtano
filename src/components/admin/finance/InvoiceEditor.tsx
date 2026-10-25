'use client';

import { useMemo, useState } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { saveInvoice } from '@/app/(admin)/admin/(panel)/finance/actions';
import { INCOME_CATEGORIES, addDays, categoryFor, invoiceTotals } from '@/lib/admin/finance/labels';
import type { Invoice, InvoiceItem } from '@/lib/admin/finance/types';
import { groupLabel } from '@/lib/admin/crm/labels';
import { useLang } from '@/components/i18n/LangProvider';
import { translator } from '@/lib/i18n';

interface Line {
  key: number;
  description: string;
  qty: string;
  unit_price: string;
}

interface ProjectOption {
  id: string;
  label: string;
  customer_id: string | null;
  services: string[];
  budget: number | null;
}

/** The invoice form: who, when, the lines with live totals, then save as a draft or issue it. */
export function InvoiceEditor({
  invoice,
  items = [],
  customers,
  projects,
  priceList,
  defaults,
}: {
  invoice?: Invoice;
  items?: InvoiceItem[];
  customers: { id: string; label: string }[];
  projects: ProjectOption[];
  priceList: { group: string; description: string; unit_price: number }[];
  defaults: { today: string; dueDays: number; taxPct: number; currency: string; customerId?: string; projectId?: string };
}) {
  const lang = useLang();
  const t = translator(lang);
  let next = 0;
  const toLine = (i: { description: string; qty: number | string; unit_price: number | string }): Line => ({
    key: next++,
    description: i.description,
    qty: String(i.qty),
    unit_price: String(i.unit_price),
  });
  const startProject = projects.find((p) => p.id === (invoice?.project_id ?? defaults.projectId));
  const [lines, setLines] = useState<Line[]>(() =>
    items.length
      ? items.map(toLine)
      : [toLine({ description: startProject?.label ?? '', qty: 1, unit_price: startProject?.budget ?? '' })],
  );
  const [keySeq, setKeySeq] = useState(1000);
  const [customerId, setCustomerId] = useState(invoice?.customer_id ?? defaults.customerId ?? startProject?.customer_id ?? '');
  const [projectId, setProjectId] = useState(invoice?.project_id ?? defaults.projectId ?? '');
  const [category, setCategory] = useState(invoice?.category ?? categoryFor(startProject?.services));
  const [issue, setIssue] = useState(invoice?.issue_date ?? defaults.today);
  const [due, setDue] = useState(invoice?.due_date ?? addDays(defaults.today, defaults.dueDays));
  const [discount, setDiscount] = useState(String(invoice?.discount_pct ?? 0));
  const [tax, setTax] = useState(String(invoice?.tax_pct ?? defaults.taxPct));

  const parsed = lines.map((l) => ({ description: l.description, qty: Number(l.qty.replace(',', '.')) || 0, unit_price: Number(l.unit_price.replace(',', '.')) || 0 }));
  const totals = invoiceTotals(parsed, Number(discount) || 0, Number(tax) || 0);
  const money = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: defaults.currency }), [defaults.currency]);
  const visibleProjects = customerId ? projects.filter((p) => !p.customer_id || p.customer_id === customerId) : projects;

  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const add = (line?: { description: string; unit_price: number }) => {
    setKeySeq((k) => k + 1);
    setLines((ls) => {
      // An empty first line is replaced instead of left above the new one.
      const base = ls.length === 1 && !ls[0].description && !ls[0].unit_price ? [] : ls;
      return [...base, { key: keySeq, description: line?.description ?? '', qty: '1', unit_price: line ? String(line.unit_price) : '' }];
    });
  };
  const pickProject = (id: string) => {
    setProjectId(id);
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    if (p.customer_id && !customerId) setCustomerId(p.customer_id);
    setCategory(categoryFor(p.services));
  };

  const groups = [...new Set(priceList.map((p) => p.group))];
  return (
    <form action={saveInvoice} className="grid gap-4 xl:grid-cols-3">
      {invoice && <input type="hidden" name="id" value={invoice.id} />}
      <input type="hidden" name="items" value={JSON.stringify(parsed)} />

      <div className="card xl:col-span-2">
        <div className="card-header">
          <h2 className="card-title">{t('Items', 'Stavke')}</h2>
          {priceList.length > 0 && (
            <select
              className="form-input h-9 w-auto max-w-[60%] py-1 text-[13px]"
              value=""
              aria-label={t('Add from the price list', 'Dodaj iz cenovnika')}
              onChange={(e) => {
                const item = priceList[Number(e.target.value)];
                if (item) add(item);
              }}
            >
              <option value="">{t('+ From the price list…', '+ Iz cenovnika…')}</option>
              {groups.map((g) => (
                <optgroup key={g} label={groupLabel(g, lang)}>
                  {priceList.map((p, i) =>
                    p.group === g ? (
                      <option key={i} value={i}>
                        {p.description} · {money.format(p.unit_price)}
                      </option>
                    ) : null,
                  )}
                </optgroup>
              ))}
            </select>
          )}
        </div>
        <div className="card-body space-y-3">
          <div className="hidden grid-cols-[1fr_80px_120px_110px_36px] gap-2 px-1 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase md:grid">
            <span>{t('Description', 'Opis')}</span>
            <span className="text-right">{t('Qty', 'Kol.')}</span>
            <span className="text-right">{t('Price', 'Cena')}</span>
            <span className="text-right">{t('Amount', 'Iznos')}</span>
            <span />
          </div>
          {lines.map((l, i) => (
            <div key={l.key} className="grid grid-cols-[1fr_auto] gap-2 rounded-xl bg-zinc-50 p-2 ring-1 ring-line md:grid-cols-[1fr_80px_120px_110px_36px] md:items-start md:bg-transparent md:p-0 md:ring-0">
              <div className="flex items-start gap-1.5 max-md:col-span-2">
                <GripVertical className="mt-3 size-4 shrink-0 text-zinc-300 max-md:hidden" aria-hidden />
                <textarea
                  className="form-input min-h-10 resize-y py-2"
                  rows={1}
                  value={l.description}
                  onChange={(e) => update(l.key, { description: e.target.value })}
                  placeholder={t('e.g. Website design and build, 8 pages', 'npr. Website design and build, 8 pages')}
                  aria-label={`${t('Item description', 'Opis stavke')} ${i + 1}`}
                  required={i === 0}
                />
              </div>
              <input
                className="form-input text-right tabular-nums max-md:w-20"
                inputMode="decimal"
                value={l.qty}
                onChange={(e) => update(l.key, { qty: e.target.value })}
                aria-label={`${t('Quantity, item', 'Količina, stavka')} ${i + 1}`}
              />
              <input
                className="form-input text-right tabular-nums"
                inputMode="decimal"
                value={l.unit_price}
                onChange={(e) => update(l.key, { unit_price: e.target.value })}
                placeholder="0.00"
                aria-label={`${t('Price, item', 'Cena, stavka')} ${i + 1}`}
              />
              <div className="self-center text-right text-[13.5px] font-semibold text-ink tabular-nums max-md:col-span-1">
                {money.format(parsed[i].qty * parsed[i].unit_price)}
              </div>
              <button
                type="button"
                onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((x) => x.key !== l.key) : ls))}
                disabled={lines.length === 1}
                className="grid size-9 cursor-pointer place-items-center self-center rounded-lg text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                aria-label={`${t('Remove item', 'Ukloni stavku')} ${i + 1}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => add()} className="btn btn-sm btn-light">
            <Plus className="size-3.5" /> {t('New item', 'Nova stavka')}
          </button>
        </div>
        <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-[1fr_280px]">
          <div>
            <label className="form-label" htmlFor="inv-notes">
              {t('Note on the invoice', 'Napomena na računu')}{' '}
              <span className="font-normal text-muted">({t('in English, the client sees it', 'na engleskom, vidi je klijent')})</span>
            </label>
            <textarea className="form-input" id="inv-notes" name="notes" rows={3} maxLength={3000} defaultValue={invoice?.notes ?? ''} placeholder="Thank you for your business." />
          </div>
          <dl className="space-y-2 self-end text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-muted">{t('Subtotal', 'Osnovica')}</dt>
              <dd className="tabular-nums">{money.format(totals.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{t('Discount %', 'Popust %')}</dt>
              <dd>
                <input className="form-input h-8 w-20 py-1 text-right tabular-nums" name="discount_pct" inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{t('Tax %', 'Porez %')}</dt>
              <dd>
                <input className="form-input h-8 w-20 py-1 text-right tabular-nums" name="tax_pct" inputMode="decimal" value={tax} onChange={(e) => setTax(e.target.value)} />
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-ink">
              <dt>{t('Total', 'Ukupno')}</dt>
              <dd className="tabular-nums">{money.format(totals.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card card-body space-y-4">
          <div>
            <label className="form-label" htmlFor="inv-customer">
              {t('Customer', 'Klijent')}
            </label>
            <select className="form-input" id="inv-customer" name="customer_id" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
              <option value="">{t('Choose a customer…', 'Izaberi klijenta…')}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="form-hint">{t('Name, company, email and address are copied from the customer when you save.', 'Ime, firma, email i adresa se prepisuju sa klijenta kad sačuvaš.')}</p>
          </div>
          <div>
            <label className="form-label" htmlFor="inv-project">
              {t('Project', 'Projekat')} <span className="font-normal text-muted">({t('optional', 'nije obavezno')})</span>
            </label>
            <select className="form-input" id="inv-project" name="project_id" value={projectId} onChange={(e) => pickProject(e.target.value)}>
              <option value="">{t('No project', 'Bez projekta')}</option>
              {visibleProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="inv-category">
              {t('Income type', 'Vrsta prihoda')}
            </label>
            <select className="form-input" id="inv-category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {Object.entries(INCOME_CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v[lang]}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label" htmlFor="inv-issue">
                {t('Issue date', 'Datum izdavanja')}
              </label>
              <input
                className="form-input"
                type="date"
                id="inv-issue"
                name="issue_date"
                value={issue}
                required
                onChange={(e) => {
                  setIssue(e.target.value);
                  if (!invoice && e.target.value) setDue(addDays(e.target.value, defaults.dueDays));
                }}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="inv-due">
                {t('Due date', 'Rok plaćanja')}
              </label>
              <input className="form-input" type="date" id="inv-due" name="due_date" value={due} min={issue} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="card card-body space-y-2">
          <button className="btn btn-primary w-full" type="submit" name="intent" value="issue">
            {invoice?.status === 'issued' ? t('Save invoice', 'Sačuvaj račun') : t('Save and issue', 'Sačuvaj i izdaj')}
          </button>
          {(!invoice || invoice.status === 'draft') && (
            <button className="btn btn-light w-full" type="submit" name="intent" value="draft" formNoValidate>
              {t('Save as draft', 'Sačuvaj kao nacrt')}
            </button>
          )}
          <p className="text-center text-xs text-muted">{t('An issued invoice gets a number and can be emailed as a PDF.', 'Izdat račun dobija broj i može da se pošalje emailom kao PDF.')}</p>
        </div>
      </div>
    </form>
  );
}
