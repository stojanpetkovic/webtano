import type { Post } from '../types';

export const post: Post = {
  slug: 'local-services-ads-move-to-google-ads',
  title: 'Local Services Ads are moving into Google Ads: what home service companies should do before the switch',
  seoTitle: 'Local Services Ads move into Google Ads: what to do first',
  description:
    'Google is retiring the standalone Local Services Ads dashboard and turning each campaign into a pay-per-lead Performance Max campaign. Here is what changes, what stays, and the checklist to run before your account moves.',
  category: 'Google Ads',
  keywords: ['Local Services Ads', 'LSA migration', 'Google Ads', 'pay per lead', 'Performance Max', 'home services advertising'],
  published: '2026-10-24',
  takeaways: [
    'Each LSA campaign becomes a pay-per-lead campaign inside Google Ads. You still pay per lead, not per click.',
    'Your old impression, click and spend reports do not move over. Export them before your migration date.',
    'Manual and per-trade bidding go away in favour of one target cost per lead per campaign.',
    'Your business name, address and hours will come from your Google Business Profile, so fix it there first.',
  ],
  body: [
    {
      p: 'If your phone rings from the "Google Guaranteed" or "Google Screened" box at the top of search results, the place you manage it is about to change. Google is retiring the separate Local Services Ads (LSA) dashboard and moving those campaigns into regular Google Ads, where each one becomes a special pay-per-lead version of Performance Max.',
    },
    {
      p: 'For most tree services, roofers, plumbers and other home service companies, this is not a reason to panic. The ads will look the same to homeowners and you still pay for leads, not clicks. But a few settings disappear, your history does not come along, and anyone who never logs into Google Ads will now have to. Here is what we are telling our own clients.',
    },
    { h2: 'What is actually changing' },
    {
      p: 'According to the rollout details Google has shared with advertisers, the move happens account by account in phases. The first phase started in August 2026 with selected US home and storefront service categories such as plumbing, HVAC, electrical, roofing, lawn care and pest control. A second phase in late 2026 adds service-area businesses without a storefront, which is where most tree companies sit. Remaining categories and countries follow in 2027.',
    },
    {
      p: 'The account administrator gets an email about 14 days before the move, a reminder a week later, and a confirmation after it is done. If nobody watches that inbox, you can find out the hard way.',
    },
    {
      table: {
        head: ['', 'Before', 'After the move'],
        rows: [
          ['Where you manage it', 'Separate LSA dashboard or app', 'A campaign inside Google Ads'],
          ['How you pay', 'Per valid lead', 'Per valid lead (unchanged)'],
          ['Where ads show', 'Google Search and Maps', 'Google Search and Maps (unchanged)'],
          ['Bidding', 'Manual max cost per lead, or per-trade targets', 'One target cost per lead for the whole campaign'],
          ['Budget', 'Weekly', 'Daily (your weekly average divided by seven)'],
          ['Old reports', 'Impressions, clicks, spend by week', 'Not carried over'],
          ['Name, address, hours', 'Edited in LSA', 'Synced from your Google Business Profile'],
        ],
      },
    },
    { h2: 'What stays the same' },
    {
      ul: [
        '**Pay per lead.** You are charged for calls and messages that count as valid leads, and you can still dispute ones that are not.',
        '**No keywords.** Targeting still comes from the job types and service areas you select.',
        '**Your lead history.** Contact details, messages and call recordings transfer automatically.',
        '**Your badge.** The Google Verified badge carries over, so you do not need to repeat background checks.',
      ],
    },
    { h2: 'The parts that can hurt if you ignore them' },
    { h3: '1. Your history disappears' },
    {
      p: 'Past performance reports, such as weekly spend, impressions and clicks, are not migrated. After the move the old dashboard redirects into Google Ads and that data is gone. If you ever want to compare this spring with last spring, or show a partner what a lead used to cost, you need that export now.',
    },
    { h3: '2. One bid for every kind of job' },
    {
      p: 'Many companies set a higher cost per lead for valuable work, like an emergency tree removal, and a lower one for small jobs. Per-trade targets are replaced by a single target cost per lead for each campaign. If your jobs are worth very different amounts, the only way to keep separate bids is to split them into separate campaigns.',
    },
    { h3: '3. Weekly budgets become daily' },
    {
      p: 'Your weekly budget is converted into a daily one, and monthly spend can reach the daily amount times 30.4. Storm weeks used to absorb a bigger share of a weekly budget. Check the new daily figure the day your account moves and adjust it to what you actually want to spend.',
    },
    { h3: '4. Your Business Profile becomes the source of truth' },
    {
      p: 'Business name, address and hours now sync from your Google Business Profile and can only be edited there. A big change to name or address can trigger a verification review of a day or two, during which the campaign may pause. Fix any mismatch before the migration, not in the middle of your busy season.',
    },
    {
      tip: 'Do the Business Profile clean-up first, then wait for your migration email. Changing your name or address the same week your account moves is the easiest way to lose a few days of leads.',
      title: 'Order matters',
    },
    { h2: 'A 20-minute checklist before your account moves' },
    {
      ol: [
        '**Export everything** you can from the LSA dashboard: leads, weekly spend, and any performance reports. Save them somewhere other than Google.',
        '**Make sure the admin email is read** by someone in the business, not a former employee or an old agency.',
        '**Open your Google Business Profile** and compare the name, address, phone, hours and service areas with your LSA profile. Make them match.',
        '**Write down your current bids** per job type. You will need them to decide whether to split campaigns.',
        '**Note your real weekly budget** so you can sanity-check the daily figure after the move.',
        '**Pick at least six structured callouts.** The Better Business Bureau callout is being retired.',
        '**Set up call tracking you control,** so you can compare LSA leads with Google Ads and your website on the same report.',
      ],
    },
    { h2: 'Should you split your campaign?' },
    {
      p: 'Ask one question: is a lead for your best job worth at least twice a lead for your smallest one? If yes, a single target cost per lead will either overpay for the small jobs or underbid on the big ones. Splitting into two campaigns, for example removals and emergency work in one and trimming and stump grinding in another, keeps that control.',
    },
    {
      p: 'If most of your jobs are worth about the same, one campaign is simpler and gives Google more data to learn from. Google itself advises allowing up to two weeks for performance to settle after the move, so do not judge the new setup on its first few days.',
    },
    { h2: 'The upside: one place to see what pays' },
    {
      p: 'Having LSA inside Google Ads is, in the long run, a good thing. Your pay-per-lead campaign, your search campaigns and your conversion data finally sit in one account. Combined with call tracking on your website, you can see which channel brings the jobs you actually want, at what cost, without stitching three dashboards together.',
    },
    {
      p: 'That is exactly how we run accounts for clients like [Tree Jaws](/work/tree-jaws): every call and form is tied to the ad or search that produced it. If you want a second pair of eyes on your setup before the switch, [ask for a free check](/#hero-form) and we will look at your ads, profile and website together.',
    },
  ],
  faq: [
    {
      q: 'Do I pay per click after Local Services Ads move into Google Ads?',
      a: 'No. The new campaign type keeps pay-per-lead billing. You are charged for valid calls and messages, the same as before.',
    },
    {
      q: 'Will I lose my Google Guaranteed or Google Screened badge?',
      a: 'No. Google Verified badges carry over during the migration, so you do not need to redo background or licence checks.',
    },
    {
      q: 'When will my tree service account move?',
      a: 'Service-area businesses without a storefront are in the second phase, scheduled for late 2026. Your account admin receives an email about 14 days before the move.',
    },
    {
      q: 'Can I still create a new Local Services Ads campaign?',
      a: 'For now, new pay-per-lead campaigns cannot be created inside Google Ads, so new advertisers still sign up through the Local Services Ads site.',
    },
  ],
  sources: [
    { label: 'PPC Land: Google folds Local Services Ads into Google Ads, cuts historical reports', url: 'https://ppc.land/google-folds-local-services-ads-into-google-ads-cuts-historical-reports/' },
    { label: 'Search Engine Journal: Google is bringing Local Services Ads into Google Ads', url: 'https://www.searchenginejournal.com/google-is-bringing-local-services-ads/582816/' },
  ],
};
