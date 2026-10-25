'use client';

import { useState } from 'react';
import { completeProject } from '@/app/(admin)/admin/(panel)/finance/actions';
import { INCOME_CATEGORIES } from '@/lib/admin/finance/labels';
import { useLang } from '@/components/i18n/LangProvider';
import { translator } from '@/lib/i18n';

/** The "Project done" pop-up: closes the project and books its income, with or without an invoice. */
export function CompleteProjectForm({
  projectId,
  name,
  amount,
  category,
  currency,
  today,
  customerEmail,
}: {
  projectId: string;
  name: string;
  amount: number | null;
  category: string;
  currency: string;
  today: string;
  customerEmail: string | null;
}) {
  const lang = useLang();
  const t = translator(lang);
  const [invoice, setInvoice] = useState(true);
  const [paid, setPaid] = useState(false);
  const [send, setSend] = useState(Boolean(customerEmail));
  const result = !invoice
    ? t('The amount goes into income right away.', 'Iznos odmah ulazi u prihode.')
    : paid
      ? t('An invoice marked as paid is created, and the amount goes into income.', 'Pravi se račun označen kao plaćen, a iznos ulazi u prihode.')
      : t('An issued invoice is created; the amount goes into income once you mark it as paid.', 'Pravi se izdat račun; iznos ulazi u prihode kad ga označiš kao plaćen.');
  return (
    <form action={completeProject} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={projectId} />
      <div>
        <label className="form-label" htmlFor="done-amount">
          {t('Amount', 'Iznos')} ({currency})
        </label>
        <input
          className="form-input text-lg font-semibold tabular-nums"
          id="done-amount"
          name="amount"
          inputMode="decimal"
          pattern="[0-9]+([.,][0-9]{1,2})?"
          defaultValue={amount ?? ''}
          placeholder="0.00"
          required
          autoFocus
        />
      </div>
      <div>
        <label className="form-label" htmlFor="done-date">
          {t('Date', 'Datum')}
        </label>
        <input className="form-input" type="date" id="done-date" name="date" defaultValue={today} required />
      </div>
      <div className="sm:col-span-2">
        <label className="form-label" htmlFor="done-desc">
          {t('Description', 'Opis')} {invoice && <span className="font-normal text-muted">({t('invoice line, in English', 'stavka na računu, na engleskom')})</span>}
        </label>
        <input className="form-input" id="done-desc" name="description" defaultValue={name} maxLength={500} />
      </div>
      <div className="sm:col-span-2">
        <label className="form-label" htmlFor="done-cat">
          {t('Income type', 'Vrsta prihoda')}
        </label>
        <select className="form-input" id="done-cat" name="category" defaultValue={category}>
          {Object.entries(INCOME_CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>
              {v[lang]}
            </option>
          ))}
        </select>
      </div>
      <fieldset className="space-y-2.5 rounded-xl bg-zinc-50 p-4 ring-1 ring-line sm:col-span-2">
        <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] font-medium text-ink">
          <input type="checkbox" name="invoice" checked={invoice} onChange={(e) => setInvoice(e.target.checked)} className="size-4 accent-ink" />
          {t('Issue an invoice', 'Izdaj račun')}
        </label>
        {invoice && (
          <>
            <label className="flex cursor-pointer items-center gap-2.5 ps-6 text-[13px] text-zinc-700">
              <input type="checkbox" name="send" checked={send} disabled={!customerEmail} onChange={(e) => setSend(e.target.checked)} className="size-4 accent-ink" />
              {customerEmail
                ? t(`Email it to the customer (${customerEmail})`, `Pošalji ga klijentu emailom (${customerEmail})`)
                : t('The customer has no email, so the invoice is not sent', 'Klijent nema email, račun se ne šalje')}
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 ps-6 text-[13px] text-zinc-700">
              <input type="checkbox" name="paid" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="size-4 accent-ink" />
              {t('Already paid', 'Već je plaćeno')}
            </label>
          </>
        )}
        <p className="pt-1 text-xs text-muted">{result}</p>
      </fieldset>
      <div className="flex justify-end border-t border-line pt-4 sm:col-span-2">
        <button className="btn btn-primary" type="submit">
          {t('Complete project', 'Završi projekat')}
        </button>
      </div>
    </form>
  );
}
