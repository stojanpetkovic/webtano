import Link from 'next/link';
import { ChartColumn, ExternalLink, FileText, Globe, MoveRight, Settings } from 'lucide-react';
import type { Site } from '@/lib/admin/types';

// The strip above every page of one site: its address, client and status,
// then the tabs that split the site into its overview and its settings.
export function SiteHeader({ site, current }: { site: Site; current: 'overview' | 'settings' | 'report' }) {
  const tabs = [
    { key: 'overview', label: 'Pregled', icon: ChartColumn, href: `/admin/sites/${site.id}` },
    { key: 'report', label: 'Izveštaj (PDF)', icon: FileText, href: `/admin/sites/${site.id}/report` },
    { key: 'settings', label: 'Podešavanja', icon: Settings, href: `/admin/sites/${site.id}/settings` },
  ] as const;

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 pt-5">
        <span className="grid size-11 place-items-center rounded bg-primary/10 text-primary">
          <Globe className="size-5" />
        </span>
        <div className="min-w-0">
          <a
            href={`https://${site.domain}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 font-semibold text-zinc-800 hover:text-primary"
          >
            {site.domain}
            <ExternalLink className="size-3.5 text-zinc-400" />
          </a>
          <div className="text-xs text-zinc-500">
            {site.client_name ?? 'Bez imena klijenta'}
            {' · '}
            {site.active ? <span className="text-green-600">aktivan</span> : <span className="text-orange-600">pauziran</span>}
          </div>
        </div>
        <Link href={`/admin/leads?site=${site.id}`} className="btn btn-sm btn-soft ms-auto">
          Svi lidovi <MoveRight className="size-4" />
        </Link>
      </div>

      <nav className="mt-4 flex gap-6 border-t border-zinc-200 px-5" aria-label="Sajt">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors ${
              tab.key === current
                ? 'border-primary text-primary'
                : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-800'
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
