import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { LangProvider } from '@/components/i18n/LangProvider';
import { getAdminLang } from '@/lib/admin/i18n';
import { HTML_LANG } from '@/lib/i18n';
import './admin.css';

const sans = Geist({ variable: '--font-geist', subsets: ['latin', 'latin-ext'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: { template: '%s · WebTano Admin', default: 'WebTano Admin' },
  robots: { index: false, follow: false },
  icons: { icon: '/admin-favicon.svg' },
};

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getAdminLang();
  return (
    <html lang={HTML_LANG[lang]} className={`${sans.variable} ${mono.variable}`}>
      <body>
        <LangProvider lang={lang}>{children}</LangProvider>
      </body>
    </html>
  );
}
