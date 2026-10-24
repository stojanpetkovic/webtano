import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
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
import { caseStudies } from '@/content/work';

const heroStats = [
  { value: '1,010', label: 'tracked leads for one tree service' },
  { value: '11.2%', label: 'of visitors called, for medical transport' },
  { value: '< 1 day', label: 'to reply to every enquiry' },
];

const problems = [
  {
    icon: Hourglass,
    title: 'Visitors leave before the page loads',
    text: 'Every extra second on a phone loses people before they see your number, and the ones you paid for with ads are the first to go.',
  },
  {
    icon: SearchX,
    title: 'Customers can’t find you',
    text: 'Thin pages and no local content keep you off page one, and ChatGPT or Google’s AI answers name someone else.',
  },
  {
    icon: MailX,
    title: 'Enquiries go cold',
    text: 'Forms land in an inbox nobody checks. By the time you reply, the customer has booked the next company.',
  },
  {
    icon: Wallet,
    title: 'You can’t tell what pays',
    text: 'Clicks, impressions and agency reports, but no clear answer to the only question that matters: which dollars brought jobs?',
  },
];

const services = [
  {
    icon: LayoutTemplate,
    title: 'Fast websites',
    text: 'Custom pages that open instantly on any phone, with your phone number and reviews on the first screen.',
    points: ['Built for phones first', 'Lighthouse scores in the 90s'],
  },
  {
    icon: MapPin,
    title: 'Local SEO and AI search',
    text: 'A page for every service and every area you cover, written the way your customers search on Google and in ChatGPT.',
    points: ['Service and area pages', 'Structured data built in'],
  },
  {
    icon: Target,
    title: 'Google Ads',
    text: 'Campaigns for the jobs you want, in the areas you serve, with every call and form tied back to the keyword that brought it.',
    points: ['Call and form tracking', 'Budget moved to what pays'],
  },
  {
    icon: BellRing,
    title: 'Lead tracking and reports',
    text: 'Every form and call reaches you the second it happens, and a monthly report shows visitors, leads and cost per lead.',
    points: ['Instant lead emails', 'One plain-language report'],
  },
];

