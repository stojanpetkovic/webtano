import { FileSpreadsheet, Trash2, Upload } from 'lucide-react';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { AiImpressions, AiUpload } from '@/lib/admin/aiImpressions';
import type { ReportLocale } from '@/lib/admin/analytics';
import { formatNumber } from '@/lib/admin/report';
import { deleteAiReport, uploadAiReport } from '@/app/(admin)/admin/(print)/sites/[id]/report/actions';

const NOTICES: Record<string, { tone: 'ok' | 'err'; en: string; sr: string }> = {
  added: { tone: 'ok', en: 'File added. Its numbers are below and in the PDF report.', sr: 'Fajl je dodat. Brojke su prikazane ispod i ulaze u PDF izveštaj.' },
  deleted: { tone: 'ok', en: 'File deleted.', sr: 'Fajl je obrisan.' },
  empty: { tone: 'err', en: 'Choose a file first.', sr: 'Prvo izaberi fajl.' },
  'too-big': { tone: 'err', en: 'The file is too big for a Search Console export.', sr: 'Fajl je prevelik za Search Console izvoz.' },
  'not-zip': {
    tone: 'err',
    en: 'This is not an .xlsx or CSV .zip from Search Console.',
    sr: 'Ovo nije .xlsx ni CSV .zip iz Search Console-a.',
  },
  'no-chart': {
    tone: 'err',
    en: 'No Date / Impressions sheet in the file. Export the "Search generative AI features" report.',
    sr: 'U fajlu nema lista Date / Impressions. Izvezi izveštaj „Search generative AI features”.',
  },
  'performance-report': {
    tone: 'err',
    en: 'This is the normal Performance report (it has clicks). Upload the "Search generative AI features" export.',
    sr: 'Ovo je običan Performance izveštaj (ima klikove). Ubaci izvoz „Search generative AI features”.',
  },
  unreadable: { tone: 'err', en: 'The file could not be read.', sr: 'Fajl ne može da se pročita.' },
  db: {
    tone: 'err',
    en: 'Saving failed. Has supabase/migrations/20261114_site_ai_reports.sql been run?',
    sr: 'Čuvanje nije uspelo. Da li je pokrenut supabase/migrations/20261114_site_ai_reports.sql?',
  },
};

