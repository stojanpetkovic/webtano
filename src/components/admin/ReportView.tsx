import Link from 'next/link';
import { ArrowLeft, Inbox, MousePointerClick, Percent, Phone, Users } from 'lucide-react';
import { ReportChart } from '@/components/admin/ReportChart';
import type { ReportLocale, SiteAnalytics } from '@/lib/admin/analytics';
import { leadSource } from '@/lib/admin/leads';
import {
  T,
  channelLabel,
  formatNumber,
  formatRate,
  changeText,
  summaryOf,
  parseSpend,
  spendMetrics,
  formatMoney,
  CURRENCIES,
  type Period,
} from '@/lib/admin/report';
import type { Lead, Site } from '@/lib/admin/types';
import { PeriodSelect, PrintButton } from './ReportControls';

export type ReportLead = Pick<
  Lead,
  'created_at' | 'visitor_name' | 'visitor_email' | 'form_name' | 'utm_source' | 'utm_medium' | 'referrer' | 'status'
>;

/**
 * The client report sheet with its toolbar. The admin report renders it with
 * a site's real data; the public demo renders it with made-up data.
 */
export function ReportView({
  site,
  analytics,
  leads,
  params,
  locale,
  all,
  period,
  customRejected,
  back,
  banner,
}: {
  site: Site;
  analytics: SiteAnalytics;
  leads: ReportLead[];
  params: URLSearchParams;
  locale: ReportLocale;
  all: Period[];
  period: Period;
  customRejected: boolean;
  back: { href: string; label: string };
  banner?: React.ReactNode;
}) {
  const t = T[locale];
  // Spend entered on this page for the period, and what it bought.
  const spend = parseSpend(params);
  const won = leads.filter((l) => l.status === 'won').length;
  const cost = spend ? spendMetrics(analytics, spend, won) : null;
  const money = (v: number | null) => (v === null || !spend ? '—' : formatMoney(v, spend.currency, locale));

  const tot = analytics.totals;
  const prev = analytics.previous;
  const n = (v: number) => formatNumber(v, locale);
  const dateFmt = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'sr-Latn-RS', { dateStyle: 'medium', timeZone: site.timezone });
  const rangeText = `${dateFmt.format(new Date(`${period.current[0]}T12:00:00Z`))} – ${dateFmt.format(new Date(`${period.current.at(-1)}T12:00:00Z`))}`;

  const kpis = [
    {
      label: t.visitors,
      value: n(tot.visitors),
      change: changeText(tot.visitors, prev.visitors, locale),
      icon: Users,
      tint: 'bg-success/15',
      tile: 'bg-success',
    },
    {
      label: t.visits,
      value: n(tot.visits),
      change: changeText(tot.visits, prev.visits, locale),
      icon: MousePointerClick,
      tint: 'bg-danger/15',
      tile: 'bg-danger',
    },
    {
      label: t.leads,
      value: n(tot.leads),
      change: changeText(tot.leads, prev.leads, locale),
      icon: Inbox,
      tint: 'bg-info/15',
      tile: 'bg-info',
    },
    {
      label: t.calls,
      value: n(tot.calls),
      change: changeText(tot.calls, prev.calls, locale),
      icon: Phone,
      tint: 'bg-secondary/15',
      tile: 'bg-secondary',
    },
    {
      label: t.conversion,
      value: formatRate(tot.contacts, tot.visits, locale) ?? '—',
      change: { text: t.conversionHint, tone: 'neutral' as const },
      icon: Percent,
      tint: 'bg-primary/15',
      tile: 'bg-primary',
    },
  ];

  const maxDevice = Math.max(1, ...analytics.devices.map((d) => d.count));
  const maxCountry = Math.max(1, ...analytics.countries.map((c) => c.count));
  const maxClick = Math.max(1, ...analytics.clicks.map((c) => c.count));
  // Links that switch language keep every other setting on the page.
  const qs = (overrides: Record<string, string>) => {
    const next = new URLSearchParams(params);
    next.set('period', period.key);
    for (const [key, value] of Object.entries(overrides)) next.set(key, value);
    return `?${next}`;
  };
  const field = (name: string) => params.get(name) ?? '';
  const selected = period.key === 'custom' || customRejected ? 'custom' : period.key;

  const costCards = cost
    ? [
        { label: t.totalSpend, value: money(cost.total), hint: '' },
        {
          label: t.perLead,
          value: money(cost.perLead),
          hint: `${n(tot.leads)} ${t.leads.toLowerCase()}`,
        },
        {
          label: t.perCall,
          value: money(cost.perCall),
          hint: `${n(tot.calls)} ${t.calls.toLowerCase()}`,
        },
        {
          label: t.perContact,
          value: money(cost.perContact),
          hint: t.perContactHint,
        },
        { label: t.won, value: n(cost.won), hint: t.wonHint },
        { label: t.perWon, value: money(cost.perWon), hint: '' },
        ...(cost.revenue !== null
          ? [
              {
                label: t.revenue,
                value: money(cost.revenue),
                hint: t.revenueHint,
              },
              {
                label: t.roas,
                value: `${cost.roas!.toLocaleString(locale === 'en' ? 'en-US' : 'sr-Latn-RS', { maximumFractionDigits: 1 })}×`,
                hint: t.roasHint,
              },
            ]
          : []),
      ]
    : [];

  return (
    <div className="min-h-screen bg-zinc-100 print:bg-white">
      {banner}
      {/* Toolbar: on screen only. */}
      <div className="top-0 z-10 border-b border-zinc-200 bg-white sm:sticky print:hidden">
        <div className="mx-auto flex max-w-[210mm] flex-wrap items-center gap-3 px-4 py-3">
          <Link href={back.href} className="btn btn-sm btn-light" aria-label={back.label}>
            <ArrowLeft className="size-4" />
            <span className="max-sm:hidden">{back.label}</span>
          </Link>
          <form method="get" className="flex w-full flex-wrap items-end gap-2 order-last">
            <input type="hidden" name="lang" value={locale} />
            <PeriodSelect label={t.period} options={all.map((p) => ({ key: p.key, label: p.label }))} value={selected} customLabel={t.customPeriod}>
              <label className="text-xs text-zinc-500">
                {t.from}
                <input
                  type="date"
                  name="from"
                  defaultValue={period.key === 'custom' ? period.current[0] : field('from')}
                  className="form-input mt-0.5 block w-auto py-1.5"
                />
              </label>
              <label className="text-xs text-zinc-500">
                {t.to}
                <input
                  type="date"
                  name="to"
                  defaultValue={period.key === 'custom' ? period.current.at(-1) : field('to')}
                  className="form-input mt-0.5 block w-auto py-1.5"
                />
              </label>
            </PeriodSelect>
            <fieldset className="flex flex-wrap items-end gap-2 border-s border-zinc-200 ps-3 max-sm:grid max-sm:w-full max-sm:grid-cols-3 max-sm:items-end max-sm:border-s-0 max-sm:border-t max-sm:ps-0 max-sm:pt-2" title={t.spendHint}>
              <legend className="sr-only">{t.spendHeading}</legend>
              <label className="text-xs text-zinc-500">
                {t.spendGoogle}
                <input
                  name="spendGoogle"
                  inputMode="decimal"
                  defaultValue={field('spendGoogle')}
                  placeholder="0"
                  className="form-input mt-0.5 block w-24 py-1.5 max-sm:w-full"
                />
              </label>
              <label className="text-xs text-zinc-500">
                {t.spendMeta}
                <input
                  name="spendMeta"
                  inputMode="decimal"
                  defaultValue={field('spendMeta')}
                  placeholder="0"
                  className="form-input mt-0.5 block w-24 py-1.5 max-sm:w-full"
                />
              </label>
              <label className="text-xs text-zinc-500">
                {t.spendOther}
                <input
                  name="spendOther"
                  inputMode="decimal"
                  defaultValue={field('spendOther')}
                  placeholder="0"
                  className="form-input mt-0.5 block w-24 py-1.5 max-sm:w-full"
                />
              </label>
              <label className="text-xs text-zinc-500">
                {t.currency}
                <select
                  name="currency"
                  defaultValue={spend?.currency ?? (field('currency') || 'EUR')}
                  className="form-input mt-0.5 block w-auto py-1.5"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-zinc-500">
                {t.jobValue} <span className="text-zinc-400">({t.optional})</span>
                <input
                  name="jobValue"
                  inputMode="decimal"
                  defaultValue={field('jobValue')}
                  placeholder="0"
                  className="form-input mt-0.5 block w-28 py-1.5 max-sm:w-full"
                />
              </label>
            </fieldset>
            <button className="btn btn-sm btn-outline max-sm:w-full max-sm:justify-center" type="submit">
              {t.apply}
            </button>
            <p className="w-full text-[11px] text-zinc-400 max-sm:hidden">{t.spendHint}</p>
            {customRejected && <p className="w-full text-xs text-orange-700">{t.invalidPeriod}</p>}
          </form>
          <div className="inline-flex rounded border border-zinc-200 p-0.5 text-xs font-medium">
            <Link
              href={qs({ lang: 'sr' })}
              className={`rounded px-2.5 py-1 ${locale === 'sr' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              SR
            </Link>
            <Link
              href={qs({ lang: 'en' })}
              className={`rounded px-2.5 py-1 ${locale === 'en' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              EN
            </Link>
          </div>
          <PrintButton label={t.print} />
        </div>
      </div>

      {/* The sheet: A4 width on screen, the whole page in print. */}
      <article
        lang={locale}
        className="report-sheet mx-auto my-6 max-w-[210mm] space-y-6 bg-white p-5 shadow-sm sm:p-10 print:m-0 print:max-w-none print:space-y-4 print:p-0 print:shadow-none"
      >
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-zinc-200 pb-6 max-sm:gap-4 max-sm:pb-4 print:flex-nowrap print:pb-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">{t.title}</p>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-900">{site.name}</h1>
            <p className="mt-1 text-sm text-zinc-500">{site.domain}</p>
          </div>
          <div className="text-end text-sm max-sm:w-full max-sm:rounded-lg max-sm:bg-zinc-50 max-sm:p-3 max-sm:text-start">
            <p className="text-zinc-500">{t.period}</p>
            <p className="font-semibold text-zinc-800">{period.label}</p>
            <p className="text-xs text-zinc-500">{rangeText}</p>
            {site.client_name && (
              <p className="mt-2 text-xs text-zinc-500">
                {t.preparedFor}: <span className="font-medium text-zinc-700">{site.client_name}</span>
              </p>
            )}
          </div>
        </header>

        <p className="text-[15px] leading-relaxed text-zinc-700">
          {summaryOf(analytics, period.key === 'last30' ? (locale === 'en' ? 'the last 30 days' : 'poslednjih 30 dana') : period.label, locale)}
          {cost &&
            t.costSummary({
              total: money(cost.total),
              perContact: cost.perContact === null ? null : money(cost.perContact),
              won: cost.won,
            })}
        </p>

        <section className="avoid-break grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 print:grid-cols-5 [&>*]:min-w-0">
          {kpis.map((k) => (
            <div key={k.label} className={`rounded-[0.3rem] p-4 ${k.tint}`}>
              <span className={`grid size-9 place-items-center rounded text-white ${k.tile}`}>
                <k.icon className="size-4.5" />
              </span>
              <div className="mt-3 text-xl font-semibold text-zinc-900">{k.value}</div>
              <div className="text-xs text-zinc-700">{k.label}</div>
              <div
                className={`mt-1 text-[11px] leading-snug ${
                  k.change.tone === 'up' ? 'text-green-700' : k.change.tone === 'down' ? 'text-orange-700' : 'text-zinc-500'
                }`}
              >
                {k.change.text}
              </div>
            </div>
          ))}
        </section>

        {cost && (
          <section className="avoid-break space-y-4">
            <h2 className="text-base font-semibold">{t.costs}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 print:grid-cols-4 [&>*]:min-w-0">
              {costCards.map((k) => (
                <div key={k.label} className="rounded-[0.3rem] border border-zinc-200 p-4">
                  <div className="text-xl font-semibold text-zinc-900 tabular-nums">{k.value}</div>
                  <div className="text-xs text-zinc-700">{k.label}</div>
                  {k.hint && <div className="mt-1 text-[11px] leading-snug text-zinc-500">{k.hint}</div>}
                </div>
              ))}
            </div>
            {cost.channels.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">{t.byChannel}</h3>
                <table className="table w-full table-fixed">
                  <thead>
                    <tr>
                      <th className="w-[40%]">{t.channel}</th>
                      <th className="text-right">{t.spent}</th>
                      <th className="text-right">{t.contacts}</th>
                      <th className="text-right">{t.perContact}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cost.channels.map((c) => (
                      <tr key={c.key}>
                        <td>{channelLabel(c.label, locale)}</td>
                        <td className="text-right tabular-nums">{money(c.spend)}</td>
                        <td className="text-right font-semibold tabular-nums">{n(c.contacts)}</td>
                        <td className="text-right tabular-nums">{money(c.perContact)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {spend && spend.other > 0 && <p className="mt-2 text-[11px] text-zinc-500">{t.breakdownOther}</p>}
              </div>
            )}
          </section>
        )}

        <section className="avoid-break">
          <h2 className="mb-3 text-base font-semibold">{t.daily}</h2>
          <ReportChart
            days={analytics.daily.map((d) => ({
              day: d.day,
              visitors: d.visitors,
              leads: d.leads + d.calls,
            }))}
            labels={{
              visitors: t.visitors,
              leads: `${t.leads} + ${t.calls.toLowerCase()}`,
            }}
          />
        </section>

        <section className="space-y-6">
          <div className="avoid-break">
            <h2 className="mb-3 text-base font-semibold">{t.sources}</h2>
            <table className="table w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-[44%]">{t.source}</th>
                  <th className="text-right">{t.visits}</th>
                  <th className="text-right">{t.leads}</th>
                  <th className="text-right">{t.calls}</th>
                  <th className="text-right">{t.rate}</th>
                </tr>
              </thead>
              <tbody>
                {analytics.channels.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-zinc-500">
                      {t.noData}
                    </td>
                  </tr>
                )}
                {analytics.channels.map((c) => (
                  <tr key={c.label}>
                    <td className="truncate" title={channelLabel(c.label, locale)}>
                      {channelLabel(c.label, locale)}
                    </td>
                    <td className="text-right tabular-nums">{n(c.visits)}</td>
                    <td className="text-right font-semibold tabular-nums">{c.leads}</td>
                    <td className="text-right font-semibold tabular-nums">{c.calls}</td>
                    <td className="text-right text-zinc-500 tabular-nums">{formatRate(c.leads + c.calls, c.visits, locale) ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="avoid-break">
            <h2 className="mb-3 text-base font-semibold">{t.pages}</h2>
            <table className="table w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-[52%]">{t.page}</th>
                  <th className="text-right">{t.pageViews}</th>
                  <th className="text-right">{t.leads}</th>
                  <th className="text-right">{t.calls}</th>
                </tr>
              </thead>
              <tbody>
                {analytics.pages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-zinc-500">
                      {t.noData}
                    </td>
                  </tr>
                )}
                {analytics.pages.slice(0, 8).map((p) => (
                  <tr key={p.label}>
                    <td className="truncate" title={p.label}>
                      {p.label}
                    </td>
                    <td className="text-right tabular-nums">{n(p.views)}</td>
                    <td className="text-right font-semibold tabular-nums">{p.leads}</td>
                    <td className="text-right font-semibold tabular-nums">{p.calls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          {[
            { title: t.contactClicks, items: analytics.clicks, max: maxClick },
            { title: t.devices, items: analytics.devices, max: maxDevice },
            { title: t.countries, items: analytics.countries, max: maxCountry },
          ].map((block) => (
            <div key={block.title} className="avoid-break">
              <h2 className="mb-3 text-base font-semibold">{block.title}</h2>
              {block.items.length === 0 && <p className="text-sm text-zinc-500">{t.noData}</p>}
              <div className="space-y-2.5">
                {block.items.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-zinc-700">{item.label}</span>
                      <span className="font-semibold tabular-nums">{n(item.count)}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-zinc-100">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(item.count / block.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">
            {t.leadList} ({leads.length})
          </h2>
          {leads.length === 0 ? (
            <p className="text-sm text-zinc-500">{t.noLeads}</p>
          ) : (
            <div className="overflow-x-auto print:overflow-visible">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t.date}</th>
                    <th>{t.name}</th>
                    <th>{t.source}</th>
                    <th>{t.form}</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, i) => (
                    <tr key={`${l.created_at}-${i}`} className="avoid-break">
                      <td className="whitespace-nowrap">{dateFmt.format(new Date(l.created_at))}</td>
                      <td>{l.visitor_name || l.visitor_email || '—'}</td>
                      <td>{channelLabel(leadSource(l), locale)}</td>
                      <td>{l.form_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="space-y-1 border-t border-zinc-200 pt-3 text-[11px] text-zinc-500">
          <p>{t.notes}</p>
          {cost && <p>{t.costNotes}</p>}
          <p className="font-medium text-zinc-600">{t.footer}</p>
        </footer>
      </article>
    </div>
  );
}
