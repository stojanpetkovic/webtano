import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Repeat, Trash2 } from 'lucide-react';
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
  const active = items.filter((i) => i.active).length;

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

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="card min-w-0">
          <div className="card-header">
            <div>
              <h2 className="card-title">Stavke</h2>
              <p className="card-sub">
                {items.length} {items.length === 1 ? 'stavka' : 'stavki'}, {active} u ponudi. Sakrivene se ne nude u novim ponudama.
              </p>
            </div>
          </div>
          {items.length === 0 ? (
            <p className="px-5 py-14 text-center text-muted">Cenovnik je prazan. Dodaj prvu stavku desno.</p>
          ) : (
            groups.map((g) => (
              <section key={g}>
                <h3 className="border-y border-line bg-zinc-50/70 px-5 py-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">{g}</h3>
                <ul className="divide-y divide-line">
                  {items
                    .filter((i) => i.group_name === g)
                    .map((i) => (
                      <li key={i.id} className={`flex items-start gap-3 px-5 py-3.5 ${i.active ? '' : 'opacity-55'} ${editing?.id === i.id ? 'bg-primary/[0.04]' : ''}`}>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link href={`/admin/crm/items?edit=${i.id}#stavka`} className="font-medium text-ink hover:text-primary">
                              {i.name}
                            </Link>
                            {i.recurring && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600">
                                <Repeat className="size-3" /> mesečno
                              </span>
                            )}
                            {!i.active && <span className="badge badge-lost">Sakrivena</span>}
                          </div>
                          {i.details && <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{i.details}</p>}
                        </div>
                        <div className="shrink-0 pt-0.5 text-right font-semibold text-ink tabular-nums">
                          {money(Number(i.unit_price))}
                          {i.recurring && <span className="text-xs font-normal text-zinc-500">/mes</span>}
                        </div>
                        <div className="-my-1 flex shrink-0 items-center">
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
              </section>
            ))
          )}
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
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input type="checkbox" name="recurring" defaultChecked={editing?.recurring ?? false} className="size-4 accent-ink-950" />
                Mesečno plaćanje
              </label>
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
