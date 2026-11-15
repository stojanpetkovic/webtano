import Link from 'next/link';
import { FileSpreadsheet, PhoneCall, PhoneMissed, Timer, Trash2, Upload } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { getAdminI18n } from '@/lib/admin/i18n';
import { LONG_CALL_SECONDS, maskPhone, minSec, siteAdCalls, type AdCallsStats, type AdCallsUpload } from '@/lib/admin/adsCalls';
import type { ReportLocale } from '@/lib/admin/analytics';
import { formatNumber } from '@/lib/admin/report';
import type { Site } from '@/lib/admin/types';
import { HTML_LANG } from '@/lib/i18n';
import { deleteAdCalls, uploadAdCalls } from '@/app/(admin)/admin/(print)/sites/[id]/report/callActions';

const NOTICES: Record<string, { tone: 'ok' | 'err'; en: string; sr: string }> = {
  added: { tone: 'ok', en: 'File added. The calls are below and in the PDF report.', sr: 'Fajl je dodat. Pozivi su prikazani ispod i ulaze u PDF izveštaj.' },
  deleted: { tone: 'ok', en: 'File deleted.', sr: 'Fajl je obrisan.' },
  empty: { tone: 'err', en: 'Choose a file first.', sr: 'Prvo izaberi fajl.' },
  'too-big': { tone: 'err', en: 'The file is too big for a call details export.', sr: 'Fajl je prevelik za izvoz poziva.' },
  'not-calls': {
    tone: 'err',
    en: 'No "Start time" and "Duration" columns. Download Reports → Call details from Google Ads as CSV.',
    sr: 'Nema kolona „Start time” i „Duration”. Preuzmi Reports → Call details iz Google Ads-a kao CSV.',
  },
  'wrong-report': {
    tone: 'err',
    en: 'This looks like a campaign report. Upload the "Call details" export.',
    sr: 'Ovo liči na izveštaj kampanje. Ubaci izvoz „Call details”.',
  },
  'no-calls': { tone: 'err', en: 'The file has no calls in it.', sr: 'U fajlu nema nijednog poziva.' },
  unreadable: { tone: 'err', en: 'The file could not be read.', sr: 'Fajl ne može da se pročita.' },
  db: {
    tone: 'err',
    en: 'Saving failed. Has supabase/migrations/20261115_site_ad_call_reports.sql been run?',
    sr: 'Čuvanje nije uspelo. Da li je pokrenut supabase/migrations/20261115_site_ad_call_reports.sql?',
  },
};

