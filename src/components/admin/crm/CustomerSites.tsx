import Link from 'next/link';
import { ExternalLink, FileText, Globe, Link2, Plus, Unlink } from 'lucide-react';
import { Modal } from '@/components/admin/Modal';
import { NewSiteForm } from '@/app/(admin)/admin/(panel)/sites/SiteForms';
import { linkSite, unlinkSite } from '@/app/(admin)/admin/(panel)/crm/actions';
import { db } from '@/lib/admin/supabase';
import { webtanoSiteId } from '@/lib/admin/crm/data';
import { daysAgo } from '@/lib/admin/stats';
import type { CustomerSite } from '@/lib/admin/crm/types';
import type { Site } from '@/lib/admin/types';

/** The customer's websites, with their last 30 days, and a picker to link another one. */
export async function CustomerSites({ customerId, customerName }: { customerId: string; customerName: string }) {
  const [{ data: links }, { data: sitesData }, webtano] = await Promise.all([
    db().from('crm_customer_sites').select('*'),
    db().from('sites').select('*').order('name'),
    webtanoSiteId(),
  ]);
  const linked = (links ?? []) as CustomerSite[];
  const sites = (sitesData ?? []) as Site[];
  const mine = sites.filter((s) => linked.some((l) => l.site_id === s.id && l.customer_id === customerId));
  // Sites no customer has yet; WebTano's own site is never a client's.
  const free = sites.filter((s) => s.id !== webtano && !linked.some((l) => l.site_id === s.id));

  const leadCounts = new Map<string, number>();
  if (mine.length) {
    const { data } = await db()
      .from('leads')
      .select('site_id')
      .in(
        'site_id',
        mine.map((s) => s.id),
      )
      .eq('is_spam', false)
      .gte('created_at', daysAgo(30));
    for (const r of (data ?? []) as { site_id: string }[]) leadCounts.set(r.site_id, (leadCounts.get(r.site_id) ?? 0) + 1);
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Sajtovi</h2>
        <Modal
          label={
            <>
              <Plus className="size-3.5" /> Novi sajt
            </>
          }
          buttonClassName="btn btn-sm btn-light"
          title="Novi sajt"
          description={`Sajt se odmah vezuje za klijenta ${customerName}.`}
        >
          <NewSiteForm customerId={customerId} clientName={customerName} />
        </Modal>
      </div>
      {mine.length > 0 && <p className="-mt-1 px-5 pb-1 text-right text-xs text-muted">Lidovi u 30 dana</p>}
      <ul className="divide-y divide-line">
        {mine.length === 0 && <li className="px-5 py-4 text-muted">Nijedan sajt nije povezan.</li>}
        {mine.map((s) => (
          <li key={s.id} className="flex items-center gap-3 px-5 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-900 to-ink-975 text-accent">
              <Globe className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <Link href={`/admin/sites/${s.id}`} className="block truncate text-[13.5px] font-medium text-ink hover:text-primary">
                {s.name}
              </Link>
              <a href={`https://${s.domain}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 truncate text-xs text-muted hover:text-primary">
                {s.domain} <ExternalLink className="size-3" />
              </a>
            </div>
            <span className="font-semibold text-ink tabular-nums">{leadCounts.get(s.id) ?? 0}</span>
            <Link
              href={`/admin/sites/${s.id}/report`}
              className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-ink"
              title="Izveštaj (PDF)"
              aria-label="Izveštaj (PDF)"
            >
              <FileText className="size-4" />
            </Link>
            <form action={unlinkSite}>
              <input type="hidden" name="site_id" value={s.id} />
              <button
                type="submit"
                className="grid size-8 cursor-pointer place-items-center rounded-lg text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600"
                title="Odvoji sajt od klijenta"
                aria-label="Odvoji sajt od klijenta"
              >
                <Unlink className="size-4" />
              </button>
            </form>
          </li>
        ))}
      </ul>
      {free.length > 0 && (
        <form action={linkSite} className="flex gap-2 border-t border-line p-4">
          <input type="hidden" name="customer_id" value={customerId} />
          <select name="site_id" className="form-input py-1.5 text-[13px]" aria-label="Sajt za povezivanje" required defaultValue="">
            <option value="" disabled>
              Poveži sajt…
            </option>
            {free.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.domain}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-outline shrink-0">
            <Link2 className="size-4" /> Poveži
          </button>
        </form>
      )}
    </div>
  );
}
