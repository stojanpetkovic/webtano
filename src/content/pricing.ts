// Plans shown on /pricing, in US dollars. The prices here are the fallback: the
// live prices come from the admin price list (Cenovnik) through livePricing() in
// src/lib/pricing.ts, matched by id. Names, features and notes stay here, and
// their Serbian text in pricing.sr.ts.

import type { Lang } from '@/lib/i18n';
import { addOnsSr, comparisonSr, includedSr, plansSr, pricingFaqsSr } from './pricing.sr';

export interface Plan {
  id: string;
  name: string;
  price: number;
  /** "/mo" for monthly plans, "one-time" for projects. */
  unit: 'mo' | 'one-time';
  /** Shown as "from $X" when the final price depends on the scope. */
  from?: boolean;
  tagline: string;
  bestFor: string;
  features: string[];
  note?: string;
  featured?: boolean;
}

export const monthlyPlans: Plan[] = [
  {
    id: 'local-seo',
    name: 'Local SEO',
    price: 900,
    unit: 'mo',
    tagline: 'Show up on Google Maps and in AI answers wherever your customers search.',
    bestFor: 'Businesses with a solid website that want more calls without paying for every click.',
    features: [
      'Google Business Profile management',
      'Two new service or location pages a month',
      'Technical SEO and site speed fixes',
      'More Google reviews, and replies to every one',
      'Listings in local directories and maps',
      'Call and enquiry tracking',
      'Monthly report and strategy call',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 1900,
    unit: 'mo',
    tagline: 'SEO and Google Ads working together, with every result in one report.',
    bestFor: 'Businesses that want calls this week and a growing flow of free enquiries every month.',
    features: [
      'Everything in Local SEO',
      'Everything in Google Ads',
      'Local Services Ads management',
      'Landing pages built to convert your ad traffic',
      'Cost per enquiry for every channel',
      'Priority support, reply within one business day',
    ],
    note: 'Ad spend is paid directly to Google.',
    featured: true,
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    price: 750,
    unit: 'mo',
    tagline: 'Google Ads judged by new customers, not clicks.',
    bestFor: 'Businesses that need calls fast or have a busy season to fill.',
    features: [
      'Account setup or a full audit',
      'Keywords, negative keywords and ads for each service',
      'Bids and budgets reviewed twice a month',
      'Call and conversion tracking',
      'Seasonal budget plan',
      'Monthly report and strategy call',
    ],
    note: 'Ad spend is paid directly to Google. We recommend at least $1,500 a month.',
  },
];

export const websitePlans: Plan[] = [
  {
    id: 'starter-site',
    name: 'Starter site',
    price: 2900,
    unit: 'one-time',
    tagline: 'A fast, professional website that turns visitors into calls and enquiries.',
    bestFor: 'New businesses, or anyone whose current site is slow or outdated.',
    features: [
      'Up to 8 pages',
      'A page for each main service',
      'Professional copywriting included',
      'Mobile-first design that loads in about a second',
      'Call and enquiry tracking',
      'Google Business Profile setup',
      'Ready in 2 to 3 weeks',
    ],
  },
  {
    id: 'growth-site',
    name: 'Growth site',
    price: 5900,
    unit: 'one-time',
    tagline: 'Built to rank in every town you serve.',
    bestFor: 'Established businesses ready to grow across their region.',
    features: [
      'Up to 25 pages',
      'Service and location pages',
      'Blog with 4 articles to start',
      'Structured data for services and FAQs',
      'Redirects from your old site, so no rankings are lost',
      'Call and enquiry tracking',
      'Ready in 4 to 6 weeks',
    ],
    featured: true,
  },
  {
    id: 'authority-site',
    name: 'Authority site',
    price: 9900,
    unit: 'one-time',
    from: true,
    tagline: 'A large website built to dominate local search.',
    bestFor: 'Market leaders who want to be the first name customers find.',
    features: [
      '50 pages or more',
      'A dedicated page for every area you serve',
      'Custom design and photography direction',
      'Content plan for the first year',
      'Call and enquiry tracking',
      'Price agreed after the free audit',
    ],
    note: 'Like the 176-page site we built for Tree Jaws.',
  },
];

export interface AddOn {
  /** Matches the slug of the item in the admin price list (Cenovnik). */
  id: string;
  name: string;
  price: number;
  /** Shown after the price: "/mo" or " each". */
  per: '/mo' | ' each';
  text: string;
}

export const addOns: AddOn[] = [
  { id: 'hosting', name: 'Hosting and care', price: 99, per: '/mo', text: 'Hosting in your name, updates, backups, uptime monitoring and small edits.' },
  { id: 'local-services-ads', name: 'Local Services Ads', price: 300, per: '/mo', text: 'Setup and management of Google’s pay-per-lead ads, with lead disputes handled for you.' },
  { id: 'extra-article', name: 'Extra articles', price: 350, per: ' each', text: 'Researched articles written for your market, with images and FAQs.' },
  { id: 'extra-page', name: 'Extra pages', price: 250, per: ' each', text: 'Additional service or location pages, written and designed to match your site.' },
];

/** What every client gets, whatever they buy. */
export const included = [
  { title: 'One business per industry', text: 'We take on one business per industry in each area, so we never work for your competitor.' },
  { title: 'You own everything', text: 'Domain, code, hosting and ad accounts are in your name from day one.' },
  { title: 'No long contracts', text: 'Monthly plans run month to month. Cancel with 30 days’ notice.' },
  { title: 'Every enquiry tracked', text: 'Every call and form tied to its source, in a report you can read in two minutes.' },
];

/** The comparison table under the monthly plans. true = included, string = detail. */
export const comparison: { label: string; values: [boolean | string, boolean | string, boolean | string] }[] = [
  { label: 'Google Business Profile management', values: [true, true, false] },
  { label: 'New service or local pages', values: ['2 a month', '2 a month', false] },
  { label: 'Technical SEO and speed', values: [true, true, false] },
  { label: 'Reviews: requests and replies', values: [true, true, false] },
  { label: 'Google Ads management', values: [false, true, true] },
  { label: 'Local Services Ads', values: ['Add-on', true, 'Add-on'] },
  { label: 'Landing pages for ads', values: [false, true, '1 to start'] },
  { label: 'Call and enquiry tracking', values: [true, true, true] },
  { label: 'Monthly report and strategy call', values: [true, true, true] },
  { label: 'Support reply time', values: ['1 business day', 'Priority, 1 business day', '1 business day'] },
];

/** A plan's text in a language; the price stays the same. */
export const planIn = (lang: Lang) => (p: Plan): Plan => (lang === 'sr' && plansSr[p.id] ? { ...p, ...plansSr[p.id] } : p);
export const addOnIn = (lang: Lang) => (a: AddOn): AddOn => (lang === 'sr' && addOnsSr[a.id] ? { ...a, ...addOnsSr[a.id] } : a);
export const includedIn = (lang: Lang) => (lang === 'sr' ? includedSr : included);
export const comparisonIn = (lang: Lang) => (lang === 'sr' ? comparisonSr : comparison);
export const pricingFaqsIn = (lang: Lang) => (lang === 'sr' ? pricingFaqsSr : pricingFaqs);

export const pricingFaqs = [
  {
    q: 'Is ad spend included in the price?',
    a: 'No. Your ad budget is paid directly to Google from your own account, so you always see exactly what was spent. Our fee covers the management only.',
  },
  {
    q: 'Is there a setup fee or a long contract?',
    a: 'There is no setup fee on monthly plans and no long contract. Plans run month to month and you can cancel with 30 days’ notice.',
  },
  {
    q: 'Do I need a new website before starting SEO or Ads?',
    a: 'Not always. The free audit shows whether your current site turns visitors into enquiries. If it does, we build on it. If it is losing calls, we tell you what to fix first.',
  },
  {
    q: 'Can I pay for the website in parts?',
    a: 'Yes. Websites are paid half when we start and half at launch.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'You keep everything: the website, the domain, the content, the Google Business Profile and the ad account with all its history.',
  },
  {
    q: 'Why don’t you charge a percentage of ad spend?',
    a: 'A percentage rewards spending more, not winning more customers. A flat fee keeps our advice honest, even when the right answer is to spend less.',
  },
];
