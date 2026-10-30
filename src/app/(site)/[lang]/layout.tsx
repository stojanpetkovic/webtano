import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/site/Header';
import { BackToTop } from '@/components/site/BackToTop';
import { Footer } from '@/components/site/Footer';
import { MobileTabBar } from '@/components/site/MobileTabBar';
import { RevealObserver } from '@/components/site/RevealObserver';
import { Tracking } from '@/components/site/Tracking';
import { NewsletterPopup } from '@/components/site/Newsletter';
import { LangProvider } from '@/components/i18n/LangProvider';
import { site } from '@/content/site';
import { appSettings } from '@/lib/admin/settings';
import { HTML_LANG, LANGS, OG_LOCALE, translator } from '@/lib/i18n';
import { getLang } from '@/lib/i18n-site';
import { ogImage } from '@/lib/seo';
import './site.css';

const sans = Geist({ variable: '--font-geist', subsets: ['latin', 'latin-ext'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin', 'latin-ext'] });

// Pages are rebuilt at most hourly, and at once when Podešavanja or the price list is saved.
export const revalidate = 3600;

// Both languages are built ahead; English is served at the root, Serbian under /sr.
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));
export const dynamicParams = false;

const description = (lang: 'en' | 'sr') =>
  translator(lang)(
    'WebTano designs fast websites and runs SEO and Google Ads for small and local businesses, then tracks every call and enquiry so you know exactly what pays.',
    'WebTano pravi brze, moderne sajtove i vodi SEO i Google oglašavanje za male i lokalne firme, a svaki poziv i upit beleži, pa tačno znate šta vam se isplati.',
  );

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const tr = translator(lang);
  const { tracking: t } = await appSettings();
  const other: Record<string, string> = {};
  if (t.bing_verification) other['msvalidate.01'] = t.bing_verification;
  if (t.facebook_verification) other['facebook-domain-verification'] = t.facebook_verification;
  return {
    metadataBase: new URL(site.url),
    title: {
      default: tr('WebTano | Websites, local SEO and Google Ads that bring calls', 'WebTano | Sajtovi, lokalni SEO i Google Ads koji donose pozive'),
      template: '%s | WebTano',
    },
    description: description(lang),
    applicationName: site.name,
    openGraph: {
      siteName: site.name,
      type: 'website',
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [ogImage(lang)],
    },
    twitter: { card: 'summary_large_image', images: [ogImage(lang).url] },
    formatDetection: { telephone: false, address: false, email: false },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    verification: { google: t.google_verification || undefined, other },
  };
}

// Dark browser chrome on phones, and room for the notch and home bar.
export const viewport: Viewport = {
  themeColor: '#05060a',
  viewportFit: 'cover',
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const { tracking: t, company, newsletter } = await appSettings();
  // Who we are, once for every page: search engines tie each page to this one business.
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: { '@type': 'ImageObject', url: `${site.url}/brand/webtano-mark-512.png`, width: 512, height: 512 },
        description: description(lang),
        areaServed: { '@type': 'Country', name: 'United States' },
        knowsAbout: ['Website design', 'Local SEO', 'Google Ads', 'Google Business Profile', 'Call tracking'],
        ...(company.email || company.phone
          ? { contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: company.email || undefined, telephone: company.phone || undefined, availableLanguage: ['English', 'Serbian'] } }
          : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.tagline[lang],
        inLanguage: LANGS.map((l) => HTML_LANG[l]),
        publisher: { '@id': `${site.url}/#organization` },
      },
    ],
  };
  // translate="no": the site has its own English and Serbian, and a browser translating it rewrites text React still manages, which crashes the page.
  return (
    <html lang={HTML_LANG[lang]} className={`${sans.variable} ${mono.variable}`} translate="no" suppressHydrationWarning>
      <head>
        {/* Lets the scroll animations hide content only when they can also show it. */}
        <Script id="js-class" strategy="beforeInteractive">{"document.documentElement.classList.add('js')"}</Script>
      </head>
      <body className="min-h-screen">
        <LangProvider lang={lang}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }} />
        <Tracking
          config={{
            ga4: t.ga4_id,
            gtm: t.gtm_id,
            ads: t.google_ads_id,
            adsLead: t.google_ads_lead_label,
            adsCall: t.google_ads_call_label,
            pixel: t.meta_pixel_id,
            consent: t.consent,
          }}
        />
        <RevealObserver />
        <Header />
        <main>{children}</main>
        <Footer newsletter={newsletter.footer} lang={lang} />
        {newsletter.popup && <NewsletterPopup />}
        {/* Keeps the end of the footer clear of the phone tab bar. */}
        <div className="h-[calc(6rem+env(safe-area-inset-bottom))] md:hidden" aria-hidden />
        <MobileTabBar />
        <BackToTop />
        {/* Our own collector: page views and call clicks on webtano.com land in the admin like any client site. */}
        <script src="/leads.js" data-site-key={site.leadsSiteKey} defer />
        </LangProvider>
      </body>
    </html>
  );
}
