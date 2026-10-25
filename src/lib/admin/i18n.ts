import { cookies, headers } from 'next/headers';
import { isLang, translator, type Lang } from '@/lib/i18n';

/**
 * The admin speaks English or Serbian, chosen with the EN/SR switch in the
 * profile menu and on the login page. The choice lives in a cookie; before
 * there is one, a browser that asks for Serbian first gets Serbian.
 */
export const ADMIN_LANG_COOKIE = 'admin_lang';

export async function getAdminLang(): Promise<Lang> {
  const saved = (await cookies()).get(ADMIN_LANG_COOKIE)?.value;
  if (isLang(saved)) return saved;
  const accept = (await headers()).get('accept-language') ?? '';
  return /^\s*(sr|hr|bs|sh|cnr)\b/i.test(accept) ? 'sr' : 'en';
}

export async function getAdminI18n() {
  const lang = await getAdminLang();
  return { lang, t: translator(lang) };
}
