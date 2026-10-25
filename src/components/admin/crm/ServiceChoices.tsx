import { SERVICES } from '@/lib/admin/crm/labels';
import { getAdminI18n } from '@/lib/admin/i18n';

/** The SERVICES as pill checkboxes, sent as one `services` value per checked pill. */
export async function ServiceChoices({ selected, legend, hint }: { selected?: string[] | null; legend?: string; hint?: string }) {
  const { lang, t } = await getAdminI18n();
  return (
    <fieldset className="sm:col-span-2">
      <legend className="form-label">{legend ?? t('Services', 'Usluge')}</legend>
      <div className="flex flex-wrap gap-2">
        {Object.entries(SERVICES).map(([key, label]) => (
          <label
            key={key}
            className="cursor-pointer rounded-full border border-line px-3.5 py-1.5 text-[13px] text-zinc-600 transition select-none hover:border-zinc-300 has-checked:border-ink has-checked:bg-ink has-checked:text-white"
          >
            <input type="checkbox" name="services" value={key} defaultChecked={selected?.includes(key)} className="sr-only" />
            {label[lang]}
          </label>
        ))}
      </div>
      {hint && <p className="form-hint">{hint}</p>}
    </fieldset>
  );
}
