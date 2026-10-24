import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageHeading } from '@/components/admin/PageHeading';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { db } from '@/lib/admin/supabase';
import { leadSource } from '@/lib/admin/leads';
import { STATUS_LABELS, formatDateTime } from '@/lib/admin/format';
import type { EmailLog, Lead, Site } from '@/lib/admin/types';
import { deleteLead, resendLead, toggleSpam, updateLead } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lid' };

const NOTICES: Record<string, string> = {
  saved: 'Sačuvano.',
  resent: 'Email je ponovo poslat. Rezultat je u istoriji ispod.',
  'not-spam': 'Lid više nije označen kao spam.',
  spam: 'Lid je označen kao spam i ne ulazi u statistiku.',
};

export default async function LeadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { id } = await params;
  const notice = NOTICES[(await searchParams).notice ?? ''] ?? '';
  if (!/^[0-9a-f-]{36}$/.test(id)) redirect('/admin/leads');

  const { data: lead } = await db().from('leads').select('*').eq('id', id).maybeSingle<Lead>();
  if (!lead) redirect('/admin/leads');
  const [{ data: site }, { data: logData }] = await Promise.all([
    db().from('sites').select('*').eq('id', lead.site_id).single<Site>(),
    db().from('email_log').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false }),
  ]);
  const emails = (logData ?? []) as EmailLog[];
  const tz = site?.timezone ?? 'Europe/Belgrade';
  const title = lead.visitor_name || lead.visitor_email || 'Lid';

  const meta: [string, string | null][] = [
    ['Sajt', site?.name ?? '—'],
    ['Forma', lead.form_name],
    [
      'Vreme',
      `${formatDateTime(lead.created_at)} (Beograd)${tz !== 'Europe/Belgrade' ? ` · ${formatDateTime(lead.created_at, tz)} (klijent)` : ''}`,
    ],
    ['Izvor', leadSource(lead)],
    ['Kampanja', [lead.utm_campaign, lead.utm_content, lead.utm_term].filter(Boolean).join(' · ') || null],
    ['Stranica', lead.page_url],
    ['Došao sa', lead.referrer],
    ['Uređaj', lead.user_agent],
  ];

  return (
    <>
      <PageHeading title={title} crumbs={[{ label: 'Lidovi', href: '/admin/leads' }]} />
      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/admin/leads" className="btn btn-light btn-sm">
          ← Svi lidovi
        </Link>
        {lead.is_spam ? (
          <span className="badge badge-spam">Spam</span>
        ) : (
          <span className={`badge badge-${lead.status}`}>{STATUS_LABELS[lead.status]}</span>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          {lead.visitor_email && (
            <a className="btn btn-primary btn-sm" href={`mailto:${lead.visitor_email}`}>
              Odgovori emailom
            </a>
          )}
          {lead.visitor_phone && (
            <a className="btn btn-outline btn-sm" href={`tel:${lead.visitor_phone.replace(/[^\d+]/g, '')}`}>
              Pozovi
            </a>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Podaci iz forme</h2>
            </div>
            <table className="table">
              <tbody>
                {Object.entries(lead.data).map(([key, value]) => (
                  <tr key={key}>
                    <td className="w-1/3 text-muted">{key}</td>
                    <td className="text-ink whitespace-pre-wrap break-words">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Odakle je došao</h2>
            </div>
            <table className="table">
              <tbody>
                {meta
                  .filter(([, v]) => v)
                  .map(([key, value]) => (
                    <tr key={key}>
                      <td className="w-1/3 text-muted">{key}</td>
                      <td className="break-all">{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <form action={updateLead} className="card">
            <input type="hidden" name="id" value={lead.id} />
            <div className="card-header">
              <h2 className="card-title">Praćenje</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="form-label" htmlFor="status">Status</label>
                <select className="form-input" id="status" name="status" defaultValue={lead.status}>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="notes">Beleške</label>
                <textarea className="form-input" id="notes" name="notes" rows={4} defaultValue={lead.notes ?? ''} />
              </div>
              <button className="btn btn-primary" type="submit">
                Sačuvaj
              </button>
            </div>
          </form>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Poslati emailovi</h2>
            </div>
            <div className="card-body space-y-3">
              {emails.length === 0 && (
                <p className="text-muted">Nijedan email nije poslat{lead.is_spam ? ' (spam se ne šalje)' : ''}.</p>
              )}
              {emails.map((e) => (
                <div key={e.id} className="text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${e.status === 'sent' ? 'badge-won' : 'badge-spam'}`}>{e.status === 'sent' ? 'Poslato' : 'Greška'}</span>
                    <span className="text-ink truncate">{e.recipient}</span>
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {e.kind === 'client' ? 'Klijent' : 'Ti'} · {formatDateTime(e.created_at)}
                  </div>
                  {e.error && <div className="text-xs text-orange-700 mt-0.5">{e.error}</div>}
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                <form action={resendLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <input type="hidden" name="to" value="client" />
                  <button className="btn btn-outline btn-sm" type="submit" disabled={!site?.client_emails.length}>
                    Pošalji klijentu
                  </button>
                </form>
                <form action={resendLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <input type="hidden" name="to" value="owner" />
                  <button className="btn btn-outline btn-sm" type="submit">
                    Pošalji meni
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="card card-body flex flex-wrap gap-2">
            <form action={toggleSpam}>
              <input type="hidden" name="id" value={lead.id} />
              <button className="btn btn-light btn-sm" type="submit">
                {lead.is_spam ? 'Nije spam' : 'Označi kao spam'}
              </button>
            </form>
            <form action={deleteLead}>
              <input type="hidden" name="id" value={lead.id} />
              <ConfirmSubmit className="btn btn-danger btn-sm" message="Trajno obrisati ovaj lid?">
                Obriši lid
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
