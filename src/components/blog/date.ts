import { HTML_LANG, type Lang } from '@/lib/i18n';

/** "Oct 24, 2026" or "24. okt 2026.", fixed to UTC so server and browser agree. */
export function formatDate(iso: string, lang: Lang = 'en') {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(HTML_LANG[lang], { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
