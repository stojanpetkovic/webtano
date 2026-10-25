import { db } from './supabase';
import { env } from './env';
import { DEFAULT_INTRO, DEFAULT_TERMS } from './crm/priceList';

type Field =
  | { key: string; label: string; type: 'text' | 'email' | 'url' | 'textarea'; hint?: string; placeholder?: string; wide?: boolean }
  | { key: string; label: string; type: 'number'; min: number; max: number; hint?: string; suffix?: string }
  | { key: string; label: string; type: 'select'; options: { value: string; label: string }[]; hint?: string }
  | { key: string; label: string; type: 'toggle'; hint?: string };

/**
 * Everything that can be changed under Podešavanja, by section. The form and the
 * save action are both built from this list, so a new setting is one entry here.
 * Secrets (API keys, CRON_SECRET) never live here: they stay in Railway variables.
 */
export const SETTINGS = {
  company: {
    title: 'Firma',
    description: 'Ime i kontakt koji vide klijenti na ponudama, a kasnije i na fakturama.',
    fields: [
      { key: 'name', label: 'Naziv', type: 'text', placeholder: 'WebTano' },
      { key: 'tagline', label: 'Opis ispod naziva', type: 'text', placeholder: 'Websites, Local SEO and Google Ads' },
      { key: 'website', label: 'Sajt', type: 'text', placeholder: 'webtano.com' },
      {
        key: 'email',
        label: 'Email za klijente',
        type: 'email',
        placeholder: 'hello@webtano.com',
        hint: 'Prikazuje se na ponudi. Prazno znači da se ne prikazuje.',
      },
      { key: 'phone', label: 'Telefon', type: 'text', placeholder: '+1 …' },
      { key: 'legal_name', label: 'Pravni naziv', type: 'text', hint: 'Za fakture. Prazno dok ne odlučiš ko ih izdaje.' },
      { key: 'address', label: 'Adresa', type: 'textarea', wide: true },
      { key: 'tax_id', label: 'PIB ili EIN', type: 'text' },
      { key: 'reg_no', label: 'Matični broj', type: 'text' },
    ],
  },
  proposals: {
    title: 'Ponude',
    description: 'Šta nova ponuda dobija unapred. Svaku ponudu i dalje menjaš pojedinačno.',
    fields: [
      { key: 'valid_days', label: 'Važi dana', type: 'number', min: 1, max: 90, suffix: 'dana' },
      {
        key: 'currency',
        label: 'Valuta',
        type: 'select',
        options: [
          { value: 'USD', label: 'USD, američki dolar' },
          { value: 'EUR', label: 'EUR, evro' },
          { value: 'RSD', label: 'RSD, dinar' },
        ],
      },
      { key: 'intro', label: 'Uvodni tekst', type: 'textarea', wide: true, hint: 'Na engleskom, klijent ga vidi u PDF-u.' },
      { key: 'terms', label: 'Uslovi, jedan po redu', type: 'textarea', wide: true },
    ],
  },
  notifications: {
    title: 'Obaveštenja i automatizacija',
    description: 'Kome i kada stižu automatski emailovi. Same poslove uključuješ na stranici Automatizacija.',
    fields: [
      { key: 'owner_email', label: 'Email za obaveštenja', type: 'email', hint: 'Prazno znači OWNER_EMAIL iz Railway varijabli.' },
      {
        key: 'timezone',
        label: 'Tvoja vremenska zona',
        type: 'select',
        options: [
          { value: 'Europe/Belgrade', label: 'Beograd' },
          { value: 'America/New_York', label: 'Njujork' },
          { value: 'America/Chicago', label: 'Čikago' },
          { value: 'America/Los_Angeles', label: 'Los Anđeles' },
        ],
      },
      {
        key: 'digest_hour',
        label: 'Jutarnji pregled stiže od',
        type: 'number',
        min: 5,
        max: 12,
        suffix: 'h',
        hint: 'Šalje se u prva tri sata od ovog vremena.',
      },
      { key: 'digest_weekends', label: 'Jutarnji pregled i vikendom', type: 'toggle' },
      { key: 'unanswered_hours', label: 'Lid bez odgovora posle', type: 'number', min: 1, max: 168, suffix: 'sati' },
      {
        key: 'unanswered_days',
        label: 'Gledaju se lidovi do',
        type: 'number',
        min: 1,
        max: 60,
        suffix: 'dana',
        hint: 'Stariji lidovi ne šalju upozorenje.',
      },
    ],
  },
  invoices: {
    title: 'Fakture',
    description: 'Koristi se kad stignu pretplate i fakture (faza 3). Možeš da popuniš unapred.',
    fields: [
      { key: 'due_days', label: 'Rok plaćanja', type: 'number', min: 0, max: 60, suffix: 'dana' },
      { key: 'prefix', label: 'Prefiks broja', type: 'text', placeholder: 'WT-', hint: 'Faktura dobija broj kao WT-0001.' },
      { key: 'payment_details', label: 'Instrukcije za uplatu', type: 'textarea', wide: true, hint: 'Račun, Wise, Zelle… Ide na svaku fakturu.' },
      { key: 'note', label: 'Napomena na fakturi', type: 'textarea', wide: true },
    ],
  },
} as const satisfies Record<string, { title: string; description: string; fields: readonly Field[] }>;

