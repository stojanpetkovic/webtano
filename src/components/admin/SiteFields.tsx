import { TIMEZONES } from '@/lib/admin/siteForm';
import type { Site } from '@/lib/admin/types';

export function SiteFields({ site = {}, showActive = false }: { site?: Partial<Site>; showActive?: boolean }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="form-label" htmlFor="name">Naziv sajta</label>
        <input className="form-input" id="name" name="name" required defaultValue={site.name ?? ''} placeholder="Valena Apartmani" />
      </div>
      <div>
        <label className="form-label" htmlFor="domain">Domen</label>
        <input className="form-input" id="domain" name="domain" required defaultValue={site.domain ?? ''} placeholder="valenaapartmani.com" />
        <p className="form-hint">Forme se primaju samo sa ovog domena i njegovih poddomena.</p>
      </div>
      <div>
        <label className="form-label" htmlFor="client_name">Klijent</label>
        <input className="form-input" id="client_name" name="client_name" defaultValue={site.client_name ?? ''} placeholder="Ime i prezime ili firma" />
      </div>
      <div>
        <label className="form-label" htmlFor="client_emails">Emailovi klijenta</label>
        <input
          className="form-input"
          id="client_emails"
          name="client_emails"
          defaultValue={(site.client_emails ?? []).join(', ')}
          placeholder="vlasnik@firma.com, prodaja@firma.com"
        />
        <p className="form-hint">Svaki lid ide na sve ove adrese. Odvoji zarezom.</p>
      </div>
      <div>
        <label className="form-label" htmlFor="email_language">Jezik emaila klijentu</label>
        <select className="form-input" id="email_language" name="email_language" defaultValue={site.email_language === 'en' ? 'en' : 'sr'}>
          <option value="sr">Srpski</option>
          <option value="en">Engleski</option>
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="timezone">Vremenska zona klijenta</label>
        <select className="form-input" id="timezone" name="timezone" defaultValue={site.timezone ?? 'Europe/Belgrade'}>
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2 flex flex-col gap-2">
        <label className="inline-flex items-center gap-2 text-[13px] text-zinc-700">
          <input type="checkbox" name="notify_owner" defaultChecked={site.notify_owner ?? true} className="size-4 accent-primary" />
          Pošalji kopiju i meni
        </label>
        {showActive && (
          <label className="inline-flex items-center gap-2 text-[13px] text-zinc-700">
            <input type="hidden" name="active" value="off" />
            <input type="checkbox" name="active" defaultChecked={site.active ?? true} className="size-4 accent-primary" />
            Sajt je aktivan (prima lidove)
          </label>
        )}
      </div>
    </div>
  );
}
