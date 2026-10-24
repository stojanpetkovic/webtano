import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { site } from '@/content/site';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'latin-ext'] });
const display = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'WebTano | Websites, local SEO and Google Ads that bring calls',
    template: '%s | WebTano',
  },
  description:
    'WebTano builds fast websites, runs local SEO and Google Ads for tree services and other local companies, and tracks every call and form so you see what pays.',
  openGraph: { siteName: 'WebTano', type: 'website' },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
        {/* Our own collector: page views and call clicks on webtano.com land in the admin like any client site. */}
        <script src="/leads.js" data-site-key={site.leadsSiteKey} defer />
      </body>
    </html>
  );
}
