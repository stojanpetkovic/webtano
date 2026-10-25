'use client';

import { useMemo, useState } from 'react';
import { GripVertical, Plus, Repeat, Trash2 } from 'lucide-react';
import { money, totals } from '@/lib/admin/crm/labels';

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
  const [items, setItems] = useState<EditorItem[]>(initial);
  const [currency, setCurrency] = useState(initialCurrency);
  const [discount, setDiscount] = useState(initialDiscount);
  const t = useMemo(() => totals(items, discount), [items, discount]);
  const groups = [...new Set(priceList.map((p) => p.group))];

  const update = (i: number, patch: Partial<EditorItem>) => setItems((list) => list.map((it, n) => (n === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => setItems((list) => list.filter((_, n) => n !== i));
  const moveUp = (i: number) =>
    i > 0 && setItems((list) => list.map((it, n) => (n === i - 1 ? list[i] : n === i ? list[i - 1] : it)));

  return (
    <div className="card">
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <div className="card-header">
        <div>
          <h2 className="card-title">Stavke</h2>
          <p className="card-sub">Dodaj iz cenovnika ili ručno. Mesečne stavke su označene sa <Repeat className="inline size-3" />.</p>
        </div>
        <select
          className="form-input w-auto py-1.5 text-xs"
          value=""
          onChange={(e) => {
            const entry = priceList[Number(e.target.value)];
            if (entry) setItems((list) => [...list, { description: entry.description, details: entry.details, qty: 1, unit_price: entry.unit_price, recurring: entry.recurring }]);
          }}
          aria-label="Dodaj iz cenovnika"
        >
          <option value="">+ Iz cenovnika…</option>
          {groups.map((g) => (
            <optgroup key={g} label={g}>
              {priceList.map((p, n) =>
                p.group === g ? (
                  <option key={n} value={n}>
                    {p.description} · {money(p.unit_price)}
                    {p.recurring ? '/mes' : ''}
                  </option>
                ) : null,
              )}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="divide-y divide-line">
        {items.length === 0 && <p className="px-5 py-8 text-center text-muted">Još nema stavki. Izaberi iz cenovnika gore ili dodaj ručno.</p>}
        {items.map((it, i) => (
          <div key={i} className="grid gap-3 px-5 py-4 md:grid-cols-[20px_minmax(0,1fr)_80px_120px_110px_36px] md:items-start">
            <button type="button" onClick={() => moveUp(i)} className="hidden cursor-pointer pt-2.5 text-zinc-300 hover:text-zinc-600 md:block" title="Pomeri gore" aria-label="Pomeri gore">
              <GripVertical className="size-4" />
            </button>
            <div className="space-y-2">
              <input className="form-input font-medium" value={it.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Naziv stavke" aria-label="Naziv stavke" />
              <textarea className="form-input min-h-0 text-[13px]" rows={2} value={it.details} onChange={(e) => update(i, { details: e.target.value })} placeholder="Opis (opciono)" aria-label="Opis stavke" />
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-zinc-600">
                <input type="checkbox" checked={it.recurring} onChange={(e) => update(i, { recurring: e.target.checked })} className="size-3.5 accent-ink-950" />
                Mesečno
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3 md:contents">
              <div>
                <label className="form-label md:sr-only">Kol.</label>
                <input className="form-input text-right tabular-nums" type="number" min="0" step="0.5" value={it.qty} onChange={(e) => update(i, { qty: Number(e.target.value) })} aria-label="Količina" />
              </div>
              <div>
                <label className="form-label md:sr-only">Cena</label>
                <input className="form-input text-right tabular-nums" type="number" min="0" step="1" value={it.unit_price} onChange={(e) => update(i, { unit_price: Number(e.target.value) })} aria-label="Cena po jedinici" />
              </div>
              <div className="text-right">
                <label className="form-label md:sr-only">Ukupno</label>
                <div className="pt-2 text-[13.5px] font-semibold text-ink tabular-nums">
                  {money(it.qty * it.unit_price, currency)}
                  {it.recurring && <span className="text-xs font-normal text-zinc-500">/mes</span>}
                </div>
              </div>
            </div>
            <button type="button" onClick={() => remove(i)} className="grid size-9 cursor-pointer place-items-center justify-self-end rounded-lg text-zinc-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Obriši stavku">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-line p-5 md:flex-row md:items-start md:justify-between">
        <button type="button" className="btn btn-outline self-start" onClick={() => setItems((list) => [...list, { description: '', details: '', qty: 1, unit_price: 0, recurring: false }])}>
          <Plus className="size-4" /> Dodaj stavku
        </button>
        <div className="w-full space-y-2 text-[13.5px] md:max-w-xs">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-zinc-500">
              Valuta
              <select name="currency" className="form-input mt-1 py-1.5" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option>USD</option>
                <option>EUR</option>
                <option>RSD</option>
              </select>
            </label>
            <label className="text-xs text-zinc-500">
              Popust %
              <input name="discount_pct" type="number" min="0" max="100" step="1" className="form-input mt-1 py-1.5 text-right" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </label>
          </div>
          <dl className="space-y-1.5 pt-2">
            <div className="flex justify-between text-zinc-600"><dt>Jednokratno</dt><dd className="tabular-nums">{money(t.oneTimeGross, currency)}</dd></div>
            {t.monthlyGross > 0 && <div className="flex justify-between text-zinc-600"><dt>Mesečno</dt><dd className="tabular-nums">{money(t.monthlyGross, currency)}/mes</dd></div>}
            {t.discount > 0 && <div className="flex justify-between text-rose-600"><dt>Popust {discount}%</dt><dd className="tabular-nums">−{money(t.discount, currency)}</dd></div>}
            <div className="flex justify-between border-t border-line pt-2 text-[15px] font-semibold text-ink">
              <dt>Ukupno</dt>
              <dd className="text-right tabular-nums">
                {money(t.oneTime, currency)}
                {t.monthly > 0 && <div className="text-xs font-medium text-zinc-500">+ {money(t.monthly, currency)}/mes</div>}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
