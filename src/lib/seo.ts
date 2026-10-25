import type { Metadata } from 'next';
import { HTML_LANG, LANGS, localePath, type Lang } from '@/lib/i18n';

/** The site's share card, from src/app/og.png. Pages that set openGraph pass it again, as Next does not merge openGraph. */
export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: 'WebTano: websites, local SEO and Google Ads that bring calls' };

/** The share card in the page's language (src/app/og-sr.png for Serbian). */
export const ogImage = (lang: Lang) =>
  lang === 'sr' ? { ...OG_IMAGE, url: '/og-sr.png', alt: 'WebTano: sajtovi, lokalni SEO i Google Ads koji donose pozive' } : OG_IMAGE;

/**
 * Canonical address of a page in its language, plus hreflang links to the
 * other language, so Google shows each searcher the right version.
 */
export function alternates(lang: Lang, path: string): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = Object.fromEntries(LANGS.map((l) => [HTML_LANG[l], localePath(l, path)]));
  languages['x-default'] = path;
  return { canonical: localePath(lang, path), languages };
}

const SUFFIX = ' | WebTano';

/** A page title that fits Google's ~60 characters: the "| WebTano" suffix is dropped when it would not fit. */
export function pageTitle(title: string): Metadata['title'] {
  return title.length + SUFFIX.length > 60 ? { absolute: title } : title;
}

/**
 * A meta description of at most `max` characters, cut at the end of a sentence
 * when one fits, else at a word, so Google shows it whole instead of with "…".
 */
export function metaDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (sentence > max * 0.55) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:–-]+$/, '')}…`;
}

/** JSON-LD for a script tag, with "<" escaped so text in it can never close the tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
