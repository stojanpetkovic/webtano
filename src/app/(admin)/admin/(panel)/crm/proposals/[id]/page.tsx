import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Check, FileDown, FolderKanban, Send, Trash2, X } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { ProposalForm } from '@/components/admin/crm/ProposalForm';
import { deleteProposal, projectFromProposal, setProposalStatus } from '../../actions';
import { db } from '@/lib/admin/supabase';
import { PROPOSAL_STATUS } from '@/lib/admin/crm/labels';
import { priceList } from '@/lib/admin/crm/priceList';
import { toParams } from '@/lib/admin/params';
import type { Customer, Deal, Proposal, ProposalItem } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Ponuda' };

function StatusButton({ id, status, children, className }: { id: string; status: string; children: React.ReactNode; className: string }) {
  return (
    <form action={setProposalStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={className} type="submit">{children}</button>
    </form>
  );
}

export default async function ProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const notice = toParams(await searchParams).get('notice');
  if (!/^[0-9a-f-]{36}$/.test(id)) redirect('/admin/crm/proposals');
  const [{ data: proposal }, { data: items }, { data: customers }, { data: deals }, { data: project }] = await Promise.all([
    db().from('crm_proposals').select('*').eq('id', id).maybeSingle<Proposal>(),
    db().from('crm_proposal_items').select('*').eq('proposal_id', id).order('position'),
    db().from('crm_customers').select('id, company').order('company'),
    db().from('crm_deals').select('id, name, company').eq('archived', false).order('created_at', { ascending: false }),
    db().from('crm_projects').select('id').eq('proposal_id', id).limit(1).maybeSingle<{ id: string }>(),
  ]);
  if (!proposal) redirect('/admin/crm/proposals');
  const st = PROPOSAL_STATUS[proposal.status];

  return (
    <>
      <PageHeading
        title={`#${String(proposal.number).padStart(4, '0')} ${proposal.title}`}
        crumbs={[{ label: 'WebTano CRM' }, { label: 'Ponude', href: '/admin/crm/proposals' }]}
        description={<span className={`badge ${st.badge}`}>{st.label}</span>}
      >
        <Link href={`/admin/crm/proposals/${proposal.id}/pdf`} className="btn btn-outline">
          <FileDown className="size-4" /> PDF
        </Link>
        {proposal.status === 'draft' && (
          <StatusButton id={proposal.id} status="sent" className="btn btn-primary"><Send className="size-4" /> Označi kao poslatu</StatusButton>
        )}
        {proposal.status === 'sent' && (
          <>
            <StatusButton id={proposal.id} status="declined" className="btn btn-light"><X className="size-4" /> Odbijena</StatusButton>
            <StatusButton id={proposal.id} status="accepted" className="btn btn-accent"><Check className="size-4" /> Prihvaćena</StatusButton>
          </>
        )}
        {proposal.status === 'accepted' &&
          (project ? (
            <Link href={`/admin/crm/projects/${project.id}`} className="btn btn-primary"><FolderKanban className="size-4" /> Otvori projekat</Link>
          ) : (
            <form action={projectFromProposal}>
              <input type="hidden" name="id" value={proposal.id} />
              <button className="btn btn-primary" type="submit"><FolderKanban className="size-4" /> Pokreni projekat</button>
            </form>
          ))}
      </PageHeading>

      {notice === 'saved' && <div className="alert alert-success">Ponuda je sačuvana. PDF otvaraš dugmetom gore desno.</div>}

      <ProposalForm
        proposal={proposal}
        items={(items ?? []) as ProposalItem[]}
        customers={(customers ?? []) as Pick<Customer, 'id' | 'company'>[]}
        deals={(deals ?? []) as Pick<Deal, 'id' | 'name' | 'company'>[]}
        priceList={await priceList()}
      />

      <form action={deleteProposal} className="text-right">
        <input type="hidden" name="id" value={proposal.id} />
        <ConfirmSubmit className="btn btn-sm btn-danger" message="Obrisati ovu ponudu?">
          <Trash2 className="size-4" /> Obriši ponudu
        </ConfirmSubmit>
      </form>
    </>
  );
}
