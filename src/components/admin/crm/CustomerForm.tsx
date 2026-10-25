import { saveCustomer } from '@/app/(admin)/admin/(panel)/crm/actions';
import { SERVICES } from '@/lib/admin/crm/labels';
import type { Customer } from '@/lib/admin/crm/types';

const fields: { name: keyof Customer; label: string; type?: string; placeholder?: string; wide?: boolean }[] = [
  { name: 'contact_name', label: 'Ime i prezime', placeholder: 'Mike Turner' },
  { name: 'company', label: 'Firma (opciono)', placeholder: 'Turner Tree Care' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Telefon' },
  { name: 'website', label: 'Sajt', placeholder: 'firma.com' },
  { name: 'industry', label: 'Delatnost', placeholder: 'Tree service' },
  { name: 'address', label: 'Adresa', wide: true },
  { name: 'city', label: 'Grad' },
  { name: 'country', label: 'Država', placeholder: 'USA' },
];

export function CustomerForm({ customer }: { customer?: Customer }) {
  return (
    <form action={saveCustomer} className="space-y-4">
      {customer && <input type="hidden" name="id" value={customer.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.wide ? 'sm:col-span-2' : undefined}>
            <label className="form-label" htmlFor={f.name}>{f.label}</label>
            <input
              className="form-input"
              id={f.name}
              name={f.name}
              type={f.type ?? 'text'}
              defaultValue={(customer?.[f.name] as string | null) ?? ''}
              placeholder={f.placeholder}
              required={f.name === 'contact_name'}
            />
          </div>
        ))}
        <fieldset className="sm:col-span-2">
          <legend className="form-label">Usluge</legend>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SERVICES).map(([key, label]) => (
              <label
                key={key}
                className="cursor-pointer rounded-full border border-line px-3.5 py-1.5 text-[13px] text-zinc-600 transition select-none hover:border-zinc-300 has-checked:border-ink has-checked:bg-ink has-checked:text-white"
              >
                <input type="checkbox" name="services" value={key} defaultChecked={customer?.services?.includes(key)} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className="form-label" htmlFor="status">Status</label>
          <select className="form-input" id="status" name="status" defaultValue={customer?.status ?? 'active'}>
            <option value="active">Aktivan</option>
            <option value="inactive">Neaktivan</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="notes">Beleške</label>
          <textarea className="form-input" id="notes" name="notes" rows={3} defaultValue={customer?.notes ?? ''} />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">{customer ? 'Sačuvaj' : 'Dodaj klijenta'}</button>
    </form>
  );
}
