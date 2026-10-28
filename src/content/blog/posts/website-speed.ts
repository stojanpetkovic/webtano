import type { Post } from '../types';

export const post: Post = {
  slug: 'website-speed-core-web-vitals-local-business',
  title: 'Is your website too slow for mobile customers? A plain guide to Core Web Vitals',
  seoTitle: 'Core Web Vitals for local businesses, explained simply',
  description:
    'Core Web Vitals explained without the jargon: what Google measures, why a slow site costs a local service company calls, how to test yours in two minutes and what usually fixes it.',
  category: 'Websites',
  keywords: ['Core Web Vitals', 'website speed', 'PageSpeed Insights', 'mobile website', 'LCP INP CLS', 'local business website'],
  published: '2026-10-24',
  takeaways: [
    'Core Web Vitals are three measurements: how fast the main content appears, how quickly the page reacts, and how much it jumps around.',
    'They are based on real visitors\' phones, which are often slower than yours.',
    'Large images, heavy themes and too many scripts cause most problems on small business sites.',
    'Speed helps rankings a little and conversions a lot.',
  ],
  body: [
    {
      p: 'You open your own website on your phone and it looks fine. It probably is fine, on your phone, on your Wi-Fi, with the page already in its cache. Your customers see something else: a first visit, on a mid-range phone, on a mobile connection, standing outside. Google measures what they see, and so should you.',
    },
    {
      p: 'Google calls these measurements Core Web Vitals. They sound technical, but each one answers a simple question a visitor would ask.',
    },
    { h2: 'The three measurements in plain words' },
    {
      table: {
        head: ['Measurement', 'The question it answers', 'Good result'],
        rows: [
          ['Largest Contentful Paint (LCP)', 'How long until I see the main content?', '2.5 seconds or less'],
          ['Interaction to Next Paint (INP)', 'When I tap something, does it react right away?', '200 milliseconds or less'],
          ['Cumulative Layout Shift (CLS)', 'Does the page jump while I try to tap?', '0.1 or less'],
        ],
      },
    },
    {
      p: 'Google looks at these values for real visitors over the previous 28 days, and a page passes when at least three quarters of visits meet the "good" level. That is why a site can feel fast to you and still fail.',
    },
    { h2: 'Why speed matters for a local service company' },
    {
      p: 'Core Web Vitals are one of many signals in Google\'s ranking systems. They will not lift a weak page above a much better one, but between similar pages a better experience can help. The bigger effect is on people. A page that takes too long or jumps when someone tries to tap "Call" loses visitors you already paid to bring there, whether through ads or months of SEO work.',
    },
    {
      p: 'Layout shift deserves special attention on contractor sites. A cookie banner or a late-loading image that pushes the phone button down at the moment someone taps it is both annoying and expensive.',
    },
    { h2: 'Test your site in two minutes' },
    {
      ol: [
        'Go to **PageSpeed Insights** (pagespeed.web.dev) and enter your homepage.',
        'Look at the top section, "Discover what your real users are experiencing". That is real visitor data, if Google has enough of it.',
        'Check the **Mobile** tab first. That is where most of your customers are.',
        'Repeat for your most important service page, such as tree removal.',
      ],
    },
    {
      tip: 'The big performance score below the real-user data comes from a single simulated test. It is useful for finding problems, but the real-user section is what Google uses.',
      title: 'Which number counts',
    },
    { h2: 'What usually slows down small business sites' },
    { h3: 'Oversized images' },
    {
      p: 'A 5 MB photo straight from a camera, shown at the width of a phone, is the most common problem we see. Images should be resized to the size they are shown at and saved in a modern format such as WebP or AVIF. Only the first image on the page should load straight away; the rest can load as the visitor scrolls.',
    },
    { h3: 'Heavy themes and page builders' },
    {
      p: 'Many all-in-one themes load code for sliders, animations and features the site never uses. That code still has to download and run on every visit, which hurts both loading and how quickly the page reacts to taps.',
    },
    { h3: 'Too many third-party scripts' },
    {
      p: 'Chat widgets, several tracking tools, review badges, social feeds and pop-ups add up. Each one may be small, but together they can block the page. Keep the ones you use and can measure, and remove the rest.',
    },
    { h3: 'Slow hosting' },
    {
      p: 'Cheap shared hosting can make the server slow to answer before anything appears. A good host or a static site served from a content delivery network fixes this almost completely.',
    },
    { h2: 'What we do on the sites we build' },
    {
      p: 'Our sites are built as fast, mostly static pages with optimised images, very little JavaScript and as few third-party scripts as possible. The case studies on this site list the live Lighthouse scores of each client site, for example [Tree Jaws](/work/tree-jaws) and [Care Trans](/work/care-trans), so you can check them yourself.',
    },
    {
      p: 'If your PageSpeed results are red or orange and you are not sure what to fix first, [ask for a free website audit](/#hero-form). We will tell you which problems actually cost you calls.',
    },
  ],
  faq: [
    {
      q: 'What are Core Web Vitals?',
      a: 'They are three measurements Google uses to judge page experience: Largest Contentful Paint (loading), Interaction to Next Paint (responsiveness) and Cumulative Layout Shift (visual stability).',
    },
    {
      q: 'Do Core Web Vitals affect Google rankings?',
      a: 'Yes, as part of Google\'s page experience signals, but relevance and content quality matter more. The larger effect of a fast site is more visitors who stay and call.',
    },
    {
      q: 'What is a good PageSpeed score?',
      a: 'A Lighthouse performance score of 90 or more is considered good. More important is passing Core Web Vitals in the real-user data section.',
    },
    {
      q: 'How can I make my website faster without rebuilding it?',
      a: 'Resize and compress images, remove unused plugins and scripts, and move to better hosting. These steps fix most problems on small business sites.',
    },
  ],
  sources: [
    { label: 'Google Search Central: understanding Core Web Vitals and Google search results', url: 'https://developers.google.com/search/docs/appearance/core-web-vitals' },
    { label: 'web.dev: Web Vitals', url: 'https://web.dev/articles/vitals' },
  ],
};
