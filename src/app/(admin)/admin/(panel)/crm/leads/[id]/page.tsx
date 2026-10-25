import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, Building2, FileText, Globe, Mail, Phone, Trash2, UserCheck } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { NewProposal } from '@/components/admin/crm/NewProposal';
import { MarkLeadsSeen } from '@/components/admin/MarkLeadsSeen';
import { unseenLeadCount } from '@/lib/admin/seen';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { ActivityFeed } from '@/components/admin/crm/ActivityFeed';
import { DealForm } from '@/components/admin/crm/DealForm';
import { StageSteps } from '@/components/admin/crm/StageSteps';
import { convertDeal, deleteDeal } from '../../actions';
import { db } from '@/lib/admin/supabase';
import { PROPOSAL_STATUS, SERVICES, money } from '@/lib/admin/crm/labels';
import { formatDateTime } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import type { Activity, Deal, Proposal } from '@/lib/admin/crm/types';
import type { Lead } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lid' };

const FIELD_LABELS: Record<string, string> = {
  service: 'Usluga',
  website: 'Sajt',
  business: 'Posao',
  timeline: 'Kada',
  message: 'Poruka',
};
const TIMELINE: Record<string, string> = { asap: 'Što pre', '1-3-months': 'Za 1 do 3 meseca', exploring: 'Samo istražuje' };

export default async function DealPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const notice = toParams(await searchParams).get('notice');
  if (!/^[0-9a-f-]{36}$/.test(id)) redirect('/admin/crm/leads');
  const { data: deal } = await db().from('crm_deals').select('*').eq('id', id).maybeSingle<Deal>();
  if (!deal) redirect('/admin/crm/leads');

  const [{ data: activity }, { data: proposals }, { data: lead }] = await Promise.all([
    db().from('crm_activity').select('*').eq('deal_id', deal.id).order('created_at', { ascending: false }),
    db().from('crm_proposals').select('*').eq('deal_id', deal.id).order('created_at', { ascending: false }),
    deal.lead_id ? db().from('leads').select('*').eq('id', deal.lead_id).maybeSingle<Lead>() : Promise.resolve({ data: null }),
  ]);
  const formFields = Object.entries((lead as Lead | null)?.data ?? {}).filter(([k, v]) => FIELD_LABELS[k] && v);

  return (
    <>
      {(await unseenLeadCount('crm')) > 0 && <MarkLeadsSeen scope="crm" />}
      <PageHeading title={deal.name} crumbs={[{ label: 'WebTano CRM' }, { label: 'Lidovi', href: '/admin/crm/leads' }]} description={deal.company ?? undefined}>
        <NewProposal
          dealId={deal.id}
          buttonClassName="btn btn-outline"
          label={
            <>
              <FileText className="size-4" /> Napravi ponudu
            </>
          }
        />
        <form action={convertDeal}>
          <input type="hidden" name="id" value={deal.id} />
          <button className="btn btn-primary" type="submit">
            <UserCheck className="size-4" /> {deal.customer_id ? 'Otvori klijenta' : 'Pretvori u klijenta'}
          </button>
        </form>
      </PageHeading>

      {notice === 'saved' && <div className="alert alert-success">Sačuvano.</div>}

      <div className="card card-body">
        <StageSteps dealId={deal.id} stage={deal.stage} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          {formFields.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Upit sa webtano.com</h2>
                {lead && <span className="text-xs text-muted">{formatDateTime((lead as Lead).created_at)}</span>}
              </div>
              <dl className="divide-y divide-line">
                {formFields.map(([k, v]) => (
                  <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[140px_1fr]">
                    <dt className="text-[13px] text-zinc-500">{FIELD_LABELS[k]}</dt>
                    <dd className="text-[13.5px] whitespace-pre-line text-ink">{k === 'service' ? SERVICES[v] ?? v : k === 'timeline' ? TIMELINE[v] ?? v : v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <ActivityFeed items={(activity ?? []) as Activity[]} target={{ deal_id: deal.id, customer_id: deal.customer_id ?? undefined }} />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Kontakt</h2>
              {Number(deal.value) > 0 && <span className="text-[15px] font-semibold text-ink tabular-nums">{money(Number(deal.value))}</span>}
            </div>
            <ul className="space-y-3 p-5 text-[13.5px]">
              {deal.email && (
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-zinc-400" />
                  <a href={`mailto:${deal.email}`} className="truncate text-ink hover:text-primary">{deal.email}</a>
                </li>
              )}
              {deal.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-zinc-400" />
                  <a href={`tel:${deal.phone.replace(/[^\d+]/g, '')}`} className="text-ink hover:text-primary">{deal.phone}</a>
                </li>
              )}
              {deal.website && (
                <li className="flex items-center gap-3">
                  <Globe className="size-4 text-zinc-400" />
                  <a href={`https://${deal.website}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 truncate text-ink hover:text-primary">
                    {deal.website} <ArrowUpRight className="size-3.5 text-zinc-400" />
                  </a>
                </li>
              )}
              {deal.company && (
                <li className="flex items-center gap-3">
                  <Building2 className="size-4 text-zinc-400" />
                  <span>{deal.company}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Ponude</h2>
            </div>
            <ul className="divide-y divide-line">
              {(proposals ?? []).length === 0 && <li className="px-5 py-4 text-muted">Još nema ponuda.</li>}
              {((proposals ?? []) as Proposal[]).map((p) => (
                <li key={p.id} className="relative flex items-center justify-between gap-3 px-5 py-3">
                  <Link href={`/admin/crm/proposals/${p.id}`} className="truncate text-[13.5px] font-medium text-ink after:absolute after:inset-0">
                    #{p.number} {p.title}
                  </Link>
                  <span className={`badge ${PROPOSAL_STATUS[p.status].badge}`}>{PROPOSAL_STATUS[p.status].label}</span>
                </li>
              ))}
            </ul>
          </div>

          <details className="card group">
            <summary className="card-header cursor-pointer list-none border-b-0 group-open:border-b">
              <h2 className="card-title">Izmeni podatke</h2>
              <span className="text-xs text-muted group-open:hidden">Otvori</span>
            </summary>
            <div className="card-body">
              <DealForm deal={deal} />
            </div>
          </details>

          <form action={deleteDeal} className="text-right">
            <input type="hidden" name="id" value={deal.id} />
            <ConfirmSubmit className="btn btn-sm btn-danger" message="Obrisati ovaj lid iz CRM-a? Originalni upit ostaje u bazi.">
              <Trash2 className="size-4" /> Obriši lid
            </ConfirmSubmit>
          </form>
        </div>
      </div>
    </>
  );
}
