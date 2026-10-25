import { saveProject } from '@/app/(admin)/admin/(panel)/crm/actions';
import { PROJECT_STATUS, customerName } from '@/lib/admin/crm/labels';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { CustomerOption, Project } from '@/lib/admin/crm/types';
import { ServiceChoices } from './ServiceChoices';

export async function ProjectForm({ project, customers, customerId }: { project?: Project; customers: CustomerOption[]; customerId?: string }) {
  const { lang, t } = await getAdminI18n();
  return (
    <form action={saveProject} className="space-y-4">
      {project && <input type="hidden" name="id" value={project.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="name">
            {t('Project name', 'Naziv projekta')}
          </label>
          <input className="form-input" id="name" name="name" required defaultValue={project?.name ?? ''} placeholder={t('New website for Turner Tree Care', 'Novi sajt za Turner Tree Care')} />
        </div>
        <ServiceChoices selected={project?.services} legend={t('Services in the project', 'Usluge u projektu')} hint={t('Pick one or more.', 'Izaberi jednu ili više.')} />
        <div>
          <label className="form-label" htmlFor="customer_id">
            {t('Customer', 'Klijent')}
          </label>
          <select className="form-input" id="customer_id" name="customer_id" defaultValue={project?.customer_id ?? customerId ?? ''}>
            <option value="">—</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{customerName(c, lang)}{c.company && c.contact_name ? ` · ${c.company}` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="status">Status</label>
          <select className="form-input" id="status" name="status" defaultValue={project?.status ?? 'not_started'}>
            {Object.entries(PROJECT_STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label[lang]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="start_date">
            {t('Start', 'Početak')}
          </label>
          <input className="form-input" id="start_date" name="start_date" type="date" defaultValue={project?.start_date ?? ''} />
        </div>
        <div>
          <label className="form-label" htmlFor="deadline">
            {t('Deadline', 'Rok')}
          </label>
          <input className="form-input" id="deadline" name="deadline" type="date" defaultValue={project?.deadline ?? ''} />
        </div>
        <div>
          <label className="form-label" htmlFor="budget">
            {t('Budget (USD)', 'Budžet (USD)')}
          </label>
          <input className="form-input" id="budget" name="budget" type="number" min="0" step="1" defaultValue={project?.budget ?? ''} />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="description">
            {t('Description', 'Opis')}
          </label>
          <textarea className="form-input" id="description" name="description" rows={3} defaultValue={project?.description ?? ''} />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">{project ? t('Save', 'Sačuvaj') : t('Create project', 'Napravi projekat')}</button>
    </form>
  );
}
