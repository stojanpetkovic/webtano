import Link from 'next/link';
import { FileText } from 'lucide-react';
import { getAdminI18n } from '@/lib/admin/i18n';
import { dayKey } from '@/lib/admin/stats';
import { aiImpressionsFor, aiReports } from '@/lib/admin/aiImpressions';
import { adCallReports, adCallsFor } from '@/lib/admin/adsCalls';
import { AiReportSection, AiUploadManager } from '@/components/admin/GoogleAi';
import { AdCallsReportSection, AdCallsUploadManager } from '@/components/admin/AdsCalls';
import type { Site } from '@/lib/admin/types';

/** The last `days` days including today in the site's timezone, and the `days` before them. */
function rangeDays(timeZone: string, days: number) {
  const dayAgo = (i: number) => dayKey(new Date(Date.now() - i * 86_400_000), timeZone);
  return {
    current: Array.from({ length: days }, (_, i) => dayAgo(days - 1 - i)),
    previous: Array.from({ length: days }, (_, i) => dayAgo(2 * days - 1 - i)),
  };
}

/**
 * Site dashboard: the Google files (Ads call details, Search Console AI exports) are added here,
 * with their numbers for the selected range. Whatever is uploaded also appears in the PDF report.
 */
export async function SiteGoogleFiles({ site, range, query }: { site: Site; range: number; query: URLSearchParams }) {
  const { lang, t } = await getAdminI18n();
  const [calls, ai] = await Promise.all([adCallReports(site.id), aiReports(site.id)]);
  const { current, previous } = rangeDays(site.timezone, range);
  const callsData = adCallsFor(calls.rows, current, previous);
  const aiData = aiImpressionsFor(ai.rows, current, previous);

  const back = new URLSearchParams(query);
  back.delete('ai');
  back.delete('calls');
  const backQuery = `?${back}`;
  const pick = <R extends { id: string; file_name: string; date_from: string; date_to: string; total: number; created_at: string }>(rows: R[]) =>
    rows.map(({ id, file_name, date_from, date_to, total, created_at }) => ({ id, file_name, date_from, date_to, total, created_at }));

  const reportLink = (
    <Link href={`/admin/sites/${site.id}/report`} className="btn btn-sm btn-light">
      <FileText className="size-4" /> {t('PDF report', 'PDF izveštaj')}
    </Link>
  );
  const empty = (text: string) => <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">{text}</p>;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div id="google-ads-pozivi" className="card min-w-0 scroll-mt-20">
        <div className="card-header">
          <div>
            <h2 className="card-title">{t('Calls from Google Ads', 'Pozivi sa Google Ads oglasa')}</h2>
            <p className="card-sub">
              {callsData
                ? t('Shown in the PDF report for the same period', 'Ulazi u PDF izveštaj za isti period')
                : t('Add a call details file; it then also goes into the PDF report', 'Dodaj „Call details” fajl; posle ulazi i u PDF izveštaj')}
            </p>
          </div>
          {reportLink}
        </div>
        <div className="card-body space-y-4">
          <AdCallsUploadManager siteId={site.id} uploads={pick(calls.rows)} missing={calls.missing} notice={query.get('calls')} backQuery={backQuery} />
          {callsData
            ? <AdCallsReportSection data={callsData} locale={lang} />
            : empty(t('No calls from ads for this period yet.', 'Za ovaj period još nema poziva sa oglasa.'))}
        </div>
      </div>

      <div id="google-ai" className="card min-w-0 scroll-mt-20">
        <div className="card-header">
          <div>
            <h2 className="card-title">{t('Shown in Google AI answers', 'Prikazi u Google AI odgovorima')}</h2>
            <p className="card-sub">
              {aiData
                ? t('Shown in the PDF report for the same period', 'Ulazi u PDF izveštaj za isti period')
                : t('Add a Search Console file; it then also goes into the PDF report', 'Dodaj Search Console fajl; posle ulazi i u PDF izveštaj')}
            </p>
          </div>
          {reportLink}
        </div>
        <div className="card-body space-y-4">
          <AiUploadManager siteId={site.id} uploads={pick(ai.rows)} missing={ai.missing} notice={query.get('ai')} backQuery={backQuery} />
          {aiData
            ? <AiReportSection data={aiData} locale={lang} />
            : empty(t('No Google AI impressions for this period yet.', 'Za ovaj period još nema Google AI prikaza.'))}
        </div>
      </div>
    </div>
  );
}
