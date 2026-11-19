import type { Metadata } from 'next';
import { ClientPreview } from '@/components/site/ClientPreview';
import { getI18n } from '@/lib/i18n-site';

// A private preview for one client: reachable by link, kept out of search and the sitemap.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t('Fight Hydration: website preview', 'Fight Hydration: pregled sajta'),
    description: t('Design preview of the new Fight Hydration store, built by WebTano.', 'Pregled dizajna nove Fight Hydration prodavnice koju pravi WebTano.'),
    robots: { index: false, follow: false },
  };
}

export default async function FightHydrationPreview() {
  const { t } = await getI18n();
  return (
    <ClientPreview
      base="/preview/fight-hydration"
      domain="fighthydration.co"
      client="Fight Hydration"
      pages={[
        { file: 'index.html', label: t('Home', 'Početna'), path: '/' },
        { file: 'shop.html', label: 'Shop', path: '/collections/all' },
        { file: 'contact.html', label: t('Contact', 'Kontakt'), path: '/pages/contact' },
        { file: 'cart.html', label: t('Cart', 'Korpa'), path: '/cart' },
      ]}
    />
  );
}
