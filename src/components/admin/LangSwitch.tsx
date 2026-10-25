'use client';

import { setAdminLang } from '@/app/(admin)/admin/lang/actions';
import { useLang } from '@/components/i18n/LangProvider';
import { LANGS } from '@/lib/i18n';

/** EN | SR pill that switches the admin language. */
export function LangSwitch({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const lang = useLang();
  return (
    <form action={setAdminLang} className={`inline-flex rounded-lg p-0.5 text-xs font-semibold ${tone === 'dark' ? 'bg-white/[0.06] ring-1 ring-white/10' : 'bg-zinc-100'}`}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="submit"
          name="lang"
          value={l}
          aria-pressed={l === lang}
          className={`cursor-pointer rounded-md px-2.5 py-1 uppercase transition ${
            l === lang
              ? tone === 'dark'
                ? 'bg-white/15 text-white'
                : 'bg-white text-ink shadow-sm'
              : tone === 'dark'
                ? 'text-white/50 hover:text-white'
                : 'text-zinc-500 hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </form>
  );
}
