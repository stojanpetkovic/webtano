import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Check,
  FileText,
  Hourglass,
  KeyRound,
  LayoutTemplate,
  MailX,
  MapPin,
  Phone,
  SearchX,
  ShieldCheck,
  Target,
  Wallet,
  Zap,
} from 'lucide-react';
import { CheckForm } from '@/components/site/CheckForm';
import { CountUp } from '@/components/site/CountUp';
import { HeroBackdrop } from '@/components/site/HeroBackdrop';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/Section';
import { AdsVisual, LeadsVisual, SearchVisual, SpeedVisual } from '@/components/site/ServiceVisuals';
import { caseStudies } from '@/content/work';
import { LighthouseCard, RatingChip } from '@/components/site/CaseVisuals';
import { AreaVisual, NumbersVisual, OwnershipVisual, RingingPhone } from '@/components/site/PromiseVisuals';

const heroStats = [
  { value: '1,010', label: 'tracked leads for one tree service' },
  { value: '11.2%', label: 'of visitors called, for medical transport' },
  { value: '< 1 day', label: 'to reply to every enquiry' },
];

// The customer's path from a search to a booked job, and where each step leaks.
const problems = [
  {
    stage: 'Search',
    icon: SearchX,
    title: 'They can’t find you',
    text: 'Thin pages and no local content keep you off page one, and ChatGPT or Google’s AI answers name someone else.',
    fix: 'A page for every service and town, written the way people search.',
  },
  {
    stage: 'Visit',
    icon: Hourglass,
    title: 'They leave before it loads',
    text: 'Every extra second on a phone loses people before they see your number, and the ones you paid for with ads go first.',
    fix: 'Pages that open in under two seconds, number on the first screen.',
  },
  {
    stage: 'Enquiry',
    icon: MailX,
    title: 'The enquiry goes cold',
    text: 'Forms land in an inbox nobody checks. By the time you reply, the customer has booked the next company.',
    fix: 'Every call and form reaches your phone the second it happens.',
  },
  {
    stage: 'Budget',
    icon: Wallet,
    title: 'You can’t tell what pays',
    text: 'Clicks, impressions and agency reports, but no answer to the only question that matters: which dollars brought jobs?',
    fix: 'One monthly report: leads, calls and cost per lead, by source.',
  },
];

// Bento layout on desktop: the lead feed runs down the right, Google Ads spans two columns.
const services = [
  {
    icon: LayoutTemplate,
    visual: SpeedVisual,
    area: 'lg:col-start-1 lg:row-start-1',
    title: 'Fast websites',
    text: 'Custom pages that open instantly on any phone, with your phone number and reviews on the first screen.',
    points: ['Built for phones first', 'Lighthouse scores in the 90s'],
  },
  {
    icon: MapPin,
    visual: SearchVisual,
    area: 'lg:col-start-2 lg:row-start-1',
    title: 'Local SEO and AI search',
    text: 'A page for every service and every area you cover, written the way your customers search on Google and in ChatGPT.',
    points: ['Service and area pages', 'Structured data built in'],
  },
  {
    icon: Target,
    visual: AdsVisual,
    area: 'lg:col-span-2 lg:col-start-1 lg:row-start-2',
    title: 'Google Ads',
    text: 'Campaigns for the jobs you want, in the areas you serve, with every call and form tied back to the keyword that brought it.',
    points: ['Call and form tracking', 'Budget moved to what pays'],
  },
  {
    icon: BellRing,
    visual: LeadsVisual,
    area: 'lg:col-start-3 lg:row-span-2 lg:row-start-1',
    title: 'Lead tracking and reports',
    text: 'Every form and call reaches you the second it happens, and a monthly report shows visitors, leads and cost per lead.',
    points: ['Instant lead emails', 'One plain-language report'],
  },
];