const promises = [
  {
    icon: MapPin,
    title: 'One company per area',
    text: 'We never work for two competitors in the same service area. The pages and ads we build for you are yours alone.',
  },
  {
    icon: KeyRound,
    title: 'Everything in your name',
    text: 'Domain, code, hosting and ad account belong to you from day one. No lock-in, nothing held hostage.',
  },
  {
    icon: FileText,
    title: 'Numbers, not excuses',
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
    text: 'Send the form. Within one business day we review your site and your top local competitors and tell you honestly what holds you back.',
  },
  {
    title: 'One clear proposal',
    text: 'A short call, then one document: what we build or run, when it is ready, and one fixed price.',
  },
  {
    title: 'Build and launch',
    text: 'You follow progress on a preview link. Your current site stays live until the new one is ready, and old pages are redirected.',
  },
  {
    title: 'Measure and grow',
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
      <section className="relative bg-white py-24 sm:py-32">
        <div className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-72 [mask-image:radial-gradient(ellipse_60%_100%_at_50%_0%,#000,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="What it costs you"
              title="Your website may be sending customers to the company down the road"
              lead="Nothing warns you. No error and no alert, just calls that never come."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="group flex h-full gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lift sm:p-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100 transition group-hover:scale-105">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest-950">{p.title}</h3>
                    <p className="mt-2 leading-relaxed text-zinc-600">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-paper hairline-top hairline-bottom relative scroll-mt-16 overflow-hidden py-24 sm:py-32">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title="Everything between a search and a phone call"
              lead="One team for the website, the search rankings, the ads and the tracking, so nothing falls between two agencies."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <div className="group flex h-full flex-col rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-forest-200 hover:shadow-lift">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-700 to-forest-950 text-lime shadow-soft transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-forest-950">{s.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-zinc-600">{s.text}</p>
                  <ul className="mt-5 space-y-2 border-t border-zinc-100 pt-4">
                    {s.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm font-medium text-forest-800">
                        <Check className="h-4 w-4 text-forest-600" aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="work" className="scroll-mt-16 bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Results"
              title="Real numbers from real client sites"
              lead="Every figure below comes from the client’s own lead tracking or ad account, not from a mock-up."
            />
          </Reveal>
          <div className="mt-16 space-y-20 sm:space-y-28">
            {caseStudies.map((c, i) => {
              const metrics = [c.headline, ...c.stats.slice(0, 2)];
              const shot = c.shots[0];
              return (
                <article key={c.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <Reveal variant="scale" className={i % 2 ? 'lg:order-2' : undefined}>
                    <Link
                      href={`/work/${c.slug}`}
                      className="group relative block overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-float transition duration-500 hover:-translate-y-1"
                      aria-label={`${c.client} case study`}
                    >
                      <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5" aria-hidden>
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                        <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 text-[11px] text-zinc-500 ring-1 ring-zinc-200">
                          {c.url.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          fill
                          sizes="(min-width: 1024px) 34rem, 100vw"
                          className="object-cover object-top transition duration-[1.2s] ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                    </Link>
                  </Reveal>
                  <div>
                    <Reveal>
                      <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-forest-700 uppercase">
                        {String(i + 1).padStart(2, '0')} · {c.sector} · {c.location}
                      </p>
                      <h3 className="mt-3 font-display text-3xl text-forest-950 sm:text-4xl">{c.client}</h3>
                      <p className="mt-3 text-lg leading-relaxed text-zinc-600">{c.summary}</p>
                    </Reveal>
                    <dl className="mt-8 grid grid-cols-3 divide-x divide-zinc-200 border-y border-zinc-200">
                      {metrics.map((m, j) => (
                        <Reveal key={m.label} delay={j * 100} className="flex flex-col-reverse px-3 py-5 first:pl-0 sm:px-5">
                          <dt className="mt-1.5 text-xs leading-snug text-zinc-500 sm:text-sm">{m.label}</dt>
                          <dd className="font-display text-3xl text-forest-700 sm:text-[2.6rem] sm:leading-none">
                            <CountUp value={m.value} />
                          </dd>
                        </Reveal>
                      ))}
                    </dl>
                    <Reveal delay={200}>
                      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Link
                          href={`/work/${c.slug}`}
                          className="group inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-lift"
                        >
                          View case study
                          <ArrowRight className="h-4 w-4 text-lime transition-transform group-hover:translate-x-1" aria-hidden />
                        </Link>
                        <ul className="flex flex-wrap gap-2">
                          {c.services.slice(0, 3).map((sv) => (
                            <li key={sv} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                              {sv}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  </div>
                </article>
              );
            })}
          </div>
          <Reveal className="mt-20 text-center">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white px-5 py-3 font-semibold text-forest-800 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-forest-700 hover:shadow-lift"
            >
              All case studies
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Promises */}
      <section className="bg-spotlight-center relative overflow-hidden py-24 text-white sm:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading light eyebrow="How we work" title="We only win when the phone rings" lead="Three rules we keep with every client." />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {promises.map((p, i) => (
              <Reveal key={p.title} delay={i * 110}>
                <div className="ring-gradient group h-full rounded-3xl bg-white/[0.03] p-7 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/10 text-lime ring-1 ring-lime/25 transition group-hover:bg-lime/15">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/65">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Report */}
      <section id="report" className="scroll-mt-16 overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Tracking and monthly report"
              title="Without numbers you are guessing, and that is how budgets disappear"
              lead="Every site we build or run comes with our own lead tracking: every enquiry, every call and every dollar, in one report written in plain language."
            />
          </Reveal>
          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <ul className="grid gap-4 sm:grid-cols-2">
              {reportPoints.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 80}>
                  <div className="group h-full rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-50 text-forest-700 ring-1 ring-forest-100 transition group-hover:bg-forest-700 group-hover:text-lime">
                      <p.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display font-bold text-forest-950">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal variant="scale" delay={150}>
              <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="pointer-events-none absolute -inset-8 rounded-full bg-forest-100/70 blur-3xl" aria-hidden />
                <div className="relative -rotate-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-float transition duration-500 hover:rotate-0">
                  <Image
                    src="/work/report-example.webp"
                    alt="An example monthly report page with demo data."
                    width={1323}
                    height={1568}
                    sizes="(min-width: 1024px) 32rem, 90vw"
                    className="h-auto w-full"
                  />
                </div>
                <span className="absolute -top-3 left-5 inline-flex items-center gap-1.5 rounded-full bg-forest-700 px-3 py-1 text-xs font-semibold text-lime shadow-lift">
                  <Zap className="h-3.5 w-3.5" aria-hidden />
                  Included with every site
                </span>
                <figcaption className="relative mt-5 text-center text-sm text-zinc-500">An example monthly report with demo data.</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-paper hairline-top hairline-bottom relative scroll-mt-16 overflow-hidden py-24 sm:py-32">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="Four steps from a site that loses customers to one that wins them"
              lead="No long meetings and no surprises. You always know what happens next."
            />
          </Reveal>
          <ol className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <span
              className="pointer-events-none absolute top-11 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-forest-200 via-forest-600/40 to-forest-200 lg:block"
              aria-hidden
            />
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 110} className="relative">
                <div className="group h-full rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-forest-700 font-mono text-sm font-medium text-lime ring-4 ring-white transition group-hover:scale-110">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-forest-950">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-zinc-600">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Free check */}
      <section id="check" className="relative scroll-mt-16 overflow-hidden bg-white py-24 sm:py-32">
        <div className="pointer-events-none absolute top-0 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-forest-100/50 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-forest-700 uppercase">Zero risk to start</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-forest-950 md:text-[2.6rem] md:leading-[1.1]">
              Find out what your website is costing you
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-zinc-600">
              No obligation and no sales pitch. Just an honest look at where visitors and enquiries slip away today.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                'A review of your site’s speed, SEO and AI-search visibility',
                'A comparison with your top local competitors',
                'Concrete next steps, whether you work with us or not',
                'One fixed price if you decide to go ahead',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-zinc-800">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-700 text-lime">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-950 text-lime shadow-soft">
                <Zap className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-forest-950">Reply within one business day</p>
                <p className="text-sm text-zinc-600">From a real person who has looked at your site.</p>
              </div>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <CheckForm />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-paper hairline-top scroll-mt-16 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow="Questions" title="Before you ask" />
          </Reveal>
          <div className="mt-12 space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group rounded-2xl border border-zinc-200/80 bg-white shadow-soft transition duration-300 open:shadow-lift hover:border-zinc-300">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[1.05rem] text-forest-950 sm:px-6 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-50 text-xl leading-none text-forest-700 transition duration-300 group-open:rotate-45 group-open:bg-forest-700 group-open:text-lime"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <div className="faq-body">
                    <div>
                      <p className="px-5 pb-5 leading-relaxed text-zinc-600 sm:px-6">{f.a}</p>
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
                <Link href="#check" className={primaryButton}>
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
