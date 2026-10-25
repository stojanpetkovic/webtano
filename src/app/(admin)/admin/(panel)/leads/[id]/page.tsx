import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageHeading } from '@/components/admin/PageHeading';
import { MarkLeadsSeen } from '@/components/admin/MarkLeadsSeen';
import { unseenLeadCount } from '@/lib/admin/seen';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { db } from '@/lib/admin/supabase';
import { leadSource } from '@/lib/admin/leads';
import { STATUS_LABELS, formatDateTime } from '@/lib/admin/format';
import type { EmailLog, Lead, Site } from '@/lib/admin/types';
import { channelLabel } from '@/lib/admin/channels';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { T } from '@/lib/i18n';
import { deleteLead, resendLead, toggleSpam, updateLead } from './actions';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Lead', 'Lid') };
}

const notices = (t: T): Record<string, string> => ({
  saved: t('Saved.', 'Sačuvano.'),
  resent: t('The email was sent again. The result is in the history below.', 'Email je ponovo poslat. Rezultat je u istoriji ispod.'),
  'not-spam': t('The lead is no longer marked as spam.', 'Lid više nije označen kao spam.'),
  spam: t('The lead is marked as spam and left out of the stats.', 'Lid je označen kao spam i ne ulazi u statistiku.'),
});

export default async function LeadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { lang, t } = await getAdminI18n();
  const { id } = await params;
  const notice = notices(t)[(await searchParams).notice ?? ''] ?? '';
  if (!/^[0-9a-f-]{36}$/.test(id)) redirect('/admin/leads');

  const { data: lead } = await db().from('leads').select('*').eq('id', id).maybeSingle<Lead>();
  if (!lead) redirect('/admin/leads');
  const [{ data: site }, { data: logData }] = await Promise.all([
    db().from('sites').select('*').eq('id', lead.site_id).single<Site>(),
    db().from('email_log').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false }),
  ]);
  const emails = (logData ?? []) as EmailLog[];
  const tz = site?.timezone ?? 'Europe/Belgrade';
  const title = lead.visitor_name || lead.visitor_email || t('Lead', 'Lid');

  const meta: [string, string | null][] = [
    [t('Site', 'Sajt'), site?.name ?? '—'],
    [t('Form', 'Forma'), lead.form_name],
    [
      t('Time', 'Vreme'),
      `${formatDateTime(lead.created_at, lang)} (${t('Belgrade', 'Beograd')})${
        tz !== 'Europe/Belgrade' ? ` · ${formatDateTime(lead.created_at, lang, tz)} (${t('client', 'klijent')})` : ''
      }`,
    ],
    [t('Source', 'Izvor'), channelLabel(leadSource(lead), lang)],
    [t('Campaign', 'Kampanja'), [lead.utm_campaign, lead.utm_content, lead.utm_term].filter(Boolean).join(' · ') || null],
    [t('Page', 'Stranica'), lead.page_url],
    [t('Came from', 'Došao sa'), lead.referrer],
    [t('Device', 'Uređaj'), lead.user_agent],
  ];

  return (
    <>
      {(await unseenLeadCount('sites')) > 0 && <MarkLeadsSeen scope="sites" />}
      <PageHeading title={title} crumbs={[{ label: t('Leads', 'Lidovi'), href: '/admin/leads' }]} />
      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/admin/leads" className="btn btn-light btn-sm">
          ← {t('All leads', 'Svi lidovi')}
        </Link>
        {lead.is_spam ? (
          <span className="badge badge-spam">Spam</span>
        ) : (
          <span className={`badge badge-${lead.status}`}>{STATUS_LABELS[lead.status][lang]}</span>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          {lead.visitor_email && (
            <a className="btn btn-primary btn-sm" href={`mailto:${lead.visitor_email}`}>
              {t('Reply by email', 'Odgovori emailom')}
            </a>
          )}
          {lead.visitor_phone && (
            <a className="btn btn-outline btn-sm" href={`tel:${lead.visitor_phone.replace(/[^\d+]/g, '')}`}>
              {t('Call', 'Pozovi')}
            </a>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t('Form details', 'Podaci iz forme')}</h2>
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
              <h2 className="card-title">{t('Where they came from', 'Odakle je došao')}</h2>
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
              <h2 className="card-title">{t('Follow-up', 'Praćenje')}</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="form-label" htmlFor="status">Status</label>
                <select className="form-input" id="status" name="status" defaultValue={lead.status}>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label[lang]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="notes">
                  {t('Notes', 'Beleške')}
                </label>
                <textarea className="form-input" id="notes" name="notes" rows={4} defaultValue={lead.notes ?? ''} />
              </div>
              <button className="btn btn-primary" type="submit">
                {t('Save', 'Sačuvaj')}
              </button>
            </div>
          </form>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t('Emails sent', 'Poslati emailovi')}</h2>
            </div>
            <div className="card-body space-y-3">
              {emails.length === 0 && (
                <p className="text-muted">
                  {t('No email was sent', 'Nijedan email nije poslat')}
                  {lead.is_spam ? t(' (spam is not sent)', ' (spam se ne šalje)') : ''}.
                </p>
              )}
              {emails.map((e) => (
                <div key={e.id} className="text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${e.status === 'sent' ? 'badge-won' : 'badge-spam'}`}>{e.status === 'sent' ? t('Sent', 'Poslato') : t('Error', 'Greška')}</span>
                    <span className="text-ink truncate">{e.recipient}</span>
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {e.kind === 'client' ? t('Client', 'Klijent') : t('You', 'Ti')} · {formatDateTime(e.created_at, lang)}
                  </div>
                  {e.error && <div className="text-xs text-orange-700 mt-0.5">{e.error}</div>}
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                <form action={resendLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <input type="hidden" name="to" value="client" />
                  <button className="btn btn-outline btn-sm" type="submit" disabled={!site?.client_emails.length}>
                    {t('Send to client', 'Pošalji klijentu')}
                  </button>
                </form>
                <form action={resendLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <input type="hidden" name="to" value="owner" />
                  <button className="btn btn-outline btn-sm" type="submit">
                    {t('Send to me', 'Pošalji meni')}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="card card-body flex flex-wrap gap-2">
            <form action={toggleSpam}>
              <input type="hidden" name="id" value={lead.id} />
              <button className="btn btn-light btn-sm" type="submit">
                {lead.is_spam ? t('Not spam', 'Nije spam') : t('Mark as spam', 'Označi kao spam')}
              </button>
            </form>
            <form action={deleteLead}>
              <input type="hidden" name="id" value={lead.id} />
              <ConfirmSubmit className="btn btn-danger btn-sm" message={t('Delete this lead for good?', 'Trajno obrisati ovaj lid?')}>
                {t('Delete lead', 'Obriši lid')}
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
