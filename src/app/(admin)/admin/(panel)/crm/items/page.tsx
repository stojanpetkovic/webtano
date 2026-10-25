import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Eye, EyeOff, Globe, Pencil, Plus, Receipt, Repeat, Trash2 } from 'lucide-react';
import { BILLING, ItemIcon } from '@/components/admin/crm/ItemIcon';
import { PageHeading } from '@/components/admin/PageHeading';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { Modal } from '@/components/admin/Modal';
import { deleteItem, moveItem, saveItem, toggleItem } from '../actions';
import { db } from '@/lib/admin/supabase';
import { groupLabel, money } from '@/lib/admin/crm/labels';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { Lang, T } from '@/lib/i18n';
import { toParams } from '@/lib/admin/params';
import type { CatalogItem } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Price list', 'Cenovnik') };
}

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

interface Billing {
  key: 'once' | 'monthly';
  icon: typeof Receipt;
}

/** Add or edit one price list item; shown in a pop-up. */
function ItemForm({ editing, groups, billing, lang, t }: { editing?: CatalogItem; groups: string[]; billing: Billing[]; lang: Lang; t: T }) {
  // Both pop-ups can be on the page at once, so their field ids differ.
  const prefix = editing ? 'edit-' : 'new-';
  return (
    <form action={saveItem} className="space-y-4">
      {editing && <input type="hidden" name="id" value={editing.id} />}
      {editing?.slug && (
        <div className="flex gap-2.5 rounded-xl bg-accent/[0.07] p-3 text-[13px] text-sky-900 ring-1 ring-accent/20 ring-inset">
          <Globe className="mt-0.5 size-4 shrink-0 text-sky-600" />
          <span>
            {t('This item’s price is shown on', 'Cena ove stavke se prikazuje na')}{' '}
            <a href="https://webtano.com/pricing" target="_blank" rel="noopener" className="font-medium underline">
              webtano.com/pricing
            </a>
            . {t('When you save it, the site updates right away.', 'Kad je sačuvaš, sajt se odmah osveži.')}
          </span>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="form-label" htmlFor={`${prefix}name`}>{t('Name', 'Naziv')}</label>
          <input className="form-input" id={`${prefix}name`} name="name" required defaultValue={editing?.name ?? ''} placeholder="Logo design" />
        </div>
        <div>
          <label className="form-label" htmlFor={`${prefix}details`}>{t('Description', 'Opis')}</label>
          <textarea className="form-input" id={`${prefix}details`} name="details" rows={3} defaultValue={editing?.details ?? ''} placeholder="What is included" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label" htmlFor={`${prefix}unit_price`}>{t('Price (USD)', 'Cena (USD)')}</label>
            <input className="form-input text-right tabular-nums" id={`${prefix}unit_price`} name="unit_price" type="number" min="0" step="1" required defaultValue={editing ? Number(editing.unit_price) : ''} />
          </div>
          <div>
            <label className="form-label" htmlFor={`${prefix}group_name`}>{t('Group', 'Grupa')}</label>
            <input className="form-input" id={`${prefix}group_name`} name="group_name" list={`${prefix}groups`} defaultValue={editing?.group_name ?? groups[0] ?? ''} placeholder={t('Add-ons', 'Dodaci')} />
            <datalist id={`${prefix}groups`}>
              {groups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>
        </div>
        <fieldset>
          <legend className="form-label">{t('Billing', 'Naplata')}</legend>
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
                  {BILLING[b.key].label[lang]}
                  <span className="block text-[11px] font-normal text-muted">{b.key === 'monthly' ? t('every month', 'svakog meseca') : t('once', 'jednom')}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
            <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="size-4 accent-ink-950" />
            {t('Offer in proposals', 'Nudi u ponudama')}
          </label>
        </div>
      </div>
      <p className="text-xs text-muted">{t('The client sees the name and description in the PDF, so write them in English.', 'Naziv i opis vidi klijent u PDF-u, zato ih piši na engleskom.')}</p>
      <div className="flex justify-end">
        <button className="btn btn-primary" type="submit">{editing ? t('Save', 'Sačuvaj') : t('Add to price list', 'Dodaj u cenovnik')}</button>
      </div>
    </form>
  );
}

export default async function ItemsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t } = await getAdminI18n();
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
      title: t('One-time billing', 'Jednokratna naplata'),
      sub: t('Paid once, for finished work.', 'Plaća se jednom, za urađen posao.'),
      hint: t('Websites, pages, copy', 'Sajtovi, stranice, tekstovi'),
      suffix: '',
      items: items.filter((i) => !i.recurring),
    },
    {
      key: 'monthly' as const,
      icon: Repeat,
      title: t('Monthly billing', 'Mesečna naplata'),
      sub: t('Paid every month while the work goes on.', 'Plaća se svakog meseca dok traje saradnja.'),
      hint: t('Plans, hosting, ads', 'Planovi, hosting, oglasi'),
      suffix: t('/mo', '/mes'),
      items: items.filter((i) => i.recurring),
    },
  ];

  return (
    <>
      <PageHeading
        title={t('Price list', 'Cenovnik')}
        crumbs={[{ label: 'WebTano CRM' }, { label: t('Proposals', 'Ponude'), href: '/admin/crm/proposals' }]}
        description={t('Items you can add to proposals straight away. Price and description can be changed for each client.', 'Stavke koje odmah nudiš u ponudama. Cena i opis u ponudi mogu da se promene za svakog klijenta.')}
      >
        <Modal
          label={
            <>
              <Plus className="size-4" /> {t('New item', 'Nova stavka')}
            </>
          }
          title={t('New item', 'Nova stavka')}
          defaultOpen={query.get('new') === '1'}
          closeHref="/admin/crm/items"
        >
          <ItemForm groups={groups} billing={billing} lang={lang} t={t} />
        </Modal>
      </PageHeading>

      {error && <div className="alert alert-danger">{t('The price list table is not in the database yet. Proposals use the prices from webtano.com/pricing for now.', 'Tabela cenovnika još ne postoji u bazi. Ponude za sada koriste cene sa webtano.com/pricing.')}</div>}
      {notice === 'saved' && <div className="alert alert-success">{t('Item saved.', 'Stavka je sačuvana.')}</div>}
      {notice === 'deleted' && <div className="alert alert-success">{t('Item deleted. Proposals that already use it stay the same.', 'Stavka je obrisana. Ponude u kojima je već korišćena ostaju iste.')}</div>}

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
                {b.items.length} {b.items.length === 1 ? t('item', 'stavka') : t('items', 'stavki')}
              </div>
              <div className="text-xs text-muted">{b.hint}</div>
            </div>
            {b.items.length > 0 && (
              <div className="text-right text-xs text-muted tabular-nums">
                <div>{t('from', 'od')} {money(Math.min(...b.items.map((i) => Number(i.unit_price))))}{b.suffix}</div>
                <div>{t('to', 'do')} {money(Math.max(...b.items.map((i) => Number(i.unit_price))))}{b.suffix}</div>
              </div>
            )}
          </a>
        ))}
      </div>

      <div className="space-y-6">
        {items.length === 0 && <div className="card px-5 py-14 text-center text-muted">{t('The price list is empty. Add the first item with the New item button.', 'Cenovnik je prazan. Dodaj prvu stavku dugmetom Nova stavka.')}</div>}
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
                  <h3 className="border-y border-line bg-zinc-50/70 px-5 py-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">{groupLabel(g, lang)}</h3>
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
                              <Link href={`/admin/crm/items?edit=${i.id}`} className="font-medium text-ink hover:text-primary">
                                {i.name}
                              </Link>
                              {!i.active && <span className="badge badge-lost">{t('Hidden', 'Sakrivena')}</span>}
                              {i.slug && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10.5px] font-medium text-sky-700 ring-1 ring-accent/25 ring-inset" title={t('This price is shown on webtano.com', 'Ova cena se prikazuje na webtano.com')}>
                                  <Globe className="size-3" /> {t('On the site', 'Na sajtu')}
                                </span>
                              )}
                            </div>
                            {i.details && <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{i.details}</p>}
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="font-semibold text-ink tabular-nums">
                              {money(Number(i.unit_price))}
                              {i.recurring && <span className="text-xs font-normal text-zinc-500">{t('/mo', '/mes')}</span>}
                            </div>
                            <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${BILLING[b.key].pill}`}>
                              <b.icon className="size-3" /> {BILLING[b.key].label[lang]}
                            </span>
                          </div>
                          <div className="-my-1 flex shrink-0 items-center max-sm:flex-col">
                            <IconButton action={moveItem} fields={{ id: i.id, dir: 'up' }} label={t('Move up', 'Pomeri gore')} className="max-sm:hidden">
                              <ArrowUp className="size-4" />
                            </IconButton>
                            <IconButton action={moveItem} fields={{ id: i.id, dir: 'down' }} label={t('Move down', 'Pomeri dole')} className="max-sm:hidden">
                              <ArrowDown className="size-4" />
                            </IconButton>
                            <IconButton action={toggleItem} fields={{ id: i.id, active: i.active ? '0' : '1' }} label={i.active ? t('Hide from proposals', 'Sakrij iz ponuda') : t('Show in proposals', 'Vrati u ponude')}>
                              {i.active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </IconButton>
                            <Link
                              href={`/admin/crm/items?edit=${i.id}`}
                              className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-ink"
                              title={t('Edit', 'Uredi')}
                              aria-label={t('Edit', 'Uredi')}
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

      {editing && (
        <Modal title={t('Edit item', 'Uredi stavku')} defaultOpen closeHref="/admin/crm/items" key={editing.id}>
          <ItemForm editing={editing} groups={groups} billing={billing} lang={lang} t={t} />
          <form action={deleteItem} className="mt-4 border-t border-line pt-4">
            <input type="hidden" name="id" value={editing.id} />
            <ConfirmSubmit className="btn btn-sm btn-danger" message={t(`Delete “${editing.name}” from the price list? Existing proposals stay the same.`, `Obrisati „${editing.name}” iz cenovnika? Postojeće ponude ostaju iste.`)}>
              <Trash2 className="size-4" /> {t('Delete item', 'Obriši stavku')}
            </ConfirmSubmit>
          </form>
        </Modal>
      )}
    </>
  );
}
