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
  Search,
  SearchX,
  ShieldCheck,
  Target,
  Wallet,
  Zap,
} from 'lucide-react';
import { CaseCard } from '@/components/site/CaseCard';
import { CheckForm } from '@/components/site/CheckForm';
import { SectionHeading } from '@/components/site/Section';
import { caseStudies } from '@/content/work';

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
  },
  {
    icon: MapPin,
    title: 'Local SEO and AI search',
    text: 'A page for every service and every area you cover, written the way your customers search on Google and in ChatGPT.',
  },
  {
    icon: Target,
    title: 'Google Ads',
    text: 'Campaigns for the jobs you want, in the areas you serve, with every call and form tied back to the keyword that brought it.',
  },
  {
    icon: BellRing,
    title: 'Lead tracking and reports',
    text: 'Every form and call reaches you the second it happens, and a monthly report shows visitors, leads and cost per lead.',
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

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-950 pt-14 pb-20 text-white sm:pt-20 lg:pb-28">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
              <span className="h-2 w-2 rounded-full bg-lime" aria-hidden />
              Taking on one company per service area
            </p>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Websites and ads that turn searches into <span className="text-lime">booked jobs</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-white/75 lg:mx-0">
              WebTano builds fast websites and runs local SEO and Google Ads for tree services and other local companies. Every
              call and form is counted, so you see exactly which dollars bring in work.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="#check"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-semibold text-forest-950 transition hover:bg-lime-dark sm:w-auto"
              >
                Get a free website check
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="#work"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                See the results
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-3 sm:gap-6">
              {[
                { value: '1,010', label: 'tracked leads for one tree service' },
                { value: '11.2%', label: 'of visitors called, for medical transport' },
                { value: '< 1 day', label: 'to reply to every enquiry' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center sm:p-4 lg:text-left">
                  <dd className="font-display text-2xl font-bold text-lime sm:text-3xl">{s.value}</dd>
                  <dt className="mt-1 text-xs leading-snug text-white/65 sm:text-sm">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="pointer-events-none absolute -inset-10 rounded-full bg-lime/15 blur-3xl" aria-hidden />
            <div className="relative rotate-[1.5deg] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/40">
              <Image
                src="/work/report-example.webp"
                alt="An example monthly report: visitors, inquiries, calls, conversion rate, a daily chart and where visitors come from."
                width={1323}
                height={1568}
                priority
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="h-auto w-full"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-forest-100 bg-white p-4 text-forest-950 shadow-xl sm:-left-8">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Phone className="h-4 w-4 text-forest-700" aria-hidden />
                New call from Google Ads
              </p>
              <p className="mt-1 text-xs text-zinc-500">Every lead, the second it happens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="border-b border-zinc-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 sm:px-6">
          <span className="text-sm text-zinc-500">Growing with</span>
          {caseStudies.map((c) => (
            <Link key={c.slug} href={`/work/${c.slug}`} className="font-display text-lg font-bold text-zinc-400 transition hover:text-forest-700">
              {c.client}
            </Link>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What it costs you"
            title="Your website may be sending customers to the company down the road"
            lead="Nothing warns you. No error and no alert, just calls that never come."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {problems.map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-forest-950">{p.title}</h3>
                  <p className="mt-1.5 text-zinc-600">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-16 bg-forest-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What we do"
            title="Everything between a search and a phone call"
            lead="One team for the website, the search rankings, the ads and the tracking, so nothing falls between two agencies."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-700 text-lime">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-forest-950">{s.title}</h3>
                <p className="mt-1.5 text-zinc-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="work" className="scroll-mt-16 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Results"
            title="Real numbers from real client sites"
            lead="Every figure below comes from the client’s own lead tracking or ad account, not from a mock-up."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {caseStudies.map((c) => (
              <CaseCard key={c.slug} item={c} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/work" className="inline-flex items-center gap-1.5 font-semibold text-forest-700 hover:text-forest-900">
              All case studies
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="bg-forest-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            light
            eyebrow="How we work"
            title="We only win when the phone rings"
            lead="Three rules we keep with every client."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
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
            ].map((p) => (
              <div key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p.icon className="h-6 w-6 text-lime" aria-hidden />
                <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-white/70">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report */}
      <section id="report" className="scroll-mt-16 overflow-hidden bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Tracking and monthly report"
            title="Without numbers you are guessing, and that is how budgets disappear"
            lead="Every site we build or run comes with our own lead tracking: every enquiry, every call and every dollar, in one report written in plain language."
          />
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <ul className="grid gap-4 sm:grid-cols-2">
              {reportPoints.map((p) => (
                <li key={p.title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-display font-bold text-forest-950">{p.title}</h3>
                  <p className="mt-1 text-sm text-zinc-600">{p.text}</p>
                </li>
              ))}
            </ul>
            <figure className="mx-auto w-full max-w-md lg:max-w-none">
              <div className="-rotate-1 overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl">
                <Image
                  src="/work/report-example.webp"
                  alt="An example monthly report page with demo data."
                  width={1323}
                  height={1568}
                  sizes="(min-width: 1024px) 32rem, 90vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-4 text-center text-sm text-zinc-500">An example monthly report with demo data.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="scroll-mt-16 bg-forest-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps from a site that loses customers to one that wins them"
            lead="No long meetings and no surprises. You always know what happens next."
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-700 font-display text-lg font-bold text-lime">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-forest-950">{s.title}</h3>
                <p className="mt-1.5 text-zinc-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Free check */}
      <section id="check" className="scroll-mt-16 bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <p className="text-sm font-semibold tracking-widest text-forest-700 uppercase">Zero risk to start</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-forest-950 md:text-4xl">
              Find out what your website is costing you
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              No obligation and no sales pitch. Just an honest look at where visitors and enquiries slip away today.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'A review of your site’s speed, SEO and AI-search visibility',
                'A comparison with your top local competitors',
                'Concrete next steps, whether you work with us or not',
                'One fixed price if you decide to go ahead',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-zinc-800">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              <Zap className="h-5 w-5 shrink-0 text-forest-700" aria-hidden />
              We reply to every request within one business day.
            </div>
          </div>
          <CheckForm />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 bg-forest-50 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading eyebrow="Questions" title="Before you ask" />
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-forest-100 bg-white p-5 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-forest-950">
                  {f.q}
                  <span className="text-2xl leading-none text-forest-700 transition group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-zinc-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-forest-900 px-6 py-14 text-center text-white sm:py-20">
            <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
            <Search className="relative mx-auto h-10 w-10 text-lime" aria-hidden />
            <h2 className="relative mx-auto mt-5 max-w-2xl font-display text-3xl font-bold text-balance md:text-4xl">
              The company that shows up first gets the call. Let’s make that you.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/75">
              The check is free. The worst case: you learn exactly what loses you customers and what to fix first.
            </p>
            <Link
              href="#check"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 font-semibold text-forest-950 transition hover:bg-lime-dark"
            >
              Get my free website check
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
