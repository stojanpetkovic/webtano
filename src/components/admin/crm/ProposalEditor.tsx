'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { BookmarkCheck, BookmarkPlus, GripVertical, Plus, Repeat, Trash2 } from 'lucide-react';
import { addItemFromProposal } from '@/app/(admin)/admin/(panel)/crm/actions';
import { groupLabel, money, totals } from '@/lib/admin/crm/labels';
import { useLang } from '@/components/i18n/LangProvider';
import { translator } from '@/lib/i18n';

export interface EditorItem {
  description: string;
  details: string;
  qty: number;
  unit_price: number;
  recurring: boolean;
}

export interface PriceListEntry extends EditorItem {
  group: string;
}

/**
 * The line items of a proposal: add from the price list or by hand, edit in
 * place, and see the totals update. Sent to the server action as JSON.
 */
export function ProposalEditor({
  initial,
  priceList,
  currency: initialCurrency,
  discount: initialDiscount,
}: {
  initial: EditorItem[];
  priceList: PriceListEntry[];
  currency: string;
  discount: number;
}) {
  const lang = useLang();
  const tr = translator(lang);
  const perMonth = tr('/mo', '/mes');
  const [items, setItems] = useState<EditorItem[]>(initial);
  const [currency, setCurrency] = useState(initialCurrency);
  const [discount, setDiscount] = useState(initialDiscount);
  const t = useMemo(() => totals(items, discount), [items, discount]);
  // One-time items first, then monthly, each under its own group in the picker.
  const groupOf = (p: PriceListEntry) => `${p.recurring ? tr('Monthly', 'Mesečno') : tr('One-time', 'Jednokratno')} · ${groupLabel(p.group, lang)}`;
  const groups = [...new Set([...priceList.filter((p) => !p.recurring), ...priceList.filter((p) => p.recurring)].map(groupOf))];
  // Lines saved to the price list from here, by their text, so the button shows it.
  const [saved, setSaved] = useState<string[]>([]);
  const [, startSaving] = useTransition();
  const known = (it: EditorItem) => saved.includes(it.description) || priceList.some((p) => p.description === it.description && p.unit_price === it.unit_price);
  const saveToList = (it: EditorItem) =>
    startSaving(async () => {
      if (await addItemFromProposal(it)) setSaved((list) => [...list, it.description]);
    });

  const update = (i: number, patch: Partial<EditorItem>) => setItems((list) => list.map((it, n) => (n === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => setItems((list) => list.filter((_, n) => n !== i));
  const moveUp = (i: number) =>
    i > 0 && setItems((list) => list.map((it, n) => (n === i - 1 ? list[i] : n === i ? list[i - 1] : it)));

  return (
    <div className="card">
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <div className="card-header">
        <div>
          <h2 className="card-title">{tr('Items', 'Stavke')}</h2>
          <p className="card-sub">
            {tr('Add from the', 'Dodaj iz')}{' '}
            <Link href="/admin/crm/items" className="font-medium text-primary hover:underline">
              {tr('price list', 'cenovnika')}
            </Link>{' '}
            {tr('or by hand. Monthly items are marked with', 'ili ručno. Mesečne stavke su označene sa')} <Repeat className="inline size-3" />.
          </p>
        </div>
        <select
          className="form-input w-auto py-1.5 text-xs"
          value=""
          onChange={(e) => {
            const entry = priceList[Number(e.target.value)];
            if (entry) setItems((list) => [...list, { description: entry.description, details: entry.details, qty: 1, unit_price: entry.unit_price, recurring: entry.recurring }]);
          }}
          aria-label={tr('Add from the price list', 'Dodaj iz cenovnika')}
        >
          <option value="">{priceList.length ? tr('+ From the price list…', '+ Iz cenovnika…') : tr('The price list is empty', 'Cenovnik je prazan')}</option>
          {groups.map((g) => (
            <optgroup key={g} label={g}>
              {priceList.map((p, n) =>
                groupOf(p) === g ? (
                  <option key={n} value={n}>
                    {p.description} · {money(p.unit_price)}
                    {p.recurring ? perMonth : ''}
                  </option>
                ) : null,
              )}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="divide-y divide-line">
        {items.length === 0 && <p className="px-5 py-8 text-center text-muted">{tr('No items yet. Pick from the price list above or add one by hand.', 'Još nema stavki. Izaberi iz cenovnika gore ili dodaj ručno.')}</p>}
        {items.map((it, i) => (
          <div key={i} className="grid gap-3 px-5 py-4 md:grid-cols-[20px_minmax(0,1fr)_80px_120px_110px_36px] md:items-start">
            <button type="button" onClick={() => moveUp(i)} className="hidden cursor-pointer pt-2.5 text-zinc-300 hover:text-zinc-600 md:block" title={tr('Move up', 'Pomeri gore')} aria-label={tr('Move up', 'Pomeri gore')}>
              <GripVertical className="size-4" />
            </button>
            <div className="space-y-2">
              <input className="form-input font-medium" value={it.description} onChange={(e) => update(i, { description: e.target.value })} placeholder={tr('Item name', 'Naziv stavke')} aria-label={tr('Item name', 'Naziv stavke')} />
              <textarea className="form-input min-h-0 text-[13px]" rows={2} value={it.details} onChange={(e) => update(i, { details: e.target.value })} placeholder={tr('Description (optional)', 'Opis (opciono)')} aria-label={tr('Item description', 'Opis stavke')} />
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-zinc-600">
                <input type="checkbox" checked={it.recurring} onChange={(e) => update(i, { recurring: e.target.checked })} className="size-3.5 accent-ink-950" />
                {tr('Monthly', 'Mesečno')}
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3 md:contents">
              <div>
                <label className="form-label md:sr-only">{tr('Qty', 'Kol.')}</label>
                <input className="form-input text-right tabular-nums" type="number" min="0" step="0.5" value={it.qty} onChange={(e) => update(i, { qty: Number(e.target.value) })} aria-label={tr('Quantity', 'Količina')} />
              </div>
              <div>
                <label className="form-label md:sr-only">{tr('Price', 'Cena')}</label>
                <input className="form-input text-right tabular-nums" type="number" min="0" step="1" value={it.unit_price} onChange={(e) => update(i, { unit_price: Number(e.target.value) })} aria-label={tr('Unit price', 'Cena po jedinici')} />
              </div>
              <div className="text-right">
                <label className="form-label md:sr-only">{tr('Total', 'Ukupno')}</label>
                <div className="pt-2 text-[13.5px] font-semibold text-ink tabular-nums">
                  {money(it.qty * it.unit_price, currency)}
                  {it.recurring && <span className="text-xs font-normal text-zinc-500">{perMonth}</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-1 md:flex-col">
              {it.description.trim() && !known(it) ? (
                <button type="button" onClick={() => saveToList(it)} className="grid size-9 cursor-pointer place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-ink" title={tr('Save to the price list', 'Sačuvaj u cenovnik')} aria-label={tr('Save to the price list', 'Sačuvaj u cenovnik')}>
                  <BookmarkPlus className="size-4" />
                </button>
              ) : saved.includes(it.description) ? (
                <span className="grid size-9 place-items-center text-emerald-600" title={tr('Saved to the price list', 'Sačuvano u cenovniku')}>
                  <BookmarkCheck className="size-4" />
                </span>
              ) : null}
              <button type="button" onClick={() => remove(i)} className="grid size-9 cursor-pointer place-items-center rounded-lg text-zinc-400 hover:bg-rose-50 hover:text-rose-600" aria-label={tr('Delete item', 'Obriši stavku')}>
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-line p-5 md:flex-row md:items-start md:justify-between">
        <button type="button" className="btn btn-outline self-start" onClick={() => setItems((list) => [...list, { description: '', details: '', qty: 1, unit_price: 0, recurring: false }])}>
          <Plus className="size-4" /> {tr('Add item', 'Dodaj stavku')}
        </button>
        <div className="w-full space-y-2 text-[13.5px] md:max-w-xs">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-zinc-500">
              {tr('Currency', 'Valuta')}
              <select name="currency" className="form-input mt-1 py-1.5" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option>USD</option>
                <option>EUR</option>
                <option>RSD</option>
              </select>
            </label>
            <label className="text-xs text-zinc-500">
              {tr('Discount %', 'Popust %')}
              <input name="discount_pct" type="number" min="0" max="100" step="1" className="form-input mt-1 py-1.5 text-right" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </label>
          </div>
          <dl className="space-y-1.5 pt-2">
            <div className="flex justify-between text-zinc-600"><dt>{tr('One-time', 'Jednokratno')}</dt><dd className="tabular-nums">{money(t.oneTimeGross, currency)}</dd></div>
            {t.monthlyGross > 0 && <div className="flex justify-between text-zinc-600"><dt>{tr('Monthly', 'Mesečno')}</dt><dd className="tabular-nums">{money(t.monthlyGross, currency)}{perMonth}</dd></div>}
            {t.discount > 0 && <div className="flex justify-between text-rose-600"><dt>{tr('Discount', 'Popust')} {discount}%</dt><dd className="tabular-nums">−{money(t.discount, currency)}</dd></div>}
            <div className="flex justify-between border-t border-line pt-2 text-[15px] font-semibold text-ink">
              <dt>{tr('Total', 'Ukupno')}</dt>
              <dd className="text-right tabular-nums">
                {money(t.oneTime, currency)}
                {t.monthly > 0 && <div className="text-xs font-medium text-zinc-500">+ {money(t.monthly, currency)}{perMonth}</div>}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