/** Panel on the site dashboard: upload and delete Search Console AI exports. Never printed. */
export async function AiUploadManager({
  siteId,
  uploads,
  missing,
  notice,
  backQuery,
}: {
  siteId: string;
  uploads: AiUpload[];
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
        {t('Google AI impressions (Search Console files)', 'Google AI prikazi (fajlovi iz Search Console-a)')}
        <span className="ms-2 font-normal text-zinc-500">
          {uploads.length ? t(`${uploads.length} file(s)`, `fajlova: ${uploads.length}`) : t('no files yet', 'još nema fajlova')}
        </span>
      </summary>

      <p className="mt-3 text-xs leading-relaxed text-zinc-500">
        {t(
          'In Search Console open Performance → "Search generative AI features" (AI Overviews and AI Mode), pick the period and use Export → Excel or CSV. Google gives these numbers only there, not through its API. Where two files cover the same day, the newer one counts.',
          'U Search Console-u otvori Performance → „Search generative AI features” (AI Overviews i AI Mode), izaberi period i klikni Export → Excel ili CSV. Google ove brojke daje samo tu, ne preko API-ja. Ako dva fajla pokrivaju isti dan, važi noviji.',
        )}
      </p>

      {missing && (
        <p className="mt-3 rounded bg-orange-50 px-3 py-2 text-xs text-orange-800">
          {t('Run supabase/migrations/20261114_site_ai_reports.sql in Supabase first.', 'Prvo pokreni supabase/migrations/20261114_site_ai_reports.sql u Supabase-u.')}
        </p>
      )}
      {msg && (
        <p className={`mt-3 rounded px-3 py-2 text-xs ${msg.tone === 'ok' ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>{msg[lang]}</p>
      )}

      <form action={uploadAiReport} className="mt-3 flex flex-wrap items-center gap-2">
        <input type="hidden" name="site_id" value={siteId} />
        <input type="hidden" name="back" value={backQuery} />
        <input
          type="file"
          name="file"
          required
          accept=".xlsx,.zip,application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                {date(u.date_from)} – {date(u.date_to)} · {u.total.toLocaleString(lang === 'en' ? 'en-US' : 'sr-Latn-RS')} {t('impressions', 'prikaza')}
              </span>
              <form action={deleteAiReport}>
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
const H = 120;

/** Daily impressions as plain SVG bars, sharp in the printed PDF. */
function Bars({ daily }: { daily: { day: string; count: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  const slot = W / Math.max(1, daily.length);
  const bw = Math.max(2, Math.min(18, slot * 0.65));
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="h-auto w-full" role="img" aria-hidden="true">
      <line x1="0" x2={W} y1={H} y2={H} stroke="#e4e4e7" />
      {daily.map((d, i) => {
        const h = (d.count / max) * (H - 6);
        return <rect key={d.day} x={slot * i + (slot - bw) / 2} y={H - h} width={bw} height={h} rx="2" fill="#7c3aed" />;
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
    title: 'Google AI pregledi (AI Overviews i AI Mode)',
    shown: 'Prikaza u Google AI odgovorima',
    perDay: 'Prosečno dnevno',
    topPage: 'Najčešće prikazana stranica',
    pages: 'Stranice u AI odgovorima',
    span: (f: string, t: string) => `${f} – ${t}`,
    devices: 'Uređaji',
    countries: 'Zemlje',
    vsPrev: 'u odnosu na prethodni period',
    noPrev: 'nema podataka za prethodni period',
    note: (to: string) =>
      `Prikaz znači da se sajt pojavio kao izvor u Google AI odgovoru. Posete sa tih linkova Google šalje kao običnu pretragu, pa su uračunate u „Google pretraga”. Izvor: Google Search Console, podaci zaključno sa ${to}.`,
    partial: (c: number, d: number) => `Podaci pokrivaju ${c} od ${d} dana ovog perioda.`,
    breakdown: (f: string, t: string) => `Stranice, uređaji i zemlje važe za ceo fajl (${f} – ${t}).`,
  },
  en: {
    title: 'Google AI results (AI Overviews and AI Mode)',
    shown: 'Times shown in Google AI answers',
    perDay: 'Average per day',
    topPage: 'Page shown most',
    pages: 'Pages in AI answers',
    span: (f: string, t: string) => `${f} – ${t}`,
    devices: 'Devices',
    countries: 'Countries',
    vsPrev: 'vs the previous period',
    noPrev: 'no data for the previous period',
    note: (to: string) =>
      `An impression means the site was shown as a source in a Google AI answer. Google sends visits from those links like a normal search, so they count under "Google Search". Source: Google Search Console, data up to ${to}.`,
    partial: (c: number, d: number) => `The data covers ${c} of the ${d} days in this period.`,
    breakdown: (f: string, t: string) => `Pages, devices and countries cover the whole file (${f} – ${t}).`,
  },
} as const;

/** The report section with Google AI impressions for the period. Prints with the report. */
export function AiReportSection({ data, locale }: { data: AiImpressions; locale: ReportLocale }) {
  const l = L[locale];
  const n = (v: number) => formatNumber(v, locale);
  const date = (d: string) =>
    new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'sr-Latn-RS', { dateStyle: 'medium', timeZone: 'UTC' })
      .format(new Date(`${d}T12:00:00Z`))
      .replace(/\.$/, '');
  const span = l.span(date(data.breakdownFrom), date(data.breakdownTo));
  const pct = data.previous ? Math.round(((data.total - data.previous) / data.previous) * 100) : null;
  const change =
    pct === null
      ? { text: l.noPrev, cls: 'text-zinc-500' }
      : { text: `${pct >= 0 ? '+' : ''}${pct}% ${l.vsPrev}`, cls: pct >= 0 ? 'text-green-700' : 'text-orange-700' };
  const maxPage = Math.max(1, ...data.pages.map((p) => p.count));
  const avg = data.covered ? data.total / data.covered : 0;

  return (
    <section className="avoid-break space-y-4">
      <h2 className="text-base font-semibold">{l.title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 print:grid-cols-3 [&>*]:min-w-0">
        <div className="rounded-[0.3rem] bg-violet-100 p-4">
          <div className="text-xl font-semibold text-zinc-900 tabular-nums">{n(data.total)}</div>
          <div className="text-xs text-zinc-700">{l.shown}</div>
          <div className={`mt-1 text-[11px] leading-snug ${change.cls}`}>{change.text}</div>
        </div>
        <div className="rounded-[0.3rem] border border-zinc-200 p-4">
          <div className="text-xl font-semibold text-zinc-900 tabular-nums">
            {avg.toLocaleString(locale === 'en' ? 'en-US' : 'sr-Latn-RS', { maximumFractionDigits: 1 })}
          </div>
          <div className="text-xs text-zinc-700">{l.perDay}</div>
        </div>
        <div className="col-span-2 rounded-[0.3rem] border border-zinc-200 p-4 sm:col-span-1 print:col-span-1">
          <div className="truncate text-sm font-semibold text-zinc-900" title={data.pages[0]?.label}>
            {data.pages[0]?.label ?? '—'}
          </div>
          <div className="text-xs text-zinc-700">{l.topPage}</div>
          {data.pages[0] && (
            <div className="mt-1 text-[11px] text-zinc-500 tabular-nums">
              {n(data.pages[0].count)} · {span}
            </div>
          )}
        </div>
      </div>
      <Bars daily={data.daily} />
      <div className="grid gap-6 sm:grid-cols-3 print:grid-cols-3 [&>*]:min-w-0">
        <div className="min-w-0 sm:col-span-2 print:col-span-2">
          <h3 className="mb-2 text-sm font-semibold">
            {l.pages} <span className="font-normal text-zinc-500">({span})</span>
          </h3>
          <div className="space-y-2">
            {data.pages.slice(0, 6).map((p) => (
              <div key={p.label}>
                <div className="flex justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate text-zinc-700" title={p.label}>
                    {p.label}
                  </span>
                  <span className="font-semibold tabular-nums">{n(p.count)}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-zinc-100">
                  <div className="h-1.5 rounded-full bg-violet-600" style={{ width: `${(p.count / maxPage) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {[
            { title: l.devices, items: data.devices },
            { title: l.countries, items: data.countries.slice(0, 4) },
          ].map((b) => (
            <div key={b.title}>
              <h3 className="mb-2 text-sm font-semibold">{b.title}</h3>
              <ul className="space-y-1 text-[13px]">
                {b.items.map((i) => (
                  <li key={i.label} className="flex justify-between gap-3">
                    <span className="truncate text-zinc-700">{i.label}</span>
                    <span className="font-semibold tabular-nums">{n(i.count)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] leading-snug text-zinc-500">
        {l.note(date(data.lastDay))} {data.covered < data.days && l.partial(data.covered, data.days)}{' '}
        {l.breakdown(date(data.breakdownFrom), date(data.breakdownTo))}
      </p>
    </section>
  );
}
