import type { Post } from '../types';

export const post: Post = {
  slug: 'google-ads-for-tree-services',
  title: 'Google Ads for tree services: keywords, negatives and budgets that bring real jobs',
  seoTitle: 'Google Ads for tree services: a practical guide',
  description:
    'A practical Google Ads setup for tree service companies: which keywords to bid on, the negative keywords that save money, how to handle storm season, and how to judge results by booked jobs instead of clicks.',
  category: 'Google Ads',
  keywords: ['Google Ads for tree service', 'tree service PPC', 'tree removal keywords', 'negative keywords', 'contractor advertising', 'storm season ads'],
  published: '2026-10-24',
  takeaways: [
    'Bid on what people search when they are ready to hire: removal, emergency, stump grinding and trimming, plus your towns.',
    'A strong negative keyword list (jobs, DIY, free wood, equipment) stops a large share of wasted spend.',
    'Send ad clicks to a matching service page with a visible phone number, not to the homepage.',
    'Judge the account by cost per real lead and booked jobs, which means tracking calls.',
  ],
  body: [
    {
      p: 'Google Ads can be the fastest way for a tree service to fill the schedule, or the fastest way to burn money. The difference is rarely the budget. It is which searches you pay for, where the click lands, and whether you can tell which calls turned into jobs.',
    },
    {
      p: 'This is the setup we use as a starting point for tree companies, including the account we run for [Tree Jaws](/work/tree-jaws) in South Florida, which has produced more than 1,000 tracked leads from Google Ads.',
    },
    { h2: 'Start with the searches that mean "I need to hire someone"' },
    {
      p: 'Group your keywords by service, so each group has its own ads and its own landing page:',
    },
    {
      table: {
        head: ['Ad group', 'Example searches', 'Typical intent'],
        rows: [
          ['Tree removal', 'tree removal near me, cut down tree cost, remove dead tree', 'High: ready to get quotes'],
          ['Emergency', 'emergency tree removal, fallen tree on house, storm tree service', 'Very high: needs help today'],
          ['Stump grinding', 'stump grinding near me, stump removal service', 'High, smaller jobs'],
          ['Trimming', 'tree trimming service, palm tree trimming, tree pruning near me', 'Medium to high, often seasonal'],
          ['Land clearing', 'lot clearing, land clearing contractor', 'High value, fewer searches'],
        ],
      },
    },
    {
      p: 'Use phrase and exact match for your core terms, and add your main towns as their own keywords ("tree removal Fort Lauderdale"). Broad match can work later, once the account has enough conversion data and a solid negative list.',
    },
    { h2: 'The negative keywords that save the most money' },
    {
      p: 'In tree work a large share of searches look relevant but will never become a job. Add these as negatives from day one, and review the search terms report every week:',
    },
    {
      ul: [
        '**Jobs:** jobs, hiring, salary, career, arborist certification, training.',
        '**DIY:** how to, diy, yourself, kill a tree, poison, chainsaw.',
        '**Free and wood:** free wood, firewood near me (unless you sell it), free mulch, wood chips.',
        '**Equipment:** rental, rent, stump grinder for sale, bucket truck.',
        '**Information only:** city responsibility, who is responsible, laws, permit (unless you want permit questions).',
        '**Places you do not serve:** towns outside your area that share a name or show up in searches.',
      ],
    },
    {
      tip: 'Free wood chips and mulch searches can bring a lot of clicks in some areas. If you give chips away, a separate small campaign is fine, but keep it far away from your removal budget.',
      title: 'Watch the mulch searches',
    },
    { h2: 'Ads that earn the call' },
    {
      p: 'Write ads that answer the homeowner\'s real worries: will you come quickly, are you insured, will you clean up, what will it cost. Good building blocks:',
    },
    {
      ul: [
        'Licensed and insured, with years in business.',
        'Same-day or 24/7 storm response, only if true.',
        'Free estimates, cleanup included, stump grinding available.',
        'Your rating and review count if it is strong.',
      ],
    },
    {
      p: 'Add a call asset with your tracked number, location or service area details, and sitelinks to your main services. Schedule call assets only for hours when someone answers.',
    },
    { h2: 'Send each click to the right page' },
    {
      p: 'A person who searched "stump grinding near me" should land on your stump grinding page, not your homepage. That page should load fast on a phone, show the phone number at the top, show real photos and reviews, and have a short form for people who prefer not to call. We explain what that page needs in [our guide to tree service websites](/blog/tree-service-website-that-converts).',
    },
    { h2: 'Budgets and storm season' },
    {
      p: 'Tree work is seasonal and weather driven. After a storm, search volume jumps and so do competitors\' bids. Plan for it:',
    },
    {
      ol: [
        '**Set a base budget** you can sustain all year for removals and emergency work.',
        '**Keep a storm reserve** you can switch on quickly, mostly for emergency keywords.',
        '**Shift trimming budget** to the months when people plan ahead, such as before hurricane season.',
        '**Pause or lower bids at night** if nobody answers the phone.',
      ],
    },
    { h2: 'Measure jobs, not clicks' },
    {
      p: 'A cheap click is worthless if it never calls. Track calls from ads and from your website, count only real leads (new callers who stay on the line), and if you can, mark which ones became jobs. Then judge each campaign by cost per lead and cost per job. Our article on [call tracking for contractors](/blog/call-tracking-for-contractors) covers the setup.',
    },
    {
      p: 'If you also run Local Services Ads, note that they are moving into Google Ads. Our [guide to the migration](/blog/local-services-ads-move-to-google-ads) explains what to do before your account moves.',
    },
    {
      p: 'Want an honest look at your current account and where the money goes? [Ask for a free audit](/#hero-form) and we will review your ads, landing pages and tracking.',
    },
  ],
  faq: [
    {
      q: 'How much should a tree service spend on Google Ads?',
      a: 'It depends on your area and competition. Start with a budget that can produce at least several leads a week in your market, track cost per lead, and increase spend on the campaigns that bring booked jobs.',
    },
    {
      q: 'Are Google Ads or Local Services Ads better for tree companies?',
      a: 'They work best together. Local Services Ads charge per lead and appear at the top, while Google Ads give you more control over keywords, ads and landing pages.',
    },
    {
      q: 'Why am I getting clicks but no calls?',
      a: 'Usually the searches are wrong (missing negative keywords), the landing page is slow or unclear, or calls are not being tracked. Check the search terms report first.',
    },
    {
      q: 'How long does it take for Google Ads to work for a tree service?',
      a: 'Calls can start in the first days. Expect a few weeks of tuning keywords, negatives and bids before costs settle.',
    },
  ],
};
