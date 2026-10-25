import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, CircleAlert, Tags, Zap } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { db } from '@/lib/admin/supabase';
import { env } from '@/lib/admin/env';
import { toParams } from '@/lib/admin/params';
import { SETTINGS, appSettings, type Field, type Section } from '@/lib/admin/settings';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { L, Lang } from '@/lib/i18n';
import { saveSettings } from './actions';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Settings', 'Podešavanja') };
}

// What the database should have after every migration so far, checked by asking for one column.
const SCHEMA: { label: L; table: string; column: string; file: string }[] = [
  { label: { en: 'Settings', sr: 'Podešavanja' }, table: 'crm_settings', column: 'key', file: '20261025_crm_settings.sql' },
  { label: { en: 'Automation', sr: 'Automatizacija' }, table: 'crm_automations', column: 'key', file: '20261025_crm_automation.sql' },
  { label: { en: 'Send queue', sr: 'Red za slanje' }, table: 'crm_outbox', column: 'id', file: '20261025_crm_automation.sql' },
  { label: { en: 'Services on leads', sr: 'Usluge na lidovima' }, table: 'crm_deals', column: 'services', file: '20261025_crm_deal_services.sql' },
  { label: { en: 'Services on projects', sr: 'Usluge na projektima' }, table: 'crm_projects', column: 'services', file: '20261025_crm_project_services.sql' },
  { label: { en: 'Services on customers', sr: 'Usluge na klijentima' }, table: 'crm_customers', column: 'services', file: '20261025_crm_customer_services.sql' },
  { label: { en: 'Customer sites', sr: 'Sajtovi klijenata' }, table: 'crm_customer_sites', column: 'site_id', file: '20261025_crm_customer_sites.sql' },
  { label: { en: 'Price list', sr: 'Cenovnik' }, table: 'crm_items', column: 'slug', file: '20261025_crm_items_slug.sql' },
  { label: { en: 'Newsletter', sr: 'Newsletter' }, table: 'newsletter_subscribers', column: 'token', file: '20261025_newsletter.sql' },
  { label: { en: 'Finance', sr: 'Finansije' }, table: 'fin_invoices', column: 'number', file: '20261025_finance.sql' },
];

// Only whether each variable is set: values never reach the page.
const VARIABLES: { name: string; set: boolean; note: L }[] = [
  { name: 'SUPABASE_SECRET_KEY', set: Boolean(env.supabaseSecretKey), note: { en: 'Database', sr: 'Baza' } },
  { name: 'RESEND_API_KEY', set: Boolean(env.resendApiKey), note: { en: 'Sending email', sr: 'Slanje emailova' } },
  { name: 'LEADS_FROM_EMAIL', set: Boolean(env.leadsFromEmail), note: { en: 'Email sender', sr: 'Pošiljalac emailova' } },
  { name: 'OWNER_EMAIL', set: Boolean(env.ownerEmail), note: { en: 'Your notifications', sr: 'Tvoja obaveštenja' } },
  { name: 'CRON_SECRET', set: Boolean(env.cronSecret), note: { en: 'Cron key', sr: 'Ključ za cron' } },
  { name: 'IP_HASH_SALT', set: Boolean(env.ipHashSalt), note: { en: 'Counting visitors', sr: 'Brojanje posetilaca' } },
];

/** Short names for the section links at the top. */
const SHORT: Record<Section, L> = {
  company: { en: 'Company', sr: 'Firma' },
  proposals: { en: 'Proposals', sr: 'Ponude' },
  notifications: { en: 'Notifications', sr: 'Obaveštenja' },
  invoices: { en: 'Invoices', sr: 'Fakture' },
  tracking: { en: 'Tracking', sr: 'Praćenje' },
  newsletter: { en: 'Newsletter', sr: 'Newsletter' },
};

