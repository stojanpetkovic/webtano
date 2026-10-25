import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/seo';
import { appSettings } from '@/lib/admin/settings';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description:
    'How WebTano handles what you send through this site: what we collect and why, where it is stored, how long we keep it, cookies, and how to delete it.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: '/privacy', images: [OG_IMAGE] },
};

const baseItems = [
  { title: 'Who', text: 'WebTano, webtano.com. You can reach us through the form on this website.' },
  {
    title: 'What we collect',
    text: 'The details you enter in the website check form: name, email, phone, website, business, your answers and your message. We also count page views and taps on contact links without cookies, using an anonymous, daily-changing visitor code.',
  },
  { title: 'Why', text: 'Only to reply to your request and prepare a proposal. No newsletters, and your data is never sold or shared for marketing.' },
  { title: 'Where', text: 'With the hosting, email and database providers that run this website, under data-processing agreements.' },
  { title: 'How long', text: 'As long as needed to handle your request, and no longer than two years without further contact.' },
  {
    title: 'Your rights',
    text: 'You can ask to see, correct or delete your data, or withdraw consent, at any time. You can also complain to your data protection authority.',
  },
];

export default async function PrivacyPage() {
  const { tracking: t } = await appSettings();
  const tools = [t.ga4_id && 'Google Analytics', (t.google_ads_id || t.gtm_id) && 'Google Ads', t.meta_pixel_id && 'Meta Pixel'].filter(Boolean) as string[];
  // Our own counter stays cookie-free; third-party tools get their own item while they are on.
  const items = tools.length
    ? [
        ...baseItems.slice(0, 2),
        {
          title: 'Cookies',
          text: `${t.consent ? 'If you accept cookies, we' : 'We'} use ${tools.join(', ')} to measure visits and see which ads bring enquiries. These tools set cookies and receive your IP address and browser details. ${t.consent ? 'If you decline, they are not loaded. You can change your choice under Cookie settings at the bottom of every page.' : ''}`.trim(),
        },
        ...baseItems.slice(2),
      ]
    : baseItems;
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-950">Privacy notice</h1>
        <dl className="mt-10 space-y-8">
          {items.map((i) => (
            <div key={i.title}>
              <dt className="font-display text-xl font-bold text-ink-950">{i.title}</dt>
              <dd className="mt-2 text-lg leading-relaxed text-zinc-700">{i.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
