import type { L } from '@/lib/i18n';
import { db } from './supabase';
import { env } from './env';
import { DEFAULT_INTRO, DEFAULT_TERMS } from './crm/priceList';

type Field =
  | {
      key: string;
      label: L;
      type: 'text' | 'email' | 'url' | 'textarea';
      hint?: L;
      placeholder?: string;
      wide?: boolean;
      /** Checked in the browser and again on save; a value that does not match is refused. */
      pattern?: string;
    }
  | { key: string; label: L; type: 'number'; min: number; max: number; hint?: L; suffix?: L }
  | { key: string; label: L; type: 'select'; options: { value: string; label: L }[]; hint?: L }
  | { key: string; label: L; type: 'toggle'; hint?: L };

const DAYS = { en: 'days', sr: 'dana' };

/**
 * Everything that can be changed under Settings, by section. The form and the
 * save action are both built from this list, so a new setting is one entry here.
 * Secrets (API keys, CRON_SECRET) never live here: they stay in Railway variables.
 */
export const SETTINGS = {
  company: {
    title: { en: 'Company', sr: 'Firma' },
    description: {
      en: 'The name and contact details clients see on proposals and invoices.',
      sr: 'Ime i kontakt koji vide klijenti na ponudama, a kasnije i na fakturama.',
    },
    fields: [
      { key: 'name', label: { en: 'Name', sr: 'Naziv' }, type: 'text', placeholder: 'WebTano' },
      { key: 'tagline', label: { en: 'Line under the name', sr: 'Opis ispod naziva' }, type: 'text', placeholder: 'Websites, Local SEO and Google Ads' },
      { key: 'website', label: { en: 'Website', sr: 'Sajt' }, type: 'text', placeholder: 'webtano.com' },
      {
        key: 'email',
        label: { en: 'Email for clients', sr: 'Email za klijente' },
        type: 'email',
        placeholder: 'hello@webtano.com',
        hint: { en: 'Shown on proposals. Leave empty to hide it.', sr: 'Prikazuje se na ponudi. Prazno znači da se ne prikazuje.' },
      },
      { key: 'phone', label: { en: 'Phone', sr: 'Telefon' }, type: 'text', placeholder: '+1 …' },
      {
        key: 'legal_name',
        label: { en: 'Legal name', sr: 'Pravni naziv' },
        type: 'text',
        hint: { en: 'For invoices. Leave empty until you decide who issues them.', sr: 'Za fakture. Prazno dok ne odlučiš ko ih izdaje.' },
      },
      { key: 'address', label: { en: 'Address', sr: 'Adresa' }, type: 'textarea', wide: true },
      { key: 'tax_id', label: { en: 'Tax ID (PIB or EIN)', sr: 'PIB ili EIN' }, type: 'text' },
      { key: 'reg_no', label: { en: 'Registration number', sr: 'Matični broj' }, type: 'text' },
    ],
  },
  proposals: {
    title: { en: 'Proposals', sr: 'Ponude' },
    description: {
      en: 'What a new proposal starts with. You can still change every proposal on its own.',
      sr: 'Šta nova ponuda dobija unapred. Svaku ponudu i dalje menjaš pojedinačno.',
    },
    fields: [
      { key: 'valid_days', label: { en: 'Valid for', sr: 'Važi dana' }, type: 'number', min: 1, max: 90, suffix: DAYS },
      {
        key: 'currency',
        label: { en: 'Currency', sr: 'Valuta' },
        type: 'select',
        options: [
          { value: 'USD', label: { en: 'USD, US dollar', sr: 'USD, američki dolar' } },
          { value: 'EUR', label: { en: 'EUR, euro', sr: 'EUR, evro' } },
          { value: 'RSD', label: { en: 'RSD, Serbian dinar', sr: 'RSD, dinar' } },
        ],
      },
      {
        key: 'intro',
        label: { en: 'Intro text', sr: 'Uvodni tekst' },
        type: 'textarea',
        wide: true,
        hint: { en: 'In English, the client sees it in the PDF.', sr: 'Na engleskom, klijent ga vidi u PDF-u.' },
      },
      { key: 'terms', label: { en: 'Terms, one per line', sr: 'Uslovi, jedan po redu' }, type: 'textarea', wide: true },
    ],
  },
  notifications: {
    title: { en: 'Notifications and automation', sr: 'Obaveštenja i automatizacija' },
    description: {
      en: 'Who gets the automatic emails and when. You switch the jobs themselves on under Automation.',
      sr: 'Kome i kada stižu automatski emailovi. Same poslove uključuješ na stranici Automatizacija.',
    },
    fields: [
      {
        key: 'owner_email',
        label: { en: 'Email for notifications', sr: 'Email za obaveštenja' },
        type: 'email',
        hint: { en: 'Empty means OWNER_EMAIL from the Railway variables.', sr: 'Prazno znači OWNER_EMAIL iz Railway varijabli.' },
      },
      {
        key: 'timezone',
        label: { en: 'Your time zone', sr: 'Tvoja vremenska zona' },
        type: 'select',
        options: [
          { value: 'Europe/Belgrade', label: { en: 'Belgrade', sr: 'Beograd' } },
          { value: 'America/New_York', label: { en: 'New York', sr: 'Njujork' } },
          { value: 'America/Chicago', label: { en: 'Chicago', sr: 'Čikago' } },
          { value: 'America/Los_Angeles', label: { en: 'Los Angeles', sr: 'Los Anđeles' } },
        ],
      },
      {
        key: 'digest_hour',
        label: { en: 'Morning digest arrives from', sr: 'Jutarnji pregled stiže od' },
        type: 'number',
        min: 5,
        max: 12,
        suffix: { en: 'h', sr: 'h' },
        hint: { en: 'Sent within three hours of this time.', sr: 'Šalje se u prva tri sata od ovog vremena.' },
      },
      { key: 'digest_weekends', label: { en: 'Morning digest on weekends too', sr: 'Jutarnji pregled i vikendom' }, type: 'toggle' },
      {
        key: 'unanswered_hours',
        label: { en: 'Lead unanswered after', sr: 'Lid bez odgovora posle' },
        type: 'number',
        min: 1,
        max: 168,
        suffix: { en: 'hours', sr: 'sati' },
      },
      {
        key: 'unanswered_days',
        label: { en: 'Check leads up to', sr: 'Gledaju se lidovi do' },
        type: 'number',
        min: 1,
        max: 60,
        suffix: DAYS,
        hint: { en: 'Older leads do not send a warning.', sr: 'Stariji lidovi ne šalju upozorenje.' },
      },
    ],
  },
  invoices: {
    title: { en: 'Invoices', sr: 'Fakture' },
    description: {
      en: 'Invoices from Finance. The legal name, address, tax ID and registration number from Company go on every invoice. The currency is the same as for proposals.',
      sr: 'Računi iz Finansija. Pravni naziv, adresa, PIB i matični broj iz sekcije Firma idu na svaki račun. Valuta je ista kao za ponude.',
    },
    fields: [
      { key: 'due_days', label: { en: 'Payment due in', sr: 'Rok plaćanja' }, type: 'number', min: 0, max: 60, suffix: DAYS },
      {
        key: 'tax_pct',
        label: { en: 'Tax on the invoice', sr: 'Porez na računu' },
        type: 'number',
        min: 0,
        max: 50,
        suffix: { en: '%', sr: '%' },
        hint: { en: '0 by default. Can be changed on each invoice too.', sr: 'Podrazumevano 0. Menja se i na svakom računu.' },
      },
      {
        key: 'prefix',
        label: { en: 'Number prefix', sr: 'Prefiks broja' },
        type: 'text',
        placeholder: 'WT-',
        hint: { en: 'Invoices get numbers like WT-0001.', sr: 'Faktura dobija broj kao WT-0001.' },
      },
      {
        key: 'payment_details',
        label: { en: 'Payment instructions', sr: 'Instrukcije za uplatu' },
        type: 'textarea',
        wide: true,
        hint: { en: 'Bank account, Wise, Zelle… Goes on every invoice.', sr: 'Račun, Wise, Zelle… Ide na svaku fakturu.' },
      },
      { key: 'note', label: { en: 'Note on the invoice', sr: 'Napomena na fakturi' }, type: 'textarea', wide: true },
    ],
  },
  tracking: {
    title: { en: 'Tracking and site verification', sr: 'Praćenje i verifikacija sajta' },
    description: {
      en: 'Codes for webtano.com. Enter only the ID and the site adds the script itself. An empty field means that script is not loaded. Changes are live on the site right after saving.',
      sr: 'Kodovi za webtano.com. Upiši samo ID, sajt sam ubacuje skriptu. Prazno polje znači da se ta skripta ne učitava. Promena je na sajtu odmah posle čuvanja.',
    },
    fields: [
      { key: 'ga4_id', label: { en: 'Google Analytics 4', sr: 'Google Analytics 4' }, type: 'text', placeholder: 'G-XXXXXXXXXX', pattern: '^G-[A-Z0-9]{4,15}$' },
      {
        key: 'gtm_id',
        label: { en: 'Google Tag Manager', sr: 'Google Tag Manager' },
        type: 'text',
        placeholder: 'GTM-XXXXXXX',
        pattern: '^GTM-[A-Z0-9]{4,12}$',
        hint: {
          en: 'If you use GTM, you can set up Analytics and Ads there and leave those two fields empty.',
          sr: 'Ako koristiš GTM, Analytics i Ads možeš da podesiš u njemu, a ova dva polja da ostaviš prazna.',
        },
      },
      { key: 'google_ads_id', label: { en: 'Google Ads ID', sr: 'Google Ads ID' }, type: 'text', placeholder: 'AW-123456789', pattern: '^AW-[0-9]{6,15}$' },
      {
        key: 'google_ads_lead_label',
        label: { en: 'Google Ads conversion: form', sr: 'Google Ads konverzija: forma' },
        type: 'text',
        placeholder: 'AbCdEfGhIjK',
        pattern: '^[A-Za-z0-9_-]{4,40}$',
        hint: { en: 'The conversion label. Sent when a visitor submits the form.', sr: 'Oznaka konverzije (label). Šalje se kad posetilac pošalje formu.' },
      },
      {
        key: 'google_ads_call_label',
        label: { en: 'Google Ads conversion: phone click', sr: 'Google Ads konverzija: klik na telefon' },
        type: 'text',
        pattern: '^[A-Za-z0-9_-]{4,40}$',
        hint: { en: 'Sent on a click on the phone number.', sr: 'Šalje se na klik na broj telefona.' },
      },
      {
        key: 'meta_pixel_id',
        label: { en: 'Meta (Facebook) Pixel', sr: 'Meta (Facebook) Pixel' },
        type: 'text',
        placeholder: '123456789012345',
        pattern: '^[0-9]{8,20}$',
        hint: { en: 'Sends a Lead event when a form arrives.', sr: 'Šalje Lead događaj kad stigne forma.' },
      },
      {
        key: 'google_verification',
        label: { en: 'Google Search Console verification', sr: 'Google Search Console verifikacija' },
        type: 'text',
        pattern: '^[A-Za-z0-9_-]{10,100}$',
        hint: { en: 'Only the content value of the google-site-verification meta tag.', sr: 'Samo vrednost content iz meta taga google-site-verification.' },
      },
      {
        key: 'bing_verification',
        label: { en: 'Bing Webmaster verification', sr: 'Bing Webmaster verifikacija' },
        type: 'text',
        pattern: '^[A-Za-z0-9]{10,100}$',
        hint: { en: 'The value of the msvalidate.01 meta tag.', sr: 'Vrednost iz meta taga msvalidate.01.' },
      },
      {
        key: 'facebook_verification',
        label: { en: 'Meta domain verification', sr: 'Meta verifikacija domena' },
        type: 'text',
        pattern: '^[a-z0-9]{10,100}$',
        hint: { en: 'The value of the facebook-domain-verification meta tag.', sr: 'Vrednost iz meta taga facebook-domain-verification.' },
      },
      {
        key: 'consent',
        label: {
          en: 'Ask for cookie consent before the Analytics, Ads and Pixel scripts',
          sr: 'Traži saglasnost za kolačiće pre Analytics, Ads i Pixel skripti',
        },
        type: 'toggle',
        hint: {
          en: 'Recommended. Without the visitor’s consent those scripts do not load, and our own visit counting keeps working without cookies.',
          sr: 'Preporučeno. Bez saglasnosti posetioca te skripte se ne učitavaju, a naše brojanje poseta radi i dalje, bez kolačića.',
        },
      },
    ],
  },
  newsletter: {
    title: { en: 'Newsletter', sr: 'Newsletter' },
    description: {
      en: 'Newsletter sign-up on webtano.com. You see sign-ups under Marketing → Subscribers.',
      sr: 'Prijava na newsletter na webtano.com. Prijave vidiš pod Marketing → Pretplatnici.',
    },
    fields: [
      {
        key: 'popup',
        label: { en: 'Show the sign-up popup', sr: 'Prikaži popup za prijavu' },
        type: 'toggle',
        hint: {
          en: 'Appears after 12 seconds and some scrolling (later on phones), at most once per visit, and stays away for 30 days once a visitor closes it.',
          sr: 'Pojavljuje se posle 12 sekundi i skrolovanja (na telefonu kasnije), najviše jednom po poseti, i ne vraća se 30 dana kad ga posetilac zatvori.',
        },
      },
      { key: 'footer', label: { en: 'Show sign-up in the footer', sr: 'Prikaži prijavu u futeru' }, type: 'toggle' },
    ],
  },
} as const satisfies Record<string, { title: L; description: L; fields: readonly Field[] }>;

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
  invoices: { due_days: 7, tax_pct: 0, prefix: 'WT-', payment_details: '', note: '' },
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
      if (raw && 'pattern' in f && f.pattern && !new RegExp(f.pattern).test(raw)) invalid.push(f.key);
    }
  }
  return { values: out, invalid };
}

export const ownerEmail = (s: AppSettings) => s.notifications.owner_email || env.ownerEmail;

export type { Field };