const promises = [
  {
    icon: MapPin,
    title: 'One company per area',
    visual: AreaVisual,
    text: 'We never work for two competitors in the same service area. The pages and ads we build for you are yours alone.',
  },
  {
    icon: KeyRound,
    title: 'Everything in your name',
    visual: OwnershipVisual,
    text: 'Domain, code, hosting and ad account belong to you from day one. No lock-in, nothing held hostage.',
  },
  {
    icon: FileText,
    title: 'Numbers, not excuses',
    visual: NumbersVisual,
    text: 'You see every lead as it arrives and one plain-language report a month. If something does not pay, we say so first.',
  },
];

const reportPoints = [
  { icon: BellRing, title: 'Every enquiry, instantly', text: 'The full form, the page and the ad or search behind it, in your inbox the second it is sent.' },
  { icon: Phone, title: 'Every call counted', text: 'Taps on your phone number, WhatsApp and text links count as leads, next to the forms.' },
  { icon: Wallet, title: 'Cost per lead and ROAS', text: 'Add your ad spend and the report shows what each lead really cost and what it returned.' },
  { icon: ShieldCheck, title: 'Private by design', text: 'Visitors are counted without cookies and without following them across other websites.' },
];

const steps = [
  {
    title: 'Free website check',
    when: 'Within 1 business day',
    get: 'An honest review of your site and your top local competitors',
    text: 'Send the form. Within one business day we review your site and your top local competitors and tell you honestly what holds you back.',
  },
  {
    title: 'One clear proposal',
    when: 'One short call',
    get: 'Scope, timeline and one fixed price in writing',
    text: 'A short call, then one document: what we build or run, when it is ready, and one fixed price.',
  },
  {
    title: 'Build and launch',
    when: 'Your old site stays live',
    get: 'A preview link to follow every step',
    text: 'You follow progress on a preview link. Your current site stays live until the new one is ready, and old pages are redirected.',
  },
  {
    title: 'Measure and grow',
    when: 'Every month',
    get: 'Every lead as it arrives and one plain report',
    text: 'Tracking is on from day one. Each month you see what came in, and we put the budget where the jobs come from.',
  },
];

const faqs = [
  {
    q: 'How much does it cost?',
    a: 'Every project gets one fixed price, agreed before work starts. Google Ads and SEO run on a monthly fee that we agree up front. No hourly billing and no surprises.',
  },
  {
    q: 'Do you work with my competitors?',
    a: 'No. We take one company per trade in each service area, so the pages and ads we build for you never compete with another client of ours.',
  },
  {
    q: 'What happens to my current site and rankings?',
    a: 'Your current site stays live until the new one is ready. Content and addresses move over, and old pages are redirected so nothing that ranks today gets lost.',
  },
  {
    q: 'Who owns the website?',
    a: 'You do. The domain, the code and the hosting are in your name from day one. If you ever leave, you take everything with you.',
  },
  {
    q: 'Do you only work with tree services?',
    a: 'Tree services are where most of our work is, but the same approach works for any local company that lives on phone calls: dentists, medical transport, contractors and more.',
  },
  {
    q: 'How fast do you reply?',
    a: 'Within one business day, to every enquiry.',
  },
];

// Short proof lines for the client cards under the hero.
const clientHighlight: Record<string, { value: string; label: string }> = {
  'tree-jaws': { value: '1,010', label: 'tracked leads from Google Ads' },
  'mahalo-tree-service': { value: '100', label: 'Lighthouse SEO, $0 on ads' },
  'care-trans': { value: '11.2%', label: 'of visitors picked up the phone' },
  'eric-dental-centar': { value: '60', label: 'pages in three languages' },
};

const clientProof = [
  { value: '1,000+', label: 'Tracked leads' },
  { value: '4.9–5.0★', label: 'Client Google ratings' },
  { value: '2', label: 'Countries' },
];

