import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { RevealObserver } from '@/components/site/RevealObserver';
import { site } from '@/content/site';
import './site.css';

const sans = Geist({ variable: '--font-geist', subsets: ['latin', 'latin-ext'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin', 'latin-ext'] });

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
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets the scroll animations hide content only when they can also show it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen">
        <RevealObserver />
        <Header />
        <main>{children}</main>
        <Footer />
        {/* Our own collector: page views and call clicks on webtano.com land in the admin like any client site. */}
        <script src="/leads.js" data-site-key={site.leadsSiteKey} defer />
      </body>
    </html>
  );
}
