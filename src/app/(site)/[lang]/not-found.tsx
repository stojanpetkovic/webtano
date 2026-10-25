import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/site/NotFoundContent';
import { getLang } from '@/lib/i18n-site';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: lang === 'sr' ? 'Stranica nije pronađena' : 'Page not found', robots: { index: false, follow: true } };
}

export default async function NotFound() {
  return <NotFoundContent lang={await getLang()} />;
}
