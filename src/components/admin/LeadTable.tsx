import Link from 'next/link';
import { STATUS_LABELS, timeAgo, formatDateTime } from '@/lib/admin/format';
import { leadSource } from '@/lib/admin/leads';
import type { Lead, Site } from '@/lib/admin/types';

export function LeadTable({
  leads,
  sites,
  showSite = true,
  empty = 'Još nema lidova.',
}: {
  leads: Lead[];
  sites: Map<string, Site>;
  showSite?: boolean;
  empty?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Kontakt</th>
            {showSite && <th>Sajt</th>}
            <th>Forma</th>
            <th>Izvor</th>
            <th>Status</th>
            <th>Vreme</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 && (
            <tr>
              <td colSpan={showSite ? 6 : 5} className="text-center text-muted py-8">
                {empty}
              </td>
            </tr>
          )}
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <Link href={`/admin/leads/${lead.id}`} className="font-medium text-ink hover:text-primary">
                  {lead.visitor_name || lead.visitor_email || lead.visitor_phone || 'Bez imena'}
                </Link>
                <div className="text-xs text-muted">
                  {[lead.visitor_email, lead.visitor_phone].filter(Boolean).join(' · ')}
                </div>
              </td>
              {showSite && <td className="whitespace-nowrap">{sites.get(lead.site_id)?.name ?? '—'}</td>}
              <td>{lead.form_name}</td>
              <td className="whitespace-nowrap">{leadSource(lead)}</td>
              <td>
                {lead.is_spam ? (
                  <span className="badge badge-spam">Spam</span>
                ) : (
                  <span className={`badge badge-${lead.status}`}>{STATUS_LABELS[lead.status]}</span>
                )}
              </td>
              <td className="whitespace-nowrap text-muted" title={formatDateTime(lead.created_at)}>
                {timeAgo(lead.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
