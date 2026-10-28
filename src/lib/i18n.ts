/**
 * Two languages for the whole app: English at the root of webtano.com and
 * Serbian under /sr. Text sits next to its translation, as t('English', 'Srpski'),
 * so a page reads the same in the code as on screen.
 */
export const LANGS = ['en', 'sr'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const isLang = (value: unknown): value is Lang => value === 'en' || value === 'sr';

/** Picks the text for a language: t('Leads', 'Lidovi'). */
export type T = (en: string, sr: string) => string;
export const translator =
  (lang: Lang): T =>
  (en, sr) =>
    lang === 'sr' ? sr : en;

/** A value in both languages, for content kept in data files. */
export type L<V = string> = { en: V; sr: V };
export const pick = <V>(lang: Lang, value: L<V>): V => value[lang];

/** The html lang attribute and the locale for numbers and dates. */
export const HTML_LANG: Record<Lang, string> = { en: 'en-US', sr: 'sr-Latn-RS' };
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', sr: 'sr_RS' };

/** A site path in a language: '/pricing' stays as it is in English and becomes '/sr/pricing' in Serbian. */
export function localePath(lang: Lang, path: string): string {
  if (lang === 'en' || /^[a-z]+:/i.test(path)) return path;
  if (path === '/' || path === '') return '/sr';
  if (path.startsWith('/#')) return `/sr${path.slice(1)}`;
  if (path.startsWith('#') || path.startsWith('?')) return path;
  return `/sr${path}`;
}

/** The language of a browser path and the same path without the /sr prefix. */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  if (pathname === '/sr' || pathname === '/sr/') return { lang: 'sr', path: '/' };
  if (pathname.startsWith('/sr/')) return { lang: 'sr', path: pathname.slice(3) };
  // English pages are served from /en behind a rewrite, and some requests report that inner path.
  if (pathname === '/en' || pathname === '/en/') return { lang: 'en', path: '/' };
  if (pathname.startsWith('/en/')) return { lang: 'en', path: pathname.slice(3) };
  return { lang: 'en', path: pathname || '/' };
}

/** A whole-dollar price the way each language writes it: $1,900 or $1.900. */
export const usd = (lang: Lang, n: number) => `$${n.toLocaleString(lang === 'sr' ? 'de-DE' : 'en-US')}`;