function Input({ section, field, value, lang }: { section: Section; field: Field; value: unknown; lang: Lang }) {
  const id = `${section}-${field.key}`;
  if (field.type === 'toggle')
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center gap-3 sm:col-span-2">
        <input id={id} name={field.key} type="checkbox" defaultChecked={Boolean(value)} className="size-4 accent-ink" />
        <span className="text-[13.5px] text-ink">{field.label[lang]}</span>
      </label>
    );
  const wide = field.type === 'textarea' || ('wide' in field && field.wide);
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <label className="form-label" htmlFor={id}>
        {field.label[lang]}
      </label>
      {field.type === 'textarea' ? (
        <textarea className="form-input" id={id} name={field.key} rows={field.key === 'terms' ? 6 : 3} defaultValue={String(value ?? '')} />
      ) : field.type === 'select' ? (
        <select className="form-input" id={id} name={field.key} defaultValue={String(value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label[lang]}
            </option>
          ))}
        </select>
      ) : field.type === 'number' ? (
        <div className="relative">
          <input
            className="form-input pe-14"
            id={id}
            name={field.key}
            type="number"
            min={field.min}
            max={field.max}
            step="1"
            defaultValue={Number(value)}
          />
          {field.suffix && (
            <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-[13px] text-zinc-400">{field.suffix[lang]}</span>
          )}
        </div>
      ) : (
        <input
          className="form-input"
          id={id}
          name={field.key}
          type={field.type}
          defaultValue={String(value ?? '')}
          placeholder={'placeholder' in field ? field.placeholder : undefined}
          pattern={'pattern' in field ? field.pattern : undefined}
        />
      )}
      {field.hint && <p className="form-hint">{field.hint[lang]}</p>}
    </div>
  );
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t } = await getAdminI18n();
  const query = toParams(await searchParams);
  const [settings, schema] = await Promise.all([
    appSettings(),
    Promise.all(SCHEMA.map(async (s) => ({ ...s, ok: !(await db().from(s.table).select(s.column).limit(1)).error }))),
  ]);
  const missing = schema.filter((s) => !s.ok);
  const todo = missing.length + VARIABLES.filter((v) => !v.set).length;
  const saved = query.get('saved');
  const failed = query.get('error');
  // Field keys that did not match their format, shown by their labels.
  const invalid = query
    .get('invalid')
    ?.split(',')
    .map((key) => Object.values(SETTINGS).flatMap((s) => s.fields as readonly Field[]).find((f) => f.key === key.trim())?.label[lang] ?? key.trim())
    .join(', ');

  return (
    <>
      <PageHeading
        title={t('Settings', 'Podešavanja')}
        crumbs={[{ label: t('System', 'Sistem') }]}
        description={t(
          'Company details, defaults for proposals and invoices, notifications and system status.',
          'Podaci firme, podrazumevane vrednosti za ponude i fakture, obaveštenja i stanje sistema.',
        )}
      >
        <nav className="segmented" aria-label={t('Sections', 'Sekcije')}>
          {(Object.keys(SETTINGS) as Section[]).map((key) => (
            <a key={key} href={`#${key}`}>
              {SHORT[key][lang]}
            </a>
          ))}
          <a href="#sistem">{t('System', 'Sistem')}</a>
        </nav>
      </PageHeading>

      {saved && saved in SETTINGS && (
        <div className="alert alert-success">
          {t('Saved', 'Sačuvano')}: {SETTINGS[saved as Section].title[lang]}.
        </div>
      )}
      {invalid && (
        <div className="alert alert-danger">
          {t('Not saved, check the format', 'Nije sačuvano, proveri format')}: {invalid}.
        </div>
      )}
      {failed && (
        <div className="alert alert-danger">
          {t(
            'Not saved. The crm_settings table does not exist in the database yet, see System status.',
            'Nije sačuvano. Tabela crm_settings još ne postoji u bazi, pogledaj Stanje sistema.',
          )}
        </div>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          {(Object.keys(SETTINGS) as Section[]).map((section) => {
            const s = SETTINGS[section];
            const values = settings[section] as Record<string, unknown>;
            return (
              <form key={section} id={section} action={saveSettings} className="card scroll-mt-24">
                <input type="hidden" name="section" value={section} />
                <div className="card-header flex-col items-start! gap-0.5">
                  <h2 className="card-title">{s.title[lang]}</h2>
                  <p className="text-[13px] text-muted">{s.description[lang]}</p>
                </div>
                <div className="card-body grid gap-4 sm:grid-cols-2">
                  {(s.fields as readonly Field[]).map((f) => (
                    <Input key={f.key} section={section} field={f} value={values[f.key]} lang={lang} />
                  ))}
                </div>
                <div className="flex justify-end border-t border-line px-5 py-3">
                  <button type="submit" className="btn btn-primary">
                    {t('Save', 'Sačuvaj')}
                  </button>
                </div>
              </form>
            );
          })}
        </div>

        <aside className="min-w-0 space-y-4 xl:sticky xl:top-24">
          <div id="sistem" className="card scroll-mt-24">
            <div className="card-header">
              <h2 className="card-title">{t('System status', 'Stanje sistema')}</h2>
              <span className={`text-xs font-medium ${todo ? 'text-amber-600' : 'text-emerald-600'}`}>
                {todo ? t(`${todo} to fix`, `${todo} za sređivanje`) : t('All good', 'Sve radi')}
              </span>
            </div>
            <div className="px-5 pt-4 text-[11px] font-medium tracking-wider text-zinc-400 uppercase">{t('Database', 'Baza')}</div>
            <ul className="divide-y divide-line">
              {schema.map((s) => (
                <li key={s.table + s.column} className="flex items-start gap-2.5 px-5 py-2.5 text-[13px]">
                  {s.ok ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  ) : (
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  )}
                  <div className="min-w-0">
                    <div className="text-ink">{s.label[lang]}</div>
                    {!s.ok && <div className="mt-0.5 text-xs break-all text-muted">{t('Run the SQL from', 'Pokreni SQL iz')} supabase/migrations/{s.file}</div>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 pt-4 text-[11px] font-medium tracking-wider text-zinc-400 uppercase">{t('Railway variables', 'Railway varijable')}</div>
            <ul className="divide-y divide-line">
              {VARIABLES.map((v) => (
                <li key={v.name} className="flex items-start gap-2.5 px-5 py-2.5 text-[13px]">
                  {v.set ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  ) : (
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  )}
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-ink">{v.name}</div>
                    <div className="text-xs text-muted">
                      {v.note[lang]}
                      {!v.set && t(', not set', ', nije podešena')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">
              {t(
                'Keys are not stored here. Change them in Railway, under Variables, and locally in .env.local.',
                'Ključevi se ne čuvaju ovde. Menjaju se u Railway-u, u Variables, a lokalno u .env.local.',
              )}
            </p>
          </div>

          <div className="card divide-y divide-line">
            <Link href="/admin/crm/automations" className="flex items-center gap-3 px-5 py-3.5 text-[13.5px] text-ink transition hover:bg-zinc-50">
              <Zap className="size-4 text-zinc-400" /> {t('Automation: jobs and approvals', 'Automatizacija: poslovi i odobrenja')}
            </Link>
            <Link href="/admin/crm/items" className="flex items-center gap-3 px-5 py-3.5 text-[13.5px] text-ink transition hover:bg-zinc-50">
              <Tags className="size-4 text-zinc-400" /> {t('Price list: items and prices on the site', 'Cenovnik: stavke i cene na sajtu')}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
