import { lang as rootLang } from 'next/root-params';
import { DEFAULT_LANG, isLang, localePath, translator, type Lang } from '@/lib/i18n';

/** The public site's language, from the /sr prefix (English pages are rewritten to /en by the proxy). */
export async function getLang(): Promise<Lang> {
  const value = await rootLang();
  return isLang(value) ? value : DEFAULT_LANG;
}

/** The language with its text picker and path helper, for server components. */
export async function getI18n() {
  const lang = await getLang();
  return { lang, t: translator(lang), lp: (path: string) => localePath(lang, path) };
}
