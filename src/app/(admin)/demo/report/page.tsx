import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FlaskConical } from 'lucide-react';
import { ReportView } from '@/components/admin/ReportView';
import { DEMO_SITE, DEMO_SPEND, demoReport } from '@/lib/admin/demoReport';
import { toParams } from '@/lib/admin/params';
import { reportPeriod } from '@/lib/admin/report';

// A public copy of the client report with made-up data, so prospects can try
// the real page: periods, language, ad spend and print to PDF all work.

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Demo report · WebTano' },
  description: 'Try the monthly report every WebTano client gets, with example data.',
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DemoReportPage({ searchParams }: Props) {
  const params = toParams(await searchParams);
  // Show the cost figures until the visitor enters spend of their own.
  if (!['spendGoogle', 'spendMeta', 'spendOther'].some((key) => params.has(key))) {
    for (const [key, value] of Object.entries(DEMO_SPEND)) params.set(key, value);
  }
  const { locale, all, period, customRejected } = reportPeriod(DEMO_SITE, params);
  const { analytics, leads } = demoReport(period.current, period.previous, locale);
  const sr = locale === 'sr';

  return (
    <ReportView
      site={DEMO_SITE}
      analytics={analytics}
      leads={leads}
      params={params}
      locale={locale}
      all={all}
      period={period}
      customRejected={customRejected}
      back={{ href: '/', label: 'webtano.com' }}
      banner={
        <div className="bg-[#05170f] text-white print:hidden">
          <div className="mx-auto flex max-w-[210mm] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c5f24a]/15 px-2.5 py-0.5 text-xs font-semibold text-[#c5f24a] ring-1 ring-[#c5f24a]/30">
              <FlaskConical className="size-3.5" />
              Demo
            </span>
            <p className="flex-1 text-white/75">
              {sr
                ? 'Primer izveštaja sa izmišljenim podacima. Promeni period, jezik ili budžet za oglase.'
                : 'An example report with made-up data. Change the period, the language or the ad spend.'}
            </p>
            <Link href="/#hero-form" className="inline-flex items-center gap-1 font-semibold text-[#c5f24a] hover:underline">
              {sr ? 'Želim ovo za svoj sajt' : 'Get this for your site'}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      }
    />
  );
}
