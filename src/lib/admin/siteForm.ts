import type { L, T } from '@/lib/i18n';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TIMEZONES: { value: string; label: L }[] = [
  { value: 'Europe/Belgrade', label: { en: 'Serbia (Belgrade)', sr: 'Srbija (Beograd)' } },
  { value: 'America/New_York', label: { en: 'US East (Florida, New York)', sr: 'SAD – istok (Florida, New York)' } },
  { value: 'America/Chicago', label: { en: 'US Central', sr: 'SAD – centralno' } },
  { value: 'America/Los_Angeles', label: { en: 'US West', sr: 'SAD – zapad' } },
  { value: 'Europe/London', label: { en: 'UK (London)', sr: 'UK (London)' } },
];

/** Normalises "https://www.Example.com/path" to "example.com". */
export function normalizeDomain(input: string): string {
  const raw = input.trim().toLowerCase();
  try {
    const host = new URL(raw.includes('://') ? raw : `https://${raw}`).hostname;
    return host.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function parseEmails(input: string): {
  emails: string[];
  invalid: string[];
} {
  const parts = input
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const emails = [...new Set(parts.filter((e) => EMAIL.test(e)))];
  return { emails, invalid: parts.filter((e) => !EMAIL.test(e)) };
}

export function readSiteForm(form: FormData, t: T) {
  const name = String(form.get('name') ?? '').trim();
  const domain = normalizeDomain(String(form.get('domain') ?? ''));
  const { emails, invalid } = parseEmails(String(form.get('client_emails') ?? ''));
  const email_language = form.get('email_language') === 'en' ? 'en' : 'sr';
  const tz = String(form.get('timezone') ?? 'Europe/Belgrade');
  const timezone = TIMEZONES.some((t) => t.value === tz) ? tz : 'Europe/Belgrade';

  const errors: string[] = [];
  if (!name) errors.push(t('The site name is required.', 'Naziv sajta je obavezan.'));
  if (!domain || !domain.includes('.')) errors.push(t('The domain is not valid (e.g. valenaapartmani.com).', 'Domen nije ispravan (npr. valenaapartmani.com).'));
  if (invalid.length) errors.push(`${t('Invalid emails', 'Neispravni emailovi')}: ${invalid.join(', ')}`);

  return {
    errors,
    values: {
      name,
      domain,
      client_name: String(form.get('client_name') ?? '').trim() || null,
      client_emails: emails,
      email_language,
      timezone,
      notify_owner: form.get('notify_owner') === 'on',
      active: form.has('active') ? form.getAll('active').includes('on') : true,
    },
  };
}
