import { TIMEZONES } from '@/lib/admin/siteForm';
import type { Site } from '@/lib/admin/types';
import { useLang } from '@/components/i18n/LangProvider';
import { translator } from '@/lib/i18n';

export function SiteFields({ site = {}, showActive = false, idPrefix = '' }: { site?: Partial<Site>; showActive?: boolean; idPrefix?: string }) {
  const lang = useLang();
  const t = translator(lang);
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="form-label" htmlFor={`${idPrefix}name`}>
          {t('Site name', 'Naziv sajta')}
        </label>
        <input className="form-input" id={`${idPrefix}name`} name="name" required defaultValue={site.name ?? ''} placeholder="Valena Apartmani" />
      </div>
      <div>
        <label className="form-label" htmlFor={`${idPrefix}domain`}>
          {t('Domain', 'Domen')}
        </label>
        <input className="form-input" id={`${idPrefix}domain`} name="domain" required defaultValue={site.domain ?? ''} placeholder="valenaapartmani.com" />
        <p className="form-hint">{t('Forms are accepted only from this domain and its subdomains.', 'Forme se primaju samo sa ovog domena i njegovih poddomena.')}</p>
      </div>
      <div>
        <label className="form-label" htmlFor={`${idPrefix}client_name`}>
          {t('Client', 'Klijent')}
        </label>
        <input className="form-input" id={`${idPrefix}client_name`} name="client_name" defaultValue={site.client_name ?? ''} placeholder={t('Full name or company', 'Ime i prezime ili firma')} />
      </div>
      <div>
        <label className="form-label" htmlFor={`${idPrefix}client_emails`}>
          {t('Client emails', 'Emailovi klijenta')}
        </label>
        <input
          className="form-input"
          id={`${idPrefix}client_emails`}
          name="client_emails"
          defaultValue={(site.client_emails ?? []).join(', ')}
          placeholder={t('owner@company.com, sales@company.com', 'vlasnik@firma.com, prodaja@firma.com')}
        />
        <p className="form-hint">{t('Every lead goes to all of these addresses. Separate with commas.', 'Svaki lid ide na sve ove adrese. Odvoji zarezom.')}</p>
      </div>
      <div>
        <label className="form-label" htmlFor={`${idPrefix}email_language`}>
          {t('Language of the client email', 'Jezik emaila klijentu')}
        </label>
        <select className="form-input" id={`${idPrefix}email_language`} name="email_language" defaultValue={site.email_language === 'en' ? 'en' : 'sr'}>
          <option value="sr">{t('Serbian', 'Srpski')}</option>
          <option value="en">{t('English', 'Engleski')}</option>
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor={`${idPrefix}timezone`}>
          {t('Client time zone', 'Vremenska zona klijenta')}
        </label>
        <select className="form-input" id={`${idPrefix}timezone`} name="timezone" defaultValue={site.timezone ?? 'Europe/Belgrade'}>
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label[lang]}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2 flex flex-col gap-2">
        <label className="inline-flex items-center gap-2 text-[13px] text-zinc-700">
          <input type="checkbox" name="notify_owner" defaultChecked={site.notify_owner ?? true} className="size-4 accent-primary" />
          {t('Send a copy to me too', 'Pošalji kopiju i meni')}
        </label>
        {showActive && (
          <label className="inline-flex items-center gap-2 text-[13px] text-zinc-700">
            <input type="hidden" name="active" value="off" />
            <input type="checkbox" name="active" defaultChecked={site.active ?? true} className="size-4 accent-primary" />
            {t('Site is active (receives leads)', 'Sajt je aktivan (prima lidove)')}
          </label>
        )}
      </div>
    </div>
  );
}