/** Panel on the site dashboard: upload and delete Google Ads call details files. Never printed. */
export async function AdCallsUploadManager({
  siteId,
  uploads,
  missing,
  notice,
  backQuery,
}: {
  siteId: string;
  uploads: AdCallsUpload[];
  missing: boolean;
  notice: string | null;
  backQuery: string;
}) {
  const { lang, t } = await getAdminI18n();
  const msg = notice ? NOTICES[notice] : null;
  const date = (d: string) =>
    new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'sr-Latn-RS', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${d}T12:00:00Z`));

  return (
    <details
      open={Boolean(notice) || uploads.length === 0 || undefined}
      className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm print:hidden"
    >
      <summary className="cursor-pointer font-semibold text-zinc-800">
        {t('Calls from Google Ads (call details files)', 'Pozivi sa Google Ads oglasa (fajlovi „Call details”)')}
        <span className="ms-2 font-normal text-zinc-500">
          {uploads.length ? t(`${uploads.length} file(s)`, `fajlova: ${uploads.length}`) : t('no files yet', 'još nema fajlova')}
        </span>
      </summary>

      <p className="mt-3 text-xs leading-relaxed text-zinc-500">
        {t(
          'In Google Ads open Campaigns → Insights and reports → Report editor → Call details (or the "Call details" report), pick the period and Download → CSV. These are calls straight from the ad, so the website never sees them. Where two files cover the same day, the newer one counts.',
          'U Google Ads-u otvori izveštaj „Call details” (Insights and reports → Report editor → Call details), izaberi period i klikni Download → CSV. To su pozivi direktno sa oglasa, pa ih sajt nikad ne vidi. Ako dva fajla pokrivaju isti dan, važi noviji.',
        )}
      </p>

      {missing && (
        <p className="mt-3 rounded bg-orange-50 px-3 py-2 text-xs text-orange-800">
          {t('Run supabase/migrations/20261115_site_ad_call_reports.sql in Supabase first.', 'Prvo pokreni supabase/migrations/20261115_site_ad_call_reports.sql u Supabase-u.')}
        </p>
      )}
      {msg && (
        <p className={`mt-3 rounded px-3 py-2 text-xs ${msg.tone === 'ok' ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>{msg[lang]}</p>
      )}

      <form action={uploadAdCalls} className="mt-3 flex flex-wrap items-center gap-2">
        <input type="hidden" name="site_id" value={siteId} />
        <input type="hidden" name="back" value={backQuery} />
        <input
          type="file"
          name="file"
          required
          accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values"
          className="min-w-0 flex-1 text-xs file:me-2 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs file:font-medium"
        />
        <button className="btn btn-sm btn-primary" type="submit">
          <Upload className="size-4" /> {t('Add file', 'Dodaj fajl')}
        </button>
      </form>

      {uploads.length > 0 && (
        <ul className="mt-4 divide-y divide-zinc-100 border-t border-zinc-100">
          {[...uploads].reverse().map((u) => (
            <li key={u.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
              <FileSpreadsheet className="size-4 shrink-0 text-green-700" />
              <span className="min-w-0 flex-1 truncate text-zinc-700" title={u.file_name}>
                {u.file_name}
              </span>
              <span className="text-xs text-zinc-500 tabular-nums">
                {date(u.date_from)} – {date(u.date_to)} · {u.total} {t('calls', 'poziva')}
              </span>
              <form action={deleteAdCalls}>
                <input type="hidden" name="site_id" value={siteId} />
                <input type="hidden" name="id" value={u.id} />
                <input type="hidden" name="back" value={backQuery} />
                <button className="btn btn-sm btn-light text-red-700" type="submit" aria-label={t('Delete', 'Obriši')} title={t('Delete', 'Obriši')}>
                  <Trash2 className="size-4" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}

const W = 1000;
const H = 110;

/** Calls per day as plain SVG bars, sharp in the printed PDF. */
function Bars({ daily }: { daily: { day: string; count: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  const slot = W / Math.max(1, daily.length);
  const bw = Math.max(2, Math.min(18, slot * 0.65));
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="h-auto w-full" role="img" aria-hidden="true">
      <line x1="0" x2={W} y1={H} y2={H} stroke="#e4e4e7" />
      {daily.map((d, i) => {
        const h = (d.count / max) * (H - 6);
        return <rect key={d.day} x={slot * i + (slot - bw) / 2} y={H - h} width={bw} height={h} rx="2" fill="#0891b2" />;
      })}
      {[0, daily.length - 1].map((i) =>
        daily[i] ? (
          <text key={i} x={i === 0 ? 0 : W} y={H + 14} fontSize="12" fill="#71717a" textAnchor={i === 0 ? 'start' : 'end'}>
            {`${daily[i].day.slice(8, 10)}.${daily[i].day.slice(5, 7)}.`}
          </text>
        ) : null,
      )}
    </svg>
  );
}

const L = {
  sr: {
    title: 'Pozivi direktno sa Google Ads oglasa',
    total: 'Poziva sa oglasa',
    long: `Razgovora dužih od ${LONG_CALL_SECONDS / 60} min`,
    avg: 'Prosečno trajanje',
    missed: 'Propušteno',
    campaigns: 'Po kampanji',
    list: 'Poslednji pozivi',
    when: 'Vreme',
    caller: 'Pozivalac',
    length: 'Trajanje',
    campaign: 'Kampanja',
    missedCall: 'propušten',
    hidden: 'skriven broj',
    vsPrev: 'u odnosu na prethodni period',
    noPrev: 'nema podataka za prethodni period',
    more: (n: number) => `i još ${n}`,
    note: (to: string) =>
      `Ovo su pozivi koje je kupac pokrenuo tapom na broj u samom oglasu, bez ulaska na sajt, pa nisu uračunati u pozive sa sajta. Izvor: Google Ads (Call details), podaci zaključno sa ${to}.`,
    partial: (c: number, d: number) => `Podaci pokrivaju ${c} od ${d} dana ovog perioda.`,
  },
  en: {
    title: 'Calls straight from Google Ads',
    total: 'Calls from ads',
    long: `Conversations over ${LONG_CALL_SECONDS / 60} min`,
    avg: 'Average length',
    missed: 'Missed',
    campaigns: 'By campaign',
    list: 'Latest calls',
    when: 'Time',
    caller: 'Caller',
    length: 'Length',
    campaign: 'Campaign',
    missedCall: 'missed',
    hidden: 'number hidden',
    vsPrev: 'vs the previous period',
    noPrev: 'no data for the previous period',
    more: (n: number) => `and ${n} more`,
    note: (to: string) =>
      `These are calls a customer started by tapping the number in the ad itself, without visiting the site, so they are not in the website's call count. Source: Google Ads (Call details), data up to ${to}.`,
    partial: (c: number, d: number) => `The data covers ${c} of the ${d} days in this period.`,
  },
} as const;

const LIST_LIMIT = 15;

/** The report section with calls from Google Ads for the period. Prints with the report. */
export function AdCallsReportSection({ data, locale }: { data: AdCallsStats; locale: ReportLocale }) {
  const l = L[locale];
  const n = (v: number) => formatNumber(v, locale);
  const fmt = locale === 'en' ? 'en-US' : 'sr-Latn-RS';
  const date = (d: string) =>
    new Intl.DateTimeFormat(fmt, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${d}T12:00:00Z`)).replace(/\.$/, '');
  const when = (t: string) =>
    new Intl.DateTimeFormat(fmt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(new Date(`${t}:00Z`));
  const pct = data.previous ? Math.round(((data.total - data.previous) / data.previous) * 100) : null;
  const change =
    pct === null
      ? { text: l.noPrev, cls: 'text-zinc-500' }
      : { text: `${pct >= 0 ? '+' : ''}${pct}% ${l.vsPrev}`, cls: pct >= 0 ? 'text-green-700' : 'text-orange-700' };
  const maxCampaign = Math.max(1, ...data.campaigns.map((c) => c.count));

  return (
    <section className="avoid-break space-y-4">
      <h2 className="text-base font-semibold">{l.title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 print:grid-cols-4 [&>*]:min-w-0">
        <div className="rounded-[0.3rem] bg-cyan-100 p-4">
          <div className="text-xl font-semibold text-zinc-900 tabular-nums">{n(data.total)}</div>
          <div className="text-xs text-zinc-700">{l.total}</div>
          <div className={`mt-1 text-[11px] leading-snug ${change.cls}`}>{change.text}</div>
        </div>
        <div className="rounded-[0.3rem] border border-zinc-200 p-4">
          <div className="text-xl font-semibold text-zinc-900 tabular-nums">{n(data.long)}</div>
          <div className="text-xs text-zinc-700">{l.long}</div>
        </div>
        <div className="rounded-[0.3rem] border border-zinc-200 p-4">
          <div className="text-xl font-semibold text-zinc-900 tabular-nums">{minSec(data.avgSeconds)}</div>
          <div className="text-xs text-zinc-700">{l.avg}</div>
        </div>
        <div className="rounded-[0.3rem] border border-zinc-200 p-4">
          <div className="text-xl font-semibold text-zinc-900 tabular-nums">{n(data.missed)}</div>
          <div className="text-xs text-zinc-700">{l.missed}</div>
        </div>
      </div>
      <Bars daily={data.daily} />
      <div className="grid gap-6 sm:grid-cols-3 print:grid-cols-3 [&>*]:min-w-0">
        <div className="min-w-0 sm:col-span-2 print:col-span-2">
          <h3 className="mb-2 text-sm font-semibold">{l.list}</h3>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="pb-1 font-medium">{l.when}</th>
                <th className="pb-1 font-medium">{l.caller}</th>
                <th className="pb-1 text-right font-medium">{l.length}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.calls.slice(0, LIST_LIMIT).map((c, i) => (
                <tr key={`${c.t}-${i}`}>
                  <td className="py-1 pe-2 whitespace-nowrap text-zinc-700">{when(c.t)}</td>
                  <td className="truncate py-1 pe-2 text-zinc-700">{c.p ? maskPhone(c.p) : <span className="text-zinc-400">{l.hidden}</span>}</td>
                  <td className="py-1 text-right font-semibold whitespace-nowrap tabular-nums">
                    {c.ok ? minSec(c.d) : <span className="font-normal text-orange-700">{l.missedCall}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.calls.length > LIST_LIMIT && <p className="mt-1 text-[11px] text-zinc-500">{l.more(data.calls.length - LIST_LIMIT)}</p>}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">{l.campaigns}</h3>
          <div className="space-y-2">
            {data.campaigns.slice(0, 6).map((c) => (
              <div key={c.label}>
                <div className="flex justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate text-zinc-700" title={c.label}>
                    {c.label}
                  </span>
                  <span className="font-semibold tabular-nums">{n(c.count)}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-zinc-100">
                  <div className="h-1.5 rounded-full bg-cyan-600" style={{ width: `${(c.count / maxCampaign) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[11px] leading-snug text-zinc-500">
        {l.note(date(data.lastDay))} {data.covered < data.days && l.partial(data.covered, data.days)}
      </p>
    </section>
  );
}

/** Site page: calls from Google Ads for the selected range, next to the site's own numbers. */
export async function AdsCallsOverview({ site, range }: { site: Site; range: number }) {
  return <AdsCallsCards data={await siteAdCalls(site.id, site.timezone, range)} />;
}

export async function AdsCallsCards({ data }: { data: AdCallsStats | null }) {
  const { lang, t } = await getAdminI18n();
  const num = (v: number) => v.toLocaleString(HTML_LANG[lang]);
  const shortDate = (d: string) =>
    new Intl.DateTimeFormat(HTML_LANG[lang], { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${d}T12:00:00Z`));
  const pct = data?.previous ? Math.round(((data.total - data.previous) / data.previous) * 100) : null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-800">{t('Calls straight from Google Ads', 'Pozivi direktno sa Google Ads oglasa')}</h2>
        <Link href="#google-ads-pozivi" className="btn btn-sm btn-light">
          <FileSpreadsheet className="size-4" /> {data ? t('Add a newer file', 'Dodaj noviji fajl') : t('Add a Google Ads file', 'Dodaj Google Ads fajl')}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          icon={PhoneCall}
          color="info"
          label={t('Calls from ads', 'Pozivi sa oglasa')}
          value={data ? num(data.total) : '—'}
          note={
            data
              ? pct !== null
                ? `${pct >= 0 ? '+' : ''}${pct}% ${t('vs the previous period', 'u odnosu na prethodni period')}`
                : t(`data up to ${shortDate(data.lastDay)}`, `podaci do ${shortDate(data.lastDay)}`)
              : t('No call details file for this period yet', 'Još nema „Call details” fajla za ovaj period')
          }
          tone={pct === null ? 'neutral' : pct >= 0 ? 'up' : 'down'}
          trend={data?.daily.map((d) => d.count)}
        />
        <StatCard
          icon={PhoneCall}
          color="success"
          label={t(`Over ${LONG_CALL_SECONDS / 60} min`, `Duži od ${LONG_CALL_SECONDS / 60} min`)}
          value={data ? num(data.long) : '—'}
          note={t('real conversations', 'pravi razgovori')}
        />
        <StatCard icon={Timer} color="warning" label={t('Average length', 'Prosečno trajanje')} value={data ? minSec(data.avgSeconds) : '—'} />
        <StatCard icon={PhoneMissed} color="secondary" label={t('Missed', 'Propušteno')} value={data ? num(data.missed) : '—'} />
      </div>
    </div>
  );
}
