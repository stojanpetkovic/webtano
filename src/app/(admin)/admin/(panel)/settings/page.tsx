import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, CircleAlert, Tags, Zap } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { db } from '@/lib/admin/supabase';
import { env } from '@/lib/admin/env';
import { toParams } from '@/lib/admin/params';
import { SETTINGS, appSettings, type Field, type Section } from '@/lib/admin/settings';
import { saveSettings } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Podešavanja' };

// What the database should have after every migration so far, checked by asking for one column.
const SCHEMA: { label: string; table: string; column: string; file: string }[] = [
  { label: 'Podešavanja', table: 'crm_settings', column: 'key', file: '20261025_crm_settings.sql' },
  { label: 'Automatizacija', table: 'crm_automations', column: 'key', file: '20261025_crm_automation.sql' },
  { label: 'Red za slanje', table: 'crm_outbox', column: 'id', file: '20261025_crm_automation.sql' },
  { label: 'Usluge na lidovima', table: 'crm_deals', column: 'services', file: '20261025_crm_deal_services.sql' },
  { label: 'Usluge na projektima', table: 'crm_projects', column: 'services', file: '20261025_crm_project_services.sql' },
  { label: 'Usluge na klijentima', table: 'crm_customers', column: 'services', file: '20261025_crm_customer_services.sql' },
  { label: 'Sajtovi klijenata', table: 'crm_customer_sites', column: 'site_id', file: '20261025_crm_customer_sites.sql' },
  { label: 'Cenovnik', table: 'crm_items', column: 'slug', file: '20261025_crm_items_slug.sql' },
];

// Only whether each variable is set: values never reach the page.
const VARIABLES: { name: string; set: boolean; note: string }[] = [
  { name: 'SUPABASE_SECRET_KEY', set: Boolean(env.supabaseSecretKey), note: 'Baza' },
  { name: 'RESEND_API_KEY', set: Boolean(env.resendApiKey), note: 'Slanje emailova' },
  { name: 'LEADS_FROM_EMAIL', set: Boolean(env.leadsFromEmail), note: 'Pošiljalac emailova' },
  { name: 'OWNER_EMAIL', set: Boolean(env.ownerEmail), note: 'Tvoja obaveštenja' },
  { name: 'CRON_SECRET', set: Boolean(env.cronSecret), note: 'Ključ za cron' },
  { name: 'IP_HASH_SALT', set: Boolean(env.ipHashSalt), note: 'Brojanje posetilaca' },
];

function Input({ section, field, value }: { section: Section; field: Field; value: unknown }) {
  const id = `${section}-${field.key}`;
  if (field.type === 'toggle')
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center gap-3 sm:col-span-2">
        <input id={id} name={field.key} type="checkbox" defaultChecked={Boolean(value)} className="size-4 accent-ink" />
        <span className="text-[13.5px] text-ink">{field.label}</span>
      </label>
    );
  const wide = field.type === 'textarea' || ('wide' in field && field.wide);
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <label className="form-label" htmlFor={id}>
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea className="form-input" id={id} name={field.key} rows={field.key === 'terms' ? 6 : 3} defaultValue={String(value ?? '')} />
      ) : field.type === 'select' ? (
        <select className="form-input" id={id} name={field.key} defaultValue={String(value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
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
            <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-[13px] text-zinc-400">{field.suffix}</span>
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
        />
      )}
      {field.hint && <p className="form-hint">{field.hint}</p>}
    </div>
  );
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const [settings, schema] = await Promise.all([
    appSettings(),
    Promise.all(SCHEMA.map(async (s) => ({ ...s, ok: !(await db().from(s.table).select(s.column).limit(1)).error }))),
  ]);
  const missing = schema.filter((s) => !s.ok);
  const todo = missing.length + VARIABLES.filter((v) => !v.set).length;
  const saved = query.get('saved');
  const failed = query.get('error');

  return (
    <>
      <PageHeading
        title="Podešavanja"
        crumbs={[{ label: 'Sistem' }]}
        description="Podaci firme, podrazumevane vrednosti za ponude i fakture, obaveštenja i stanje sistema."
      >
        <nav className="segmented" aria-label="Sekcije">
          {Object.entries(SETTINGS).map(([key, s]) => (
            <a key={key} href={`#${key}`}>
              {s.title.split(' ')[0]}
            </a>
          ))}
          <a href="#sistem">Sistem</a>
        </nav>
      </PageHeading>

      {saved && saved in SETTINGS && <div className="alert alert-success">Sačuvano: {SETTINGS[saved as Section].title}.</div>}
      {failed && <div className="alert alert-danger">Nije sačuvano. Tabela crm_settings još ne postoji u bazi, pogledaj Stanje sistema.</div>}

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          {(Object.keys(SETTINGS) as Section[]).map((section) => {
            const s = SETTINGS[section];
            const values = settings[section] as Record<string, unknown>;
            return (
              <form key={section} id={section} action={saveSettings} className="card scroll-mt-24">
                <input type="hidden" name="section" value={section} />
                <div className="card-header flex-col items-start! gap-0.5">
                  <h2 className="card-title">{s.title}</h2>
                  <p className="text-[13px] text-muted">{s.description}</p>
                </div>
                <div className="card-body grid gap-4 sm:grid-cols-2">
                  {(s.fields as readonly Field[]).map((f) => (
                    <Input key={f.key} section={section} field={f} value={values[f.key]} />
                  ))}
                </div>
                <div className="flex justify-end border-t border-line px-5 py-3">
                  <button type="submit" className="btn btn-primary">
                    Sačuvaj
                  </button>
                </div>
              </form>
            );
          })}
        </div>

        <aside className="min-w-0 space-y-4 xl:sticky xl:top-24">
          <div id="sistem" className="card scroll-mt-24">
            <div className="card-header">
              <h2 className="card-title">Stanje sistema</h2>
              <span className={`text-xs font-medium ${todo ? 'text-amber-600' : 'text-emerald-600'}`}>
                {todo ? `${todo} za sređivanje` : 'Sve radi'}
              </span>
            </div>
            <div className="px-5 pt-4 text-[11px] font-medium tracking-wider text-zinc-400 uppercase">Baza</div>
            <ul className="divide-y divide-line">
              {schema.map((s) => (
                <li key={s.label} className="flex items-start gap-2.5 px-5 py-2.5 text-[13px]">
                  {s.ok ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  ) : (
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  )}
                  <div className="min-w-0">
                    <div className="text-ink">{s.label}</div>
                    {!s.ok && <div className="mt-0.5 text-xs break-all text-muted">Pokreni SQL iz supabase/migrations/{s.file}</div>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 pt-4 text-[11px] font-medium tracking-wider text-zinc-400 uppercase">Railway varijable</div>
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
                      {v.note}
                      {!v.set && ', nije podešena'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">
              Ključevi se ne čuvaju ovde. Menjaju se u Railway-u, u Variables, a lokalno u .env.local.
            </p>
          </div>

          <div className="card divide-y divide-line">
            <Link href="/admin/crm/automations" className="flex items-center gap-3 px-5 py-3.5 text-[13.5px] text-ink transition hover:bg-zinc-50">
              <Zap className="size-4 text-zinc-400" /> Automatizacija: poslovi i odobrenja
            </Link>
            <Link href="/admin/crm/items" className="flex items-center gap-3 px-5 py-3.5 text-[13.5px] text-ink transition hover:bg-zinc-50">
              <Tags className="size-4 text-zinc-400" /> Cenovnik: stavke i cene na sajtu
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
