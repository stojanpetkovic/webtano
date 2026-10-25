import type { Metadata } from 'next';
import Link from 'next/link';
import { KanbanSquare, List, Plus } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { StatCard } from '@/components/admin/StatCard';
import { DealBoard } from '@/components/admin/crm/DealBoard';
import { DealForm } from '@/components/admin/crm/DealForm';
import { Modal } from '@/components/admin/Modal';
import { MarkLeadsSeen } from '@/components/admin/MarkLeadsSeen';
import { db } from '@/lib/admin/supabase';
import { syncDeals } from '@/lib/admin/crm/data';
import { unseenLeadCount } from '@/lib/admin/seen';
import { STAGES, STAGE_LABEL, dealServices, money } from '@/lib/admin/crm/labels';
import { ServicePills } from '@/components/admin/crm/ServicePills';
import { timeAgo } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { daysAgo } from '@/lib/admin/stats';
import type { Deal } from '@/lib/admin/crm/types';
import { CircleDollarSign, Handshake, Inbox, Target } from 'lucide-react';
import { getAdminI18n } from '@/lib/admin/i18n';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('WebTano leads', 'WebTano lidovi') };
}

export default async function CrmLeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t } = await getAdminI18n();
  const query = toParams(await searchParams);
  const view = query.get('view') === 'list' ? 'list' : 'board';
  await syncDeals();
  const { data } = await db().from('crm_deals').select('*').eq('archived', false).order('position');
  const deals = (data ?? []) as Deal[];

  const open = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  const pipeline = open.reduce((n, d) => n + Number(d.value || 0), 0);
  const since = daysAgo(30);
  const won30 = deals.filter((d) => d.stage === 'won' && d.updated_at >= since);
  const closed = deals.filter((d) => d.stage === 'won' || d.stage === 'lost');
  const winRate = closed.length ? Math.round((deals.filter((d) => d.stage === 'won').length / closed.length) * 100) : null;

  return (
    <>
      {(await unseenLeadCount('crm')) > 0 && <MarkLeadsSeen scope="crm" />}
      <PageHeading
        title={t('Leads', 'Lidovi')}
        crumbs={[{ label: 'WebTano CRM' }]}
        description={t(
          'Inquiries from webtano.com and leads you add by hand. Drag a card to the next stage.',
          'Upiti sa webtano.com i lidovi koje dodaš ručno. Prevuci karticu u sledeću fazu.',
        )}
      >
        <nav className="segmented" aria-label={t('View', 'Prikaz')}>
          <Link href="/admin/crm/leads" aria-current={view === 'board' ? 'page' : undefined} className="inline-flex items-center gap-1.5">
            <KanbanSquare className="size-3.5" /> {t('Board', 'Tabla')}
          </Link>
          <Link href="/admin/crm/leads?view=list" aria-current={view === 'list' ? 'page' : undefined} className="inline-flex items-center gap-1.5">
            <List className="size-3.5" /> {t('List', 'Lista')}
          </Link>
        </nav>
        <Modal
          label={
            <>
              <Plus className="size-4" /> {t('New lead', 'Novi lid')}
            </>
          }
          title={t('New lead', 'Novi lid')}
          description={t('For leads that did not come through the form: a call, a referral, LinkedIn.', 'Za lidove koji nisu stigli preko forme: poziv, preporuka, LinkedIn.')}
          defaultOpen={query.get('new') === '1'}
          closeHref="/admin/crm/leads"
        >
          <DealForm />
        </Modal>
      </PageHeading>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          icon={Inbox}
          color="info"
          label={t('Open leads', 'Otvoreni lidovi')}
          value={open.length}
          note={t(
            `${deals.filter((d) => d.stage === 'new').length} new, not contacted`,
            `${deals.filter((d) => d.stage === 'new').length} novih, nekontaktiranih`,
          )}
        />
        <StatCard
          icon={CircleDollarSign}
          color="primary"
          label={t('Open pipeline value', 'Vrednost u toku')}
          value={money(pipeline)}
          note={t('estimate by service', 'procena po usluzi')}
        />
        <StatCard
          icon={Handshake}
          color="success"
          label={t('Won, 30 days', 'Dogovoreno, 30 dana')}
          value={won30.length}
          note={money(won30.reduce((n, d) => n + Number(d.value || 0), 0))}
        />
        <StatCard
          icon={Target}
          color="secondary"
          label={t('Win rate', 'Stopa dogovora')}
          value={winRate === null ? '—' : `${winRate}%`}
          note={t('of closed leads', 'od zatvorenih lidova')}
        />
      </div>

      {view === 'board' ? (
        <DealBoard deals={deals} />
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('Lead', 'Lid')}</th>
                  <th>{t('Service', 'Usluga')}</th>
                  <th>{t('Stage', 'Faza')}</th>
                  <th className="text-right">{t('Value', 'Vrednost')}</th>
                  <th>{t('Next step', 'Sledeći korak')}</th>
                  <th className="text-right">{t('Arrived', 'Stigao')}</th>
                </tr>
              </thead>
              <tbody>
                {deals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-muted">
                      {t('No leads yet.', 'Još nema lidova.')}
                    </td>
                  </tr>
                )}
                {[...deals]
                  .sort((a, b) => STAGES.findIndex((s) => s.key === a.stage) - STAGES.findIndex((s) => s.key === b.stage) || a.position - b.position)
                  .map((d) => (
                    <tr key={d.id} className="relative">
                      <td>
                        <Link href={`/admin/crm/leads/${d.id}`} className="font-medium text-ink after:absolute after:inset-0 hover:text-primary">
                          {d.name}
                        </Link>
                        <div className="text-xs text-muted">{d.company ?? d.email ?? '—'}</div>
                      </td>
                      <td>{dealServices(d).length ? <ServicePills services={dealServices(d)} /> : '—'}</td>
                      <td>
                        <span className={`badge ${d.stage === 'won' ? 'badge-won' : d.stage === 'lost' ? 'badge-lost' : d.stage === 'new' ? 'badge-new' : 'badge-contacted'}`}>
                          {STAGE_LABEL[d.stage][lang]}
                        </span>
                      </td>
                      <td className="text-right font-semibold text-ink tabular-nums">{Number(d.value) ? money(Number(d.value)) : '—'}</td>
                      <td className="max-w-[24ch] truncate">{d.next_step ?? '—'}</td>
                      <td className="text-right whitespace-nowrap text-muted">{timeAgo(d.created_at, lang)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
