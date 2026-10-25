import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/seo';
import Link from 'next/link';
import { ArrowRight, Check, Minus, Plus, Sparkles } from 'lucide-react';
import { FaqList } from '@/components/site/FaqList';
import { Reveal } from '@/components/site/Reveal';
import { SwipeRow } from '@/components/site/SwipeRow';
import { comparison, included, pricingFaqs, type Plan } from '@/content/pricing';
import { livePricing } from '@/lib/pricing';
import { site } from '@/content/site';

// Prices come from the admin price list; saving it refreshes this page at once,
// and this hourly refresh is the fallback.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { monthlyPlans, websitePlans } = await livePricing();
  return {
    title: 'Pricing: websites, local SEO and Google Ads',
    description: `Clear prices for local service companies: Google Ads from $${monthlyPlans.find((p) => p.id === 'google-ads')?.price.toLocaleString('en-US')}/mo, local SEO and websites from $${websitePlans[0].price.toLocaleString('en-US')}. No setup fees, no long contracts, every lead tracked.`,
    alternates: { canonical: '/pricing' },
    openGraph: { url: '/pricing', images: [OG_IMAGE] },
  };
}

const money = (n: number) => `$${n.toLocaleString('en-US')}`;

function PlanCard({ plan, dark = false }: { plan: Plan; dark?: boolean }) {
  const hi = plan.featured;
  // Featured cards are inverted against their section: dark on light, light-ringed on dark.
  const inverted = dark ? false : hi;
  const onDark = dark || inverted;
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl p-7 sm:p-8 ${
        dark
          ? hi
            ? 'bg-white/[0.06] ring-2 ring-accent shadow-[0_0_0_6px_rgb(1_175_233/0.08),0_30px_60px_-30px_rgb(1_175_233/0.35)]'
            : 'bg-white/[0.03] ring-1 ring-white/10'
          : hi
            ? 'bg-ink-950 ring-1 ring-ink-950 shadow-[0_2px_4px_rgb(10_14_30/0.06),0_30px_60px_-28px_rgb(10_14_30/0.45)] lg:-my-4 lg:py-12'
            : 'bg-white ring-1 ring-zinc-200/80 shadow-[0_1px_2px_rgb(10_14_30/0.04),0_8px_24px_-14px_rgb(10_14_30/0.10)]'
      }`}
    >
      {hi && (
        <span className="absolute -top-3.5 left-7 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-medium tracking-[0.12em] text-ink-950 uppercase shadow-glow sm:left-8">
          <Sparkles className="h-3 w-3" aria-hidden />
          Most popular
        </span>
      )}
      <h3 className={`font-display text-xl font-bold ${onDark ? 'text-white' : 'text-ink-950'}`}>{plan.name}</h3>
      <p className={`mt-2 text-[0.9375rem] leading-relaxed ${onDark ? 'text-white/70' : 'text-zinc-600'}`}>{plan.tagline}</p>
      <p className="mt-6 flex items-baseline gap-1.5">
        {plan.from && <span className={`text-sm ${onDark ? 'text-white/60' : 'text-zinc-500'}`}>from</span>}
        <span className={`font-display text-5xl font-bold tracking-tight ${onDark ? 'text-white' : 'text-ink-950'}`}>{money(plan.price)}</span>
        <span className={`text-sm ${onDark ? 'text-white/60' : 'text-zinc-500'}`}>{plan.unit === 'mo' ? '/ month' : 'one-time'}</span>
      </p>
      <p className={`mt-2 min-h-[2.5rem] text-xs leading-snug ${onDark ? 'text-white/50' : 'text-zinc-500'}`}>{plan.note ?? (plan.unit === 'mo' ? 'No setup fee. Month to month.' : 'Half to start, half at launch.')}</p>
      <Link
        href="/#hero-form"
        className={`group mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-px ${
          hi ? 'bg-accent text-ink-950 shadow-glow hover:bg-accent-dark' : onDark ? 'bg-white text-ink-950 hover:bg-azure-50' : 'bg-ink-950 text-white hover:bg-ink-800'
        }`}
      >
        Start with a free check
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
      <div className={`mt-7 border-t pt-6 ${onDark ? 'border-white/10' : 'border-zinc-200/80'}`}>
        <p className={`font-mono text-[10px] tracking-[0.14em] uppercase ${onDark ? 'text-white/45' : 'text-zinc-500'}`}>What you get</p>
        <ul className="mt-4 space-y-3">
          {plan.features.map((f) => (
            <li key={f} className={`flex gap-3 text-[0.9375rem] leading-snug ${onDark ? 'text-white/85' : 'text-zinc-700'}`}>
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${onDark ? 'bg-accent/15 text-accent' : 'bg-azure-50 text-azure-700 ring-1 ring-azure-100'}`} aria-hidden>
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <p className={`mt-auto pt-7 text-xs leading-relaxed ${onDark ? 'text-white/50' : 'text-zinc-500'}`}>
        <span className={`font-semibold ${onDark ? 'text-white/75' : 'text-ink-950'}`}>Best for: </span>
        {plan.bestFor}
      </p>
    </div>
  );
}

