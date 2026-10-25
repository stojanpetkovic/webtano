import { saveCustomer } from '@/app/(admin)/admin/(panel)/crm/actions';
import { ServiceChoices } from './ServiceChoices';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { T } from '@/lib/i18n';
import type { Customer } from '@/lib/admin/crm/types';

const fields = (t: T): { name: keyof Customer; label: string; type?: string; placeholder?: string; wide?: boolean }[] => [
  { name: 'contact_name', label: t('Full name', 'Ime i prezime'), placeholder: 'Mike Turner' },
  { name: 'company', label: t('Company (optional)', 'Firma (opciono)'), placeholder: 'Turner Tree Care' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: t('Phone', 'Telefon') },
  { name: 'website', label: t('Website', 'Sajt'), placeholder: t('company.com', 'firma.com') },
  { name: 'industry', label: t('Industry', 'Delatnost'), placeholder: 'Tree service' },
  { name: 'address', label: t('Address', 'Adresa'), wide: true },
  { name: 'city', label: t('City', 'Grad') },
  { name: 'country', label: t('Country', 'Država'), placeholder: 'USA' },
];

export async function CustomerForm({ customer }: { customer?: Customer }) {
  const { t } = await getAdminI18n();
  return (
    <form action={saveCustomer} className="space-y-4">
      {customer && <input type="hidden" name="id" value={customer.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields(t).map((f) => (
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
        <ServiceChoices selected={customer?.services} />
        <div>
          <label className="form-label" htmlFor="status">Status</label>
          <select className="form-input" id="status" name="status" defaultValue={customer?.status ?? 'active'}>
            <option value="active">{t('Active', 'Aktivan')}</option>
            <option value="inactive">{t('Inactive', 'Neaktivan')}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="notes">
            {t('Notes', 'Beleške')}
          </label>
          <textarea className="form-input" id="notes" name="notes" rows={3} defaultValue={customer?.notes ?? ''} />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">{customer ? t('Save', 'Sačuvaj') : t('Add customer', 'Dodaj klijenta')}</button>
    </form>
  );
}
