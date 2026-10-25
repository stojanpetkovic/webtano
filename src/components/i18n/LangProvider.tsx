'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_LANG, localePath, translator, type Lang } from '@/lib/i18n';

const LangContext = createContext<Lang>(DEFAULT_LANG);

/** Hands the page's language to client components; set once in each root layout. */
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useT = () => translator(useContext(LangContext));
/** Turns '/pricing' into the same page in the current language. */
export function useLocalePath() {
  const lang = useContext(LangContext);
  return (path: string) => localePath(lang, path);
}
