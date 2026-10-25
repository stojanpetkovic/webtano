import { saveDeal } from '@/app/(admin)/admin/(panel)/crm/actions';
import { STAGES, dealServices } from '@/lib/admin/crm/labels';
import { ServiceChoices } from './ServiceChoices';
import type { Deal } from '@/lib/admin/crm/types';

/** Create or edit a deal. Plain form posting to a server action. */
export function DealForm({ deal }: { deal?: Deal }) {
  return (
    <form action={saveDeal} className="space-y-4">
      {deal && <input type="hidden" name="id" value={deal.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <ServiceChoices selected={deal ? dealServices(deal) : []} hint="Izaberi jednu ili više." />
        <div>
          <label className="form-label" htmlFor="name">Ime i prezime</label>
          <input className="form-input" id="name" name="name" defaultValue={deal?.name} required />
        </div>
        <div>
          <label className="form-label" htmlFor="company">Firma</label>
          <input className="form-input" id="company" name="company" defaultValue={deal?.company ?? ''} placeholder="Tree service in Tampa" />
        </div>
        <div>
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-input" id="email" name="email" type="email" defaultValue={deal?.email ?? ''} />
        </div>
        <div>
          <label className="form-label" htmlFor="phone">Telefon</label>
          <input className="form-input" id="phone" name="phone" defaultValue={deal?.phone ?? ''} />
        </div>
        <div>
          <label className="form-label" htmlFor="website">Sajt</label>
          <input className="form-input" id="website" name="website" defaultValue={deal?.website ?? ''} placeholder="firma.com" />
        </div>
        <div>
          <label className="form-label" htmlFor="source">Izvor</label>
          <input className="form-input" id="source" name="source" defaultValue={deal?.source ?? ''} placeholder="Preporuka, LinkedIn…" />
        </div>
        <div>
          <label className="form-label" htmlFor="value">Procena vrednosti (USD)</label>
          <input className="form-input" id="value" name="value" type="number" min="0" step="1" defaultValue={deal ? Number(deal.value) : ''} />
        </div>
        <div>
          <label className="form-label" htmlFor="stage">Faza</label>
          <select className="form-input" id="stage" name="stage" defaultValue={deal?.stage ?? 'new'}>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="next_step_at">Rok za sledeći korak</label>
          <input className="form-input" id="next_step_at" name="next_step_at" type="date" defaultValue={deal?.next_step_at ?? ''} />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="next_step">Sledeći korak</label>
          <input className="form-input" id="next_step" name="next_step" defaultValue={deal?.next_step ?? ''} placeholder="Pozvati i dogovoriti besplatnu proveru sajta" />
        </div>
        {deal?.stage === 'lost' && (
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="lost_reason">Zašto je izgubljen</label>
            <input className="form-input" id="lost_reason" name="lost_reason" defaultValue={deal.lost_reason ?? ''} />
          </div>
        )}
      </div>
      <button className="btn btn-primary" type="submit">{deal ? 'Sačuvaj' : 'Dodaj lid'}</button>
    </form>
  );
}