function Cell({ v, hi }: { v: boolean | string; hi: boolean }) {
  if (v === true)
    return (
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${hi ? 'bg-ink-950 text-accent' : 'bg-azure-50 text-azure-700'}`}>
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-label="Included" />
      </span>
    );
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-zinc-300" aria-label="Not included" />;
  return <span className="text-sm font-medium text-ink-950">{v}</span>;
}

export default async function PricingPage() {
  const { monthlyPlans, websitePlans, addOns } = await livePricing();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        description: site.tagline,
        areaServed: 'US',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'WebTano pricing',
          itemListElement: [...monthlyPlans, ...websitePlans].map((p) => ({
            '@type': 'Offer',
            name: p.name,
            description: p.tagline,
            url: `${site.url}/pricing#${p.id}`,
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': p.unit === 'mo' ? 'UnitPriceSpecification' : 'PriceSpecification',
              priceCurrency: 'USD',
              ...(p.from ? { minPrice: p.price } : { price: p.price }),
              ...(p.unit === 'mo' && { unitCode: 'MON', billingDuration: 'P1M' }),
            },
            itemOffered: { '@type': 'Service', name: p.name, serviceType: p.unit === 'mo' ? 'Marketing' : 'Web design' },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: pricingFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${site.url}/pricing` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-spotlight relative overflow-hidden pt-16 pb-40 text-white sm:pt-24 sm:pb-48">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-accent uppercase ring-1 ring-white/12">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              Pricing
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]">
              Clear prices. <span className="text-gradient">Every lead counted.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
              Flat monthly fees for SEO and Google Ads, one fixed price for websites. No setup fees, no long contracts, and a report that shows what every dollar brought in.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <nav aria-label="Pricing sections" className="mt-9 inline-flex rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10">
              <a href="#monthly" className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/15">
                Monthly plans
              </a>
              <a href="#websites" className="rounded-full px-5 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.07] hover:text-white">
                Websites
              </a>
              <a href="#add-ons" className="rounded-full px-5 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.07] hover:text-white">
                Add-ons
              </a>
            </nav>
          </Reveal>
        </div>
      </section>

      {/* Monthly plans */}
      <section id="monthly" aria-labelledby="monthly-title" className="bg-paper relative flow-root scroll-mt-16 pb-24 sm:pb-28">
        <div className="relative mx-auto -mt-28 max-w-6xl px-4 sm:-mt-32 sm:px-6">
          <Reveal variant="scale">
            <div className="flex flex-col items-start gap-5 rounded-3xl bg-white p-6 ring-1 ring-zinc-200/80 shadow-[0_1px_2px_rgb(10_14_30/0.04),0_16px_40px_-20px_rgb(10_14_30/0.18)] sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-5">
                <p className="font-display text-4xl font-bold text-azure-700">$0</p>
                <div>
                  <p className="font-display text-lg font-semibold text-ink-950">Step one is always free: a website check</p>
                  <p className="mt-0.5 text-sm text-zinc-600">We review your site, Google profile and ads, and tell you honestly which plan you need, if any.</p>
                </div>
              </div>
              <Link
                href="/#hero-form"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:-translate-y-px hover:bg-accent-dark"
              >
                Get my free check
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <div className="mt-20 text-center">
            <p className="font-mono text-[11px] tracking-[0.14em] text-azure-700 uppercase">Monthly plans</p>
            <h2 id="monthly-title" className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink-950 md:text-[2.5rem]">
              More calls every month, measured
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-600">Flat fees, month to month. Ad budgets are paid directly to Google from your own account.</p>
          </div>

          <SwipeRow as="ul" label="Monthly plans" className="mt-14 grid items-stretch gap-6 max-md:pt-4 lg:grid-cols-3 lg:gap-5">
            {monthlyPlans.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 80}>
                <div id={p.id} className="h-full scroll-mt-24">
                  <PlanCard plan={p} />
                </div>
              </Reveal>
            ))}
          </SwipeRow>

          {/* Side-by-side comparison */}
          {/* The comparison table needs a wide screen; on phones the plan cards above say the same. */}
          <Reveal className="mt-16 max-md:hidden">
            <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-zinc-200/80">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <caption className="sr-only">What each monthly plan includes</caption>
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th scope="col" className="px-6 py-5 font-display text-lg font-semibold text-ink-950">
                      Compare plans
                    </th>
                    {monthlyPlans.map((p) => (
                      <th key={p.id} scope="col" className={`px-4 py-5 text-center ${p.featured ? 'bg-azure-50/60' : ''}`}>
                        <span className="block font-display font-semibold text-ink-950">{p.name}</span>
                        <span className="text-sm font-normal text-zinc-500">{money(p.price)}/mo</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-100 last:border-0">
                      <th scope="row" className="px-6 py-3.5 text-[0.9375rem] font-normal text-zinc-700">
                        {row.label}
                      </th>
                      {row.values.map((v, k) => (
                        <td key={k} className={`px-4 py-3.5 text-center ${monthlyPlans[k].featured ? 'bg-azure-50/60' : ''}`}>
                          <Cell v={v} hi={!!monthlyPlans[k].featured} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Websites */}
      <section id="websites" aria-labelledby="websites-title" className="bg-promises edge-glow relative scroll-mt-16 overflow-hidden py-24 text-white sm:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Websites</p>
            <h2 id="websites-title" className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-[2.5rem]">
              One fixed price. Yours to keep.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">Fast sites written to sell, with tracking built in. Domain, code and hosting in your name from day one.</p>
          </div>
          <SwipeRow as="ul" label="Website plans" className="mt-14 grid items-stretch gap-6 max-md:pt-4 lg:grid-cols-3 lg:gap-5">
            {websitePlans.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 80}>
                <div id={p.id} className="h-full scroll-mt-24">
                  <PlanCard plan={p} dark />
                </div>
              </Reveal>
            ))}
          </SwipeRow>
          <p className="mt-10 text-center text-sm text-white/55">
            Want to see the result first? Look at{' '}
            <Link href="/work" className="font-medium text-accent hover:underline">
              the sites we built
            </Link>{' '}
            and their live Lighthouse scores.
          </p>
        </div>
      </section>

      {/* Add-ons and what everyone gets */}
      <section id="add-ons" aria-labelledby="addons-title" className="bg-report relative scroll-mt-16 overflow-hidden py-24 sm:py-28">
        <div className="relative mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-azure-700 uppercase">Add-ons</p>
            <h2 id="addons-title" className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950">
              Add only what you need
            </h2>
            <ul className="mt-8 divide-y divide-zinc-200 rounded-3xl bg-white px-6 ring-1 ring-zinc-200/80">
              {addOns.map((a) => (
                <li key={a.name} className="flex gap-4 py-5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ink-950 ring-1 ring-zinc-200" aria-hidden>
                    <Plus className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="font-display font-semibold text-ink-950">{a.name}</span>
                      <span className="font-display font-semibold text-azure-700">
                        {money(a.price)}
                        {a.per}
                      </span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{a.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-azure-700 uppercase">With every plan</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950">What you can count on</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {included.map((x, i) => (
                <Reveal as="li" key={x.title} delay={i * 60} className="rounded-3xl bg-white p-6 ring-1 ring-zinc-200/80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 font-mono text-xs text-accent" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-4 font-display text-lg font-semibold text-ink-950">{x.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{x.text}</p>
                </Reveal>
              ))}
            </ul>
            <Link
              href="/demo/report"
              className="group mt-4 flex items-center justify-between rounded-3xl bg-white p-6 ring-1 ring-zinc-200/80 transition hover:ring-azure-200"
            >
              <span>
                <span className="block font-display text-lg font-semibold text-ink-950">See the monthly report</span>
                <span className="text-sm text-zinc-600">Open the demo report every client gets.</span>
              </span>
              <ArrowRight className="h-5 w-5 text-azure-700 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="pricing-faq" className="bg-faq relative overflow-hidden py-24 sm:py-28">
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[11px] tracking-[0.14em] text-azure-700 uppercase">Questions</p>
            <h2 id="pricing-faq" className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink-950 md:text-[2.5rem] md:leading-tight">
              About prices and contracts
            </h2>
            <p className="mt-4 text-zinc-600">Anything else? Ask it in the free check and we will answer within one business day.</p>
          </div>
          <Reveal className="rounded-3xl bg-white px-5 ring-1 ring-zinc-200/80 sm:px-8">
            <FaqList items={pricingFaqs} />
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-final edge-glow relative overflow-hidden bg-ink-975 py-20 text-white sm:py-24">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">Not sure which plan fits?</h2>
            <p className="mt-3 text-lg text-white/70">Start with the free check. We will recommend one plan, or tell you that you do not need us yet.</p>
          </div>
          <Link
            href="/#hero-form"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-ink-950 shadow-glow transition hover:-translate-y-px hover:bg-accent-dark"
          >
            Get a free website check
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
