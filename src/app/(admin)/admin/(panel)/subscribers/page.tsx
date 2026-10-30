import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Download, MailCheck, MailX, RotateCcw, Search, Send, Trash2, UserPlus, UserRoundPlus, Hourglass } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { StatCard } from '@/components/admin/StatCard';
import { DailyChart } from '@/components/admin/DailyChart';
import { Pagination } from '@/components/admin/Pagination';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { Modal } from '@/components/admin/Modal';
import { db } from '@/lib/admin/supabase';
import { dailySeries, daysAgo } from '@/lib/admin/stats';
import { formatDateTime, timeAgo } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { PENDING_DAYS, SOURCES, SUBSCRIBER_STATUS, type Subscriber, type SubscriberStatus } from '@/lib/admin/newsletter';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { Site } from '@/lib/admin/types';
import { convertSubscriber, deleteSubscriber, resendConfirmation, unsubscribeSubscriber } from './actions';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Subscribers', 'Pretplatnici') };
}

const SIZES = [25, 50, 100];
const DAYS = 30;
const TZ = 'Europe/Belgrade';
const BADGE: Record<SubscriberStatus, string> = { confirmed: 'badge-won', pending: 'badge-contacted', unsubscribed: 'badge-lost' };

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t } = await getAdminI18n();
  const query = toParams(await searchParams);
  const status = (['confirmed', 'pending', 'unsubscribed'] as const).find((s) => s === query.get('status')) ?? '';
  const q = (query.get('q') ?? '').trim().toLowerCase().replace(/[%_,()]/g, '');
  const size = SIZES.includes(Number(query.get('size'))) ? Number(query.get('size')) : SIZES[0];
  const requested = Math.max(1, Math.floor(Number(query.get('page')) || 1));

  // Every row's list, status and dates, for the cards, tabs and chart: small enough to read whole.
  const [{ data: everyData, error }, { data: siteData }] = await Promise.all([
    db().from('newsletter_subscribers').select('site_id, status, source, created_at, confirmed_at, unsubscribed_at').limit(50_000),
    db().from('sites').select('id, name, domain').order('name'),
  ]);

  if (error)
    return (
      <>
        <PageHeading title={t('Subscribers', 'Pretplatnici')} crumbs={[{ label: 'Marketing' }]} />
        <div className="card mt-6 p-6">
          <p className="font-semibold text-ink">{t('The newsletter table does not exist yet', 'Tabela za newsletter još ne postoji')}</p>
          <p className="mt-1 text-sm text-muted">
            {t('Run the SQL from', 'Pokreni SQL iz')} <code className="font-mono">supabase/migrations/20261025_newsletter.sql</code> {t('and', 'i')}{' '}
            <code className="font-mono">20261030_subscribers_split.sql</code>{' '}
            {t('in the Supabase SQL Editor, then refresh the page.', 'u Supabase SQL Editoru, pa osveži stranicu.')}
          </p>
        </div>
      </>
    );

  // Lists: WebTano's own newsletter, then every client site that has sign-ups.
  type Row = Pick<Subscriber, 'site_id' | 'status' | 'source' | 'created_at' | 'confirmed_at' | 'unsubscribed_at'>;
  const every = (everyData ?? []) as Row[];
  const sites = (siteData ?? []) as Pick<Site, 'id' | 'name' | 'domain'>[];
  const siteName = (id: string | null) => sites.find((x) => x.id === id)?.name ?? '—';
  const lists = [
    { key: '', label: 'WebTano newsletter', n: every.filter((r) => !r.site_id).length },
    ...sites.map((x) => ({ key: x.id, label: x.name, n: every.filter((r) => r.site_id === x.id).length })).filter((l) => l.n > 0),
  ];
  const list = lists.find((l) => l.key === query.get('list'))?.key ?? '';
  const all = every.filter((r) => (r.site_id ?? '') === list);
  const count = (s: SubscriberStatus) => all.filter((r) => r.status === s).length;
  const cutoff = daysAgo(DAYS);
  const recent = all.filter((r) => r.created_at >= cutoff);
  const confirmedRecent = all.filter((r) => r.confirmed_at && r.confirmed_at >= cutoff);
  const unsubRecent = all.filter((r) => r.unsubscribed_at && r.unsubscribed_at >= cutoff);
  // Of the sign-ups old enough to have had time, how many confirmed.
  const settled = daysAgo(2);
  const decided = all.filter((r) => r.status !== 'pending' || r.created_at < settled);
  const rate = decided.length ? Math.round((decided.filter((r) => r.confirmed_at).length / decided.length) * 100) : null;

  const labels = dailySeries([], DAYS, TZ).map((d) => d.day);
  const series = Object.entries(SOURCES)
    .map(([key, label], slot) => ({ label: label[lang], slot, data: dailySeries(recent.filter((r) => r.source === key), DAYS, TZ).map((d) => d.count) }))
    .filter((s) => s.data.some((n) => n > 0));

  const tabs: { key: '' | SubscriberStatus; label: string; n: number }[] = [
    { key: '', label: t('All', 'Svi'), n: all.length },
    { key: 'confirmed', label: t('Confirmed', 'Potvrđeni'), n: count('confirmed') },
    { key: 'pending', label: t('Awaiting confirmation', 'Čekaju potvrdu'), n: count('pending') },
    { key: 'unsubscribed', label: t('Unsubscribed', 'Odjavljeni'), n: count('unsubscribed') },
  ];

  const filtered = () => {
    let c = db().from('newsletter_subscribers').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    c = list ? c.eq('site_id', list) : c.is('site_id', null);
    if (status) c = c.eq('status', status);
    if (q) c = c.ilike('email', `%${q}%`);
    return c;
  };
  const total = q ? ((await filtered().limit(1)).count ?? 0) : status ? count(status) : all.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const page = Math.min(requested, pages);
  const { data: rowsData, count: found } = await filtered().range((page - 1) * size, page * size - 1);
  const rows = (rowsData ?? []) as Subscriber[];

  const link = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(query);
    next.delete('page');
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    }
    const s = next.toString();
    return s ? `/admin/subscribers?${s}` : '/admin/subscribers';
  };
  const pageHref = (n: number, s?: number) => link({ page: n > 1 ? String(n) : null, ...(s ? { size: s === SIZES[0] ? null : String(s) } : {}) });
  const exportHref = `/admin/subscribers/export.csv?${new URLSearchParams({ status: status || 'all', ...(list ? { list } : {}), ...(q ? { q } : {}) })}`;

  // The pop-up for turning a subscriber into a lead, opened by ?convert=id.
  const convertId = query.get('convert') ?? '';
  const { data: converting } = /^[0-9a-f-]{36}$/.test(convertId)
    ? await db().from('newsletter_subscribers').select('*').eq('id', convertId).maybeSingle<Subscriber>()
    : { data: null };
  const leadHref = (s: Subscriber) => (s.deal_id ? `/admin/crm/leads/${s.deal_id}` : s.lead_id ? `/admin/leads/${s.lead_id}` : null);

  return (
    <>
      <PageHeading
        title={t('Subscribers', 'Pretplatnici')}
        crumbs={[{ label: 'Marketing' }]}
        description={
          list
            ? t(
                `Newsletter sign-ups caught on ${siteName(list)}. They are kept here, not in the leads; turn one into a lead once you are in touch.`,
                `Prijave na newsletter sa sajta ${siteName(list)}. Ne idu u lidove; pretvori ih u lid kad stupiš u kontakt.`,
              )
            : t(
                'Newsletter sign-ups from webtano.com (popup and footer). Every address confirms by email before it joins the list. Turn one into a lead once you are in touch.',
                'Prijave na newsletter sa webtano.com (popup i futer). Svaka adresa potvrđuje prijavu emailom pre nego što uđe na listu. Pretvori je u lid kad stupiš u kontakt.',
              )
        }
      >
        <Link href="/admin/settings#newsletter" className="btn btn-light">
          {t('Popup settings', 'Podešavanja popupa')}
        </Link>
        <a href={exportHref} className="btn btn-outline">
          <Download className="size-4" /> {t('Export CSV', 'Izvezi CSV')}
        </a>
      </PageHeading>

      {lists.length > 1 && (
        <nav className="mt-6 flex flex-wrap gap-2" aria-label={t('List', 'Lista')}>
          {lists.map((l) => {
            const active = l.key === list;
            return (
              <Link
                key={l.key || 'webtano'}
                href={l.key ? `/admin/subscribers?list=${l.key}` : '/admin/subscribers'}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                  active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-zinc-600 hover:text-ink'
                }`}
              >
                {l.label}
                <span className={`font-mono text-[10.5px] tabular-nums ${active ? 'text-white/70' : 'text-zinc-400'}`}>{l.n}</span>
              </Link>
            );
          })}
        </nav>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label={t('Active subscribers', 'Aktivni pretplatnici')}
          value={count('confirmed')}
          icon={MailCheck}
          color="success"
          note={t(`+${confirmedRecent.length} in ${DAYS} days`, `+${confirmedRecent.length} za ${DAYS} dana`)}
          trend={dailySeries(confirmedRecent.map((r) => ({ created_at: r.confirmed_at! })), DAYS, TZ).map((d) => d.count)}
        />
        <StatCard
          label={t('New sign-ups', 'Nove prijave')}
          value={recent.length}
          icon={UserPlus}
          color="info"
          note={t(`last ${DAYS} days`, `poslednjih ${DAYS} dana`)} trend={dailySeries(recent, DAYS, TZ).map((d) => d.count)} />
        <StatCard
          label={t('Awaiting confirmation', 'Čekaju potvrdu')}
          value={count('pending')}
          icon={Hourglass}
          color="warning"
          note={
            rate === null
              ? t(`deleted after ${PENDING_DAYS} days`, `brišu se posle ${PENDING_DAYS} dana`)
              : t(`${rate}% of sign-ups confirm`, `${rate}% prijava se potvrdi`)
          }
        />
        <StatCard
          label={t('Unsubscribed', 'Odjavljeni')}
          value={count('unsubscribed')}
          icon={MailX}
          color="danger"
          note={t(`${unsubRecent.length} in ${DAYS} days`, `${unsubRecent.length} za ${DAYS} dana`)}
        />
      </div>

      <div className="mt-6">
        <DailyChart
          title={t('Sign-ups per day', 'Prijave po danu')}
          total={`${recent.length} ${t('sign-ups', 'prijava')}`}
          note={t(`${DAYS} days, by where they signed up`, `${DAYS} dana, po mestu prijave`)}
          labels={labels}
          series={series.length ? series : [{ label: t('Sign-ups', 'Prijave'), data: labels.map(() => 0) }]}
        />
      </div>

      <div className="card mt-6">
        <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-2" aria-label="Status">
          {tabs.map((tab) => {
            const active = tab.key === status;
            return (
              <Link
                key={tab.key || 'all'}
                href={link({ status: tab.key || null })}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-medium transition ${
                  active ? 'border-ink text-ink' : 'border-transparent text-zinc-500 hover:text-ink'
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[10.5px] leading-none tabular-nums ${active ? 'bg-ink text-white' : 'bg-zinc-100 text-zinc-500'}`}
                >
                  {tab.n}
                </span>
              </Link>
            );
          })}
        </nav>

        <form method="get" className="flex gap-2 border-b border-line p-4">
          {list && <input type="hidden" name="list" value={list} />}
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative flex-1">
            <label className="sr-only" htmlFor="q">
              {t('Search', 'Pretraga')}
            </label>
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input className="form-input ps-10" id="q" name="q" type="search" defaultValue={q} placeholder={t('Search email', 'Pretraži email')} />
          </div>
          <button className="btn btn-primary" type="submit">
            {t('Search', 'Traži')}
          </button>
          {q && (
            <Link href={link({ q: null })} className="btn btn-light" title={t('Clear search', 'Poništi pretragu')}>
              <RotateCcw className="size-4" />
              <span className="sr-only">{t('Clear', 'Poništi')}</span>
            </Link>
          )}
        </form>

        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">
            {all.length
              ? t('No subscribers match these filters.', 'Nema pretplatnika za ove filtere.')
              : t('No sign-ups yet. They come from the popup and footer on webtano.com.', 'Još nema prijava. Stižu iz popupa i futera na webtano.com.')}
          </p>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th className="max-md:hidden">Status</th>
                  <th className="max-md:hidden">{t('Source', 'Izvor')}</th>
                  <th className="max-md:hidden">{t('Signed up', 'Prijavljen')}</th>
                  <th className="text-right">{t('Actions', 'Akcije')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="max-w-[32ch] truncate font-medium text-ink max-md:max-w-[22ch]">{s.email}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted md:hidden">
                        <span className={`badge ${BADGE[s.status]}`}>{SUBSCRIBER_STATUS[s.status][lang]}</span>
                        {SOURCES[s.source]?.[lang] ?? s.source} · {timeAgo(s.created_at, lang)}
                      </div>
                      {leadHref(s) && (
                        <Link href={leadHref(s)!} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-cyan-700 hover:underline">
                          {t('Lead', 'Lid')} <ArrowUpRight className="size-3" />
                        </Link>
                      )}
                      {s.page_url && <div className="max-w-[40ch] truncate text-xs text-muted max-md:hidden">{s.page_url.replace(/^https?:\/\/[^/]+/, '') || '/'}</div>}
                    </td>
                    <td className="max-md:hidden">
                      <span className={`badge ${BADGE[s.status]}`}>{SUBSCRIBER_STATUS[s.status][lang]}</span>
                      {s.status === 'confirmed' && s.confirmed_at && (
                        <div className="mt-1 text-xs text-muted max-md:hidden">{formatDateTime(s.confirmed_at, lang)}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap max-md:hidden">
                      <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600">{SOURCES[s.source]?.[lang] ?? s.source}</span>
                    </td>
                    <td className="whitespace-nowrap text-sm text-zinc-600 max-md:hidden" title={formatDateTime(s.created_at, lang)}>
                      {timeAgo(s.created_at, lang)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {!leadHref(s) && (
                          <Link
                            href={link({ convert: s.id })}
                            scroll={false}
                            className="btn btn-sm btn-light"
                            title={t('Turn into a lead and add the details', 'Pretvori u lid i dopuni podatke')}
                          >
                            <UserRoundPlus className="size-3.5" />
                            <span className="max-lg:sr-only">{t('To lead', 'U lid')}</span>
                          </Link>
                        )}
                        {s.status === 'pending' && (
                          <form action={resendConfirmation}>
                            <input type="hidden" name="id" value={s.id} />
                            <button type="submit" className="btn btn-sm btn-light" title={t('Send the confirmation email again', 'Pošalji email za potvrdu ponovo')}>
                              <Send className="size-3.5" />
                              <span className="max-lg:sr-only">{t('Resend', 'Pošalji ponovo')}</span>
                            </button>
                          </form>
                        )}
                        {s.status === 'confirmed' && (
                          <form action={unsubscribeSubscriber}>
                            <input type="hidden" name="id" value={s.id} />
                            <ConfirmSubmit message={t(`Unsubscribe ${s.email}?`, `Odjaviti ${s.email}?`)} className="btn btn-sm btn-light">
                              <MailX className="size-3.5" />
                              <span className="max-lg:sr-only">{t('Unsubscribe', 'Odjavi')}</span>
                            </ConfirmSubmit>
                          </form>
                        )}
                        <form action={deleteSubscriber}>
                          <input type="hidden" name="id" value={s.id} />
                          <ConfirmSubmit
                            message={t(
                              `Delete ${s.email} for good? This is for data deletion requests and cannot be undone.`,
                              `Trajno obrisati ${s.email}? Ovo se koristi za zahtev za brisanje podataka i ne može da se vrati.`,
                            )}
                            className="btn btn-sm btn-light hover:text-rose-600"
                          >
                            <Trash2 className="size-3.5" />
                            <span className="sr-only">{t('Delete', 'Obriši')}</span>
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageSize={size} href={pageHref} sizes={SIZES} total={found ?? total} noun={t('subscribers', 'pretplatnika')} />
      </div>
      {converting && (
        <Modal
          title={t('Turn into a lead', 'Pretvori u lid')}
          description={t(
            `${converting.email} stays on the list. Fill in what you learned when you got in touch.`,
            `${converting.email} ostaje na listi. Upiši šta si saznao kad ste se čuli.`,
          )}
          defaultOpen
          closeHref={link({ convert: null })}
        >
          <form action={convertSubscriber} className="space-y-4">
            <input type="hidden" name="id" value={converting.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="cv-name">
                  {t('Full name', 'Ime i prezime')}
                </label>
                <input className="form-input" id="cv-name" name="name" required autoFocus />
              </div>
              <div>
                <label className="form-label" htmlFor="cv-phone">
                  {t('Phone', 'Telefon')}
                </label>
                <input className="form-input" id="cv-phone" name="phone" type="tel" />
              </div>
              <div>
                <label className="form-label" htmlFor="cv-company">
                  {t('Company', 'Firma')}
                </label>
                <input className="form-input" id="cv-company" name="company" />
              </div>
              <div>
                <label className="form-label" htmlFor="cv-website">
                  {t('Website', 'Sajt')}
                </label>
                <input className="form-input" id="cv-website" name="website" placeholder={t('company.com', 'firma.com')} />
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="cv-message">
                {t('What they need', 'Šta im treba')}
              </label>
              <textarea className="form-input min-h-24" id="cv-message" name="message" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                <UserRoundPlus className="size-4" /> {t('Create lead', 'Napravi lid')}
              </button>
            </div>
          </form>
        </Modal>
      )}
      <p className="mt-4 text-xs text-muted">
        {t(
          `Unconfirmed sign-ups are deleted on their own after ${PENDING_DAYS} days. To send a newsletter, export the confirmed ones to CSV and import them into Resend (Audiences) or another tool; every email gets an unsubscribe link.`,
          `Nepotvrđene prijave se same brišu posle ${PENDING_DAYS} dana. Za slanje newslettera izvezi potvrđene u CSV i uvezi ih u Resend (Audiences) ili drugi alat; u svaki email ide link za odjavu.`,
        )}
      </p>
    </>
  );
}
