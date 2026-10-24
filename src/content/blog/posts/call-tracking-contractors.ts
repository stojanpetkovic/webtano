import type { Post } from '../types';

export const post: Post = {
  slug: 'call-tracking-for-contractors',
  title: 'Call tracking for contractors: how to know which ad made the phone ring',
  seoTitle: 'Call tracking for contractors: which ad made the phone ring',
  description:
    'Most home service leads still arrive by phone, and most companies cannot say where those calls came from. Here is how call tracking works, what it should tell you, and how to set it up without hurting your local SEO.',
  category: 'Lead tracking',
  keywords: ['call tracking', 'call tracking for contractors', 'lead tracking', 'Google Ads conversion tracking', 'home services marketing', 'tree service leads'],
  published: '2026-10-24',
  takeaways: [
    'For trades, the phone is the main conversion. If you only count form fills, you are missing most of your leads.',
    'Good call tracking ties each call to its source: the ad, the search, the Business Profile or a referral.',
    'Use dynamic numbers on your website and keep your real number on your Business Profile and listings.',
    'The goal is a cost per real lead by channel, so budget goes to what brings jobs.',
  ],
  body: [
    {
      p: 'Ask a tree service owner where their leads come from and you will usually hear "Google, mostly." Ask which part of Google, and which ads, and the answer gets vague. That is not a lack of interest. It is because most leads in this trade arrive as phone calls, and a phone call does not come with a label saying which ad, page or listing produced it.',
    },
    {
      p: 'Call tracking fixes that. Done right, it is the single most useful thing a home service company can add to its marketing, because it turns "I think the ads work" into "the ads brought 47 calls last month at this cost each".',
    },
    { h2: 'Why calls matter more than forms in home services' },
    {
      p: 'Someone with a tree on their fence or water on their floor wants to talk to a person now. On most of the service sites we track, calls outnumber forms. On [Tree Jaws](/work/tree-jaws), for example, the last 30 days brought 47 calls and 27 forms. If that company only measured forms, it would undercount its leads by almost two thirds and would probably cut ads that were working.',
    },
    { h2: 'How call tracking works, in plain words' },
    {
      p: 'There are two common ways to track calls, and most good setups use both:',
    },
    {
      ul: [
        '**Tracking numbers:** each source shows a different phone number. A call to that number is counted for that source and forwarded to your real phone. Dynamic number insertion swaps the number shown on your website depending on how the visitor arrived.',
        '**Click-to-call tracking:** on phones, most people tap the number instead of dialling it. A small script on your site records each tap together with the page, the ad and the search that brought the visitor.',
      ],
    },
    {
      p: 'Tracking numbers give you the most complete picture, including people who write the number down and call later. Click tracking is simpler, free to run and covers the majority of mobile visitors.',
    },
    { h2: 'What a good call report should tell you' },
    {
      table: {
        head: ['Question', 'Why it matters'],
        rows: [
          ['Which source brought the call?', 'Google Ads, organic search, Business Profile, Local Services Ads, referral'],
          ['Which campaign or search term?', 'So you can raise bids on "emergency tree removal" and cut "free firewood"'],
          ['Which page were they on?', 'Shows which pages sell and which only get traffic'],
          ['Was it a new customer?', 'Separates new leads from existing customers and suppliers'],
          ['How long was the call?', 'A 10-second call is rarely a lead. A 4-minute call usually is'],
          ['Was it answered?', 'Missed calls are paid leads you never spoke to'],
        ],
      },
    },
    { h2: 'Will tracking numbers hurt my local SEO?' },
    {
      p: 'Only if you set them up carelessly. Google uses your name, address and phone number to confirm who you are. If your number is different on every directory, that consistency breaks. The safe setup is:',
    },
    {
      ol: [
        '**Keep your real number** on your Google Business Profile as the primary number, on your website\'s footer and in your structured data, and on all directories.',
        '**Use dynamic numbers on your website only,** swapped in by script for visitors from ads or specific campaigns.',
        '**If you use a tracking number on your Business Profile,** put it as the primary number and keep your real one as an additional number, which is the approach Google itself allows.',
      ],
    },
    {
      tip: 'Before adding any tracking, write down your real business number and every place it appears. That list makes it easy to keep everything consistent later.',
      title: 'Start with a list',
    },
    { h2: 'Connect calls to Google Ads' },
    {
      p: 'Google Ads learns from what you tell it is a conversion. If you only report form fills, its automated bidding optimises for forms, the smaller part of your business. Send qualified calls back as conversions, ideally only calls longer than a minute or two, and the system starts to look for more people who call.',
    },
    {
      p: 'This matters even more now that Local Services Ads are moving into Google Ads. When all your paid channels report into one account, call data is what lets you compare them fairly. We covered that change in [our guide to the Local Services Ads migration](/blog/local-services-ads-move-to-google-ads).',
    },
    { h2: 'From tracking to decisions' },
    {
      p: 'The point of tracking is not a prettier report. It is three decisions you can make every month:',
    },
    {
      ul: [
        '**Where to spend more:** the channels and campaigns with the lowest cost per real lead.',
        '**What to fix:** pages with traffic but no calls, and hours with missed calls.',
        '**What to stop:** keywords and placements that bring clicks but never a call.',
      ],
    },
    {
      p: 'Every WebTano client gets this as standard: each call and form is tracked back to its source and lands in a monthly report the owner can actually read. You can [open the demo report](/demo/report) to see what it looks like, or [ask for a free check](/#hero-form) of your current setup.',
    },
  ],
  faq: [
    {
      q: 'Is call tracking legal to use?',
      a: 'Yes, tracking which source a call came from is legal. Recording calls is different: many US states require that all parties are told, so play a short notice if you record.',
    },
    {
      q: 'Do I need a new phone number for call tracking?',
      a: 'No. Tracking numbers forward to your existing phone, and click-to-call tracking needs no new number at all.',
    },
    {
      q: 'How much does call tracking cost?',
      a: 'Click-to-call tracking on your own website can be free. Services with tracking numbers usually charge a monthly fee plus a small amount per number and per minute.',
    },
    {
      q: 'What counts as a real lead from a phone call?',
      a: 'A common rule is a first-time caller who stays on the line for at least a minute or two. Short calls, repeat customers and sales calls should be filtered out.',
    },
  ],
};
