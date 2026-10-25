import { HTML_LANG, type L, type Lang } from '@/lib/i18n';
import type { LeadStatus } from './types';

export const STATUS_LABELS: Record<LeadStatus, L> = {
  new: { en: 'New', sr: 'Novi' },
  contacted: { en: 'Contacted', sr: 'Kontaktiran' },
  won: { en: 'Won', sr: 'Dogovoren' },
  lost: { en: 'Lost', sr: 'Izgubljen' },
};

const TZ = 'Europe/Belgrade';

export function formatDateTime(iso: string, lang: Lang, timeZone = TZ): string {
  return new Intl.DateTimeFormat(HTML_LANG[lang], {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(iso));
}

export function formatDate(iso: string, lang: Lang, timeZone = TZ): string {
  return new Intl.DateTimeFormat(HTML_LANG[lang], {
    dateStyle: 'medium',
    timeZone,
  }).format(new Date(iso));
}

/** "5 min ago" / "pre 5 min", "2 days ago" / "pre 2 dana" — for lists where recency matters more than the date. */
export function timeAgo(iso: string, lang: Lang): string {
  const sr = lang === 'sr';
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return sr ? 'upravo' : 'just now';
  if (minutes < 60) return sr ? `pre ${minutes} min` : `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return sr ? `pre ${hours} h` : `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return sr ? `pre ${days} ${days === 1 ? 'dan' : 'dana'}` : `${days} ${days === 1 ? 'day' : 'days'} ago`;
  return formatDate(iso, lang);
}

export function hostOf(url: string | null): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.pathname === '/' ? u.hostname : u.pathname;
  } catch {
    return url;
  }
}