export type Section = keyof typeof SETTINGS;

const DEFAULTS = {
  company: {
    name: 'WebTano',
    tagline: 'Websites, Local SEO and Google Ads',
    website: 'webtano.com',
    email: '',
    phone: '',
    legal_name: '',
    address: '',
    tax_id: '',
    reg_no: '',
  },
  proposals: { valid_days: 14, currency: 'USD', intro: DEFAULT_INTRO, terms: DEFAULT_TERMS },
  notifications: { owner_email: '', timezone: 'Europe/Belgrade', digest_hour: 8, digest_weekends: false, unanswered_hours: 24, unanswered_days: 7 },
  invoices: { due_days: 7, prefix: 'WT-', payment_details: '', note: '' },
};

export type AppSettings = typeof DEFAULTS;

/** All settings, saved values over the defaults. Works before the table exists. */
export async function appSettings(): Promise<AppSettings> {
  const { data, error } = await db().from('crm_settings').select('key, value');
  const saved = new Map(error ? [] : ((data ?? []) as { key: string; value: Record<string, unknown> }[]).map((r) => [r.key, r.value]));
  return Object.fromEntries(
    Object.entries(DEFAULTS).map(([section, defaults]) => {
      const values = saved.get(section) ?? {};
      // Only keys the defaults know, with the defaults' types.
      const merged = Object.fromEntries(Object.entries(defaults).map(([k, d]) => [k, typeof values[k] === typeof d ? values[k] : d]));
      return [section, merged];
    }),
  ) as AppSettings;
}

/** Reads one section's form into typed values, clamped to each field's limits. */
export function readSection(section: Section, form: FormData) {
  const fallback = DEFAULTS[section] as Record<string, unknown>;
  const out: Record<string, string | number | boolean> = {};
  for (const f of SETTINGS[section].fields as readonly Field[]) {
    const raw = String(form.get(f.key) ?? '').trim();
    if (f.type === 'toggle') out[f.key] = form.get(f.key) === 'on';
    else if (f.type === 'number') {
      const n = Math.round(Number(raw));
      out[f.key] = Number.isFinite(n) && raw !== '' ? Math.min(f.max, Math.max(f.min, n)) : (fallback[f.key] as number);
    } else if (f.type === 'select') out[f.key] = f.options.some((o) => o.value === raw) ? raw : (fallback[f.key] as string);
    else out[f.key] = raw.slice(0, f.type === 'textarea' ? 5000 : 300);
  }
  return out;
}

export const ownerEmail = (s: AppSettings) => s.notifications.owner_email || env.ownerEmail;

export type { Field };
