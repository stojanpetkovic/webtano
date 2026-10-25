// Plans shown on /pricing, in US dollars. The prices here are the fallback: the
// live prices come from the admin price list (Cenovnik) through livePricing() in
// src/lib/pricing.ts, matched by id. Names, features and notes stay here.

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
    tagline: 'Rank on the map and in AI answers in the towns you serve.',
    bestFor: 'Companies with a good site that want more calls without paying per click.',
    features: [
      'Google Business Profile management',
      'Two new service or local pages a month',
      'Technical SEO and speed fixes',
      'Review requests and replies',
      'Citations and local mentions',
      'Call and form tracking',
      'Monthly report and a call',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 1900,
    unit: 'mo',
    tagline: 'Local SEO and Google Ads together, measured in one report.',
    bestFor: 'Companies that want the phone ringing now and more free leads every month.',
    features: [
      'Everything in Local SEO',
      'Everything in Google Ads',
      'Local Services Ads management',
      'Landing pages built for your ads',
      'Cost per lead by channel',
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
    tagline: 'Paid search that is judged by booked jobs, not clicks.',
    bestFor: 'Companies that need calls quickly or have a busy season to fill.',
    features: [
      'Account setup or full audit',
      'Keywords, negatives and ads per service',
      'Bids and budgets reviewed twice a month',
      'Call and conversion tracking',
      'Storm-season budget plan',
      'Monthly report and a call',
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
    tagline: 'A fast, professional site that turns visitors into calls.',
    bestFor: 'New companies, or a site that is slow and outdated.',
    features: [
      'Up to 8 pages',
      'A page for each main service',
      'Copywriting included',
      'Mobile-first, loads in about a second',
      'Call and form tracking',
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
    bestFor: 'Established companies that want to grow across a region.',
    features: [
      'Up to 25 pages',
      'Service and location pages',
      'Blog with 4 articles to start',
      'Structured data for services and FAQs',
      'Redirects from your old site',
      'Call and form tracking',
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
    tagline: 'A large site that owns the local search results.',
    bestFor: 'Market leaders who want to own the results in their area.',
    features: [
      '50 pages or more',
      'Local guides for every area you serve',
      'Custom design and photography direction',
      'Content plan for the first year',
      'Call and form tracking',
      'Price agreed after the free check',
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
  { id: 'extra-article', name: 'Extra articles', price: 350, per: ' each', text: 'Researched blog articles written for your market, with images and FAQs.' },
  { id: 'extra-page', name: 'Extra pages', price: 250, per: ' each', text: 'Additional service or location pages, written and designed to match your site.' },
];

/** What every client gets, whatever they buy. */
export const included = [
  { title: 'One client per market', text: 'We work with one company per trade in each area, never with your competitor.' },
  { title: 'You own everything', text: 'Domain, code, hosting and ad accounts are in your name from day one.' },
  { title: 'No long contracts', text: 'Monthly plans run month to month. Cancel with 30 days’ notice.' },
  { title: 'Every lead tracked', text: 'Calls and forms tied to their source, in a report you can read in two minutes.' },
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
  { label: 'Call and form tracking', values: [true, true, true] },
  { label: 'Monthly report and call', values: [true, true, true] },
  { label: 'Support reply time', values: ['1 business day', 'Priority, 1 business day', '1 business day'] },
];

export const pricingFaqs = [
  {
    q: 'Is ad spend included in the price?',
    a: 'No. Your ad budget is paid directly to Google from your own account, so you always see exactly what was spent. Our fee covers the management.',
  },
  {
    q: 'Is there a setup fee or a long contract?',
    a: 'There is no setup fee on monthly plans and no long contract. Plans run month to month and you can cancel with 30 days’ notice.',
  },
  {
    q: 'Do I need a new website before starting SEO or Ads?',
    a: 'Not always. The free check tells you whether your current site can convert visitors. If it can, we start on it. If it loses calls, we tell you what to fix first.',
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
    a: 'A percentage rewards spending more, not getting more jobs. A flat fee keeps our advice honest when the right answer is to spend less.',
  },
];