const primaryButton =
  'group inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-semibold text-forest-950 shadow-glow transition duration-300 hover:-translate-y-0.5 hover:bg-lime-dark';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-spotlight relative overflow-hidden pt-14 pb-24 text-white sm:pt-20 lg:pb-32">
        <HeroBackdrop />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="text-center lg:text-left">
            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs tracking-wide text-white/75 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur">
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-lime" aria-hidden />
                Taking on one company per service area
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[2.6rem] leading-[1.02] text-balance sm:text-6xl lg:text-[4.4rem]">
                Websites and ads that turn searches into <span className="text-gradient">booked jobs</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/70 lg:mx-0">
                WebTano builds fast websites and runs local SEO and Google Ads for tree services and other local companies. Every
                call and form is counted, so you see exactly which dollars bring in work.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="#hero-form" className={`${primaryButton} w-full sm:w-auto`}>
                  Get a free website check
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
                <Link
                  href="#work"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10 sm:w-auto"
                >
                  See the results
                </Link>
              </div>
              <p className="mt-5 flex items-center justify-center gap-2 text-sm text-white/55 lg:justify-start">
                <Check className="h-4 w-4 text-lime" aria-hidden />
                Free, no obligation, reply within one business day
              </p>
            </Reveal>
            <dl className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
              {heroStats.map((s, i) => (
                <Reveal key={s.label} delay={320 + i * 90}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur transition duration-300 hover:border-white/20 hover:bg-white/[0.06] sm:p-4 lg:text-left">
                    <dd className="font-display text-2xl text-white sm:text-3xl">
                      <CountUp value={s.value} />
                    </dd>
                    <dt className="mt-1.5 font-mono text-[10px] leading-snug tracking-wide text-white/50 uppercase sm:text-[11px]">{s.label}</dt>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal variant="scale" delay={200} className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="pointer-events-none absolute -inset-12 rounded-full bg-forest-600/30 blur-3xl" aria-hidden />
            <div className="relative">
              <CheckForm compact />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Clients */}
      <section className="bg-clients hairline-bottom relative overflow-hidden py-16 sm:py-20">
        <div className="grid-lines-light pointer-events-none absolute inset-0" aria-hidden />
        {/* The hero's dark edge melts into this section instead of stopping at a hard line. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-forest-975/[0.07] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent" aria-hidden />
        <div className="hero-aurora pointer-events-none top-1/2 left-1/2 h-72 w-[46rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(197_242_74/0.3),transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:items-end lg:text-left">
            <Reveal>
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-forest-700 uppercase">Growing with local companies like</p>
              <h2 className="mt-3 max-w-xl font-display text-2xl text-balance text-forest-950 sm:text-3xl">
                Real businesses, real numbers, measured by our own tracking
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <dl className="flex divide-x divide-zinc-200 rounded-2xl border border-zinc-200/80 bg-white/80 shadow-soft backdrop-blur">
                {clientProof.map((p) => (
                  <div key={p.label} className="flex flex-col-reverse px-4 py-3 sm:px-6">
                    <dt className="font-mono text-[10px] tracking-wide text-zinc-500 uppercase">{p.label}</dt>
                    <dd className="font-display text-xl text-forest-950 sm:text-2xl">{p.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {caseStudies.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 90}>
                <Link
                  href={`/work/${c.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-forest-200 hover:shadow-lift"
                >
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="relative flex h-28 items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-5 sm:h-36">
                    <Image
                      src={`/clients/${c.slug}.webp`}
                      alt={c.client}
                      width={332}
                      height={160}
                      className="h-14 w-auto max-w-full object-contain transition duration-500 ease-out group-hover:scale-110 sm:h-20"
                    />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-zinc-100 p-4 sm:p-5">
                    <p className="font-mono text-[10px] tracking-wide text-zinc-500 uppercase">
                      {c.sector} · {c.location.split(',')[0]}
                    </p>
                    <p className="mt-2 font-display text-2xl text-forest-700 sm:text-3xl">
                      <CountUp value={clientHighlight[c.slug].value} />
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-zinc-600 sm:text-sm">{clientHighlight[c.slug].label}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-forest-800 sm:text-sm">
                      Case study
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-leaks relative overflow-hidden py-24 sm:py-32">
        <div className="grid-lines-light pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_55%,#000_20%,transparent_75%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-red-700 uppercase shadow-soft ring-1 ring-red-100">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
                What it costs you
              </p>
              <h2 className="mt-4 font-display text-3xl text-balance text-forest-950 md:text-[2.75rem] md:leading-[1.08]">
                Your website may be sending customers to the company down the road
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-lg leading-relaxed text-pretty text-zinc-600">
                Nothing warns you. No error and no alert, just calls that never come. Here is where a customer slips away on the way from
                a search to a booked job.
              </p>
            </Reveal>
          </div>

          <ol className="relative mt-16 grid gap-6 lg:grid-cols-4 lg:gap-5">
            {/* The path itself: a line that runs through all four stages. */}
            <span className="pipeline pointer-events-none absolute top-[1.15rem] right-[12.5%] left-[12.5%] hidden h-0.5 rounded-full lg:block" aria-hidden />
            <span className="pipeline-v pointer-events-none absolute top-4 bottom-4 left-[1.15rem] w-0.5 rounded-full lg:hidden" aria-hidden />
            {problems.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 120} className="relative flex flex-col pl-14 lg:pl-0">
                <div className="absolute top-0 left-0 lg:static lg:flex lg:justify-center">
                  <span className="relative z-10 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full bg-forest-950 font-mono text-xs font-medium text-lime shadow-lift ring-4 ring-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-2.5 mb-3 font-mono text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase lg:mt-3 lg:mb-4 lg:text-center">
                  {p.stage}
                </p>
                <article className="group flex flex-1 flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100 transition duration-300 group-hover:scale-105">
                        <p.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="rounded-full bg-red-50 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-red-700 uppercase ring-1 ring-red-100">
                        Leak
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg text-forest-950">{p.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{p.text}</p>
                  </div>
                  <div className="flex gap-3 border-t border-forest-100 bg-forest-50/70 px-5 py-4 sm:px-6">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-700 text-lime">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    <p className="text-sm leading-snug text-forest-900">
                      <span className="font-semibold">We fix it: </span>
                      {p.fix}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={150}>
            <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-3xl bg-forest-975 px-6 py-6 text-center text-white shadow-float ring-1 ring-white/10 sm:px-8 md:flex-row md:text-left">
              <p className="max-w-2xl text-lg text-white/80">
                <span className="font-semibold text-white">Close all four leaks</span> and the same ad budget brings in more booked jobs. The
                free check shows you which ones are open on your site.
              </p>
              <Link href="#hero-form" className={`${primaryButton} shrink-0`}>
                Find my leaks
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-spotlight relative scroll-mt-16 overflow-hidden py-24 text-white sm:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              light
              eyebrow="What we do"
              title="Everything between a search and a phone call"
              lead="One team for the website, the search rankings, the ads and the tracking, so nothing falls between two agencies."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className={s.area}>
                <article className="group ring-gradient flex h-full flex-col overflow-hidden rounded-3xl bg-white/[0.03] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]">
                  <div className="relative border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 sm:p-6">
                    <s.visual />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-lime ring-1 ring-lime/25 transition duration-300 group-hover:bg-lime group-hover:text-forest-950">
                        <s.icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <h3 className="font-display text-xl">{s.title}</h3>
                    </div>
                    <p className="mt-3 flex-1 leading-relaxed text-white/65">{s.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {s.points.map((point) => (
                        <li
                          key={point}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10"
                        >
                          <Check className="h-3.5 w-3.5 text-lime" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-[10px] tracking-wide text-white/35 uppercase">
            Illustrations use example data. Real figures are in the case studies below.
          </p>
        </div>
      </section>

      {/* Results */}
      <section id="work" className="bg-results relative scroll-mt-16 overflow-hidden py-24 sm:py-32">
        <div className="grid-lines-light pointer-events-none absolute inset-x-0 top-0 h-[36rem] [mask-image:linear-gradient(#000,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Results"
              title="Real numbers from real client sites"
              lead="Every figure below comes from the client’s own lead tracking, ad account or a Lighthouse run on the live site, not from a mock-up."
            />
          </Reveal>
          <div className="mt-16 space-y-10 sm:space-y-14">
            {caseStudies.map((c, i) => {
              const [first, second] = c.stats.filter((s) => !s.value.endsWith('★'));
              const shot = c.shots[0];
              const flip = i % 2 === 1;
              return (
                <Reveal key={c.slug} as="article" className="group/case">
                  <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_1px_2px_rgb(6_35_26/0.04),0_8px_24px_-12px_rgb(6_35_26/0.10)] ring-1 ring-zinc-200/80 lg:grid-cols-[1.08fr_1fr]">
                    {/* The site itself, framed on a dark stage with its live scores. */}
                    <div className={`case-stage relative flex items-center overflow-hidden px-5 pt-8 pb-6 sm:px-10 sm:pt-12 sm:pb-10 ${flip ? 'lg:order-2' : ''}`}>
                      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000,transparent)]" aria-hidden />
                      <div className="relative w-full">
                        <Link
                          href={`/work/${c.slug}`}
                          aria-label={`${c.client} case study`}
                          className="block overflow-hidden rounded-xl bg-white shadow-[0_16px_32px_-16px_rgb(0_0_0/0.5)] ring-1 ring-white/15 transition duration-500 group-hover/case:-translate-y-1"
                        >
                          <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3.5 py-2" aria-hidden>
                            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                            <span className="ml-2 flex min-w-0 items-center gap-1 truncate rounded-md bg-white px-2.5 py-0.5 text-[10px] text-zinc-500 ring-1 ring-zinc-200">
                              <ShieldCheck className="h-3 w-3 shrink-0 text-forest-600" />
                              {c.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </span>
                          </div>
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                              src={shot.src}
                              alt={shot.alt}
                              fill
                              sizes="(min-width: 1024px) 32rem, 100vw"
                              className="object-cover object-top transition duration-[1.2s] ease-out group-hover/case:scale-[1.04]"
                            />
                          </div>
                        </Link>
                        <div className="absolute -top-4 right-3 sm:-top-5 sm:-right-4">
                          <RatingChip stats={c.stats} />
                        </div>
                        <div className="relative -mt-10 ml-3 w-fit sm:-mt-12 sm:-ml-4">
                          <LighthouseCard scores={c.lighthouse} />
                        </div>
                      </div>
                    </div>

                    <div className="relative flex flex-col p-7 sm:p-10 lg:p-12">
                      <span className="pointer-events-none absolute top-5 right-7 font-display text-7xl leading-none text-zinc-100 select-none sm:text-8xl" aria-hidden>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="relative flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-forest-50 px-3 py-1 font-mono text-[10px] font-medium tracking-[0.12em] text-forest-700 uppercase ring-1 ring-forest-100">
                          {c.sector}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-zinc-500 uppercase">
                          <MapPin className="h-3 w-3" aria-hidden />
                          {c.location}
                        </span>
                      </div>
                      <h3 className="relative mt-4 font-display text-3xl text-forest-950 sm:text-4xl">{c.client}</h3>
                      <p className="relative mt-3 leading-relaxed text-zinc-600 sm:text-lg">{c.summary}</p>

                      <div className="relative mt-7 rounded-2xl bg-forest-975 p-5 text-white sm:p-6">
                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(80%_120%_at_100%_0%,rgb(197_242_74/0.18),transparent_60%)]" aria-hidden />
                        <p className="relative flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-lime uppercase">
                          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime" aria-hidden />
                          Headline result
                        </p>
                        <p className="relative mt-2 font-display text-5xl leading-none text-gradient sm:text-6xl">
                          <CountUp value={c.headline.value} />
                        </p>
                        <p className="relative mt-2 text-sm text-white/70">{c.headline.label}</p>
                      </div>
                      <dl className="relative mt-3 grid grid-cols-2 gap-3">
                        {[first, second].filter(Boolean).map((m) => (
                          <div key={m.label} className="flex flex-col-reverse rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200/70">
                            <dt className="mt-1 text-xs leading-snug text-zinc-500">{m.label}</dt>
                            <dd className="font-display text-2xl text-forest-800 sm:text-3xl">
                              <CountUp value={m.value} />
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <div className="relative mt-auto flex flex-wrap items-center justify-between gap-4 pt-7">
                        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                          {c.services.slice(0, 4).map((sv) => (
                            <li key={sv} className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600">
                              <Check className="h-3.5 w-3.5 text-forest-600" aria-hidden />
                              {sv}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/work/${c.slug}`}
                          className="group inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-lift"
                        >
                          View case study
                          <ArrowRight className="h-4 w-4 text-lime transition-transform group-hover:translate-x-1" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-14 flex flex-col items-center gap-3 text-center">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white px-5 py-3 font-semibold text-forest-800 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-forest-700 hover:shadow-lift"
            >
              All case studies
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <p className="font-mono text-[10px] tracking-wide text-zinc-500 uppercase">Lighthouse scores measured on mobile</p>
          </Reveal>
        </div>
      </section>

      {/* Promises */}
      <section className="bg-promises relative overflow-hidden py-24 text-white sm:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_30%_40%,#000,transparent)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-lime uppercase ring-1 ring-white/12">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
              How we work
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance md:text-[2.75rem] md:leading-[1.08]">
              We only win when <span className="text-gradient">the phone rings</span>
            </h2>
            <p className="mt-4 text-lg text-pretty text-white/70">
              Most agencies get paid for activity. We judge our work by one number, the leads you can count, and these three rules are part of
              every agreement.
            </p>
            <div className="ring-gradient mt-8 flex items-center gap-5 rounded-3xl bg-white/[0.03] p-5 sm:p-6">
              <RingingPhone />
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-white/45 uppercase">What we answer to</p>
                <p className="mt-1 font-display text-xl sm:text-2xl">Calls and forms, counted</p>
                <p className="mt-1 text-sm text-white/60">Not clicks, impressions or rankings on their own.</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/#hero-form"
                className="group inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-forest-950 shadow-glow transition hover:-translate-y-0.5 hover:bg-lime-dark"
              >
                Get a free website check
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href="#work" className="rounded-full px-4 py-3 text-sm font-semibold text-white/75 transition hover:text-white">
                See the results
              </Link>
            </div>
          </Reveal>

          <ol className="space-y-4">
            {promises.map((p, i) => (
              <Reveal key={p.title} as="li" delay={i * 110}>
                <div className="ring-gradient group grid items-center gap-6 rounded-3xl bg-white/[0.03] p-6 transition duration-300 hover:bg-white/[0.05] sm:grid-cols-[1fr_13.5rem] sm:p-7">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-lime ring-1 ring-lime/25 transition group-hover:bg-lime/15">
                        <p.icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.14em] text-white/45 uppercase">Rule {String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl">{p.title}</h3>
                    <p className="mt-2 leading-relaxed text-white/65">{p.text}</p>
                  </div>
                  <div className="rounded-2xl bg-forest-975/70 p-3.5 ring-1 ring-white/[0.08]">
                    <p.visual />
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Report */}
      <section id="report" className="bg-report relative scroll-mt-16 overflow-hidden py-24 sm:py-32">
        <div className="grid-lines-light pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_75%_45%,#000,transparent)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-forest-700 uppercase shadow-soft ring-1 ring-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-600" aria-hidden />
                Tracking and monthly report
              </p>
              <h2 className="mt-4 font-display text-3xl text-balance text-forest-950 md:text-[2.75rem] md:leading-[1.08]">
                Without numbers you are guessing, and that is how budgets disappear
              </h2>
              <p className="mt-4 text-lg text-pretty text-zinc-600">
                Every site we build or run comes with our own lead tracking: every enquiry, every call and every dollar, in one report written in
                plain language.
              </p>
            </Reveal>
            <ul className="mt-9 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {reportPoints.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 80} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-950 text-lime">
                    <p.icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-[17px] text-forest-950">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={200} className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/demo/report"
                className="group inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-forest-800"
              >
                Open the live demo report
                <ArrowUpRight className="h-4 w-4 text-lime transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
              <span className="text-sm text-zinc-500">Example data, every button works.</span>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={150} className="relative">
            <div className="pointer-events-none absolute -inset-4 rounded-full bg-[radial-gradient(closest-side,rgb(197_242_74/0.22),transparent)] blur-2xl sm:-inset-10" aria-hidden />
            <Link
              href="/demo/report"
              aria-label="Open the demo report"
              className="group relative block overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(6_35_26/0.05),0_24px_48px_-24px_rgb(6_35_26/0.28)] ring-1 ring-zinc-200/80"
            >
              <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3.5 py-2" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                <span className="ml-2 flex items-center gap-1 rounded-md bg-white px-2.5 py-0.5 text-[10px] text-zinc-500 ring-1 ring-zinc-200">
                  <ShieldCheck className="h-3 w-3 text-forest-600" />
                  webtano.com/demo/report
                </span>
              </div>
              <div className="relative aspect-[5/5.2] overflow-hidden">
                <Image
                  src="/work/report-example.webp"
                  alt="The demo monthly report: visitors, inquiries, calls, cost per lead and a daily chart, with example data."
                  width={1586}
                  height={2226}
                  sizes="(min-width: 1024px) 34rem, 92vw"
                  className="h-auto w-full transition duration-[1.4s] ease-out group-hover:-translate-y-[6%]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" aria-hidden />
                <span className="absolute inset-x-0 bottom-5 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-4 py-2 text-xs font-semibold text-white opacity-0 shadow-lift transition duration-300 group-hover:opacity-100">
                    Try it yourself
                    <ArrowUpRight className="h-3.5 w-3.5 text-lime" aria-hidden />
                  </span>
                </span>
              </div>
            </Link>

            <div className="absolute top-14 -left-3 hidden w-60 rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-zinc-200/80 sm:block lg:-left-10">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700 text-lime">
                  <BellRing className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-forest-950">New enquiry: Free estimate</p>
                  <p className="text-[11px] text-zinc-500">From Google Ads · just now</p>
                </div>
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-lime" aria-hidden />
              </div>
            </div>
            <div className="absolute -right-3 bottom-16 hidden rounded-2xl bg-forest-950 px-4 py-3 text-white shadow-soft sm:block lg:-right-8">
              <p className="font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">Cost per contact</p>
              <p className="mt-0.5 font-display text-2xl text-lime">$12.50</p>
              <p className="text-[11px] text-white/60">Return on ad spend 5.3×</p>
            </div>
            <span className="absolute -bottom-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-forest-950 shadow-glow">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              Included with every site
            </span>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-process relative scroll-mt-16 overflow-hidden py-24 text-white sm:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              light
              eyebrow="How it works"
              title="Four steps from a site that loses customers to one that wins them"
              lead="No long meetings and no surprises. You always know what happens next."
            />
          </Reveal>

          <Reveal as="ol" className="relative mt-16 grid gap-5 lg:grid-cols-4 lg:gap-6">
            {/* The progress line fills from step one to step four as the section comes into view. */}
            <span className="pointer-events-none absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-white/10 lg:block" aria-hidden>
              <span className="proc-fill-x absolute inset-y-0 left-0 bg-gradient-to-r from-lime via-lime to-forest-600" />
            </span>
            <span className="pointer-events-none absolute top-6 bottom-6 left-6 w-px bg-white/10 lg:hidden" aria-hidden>
              <span className="proc-fill-y absolute inset-x-0 top-0 bg-gradient-to-b from-lime to-forest-600" />
            </span>
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex flex-col pl-16 lg:pl-0" style={{ '--step': i } as React.CSSProperties}>
                <span className="proc-node absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-full bg-forest-975 font-mono text-sm font-medium lg:relative lg:mx-auto">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="proc-card group flex-1 rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 transition duration-300 hover:bg-white/[0.06] lg:mt-6">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-lime/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-lime uppercase ring-1 ring-lime/20">
                    {s.when}
                  </p>
                  <h3 className="mt-4 font-display text-xl">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">{s.text}</p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">You get</p>
                    <p className="mt-1.5 flex gap-2 text-sm text-white/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" aria-hidden />
                      {s.get}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </Reveal>

          <Reveal delay={150}>
            <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-full bg-white/[0.04] p-2 pl-6 ring-1 ring-white/10 sm:flex-row max-sm:rounded-3xl max-sm:p-5 max-sm:text-center">
              <p className="text-sm text-white/75">
                <span className="font-semibold text-white">Step one is free</span> and you are under no obligation after it.
              </p>
              <Link
                href="/#hero-form"
                className="group inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold whitespace-nowrap text-forest-950 shadow-glow transition hover:bg-lime-dark"
              >
                Start with the free check
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-faq hairline-top relative scroll-mt-16 overflow-hidden py-24 sm:py-32">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_50%_60%_at_15%_40%,#000,transparent)]" aria-hidden />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            }).replace(/</g, '\\u003c'),
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-forest-700 uppercase shadow-soft ring-1 ring-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-600" aria-hidden />
              Questions
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance text-forest-950 md:text-[2.75rem] md:leading-[1.08]">Before you ask</h2>
            <p className="mt-4 text-lg text-pretty text-zinc-600">The things owners ask us most, answered straight. No fine print.</p>

            <div className="mt-8 overflow-hidden rounded-3xl bg-forest-975 text-white ring-1 ring-forest-900">
              <div className="relative p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_100%_0%,rgb(197_242_74/0.16),transparent_60%)]" aria-hidden />
                <p className="relative flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-lime uppercase">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime" aria-hidden />
                  Reply within one business day
                </p>
                <p className="relative mt-3 font-display text-2xl">Still have a question?</p>
                <p className="relative mt-2 text-sm leading-relaxed text-white/65">
                  Ask it in the free check form. A real person who has looked at your site writes back.
                </p>
                <Link
                  href="#hero-form"
                  className="group relative mt-5 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-forest-950 shadow-glow transition hover:bg-lime-dark"
                >
                  Ask in the free check
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
              <ul className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 text-center">
                {[
                  ['1', 'fixed price'],
                  ['0', 'lock-in'],
                  ['1', 'client per area'],
                ].map(([v, k]) => (
                  <li key={k} className="px-2 py-4">
                    <p className="font-display text-2xl text-lime">{v}</p>
                    <p className="font-mono text-[9px] tracking-wide text-white/50 uppercase">{k}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="divide-y divide-zinc-200 rounded-3xl bg-white px-5 shadow-[0_1px_2px_rgb(6_35_26/0.04),0_8px_24px_-12px_rgb(6_35_26/0.10)] ring-1 ring-zinc-200/80 sm:px-8">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details name="faq" open={i === 0} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-xs text-zinc-400 transition group-open:text-forest-600">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 font-display text-[1.08rem] text-forest-950 sm:text-lg">{f.q}</span>
                    <span
                      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-forest-700 ring-1 ring-zinc-200 transition duration-300 group-open:bg-forest-950 group-open:text-lime group-open:ring-forest-950 group-hover:ring-zinc-300"
                      aria-hidden
                    >
                      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                      <span className="absolute h-3.5 w-0.5 rounded-full bg-current transition duration-300 group-open:rotate-90 group-open:opacity-0" />
                    </span>
                  </summary>
                  <div className="faq-body">
                    <div>
                      <p className="pr-2 pb-6 pl-9 leading-relaxed text-zinc-600 sm:pr-12">{f.a}</p>
                    </div>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal variant="scale">
            <div className="bg-spotlight relative overflow-hidden rounded-[2rem] px-6 py-16 text-center text-white shadow-float ring-1 ring-white/10 sm:py-24">
              <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" aria-hidden />
              <h2 className="relative mx-auto max-w-2xl font-display text-3xl text-balance md:text-5xl md:leading-[1.05]">
                The company that shows up first gets the call. Let’s make that <span className="text-gradient">you</span>.
              </h2>
              <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/70">
                The check is free. The worst case: you learn exactly what loses you customers and what to fix first.
              </p>
              <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="#hero-form" className={primaryButton}>
                  Get my free website check
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  See our work
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
