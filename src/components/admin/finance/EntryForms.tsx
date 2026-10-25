import { saveExpense, saveIncome } from '@/app/(admin)/admin/(panel)/finance/actions';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/admin/finance/labels';
import type { Expense, Income } from '@/lib/admin/finance/types';

export interface Option {
  id: string;
  label: string;
}

function Footer({ label }: { label: string }) {
  return (
    <div className="flex justify-end gap-2 border-t border-line pt-4 sm:col-span-2">
      <button className="btn btn-primary" type="submit">
        {label}
      </button>
    </div>
  );
}

function Amount({ value, currency, id }: { value?: number; currency: string; id: string }) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>
        Iznos ({currency})
      </label>
      <input
        className="form-input text-lg font-semibold tabular-nums"
        id={id}
        name="amount"
        inputMode="decimal"
        required
        pattern="[0-9]+([.,][0-9]{1,2})?"
        defaultValue={value ?? ''}
        placeholder="0.00"
        autoFocus
      />
    </div>
  );
}

/** Add or edit an income entry; it sits in a pop-up. */
export function IncomeForm({
  income,
  customers,
  projects,
  currency,
  today,
  returnTo,
}: {
  income?: Income;
  customers: Option[];
  projects: Option[];
  currency: string;
  today: string;
  returnTo: string;
}) {
  const p = income?.id ?? 'new';
  return (
    <form action={saveIncome} className="grid gap-4 sm:grid-cols-2">
      {income && <input type="hidden" name="id" value={income.id} />}
      <input type="hidden" name="return" value={returnTo} />
      <Amount value={income?.amount} currency={currency} id={`inc-amount-${p}`} />
      <div>
        <label className="form-label" htmlFor={`inc-date-${p}`}>
          Datum uplate
        </label>
        <input className="form-input" type="date" id={`inc-date-${p}`} name="date" required defaultValue={income?.date ?? today} />
      </div>
      <div>
        <label className="form-label" htmlFor={`inc-cat-${p}`}>
          Kategorija
        </label>
        <select className="form-input" id={`inc-cat-${p}`} name="category" defaultValue={income?.category ?? 'website'}>
          {Object.entries(INCOME_CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor={`inc-cust-${p}`}>
          Klijent
        </label>
        <select className="form-input" id={`inc-cust-${p}`} name="customer_id" defaultValue={income?.customer_id ?? ''}>
          <option value="">Bez klijenta</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="form-label" htmlFor={`inc-proj-${p}`}>
          Projekat <span className="font-normal text-muted">(nije obavezno)</span>
        </label>
        <select className="form-input" id={`inc-proj-${p}`} name="project_id" defaultValue={income?.project_id ?? ''}>
          <option value="">Bez projekta</option>
          {projects.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="form-label" htmlFor={`inc-desc-${p}`}>
          Opis
        </label>
        <input className="form-input" id={`inc-desc-${p}`} name="description" maxLength={500} defaultValue={income?.description ?? ''} placeholder="npr. Mesečno održavanje, oktobar" />
      </div>
      <Footer label={income ? 'Sačuvaj prihod' : 'Dodaj prihod'} />
    </form>
  );
}

/** Add or edit an expense; it sits in a pop-up. */
export function ExpenseForm({
  expense,
  projects,
  currency,
  today,
  returnTo,
}: {
  expense?: Expense;
  projects: Option[];
  currency: string;
  today: string;
  returnTo: string;
}) {
  const p = expense?.id ?? 'new';
  return (
    <form action={saveExpense} className="grid gap-4 sm:grid-cols-2">
      {expense && <input type="hidden" name="id" value={expense.id} />}
      <input type="hidden" name="return" value={returnTo} />
      <Amount value={expense?.amount} currency={currency} id={`exp-amount-${p}`} />
      <div>
        <label className="form-label" htmlFor={`exp-date-${p}`}>
          Datum
        </label>
        <input className="form-input" type="date" id={`exp-date-${p}`} name="date" required defaultValue={expense?.date ?? today} />
      </div>
      <div>
        <label className="form-label" htmlFor={`exp-cat-${p}`}>
          Kategorija
        </label>
        <select className="form-input" id={`exp-cat-${p}`} name="category" defaultValue={expense?.category ?? 'software'}>
          <optgroup label="Operativni troškovi (ulaze u EBITDA)">
            {Object.entries(EXPENSE_CATEGORIES)
              .filter(([, c]) => c.operating)
              .map(([k, c]) => (
                <option key={k} value={k}>
                  {c.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Ispod EBITDA">
            {Object.entries(EXPENSE_CATEGORIES)
              .filter(([, c]) => !c.operating)
              .map(([k, c]) => (
                <option key={k} value={k}>
                  {c.label}
                </option>
              ))}
          </optgroup>
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor={`exp-vendor-${p}`}>
          Dobavljač
        </label>
        <input className="form-input" id={`exp-vendor-${p}`} name="vendor" maxLength={200} defaultValue={expense?.vendor ?? ''} placeholder="npr. Railway, Google, Figma" />
      </div>
      <div className="sm:col-span-2">
        <label className="form-label" htmlFor={`exp-desc-${p}`}>
          Opis
        </label>
        <input className="form-input" id={`exp-desc-${p}`} name="description" maxLength={500} defaultValue={expense?.description ?? ''} />
      </div>
      <div>
        <label className="form-label" htmlFor={`exp-proj-${p}`}>
          Projekat <span className="font-normal text-muted">(nije obavezno)</span>
        </label>
        <select className="form-input" id={`exp-proj-${p}`} name="project_id" defaultValue={expense?.project_id ?? ''}>
          <option value="">Opšti trošak</option>
          {projects.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 self-end pb-2.5 text-[13px] text-zinc-700">
        <input type="checkbox" name="recurring" defaultChecked={expense?.recurring} className="size-4 accent-ink" />
        Mesečni trošak (pretplata)
      </label>
      <Footer label={expense ? 'Sačuvaj rashod' : 'Dodaj rashod'} />
    </form>
  );
}
