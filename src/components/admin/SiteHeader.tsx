import Link from 'next/link';
import { ChartColumn, ExternalLink, FileText, Globe, MoveRight, Settings, Users } from 'lucide-react';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { Site } from '@/lib/admin/types';

// The strip above every page of one site: its address, client and status,
// then the tabs that split the site into its overview and its settings.
export async function SiteHeader({
  site,
  current,
  customer,
}: {
  site: Site;
  current: 'overview' | 'settings' | 'report';
  /** The CRM customer this site belongs to, when it is linked. */
  customer?: { id: string; name: string } | null;
}) {
  const { t } = await getAdminI18n();
  const tabs = [
    { key: 'overview', label: t('Overview', 'Pregled'), icon: ChartColumn, href: `/admin/sites/${site.id}` },
    { key: 'report', label: t('Report (PDF)', 'Izveštaj (PDF)'), icon: FileText, href: `/admin/sites/${site.id}/report` },
    { key: 'settings', label: t('Settings', 'Podešavanja'), icon: Settings, href: `/admin/sites/${site.id}/settings` },
  ] as const;

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 pt-5">
        <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-ink-900 to-ink-975 text-accent shadow-sm">
          <Globe className="size-5" />
        </span>
        <div className="min-w-0">
          <a
            href={`https://${site.domain}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink hover:text-primary"
          >
            {site.domain}
            <ExternalLink className="size-3.5 text-zinc-400" />
          </a>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            {customer ? (
              <Link href={`/admin/crm/customers/${customer.id}`} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                <Users className="size-3.5" /> {customer.name}
              </Link>
            ) : (
              (site.client_name ?? t('No client name', 'Bez imena klijenta'))
            )}
            {site.active ? <span className="badge badge-won">{t('Active', 'Aktivan')}</span> : <span className="badge badge-lost">{t('Paused', 'Pauziran')}</span>}
          </div>
        </div>
        <Link href={`/admin/leads?site=${site.id}`} className="btn btn-sm btn-outline ms-auto">
          {t('All leads', 'Svi lidovi')} <MoveRight className="size-4" />
        </Link>
      </div>

      <nav className="mt-4 flex gap-6 overflow-x-auto border-t border-line px-5" aria-label={t('Site', 'Sajt')}>
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 py-3 text-[13px] font-medium transition-colors ${
              tab.key === current
                ? 'border-ink text-ink'
                : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-ink'
            }`}
            aria-current={tab.key === current ? 'page' : undefined}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
