import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Receipt, Repeat, Trash2 } from 'lucide-react';
import { BILLING, ItemIcon } from '@/components/admin/crm/ItemIcon';
import { PageHeading } from '@/components/admin/PageHeading';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { deleteItem, moveItem, saveItem, toggleItem } from '../actions';
import { db } from '@/lib/admin/supabase';
import { money } from '@/lib/admin/crm/labels';
import { toParams } from '@/lib/admin/params';
import type { CatalogItem } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Cenovnik' };

function IconButton({
  action,
  fields,
  label,
  children,
  className,
}: {
  action: (f: FormData) => Promise<void>;
  fields: Record<string, string>;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form action={action} className={className}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button type="submit" className="grid size-8 cursor-pointer place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-ink" title={label} aria-label={label}>
        {children}
      </button>
    </form>
  );
}

export default async function ItemsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const notice = query.get('notice');
  const { data, error } = await db().from('crm_items').select('*').order('position');
  const items = (data ?? []) as CatalogItem[];
  const editing = items.find((i) => i.id === query.get('edit'));
  const groups = [...new Set(items.map((i) => i.group_name))];
  const billing = [
    {
      key: 'once' as const,
      icon: Receipt,
      title: 'Jednokratna naplata',
      sub: 'Plaća se jednom, za urađen posao.',
      hint: 'Sajtovi, stranice, tekstovi',
      suffix: '',
      items: items.filter((i) => !i.recurring),
    },
    {
      key: 'monthly' as const,
      icon: Repeat,
      title: 'Mesečna naplata',
      sub: 'Plaća se svakog meseca dok traje saradnja.',
      hint: 'Planovi, hosting, oglasi',
      suffix: '/mes',
      items: items.filter((i) => i.recurring),
    },
  ];

  return (
    <>
      <PageHeading
        title="Cenovnik"
        crumbs={[{ label: 'WebTano CRM' }, { label: 'Ponude', href: '/admin/crm/proposals' }]}
        description="Stavke koje odmah nudiš u ponudama. Cena i opis u ponudi mogu da se promene za svakog klijenta."
      >
        {editing && (
          <Link href="/admin/crm/items#stavka" className="btn btn-primary">
            <Plus className="size-4" /> Nova stavka
          </Link>
        )}
      </PageHeading>

      {error && <div className="alert alert-danger">Tabela cenovnika još ne postoji u bazi. Ponude za sada koriste cene sa webtano.com/pricing.</div>}
      {notice === 'saved' && <div className="alert alert-success">Stavka je sačuvana.</div>}
      {notice === 'deleted' && <div className="alert alert-success">Stavka je obrisana. Ponude u kojima je već korišćena ostaju iste.</div>}

      {/* The two ways a client pays, as a legend and a summary. */}
      <div className="grid gap-4 sm:grid-cols-2">
        {billing.map((b) => (
          <a key={b.key} href={`#${b.key}`} className="card flex-row! items-center gap-4 p-4 transition hover:ring-zinc-300 sm:p-5">
            <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset ${BILLING[b.key].tile}`}>
              <b.icon className="size-[22px]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-zinc-500">{b.title}</div>
              <div className="mt-0.5 text-xl font-semibold tracking-tight text-ink">
                {b.items.length} {b.items.length === 1 ? 'stavka' : 'stavki'}
              </div>
              <div className="text-xs text-muted">{b.hint}</div>
            </div>
            {b.items.length > 0 && (
              <div className="text-right text-xs text-muted tabular-nums">
                <div>od {money(Math.min(...b.items.map((i) => Number(i.unit_price))))}{b.suffix}</div>
                <div>do {money(Math.max(...b.items.map((i) => Number(i.unit_price))))}{b.suffix}</div>
              </div>
            )}
          </a>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          {items.length === 0 && <div className="card px-5 py-14 text-center text-muted">Cenovnik je prazan. Dodaj prvu stavku u formi.</div>}
          {billing
            .filter((b) => b.items.length > 0)
            .map((b) => (
              <section key={b.key} id={b.key} className="card relative min-w-0 scroll-mt-24 overflow-hidden">
                <span className={`absolute inset-y-0 start-0 w-1 ${BILLING[b.key].bar}`} aria-hidden="true" />
                <div className="card-header">
                  <div className="flex items-center gap-2.5">
                    <b.icon className={`size-[18px] ${b.key === 'monthly' ? 'text-emerald-600' : 'text-blue-600'}`} />
                    <div>
                      <h2 className="card-title">{b.title}</h2>
                      <p className="card-sub">{b.sub}</p>
                    </div>
                  </div>
                </div>
                {[...new Set(b.items.map((i) => i.group_name))].map((g) => (
                  <div key={g}>
                    <h3 className="border-y border-line bg-zinc-50/70 px-5 py-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">{g}</h3>
                    <ul className="divide-y divide-line">
                      {b.items
                        .filter((i) => i.group_name === g)
                        .map((i) => (
                          <li
                            key={i.id}
                            className={`flex items-start gap-3.5 px-5 py-4 ${i.active ? '' : 'opacity-55'} ${editing?.id === i.id ? 'bg-primary/[0.04]' : ''}`}
                          >
                            <ItemIcon name={i.name} recurring={i.recurring} />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Link href={`/admin/crm/items?edit=${i.id}#stavka`} className="font-medium text-ink hover:text-primary">
                                  {i.name}
                                </Link>
                                {!i.active && <span className="badge badge-lost">Sakrivena</span>}
                              </div>
                              {i.details && <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{i.details}</p>}
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="font-semibold text-ink tabular-nums">
                                {money(Number(i.unit_price))}
                                {i.recurring && <span className="text-xs font-normal text-zinc-500">/mes</span>}
                              </div>
                              <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${BILLING[b.key].pill}`}>
                                <b.icon className="size-3" /> {BILLING[b.key].label}
                              </span>
                            </div>
                            <div className="-my-1 flex shrink-0 items-center max-sm:flex-col">
                              <IconButton action={moveItem} fields={{ id: i.id, dir: 'up' }} label="Pomeri gore" className="max-sm:hidden">
                                <ArrowUp className="size-4" />
                              </IconButton>
                              <IconButton action={moveItem} fields={{ id: i.id, dir: 'down' }} label="Pomeri dole" className="max-sm:hidden">
                                <ArrowDown className="size-4" />
                              </IconButton>
                              <IconButton action={toggleItem} fields={{ id: i.id, active: i.active ? '0' : '1' }} label={i.active ? 'Sakrij iz ponuda' : 'Vrati u ponude'}>
                                {i.active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                              </IconButton>
                              <Link
                                href={`/admin/crm/items?edit=${i.id}#stavka`}
                                className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-ink"
                                title="Uredi"
                                aria-label="Uredi"
                              >
                                <Pencil className="size-4" />
                              </Link>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
        </div>

        <form id="stavka" key={editing?.id ?? 'new'} action={saveItem} className="card scroll-mt-24 xl:sticky xl:top-24">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="card-header">
            <div>
              <h2 className="card-title">{editing ? 'Uredi stavku' : 'Nova stavka'}</h2>
              <p className="card-sub">Naziv i opis vidi klijent u PDF-u, zato ih piši na engleskom.</p>
            </div>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="form-label" htmlFor="name">Naziv</label>
              <input className="form-input" id="name" name="name" required defaultValue={editing?.name ?? ''} placeholder="Logo design" />
            </div>
            <div>
              <label className="form-label" htmlFor="details">Opis</label>
              <textarea className="form-input" id="details" name="details" rows={3} defaultValue={editing?.details ?? ''} placeholder="What is included" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label" htmlFor="unit_price">Cena (USD)</label>
                <input className="form-input text-right tabular-nums" id="unit_price" name="unit_price" type="number" min="0" step="1" required defaultValue={editing ? Number(editing.unit_price) : ''} />
              </div>
              <div>
                <label className="form-label" htmlFor="group_name">Grupa</label>
                <input className="form-input" id="group_name" name="group_name" list="item-groups" defaultValue={editing?.group_name ?? groups[0] ?? ''} placeholder="Dodaci" />
                <datalist id="item-groups">
                  {groups.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>
            </div>
            <fieldset>
              <legend className="form-label">Naplata</legend>
              <div className="grid grid-cols-2 gap-2">
                {billing.map((b) => (
                  <label
                    key={b.key}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line p-3 transition has-checked:border-ink has-checked:ring-1 has-checked:ring-ink"
                  >
                    <input type="radio" name="recurring" value={b.key === 'monthly' ? 'on' : 'off'} defaultChecked={(editing?.recurring ?? false) === (b.key === 'monthly')} className="sr-only" />
                    <span className={`grid size-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${BILLING[b.key].tile}`}>
                      <b.icon className="size-4" />
                    </span>
                    <span className="text-[13px] leading-tight font-medium text-ink">
                      {BILLING[b.key].label}
                      <span className="block text-[11px] font-normal text-muted">{b.key === 'monthly' ? 'svakog meseca' : 'jednom'}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="size-4 accent-ink-950" />
                Nudi u ponudama
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-4">
            {editing ? (
              <Link href="/admin/crm/items" className="btn btn-light">Otkaži</Link>
            ) : (
              <span />
            )}
            <button className="btn btn-primary" type="submit">{editing ? 'Sačuvaj' : 'Dodaj u cenovnik'}</button>
          </div>
        </form>
      </div>

      {editing && (
        <form action={deleteItem} className="text-right">
          <input type="hidden" name="id" value={editing.id} />
          <ConfirmSubmit className="btn btn-sm btn-danger" message={`Obrisati „${editing.name}” iz cenovnika? Postojeće ponude ostaju iste.`}>
            <Trash2 className="size-4" /> Obriši stavku
          </ConfirmSubmit>
        </form>
      )}
    </>
  );
}
