import { saveProposal } from '@/app/(admin)/admin/(panel)/crm/actions';
import { ProposalEditor, type EditorItem, type PriceListEntry } from './ProposalEditor';
import { PROPOSAL_STATUS, customerName } from '@/lib/admin/crm/labels';
import { DEFAULT_INTRO, DEFAULT_TERMS } from '@/lib/admin/crm/priceList';
import type { CustomerOption, Deal, Proposal, ProposalItem } from '@/lib/admin/crm/types';

const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

export function ProposalForm({
  proposal,
  items = [],
  customers,
  deals,
  priceList,
  preset = {},
  inModal = false,
}: {
  proposal?: Proposal;
  items?: ProposalItem[];
  customers: CustomerOption[];
  deals: Pick<Deal, 'id' | 'name' | 'company'>[];
  priceList: PriceListEntry[];
  preset?: { customer_id?: string; deal_id?: string; title?: string; items?: EditorItem[] };
  /** In a pop-up the save bar sticks to the pop-up's bottom edge instead of the page's. */
  inModal?: boolean;
}) {
  const initial: EditorItem[] = proposal
    ? items.map((i) => ({ description: i.description, details: i.details ?? '', qty: Number(i.qty), unit_price: Number(i.unit_price), recurring: i.recurring }))
    : (preset.items ?? []);
  return (
    <form action={saveProposal} className="space-y-4">
      {proposal && <input type="hidden" name="id" value={proposal.id} />}
      <div className="card">
        <div className="card-body grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="title">Naslov ponude</label>
            <input className="form-input" id="title" name="title" required defaultValue={proposal?.title ?? preset.title ?? ''} placeholder="Website redesign and Local SEO" />
          </div>
          <div>
            <label className="form-label" htmlFor="customer_id">Klijent</label>
            <select className="form-input" id="customer_id" name="customer_id" defaultValue={proposal?.customer_id ?? preset.customer_id ?? ''}>
              <option value="">—</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{customerName(c)}{c.company && c.contact_name ? ` · ${c.company}` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="deal_id">Lid</label>
            <select className="form-input" id="deal_id" name="deal_id" defaultValue={proposal?.deal_id ?? preset.deal_id ?? ''}>
              <option value="">—</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>{d.name}{d.company ? ` · ${d.company}` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="status">Status</label>
            <select className="form-input" id="status" name="status" defaultValue={proposal?.status ?? 'draft'}>
              {Object.entries(PROPOSAL_STATUS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="issue_date">Datum</label>
            <input className="form-input" id="issue_date" name="issue_date" type="date" defaultValue={proposal?.issue_date ?? inDays(0)} />
          </div>
          <div>
            <label className="form-label" htmlFor="valid_until">Važi do</label>
            <input className="form-input" id="valid_until" name="valid_until" type="date" defaultValue={proposal?.valid_until ?? inDays(14)} />
          </div>
        </div>
      </div>

      <ProposalEditor initial={initial} priceList={priceList} currency={proposal?.currency ?? 'USD'} discount={Number(proposal?.discount_pct ?? 0)} />

      <div className="card">
        <div className="card-body grid gap-4 lg:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="intro">Uvod (vidi klijent, na engleskom)</label>
            <textarea className="form-input" id="intro" name="intro" rows={5} defaultValue={proposal ? proposal.intro ?? '' : DEFAULT_INTRO} />
          </div>
          <div>
            <label className="form-label" htmlFor="terms">Uslovi (jedan po redu)</label>
            <textarea className="form-input" id="terms" name="terms" rows={5} defaultValue={proposal ? proposal.terms ?? '' : DEFAULT_TERMS} />
          </div>
        </div>
      </div>

      <div
        className={`sticky z-10 flex justify-end gap-2 border-t border-line bg-body/90 py-3 backdrop-blur ${inModal ? '-bottom-5 -mx-5 -mb-5 px-5' : 'bottom-0 -mx-4 px-4 lg:-mx-8 lg:px-8'}`}
      >
        <button className="btn btn-primary" type="submit">{proposal ? 'Sačuvaj ponudu' : 'Napravi ponudu'}</button>
      </div>
    </form>
  );
}
