import { db } from './supabase';
import { env } from './env';
import { DEFAULT_INTRO, DEFAULT_TERMS } from './crm/priceList';

type Field =
  | {
      key: string;
      label: string;
      type: 'text' | 'email' | 'url' | 'textarea';
      hint?: string;
      placeholder?: string;
      wide?: boolean;
      /** Checked in the browser and again on save; a value that does not match is refused. */
      pattern?: string;
    }
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
  tracking: {
    title: 'Praćenje i verifikacija sajta',
    description:
      'Kodovi za webtano.com. Upiši samo ID, sajt sam ubacuje skriptu. Prazno polje znači da se ta skripta ne učitava. Promena je na sajtu odmah posle čuvanja.',
    fields: [
      { key: 'ga4_id', label: 'Google Analytics 4', type: 'text', placeholder: 'G-XXXXXXXXXX', pattern: '^G-[A-Z0-9]{4,15}$' },
      {
        key: 'gtm_id',
        label: 'Google Tag Manager',
        type: 'text',
        placeholder: 'GTM-XXXXXXX',
        pattern: '^GTM-[A-Z0-9]{4,12}$',
        hint: 'Ako koristiš GTM, Analytics i Ads možeš da podesiš u njemu, a ova dva polja da ostaviš prazna.',
      },
      { key: 'google_ads_id', label: 'Google Ads ID', type: 'text', placeholder: 'AW-123456789', pattern: '^AW-[0-9]{6,15}$' },
      {
        key: 'google_ads_lead_label',
        label: 'Google Ads konverzija: forma',
        type: 'text',
        placeholder: 'AbCdEfGhIjK',
        pattern: '^[A-Za-z0-9_-]{4,40}$',
        hint: 'Oznaka konverzije (label). Šalje se kad posetilac pošalje formu.',
      },
      {
        key: 'google_ads_call_label',
        label: 'Google Ads konverzija: klik na telefon',
        type: 'text',
        pattern: '^[A-Za-z0-9_-]{4,40}$',
        hint: 'Šalje se na klik na broj telefona.',
      },
      { key: 'meta_pixel_id', label: 'Meta (Facebook) Pixel', type: 'text', placeholder: '123456789012345', pattern: '^[0-9]{8,20}$', hint: 'Šalje Lead događaj kad stigne forma.' },
      {
        key: 'google_verification',
        label: 'Google Search Console verifikacija',
        type: 'text',
        pattern: '^[A-Za-z0-9_-]{10,100}$',
        hint: 'Samo vrednost content iz meta taga google-site-verification.',
      },
      { key: 'bing_verification', label: 'Bing Webmaster verifikacija', type: 'text', pattern: '^[A-Za-z0-9]{10,100}$', hint: 'Vrednost iz meta taga msvalidate.01.' },
      {
        key: 'facebook_verification',
        label: 'Meta verifikacija domena',
        type: 'text',
        pattern: '^[a-z0-9]{10,100}$',
        hint: 'Vrednost iz meta taga facebook-domain-verification.',
      },
      {
        key: 'consent',
        label: 'Traži saglasnost za kolačiće pre Analytics, Ads i Pixel skripti',
        type: 'toggle',
        hint: 'Preporučeno. Bez saglasnosti posetioca te skripte se ne učitavaju, a naše brojanje poseta radi i dalje, bez kolačića.',
      },
    ],
  },
  newsletter: {
    title: 'Newsletter',
    description: 'Prijava na newsletter na webtano.com. Prijave vidiš pod Marketing → Pretplatnici.',
    fields: [
      {
        key: 'popup',
        label: 'Prikaži popup za prijavu',
        type: 'toggle',
        hint: 'Pojavljuje se posle 12 sekundi i skrolovanja (na telefonu kasnije), najviše jednom po poseti, i ne vraća se 30 dana kad ga posetilac zatvori.',
      },
      { key: 'footer', label: 'Prikaži prijavu u futeru', type: 'toggle' },
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
  tracking: {
    ga4_id: '',
    gtm_id: '',
    google_ads_id: '',
    google_ads_lead_label: '',
    google_ads_call_label: '',
    meta_pixel_id: '',
    google_verification: '',
    bing_verification: '',
    facebook_verification: '',
    consent: true,
  },
  newsletter: { popup: true, footer: true },
};

export type AppSettings = typeof DEFAULTS;

/** All settings, saved values over the defaults. Works before the table exists. */
export async function appSettings(): Promise<AppSettings> {
  let rows: { key: string; value: Record<string, unknown> }[] = [];
  try {
    const { data, error } = await db().from('crm_settings').select('key, value');
    if (!error) rows = data ?? [];
  } catch {
    // No database at build time: the site is built with the defaults and refreshed on the first save.
  }
  const saved = new Map(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(
    Object.entries(DEFAULTS).map(([section, defaults]) => {
      const values = saved.get(section) ?? {};
      // Only keys the defaults know, with the defaults' types.
      const merged = Object.fromEntries(Object.entries(defaults).map(([k, d]) => [k, typeof values[k] === typeof d ? values[k] : d]));
      return [section, merged];
    }),
  ) as AppSettings;
}

/** Reads one section's form into typed values, clamped to each field's limits, and lists fields that do not match their pattern. */
export function readSection(section: Section, form: FormData) {
  const fallback = DEFAULTS[section] as Record<string, unknown>;
  const out: Record<string, string | number | boolean> = {};
  const invalid: string[] = [];
  for (const f of SETTINGS[section].fields as readonly Field[]) {
    const raw = String(form.get(f.key) ?? '').trim();
    if (f.type === 'toggle') out[f.key] = form.get(f.key) === 'on';
    else if (f.type === 'number') {
      const n = Math.round(Number(raw));
      out[f.key] = Number.isFinite(n) && raw !== '' ? Math.min(f.max, Math.max(f.min, n)) : (fallback[f.key] as number);
    } else if (f.type === 'select') out[f.key] = f.options.some((o) => o.value === raw) ? raw : (fallback[f.key] as string);
    else {
      out[f.key] = raw.slice(0, f.type === 'textarea' ? 5000 : 300);
      if (raw && 'pattern' in f && f.pattern && !new RegExp(f.pattern).test(raw)) invalid.push(f.label);
    }
  }
  return { values: out, invalid };
}

export const ownerEmail = (s: AppSettings) => s.notifications.owner_email || env.ownerEmail;

export type { Field };
