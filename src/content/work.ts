// Case studies shown on the homepage and under /work. Every figure here comes
// from the client's own tracking (the WebTano lead admin or the Google Ads
// account) or from a Lighthouse run on the live site. The Serbian text is in work.sr.ts.

import type { Lang } from '@/lib/i18n';
import { caseStudiesSr } from './work.sr';

export interface Stat {
  value: string;
  label: string;
}

export interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CaseStudy {
  slug: string;
  client: string;
  url: string;
  sector: string;
  location: string;
  summary: string;
  headline: Stat;
  stats: Stat[];
  services: string[];
  challenge: string[];
  work: { title: string; text: string }[];
  outcome: string[];
  lighthouse: { performance: number; accessibility: number; bestPractices: number; seo: number };
  /** Where the figures above come from, shown next to them. */
  source: string;
  shots: Shot[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'tree-jaws',
    client: 'Tree Jaws',
    url: 'https://treejaws.com',
    sector: 'Tree service',
    location: 'South Florida',
    summary: 'A full rebuild, local SEO and a Google Ads account, all measured in one place.',
    headline: { value: '1,010', label: 'tracked leads from Google Ads, 732 of them phone calls' },
    stats: [
      { value: '7.9%', label: 'of visitors became a lead in the last 30 days' },
      { value: '74', label: 'leads in 30 days: 47 calls and 27 forms' },
      { value: '4.9★', label: 'across 427 Google reviews' },
    ],
    services: ['Website', 'Local SEO', 'Google Ads', 'Lead tracking'],
    challenge: [
      'Tree Jaws removes, trims and grinds out trees for homes and businesses across South Florida. In this trade a homeowner with a storm-damaged tree is not comparison shopping: they call the first company that looks credible and answers the phone.',
      'The old WordPress site was slow on phones and thin on content, so it lost the visitors the ads had already paid for.',
    ],
    work: [
      { title: 'A rebuild for speed', text: 'The site was moved off WordPress to static pages that open instantly, even on a weak 4G connection.' },
      { title: 'Local search, page by page', text: '176 pages, including 108 local guides, written for the way South Florida homeowners actually search.' },
      { title: 'Google Ads that report back', text: 'Every call and form is tied to the ad or search that brought the visitor, so budget moves to what produces jobs.' },
    ],
    outcome: [
      'Since tracking began the Google Ads account has produced 1,010 conversions, 732 of them phone calls. In the last 30 days 891 visitors turned into 74 leads.',
      'The owner sees every lead the second it arrives and gets one monthly report in plain language.',
    ],
    lighthouse: { performance: 91, accessibility: 96, bestPractices: 96, seo: 100 },
    source: 'WebTano lead tracking and the client’s Google Ads account; rating from Google.',
    shots: [
      { src: '/work/tree-jaws-hero-dark.webp', alt: 'The Tree Jaws homepage, built around a job-site photo with the rating and a call button up front.', width: 1440, height: 603 },
      { src: '/work/tree-jaws-testimonials.webp', alt: 'A reviews section showing the 4.9-star rating across 427 Google reviews.', width: 1440, height: 603 },
      { src: '/work/tree-jaws-blog.webp', alt: 'The Tree Jaws blog with South Florida tree care guides.', width: 1440, height: 603 },
    ],
  },
  {
    slug: 'mahalo-tree-service',
    client: 'Mahalo Tree Service',
    url: 'https://mahalotreeservice.com',
    sector: 'Tree service',
    location: 'South Florida',
    summary: 'Off WordPress and onto fast static pages, with growth from search alone.',
    headline: { value: '100', label: 'Lighthouse SEO score, with $0 spent on ads' },
    stats: [
      { value: '18', label: 'service-area pages' },
      { value: '24', label: 'blog posts written for local search' },
      { value: '5.0★', label: 'Google rating' },
    ],
    services: ['Website', 'Local SEO', 'Content'],
    challenge: [
      'Mahalo is a family-owned tree company with ISA Certified arborists and a perfect Google rating. Its WordPress site was a stack of plugins with thin, duplicated pages behind it.',
      'There was no ad campaign to run. The site simply had to stop holding the business back.',
    ],
    work: [
      { title: 'Static pages instead of plugins', text: 'A lean rebuild with nothing to update, patch or break.' },
      { title: 'One page per service area', text: '18 area pages and a 24-post blog give Google real content to rank.' },
      { title: 'Instant lead alerts', text: 'Every enquiry reaches the owner’s inbox the second it is sent, with no portal to check.' },
    ],
    outcome: ['The site scores 100 for SEO and Best Practices in Lighthouse, and it grows from search without paid ads.'],
    lighthouse: { performance: 87, accessibility: 91, bestPractices: 100, seo: 100 },
    source: 'Lighthouse on the live site, page counts from the site; rating from Google.',
    shots: [
      { src: '/work/mahalo-hero.webp', alt: 'The Mahalo Tree Service homepage: fast, efficient, affordable tree removal, over a job-site photo.', width: 1440, height: 619 },
      { src: '/work/mahalo-services.webp', alt: 'The services section with tree removal, trimming and the ISA Certified Arborist badge.', width: 1440, height: 619 },
      { src: '/work/mahalo-blog.webp', alt: 'The Mahalo blog with local tree care guides.', width: 1440, height: 619 },
    ],
  },
  {
    slug: 'care-trans',
    client: 'Care Trans',
    url: 'https://prevozpacijenatacaretrans.rs',
    sector: 'Medical transport',
    location: 'Belgrade, Serbia',
    summary: 'A 24/7 patient transport company that now ranks for every service it offers.',
    headline: { value: '11.2%', label: 'of visitors called in the last 30 days' },
    stats: [
      { value: '26', label: 'tracked phone calls in 30 days' },
      { value: '33', label: 'pages, one per service and route' },
      { value: '95', label: 'Lighthouse performance on mobile' },
    ],
    services: ['Website', 'Local SEO', 'Call tracking'],
    challenge: [
      'Care Trans moves bedridden and less mobile patients across Serbia and home from Germany, Austria, Switzerland and Italy, around the clock.',
      'The old site had a few plain pages and loaded slowly on the phones people grab in an emergency. Families call the first company whose site opens and answers their question.',
    ],
    work: [
      { title: 'A page for every service', text: '33 static pages and 17 articles, each answering one need: hospital transfers, spa trips, repatriation.' },
      { title: 'One tap to call', text: 'The phone number sits on every screen, and every tap on it is counted as a lead.' },
      { title: 'Tracking next to the partner’s', text: 'Call tracking runs alongside the marketing partner’s tools without slowing the site.' },
    ],
    outcome: ['In the last 30 days 111 visitors produced 26 calls, an 11.2% conversion rate.'],
    lighthouse: { performance: 95, accessibility: 96, bestPractices: 100, seo: 100 },
    source: 'WebTano lead tracking, last 30 days; Lighthouse on the live site.',
    shots: [
      { src: '/work/caretrans-home.webp', alt: 'The Care Trans homepage with 24/7 availability and a call button.', width: 1440, height: 900 },
      { src: '/work/caretrans-service.webp', alt: 'A Care Trans service page for one type of patient transport.', width: 1440, height: 900 },
      { src: '/work/caretrans-contact.webp', alt: 'The contact page with a tap-to-call phone number.', width: 1440, height: 900 },
    ],
  },
  {
    slug: 'eric-dental-centar',
    client: 'Erić Dental Centar',
    url: 'https://zubarpancevo.com/en/',
    sector: 'Dental practice',
    location: 'Pančevo, Serbia',
    summary: 'From a theme full of demo content to a booking path in three languages.',
    headline: { value: '100', label: 'Lighthouse accessibility, best practices and SEO' },
    stats: [
      { value: '60', label: 'pages in Serbian, English and German' },
      { value: '9', label: 'booking requests and calls in 30 days' },
      { value: '< 1 min', label: 'from search to appointment request' },
    ],
    services: ['Website', 'Local SEO', 'Translation', 'Lead tracking'],
    challenge: [
      'The practice’s WordPress theme still carried its demo doctors and empty sections, and nothing led a visitor from a search to a booked appointment.',
    ],
    work: [
      { title: 'A clear path to booking', text: 'The booking form sits on the first screen, with the service and time picked in one tap.' },
      { title: 'Three languages', text: 'Serbian, English and German versions for patients from Belgrade and abroad.' },
      { title: 'Every request counted', text: 'Forms and calls are tracked, so the practice knows which pages bring patients.' },
    ],
    outcome: ['The site scores 96 for performance and 100 for accessibility, best practices and SEO, with full-size photography.'],
    lighthouse: { performance: 96, accessibility: 100, bestPractices: 100, seo: 100 },
    source: 'WebTano lead tracking, last 30 days; Lighthouse on the live site.',
    shots: [
      { src: '/work/eric-dental-centar-home.webp', alt: 'The new Erić Dental Centar homepage with the dentist’s photo, a 5.0 rating and a booking button.', width: 1440, height: 900 },
      { src: '/work/eric-dental-centar-before-home.webp', alt: 'The old site: a dark full-screen photo and no way to book.', width: 1440, height: 900 },
      { src: '/work/eric-dental-centar-contact.webp', alt: 'The booking page with the form on the first screen.', width: 1440, height: 900 },
    ],
  },
];

/** The case studies in a language: the same figures, links and photos, with the text translated. */
export function caseStudiesIn(lang: Lang): CaseStudy[] {
  if (lang === 'en') return caseStudies;
  return caseStudies.map((c) => {
    const { shotAlts, ...text } = caseStudiesSr[c.slug];
    return { ...c, ...text, shots: c.shots.map((s, i) => ({ ...s, alt: shotAlts[i] ?? s.alt })) };
  });
}

export function findCase(slug: string, lang: Lang = 'en'): CaseStudy | undefined {
  return caseStudiesIn(lang).find((c) => c.slug === slug);
}
