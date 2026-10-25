import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, MailCheck, MailX, RotateCcw, Search, Send, Trash2, UserPlus, Hourglass } from 'lucide-react';
import { PageHeading } from '@/components/admin/PageHeading';
import { StatCard } from '@/components/admin/StatCard';
import { DailyChart } from '@/components/admin/DailyChart';
import { Pagination } from '@/components/admin/Pagination';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { db } from '@/lib/admin/supabase';
import { dailySeries, daysAgo } from '@/lib/admin/stats';
import { formatDateTime, timeAgo } from '@/lib/admin/format';
import { toParams } from '@/lib/admin/params';
import { PENDING_DAYS, SOURCES, SUBSCRIBER_STATUS, type Subscriber, type SubscriberStatus } from '@/lib/admin/newsletter';
import { deleteSubscriber, resendConfirmation, unsubscribeSubscriber } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Pretplatnici' };

const SIZES = [25, 50, 100];
const DAYS = 30;
const TZ = 'Europe/Belgrade';
const BADGE: Record<SubscriberStatus, string> = { confirmed: 'badge-won', pending: 'badge-contacted', unsubscribed: 'badge-lost' };

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const status = (['confirmed', 'pending', 'unsubscribed'] as const).find((s) => s === query.get('status')) ?? '';
  const q = (query.get('q') ?? '').trim().toLowerCase().replace(/[%_,()]/g, '');
  const size = SIZES.includes(Number(query.get('size'))) ? Number(query.get('size')) : SIZES[0];
  const requested = Math.max(1, Math.floor(Number(query.get('page')) || 1));

  // Every row's status and dates, for the cards, tabs and chart: small enough to read whole.
  const { data: allData, error } = await db()
    .from('newsletter_subscribers')
    .select('status, source, created_at, confirmed_at, unsubscribed_at')
    .limit(50_000);

  if (error)
    return (
      <>
        <PageHeading title="Pretplatnici" crumbs={[{ label: 'Marketing' }]} />
        <div className="card mt-6 p-6">
          <p className="font-semibold text-ink">Tabela za newsletter još ne postoji</p>
          <p className="mt-1 text-sm text-muted">
            Pokreni SQL iz <code className="font-mono">supabase/migrations/20261025_newsletter.sql</code> u Supabase SQL Editoru, pa osveži stranicu.
          </p>
        </div>
      </>
    );

  const all = (allData ?? []) as Pick<Subscriber, 'status' | 'source' | 'created_at' | 'confirmed_at' | 'unsubscribed_at'>[];
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
    .map(([key, label], slot) => ({ label, slot, data: dailySeries(recent.filter((r) => r.source === key), DAYS, TZ).map((d) => d.count) }))
    .filter((s) => s.data.some((n) => n > 0));

  const tabs: { key: '' | SubscriberStatus; label: string; n: number }[] = [
    { key: '', label: 'Svi', n: all.length },
    { key: 'confirmed', label: 'Potvrđeni', n: count('confirmed') },
    { key: 'pending', label: 'Čekaju potvrdu', n: count('pending') },
    { key: 'unsubscribed', label: 'Odjavljeni', n: count('unsubscribed') },
  ];

  const filtered = () => {
    let c = db().from('newsletter_subscribers').select('*', { count: 'exact' }).order('created_at', { ascending: false });
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
  const exportHref = `/admin/subscribers/export.csv?${new URLSearchParams({ status: status || 'all', ...(q ? { q } : {}) })}`;

  return (
    <>
      <PageHeading
        title="Pretplatnici"
        crumbs={[{ label: 'Marketing' }]}
        description="Prijave na newsletter sa webtano.com (popup i futer). Svaka adresa potvrđuje prijavu emailom pre nego što uđe na listu."
      >
        <Link href="/admin/settings#newsletter" className="btn btn-light">
          Podešavanja popupa
        </Link>
        <a href={exportHref} className="btn btn-outline">
          <Download className="size-4" /> Izvezi CSV
        </a>
      </PageHeading>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Aktivni pretplatnici"
          value={count('confirmed')}
          icon={MailCheck}
          color="success"
          note={`+${confirmedRecent.length} za ${DAYS} dana`}
          trend={dailySeries(confirmedRecent.map((r) => ({ created_at: r.confirmed_at! })), DAYS, TZ).map((d) => d.count)}
        />
        <StatCard label="Nove prijave" value={recent.length} icon={UserPlus} color="info" note={`poslednjih ${DAYS} dana`} trend={dailySeries(recent, DAYS, TZ).map((d) => d.count)} />
        <StatCard
          label="Čekaju potvrdu"
          value={count('pending')}
          icon={Hourglass}
          color="warning"
          note={rate === null ? `brišu se posle ${PENDING_DAYS} dana` : `${rate}% prijava se potvrdi`}
        />
        <StatCard label="Odjavljeni" value={count('unsubscribed')} icon={MailX} color="danger" note={`${unsubRecent.length} za ${DAYS} dana`} />
      </div>

      <div className="mt-6">
        <DailyChart
          title="Prijave po danu"
          total={`${recent.length} prijava`}
          note={`${DAYS} dana, po mestu prijave`}
          labels={labels}
          series={series.length ? series : [{ label: 'Prijave', data: labels.map(() => 0) }]}
        />
      </div>

      <div className="card mt-6">
        <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-2" aria-label="Status">
          {tabs.map((t) => {
            const active = t.key === status;
            return (
              <Link
                key={t.key || 'all'}
                href={link({ status: t.key || null })}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-medium transition ${
                  active ? 'border-ink text-ink' : 'border-transparent text-zinc-500 hover:text-ink'
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[10.5px] leading-none tabular-nums ${active ? 'bg-ink text-white' : 'bg-zinc-100 text-zinc-500'}`}
                >
                  {t.n}
                </span>
              </Link>
            );
          })}
        </nav>

        <form method="get" className="flex gap-2 border-b border-line p-4">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative flex-1">
            <label className="sr-only" htmlFor="q">
              Pretraga
            </label>
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input className="form-input ps-10" id="q" name="q" type="search" defaultValue={q} placeholder="Pretraži email" />
          </div>
          <button className="btn btn-primary" type="submit">
            Traži
          </button>
          {q && (
            <Link href={link({ q: null })} className="btn btn-light" title="Poništi pretragu">
              <RotateCcw className="size-4" />
              <span className="sr-only">Poništi</span>
            </Link>
          )}
        </form>

        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">
            {all.length ? 'Nema pretplatnika za ove filtere.' : 'Još nema prijava. Stižu iz popupa i futera na webtano.com.'}
          </p>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th className="max-md:hidden">Status</th>
                  <th className="max-md:hidden">Izvor</th>
                  <th className="max-md:hidden">Prijavljen</th>
                  <th className="text-right">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="max-w-[32ch] truncate font-medium text-ink max-md:max-w-[22ch]">{s.email}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted md:hidden">
                        <span className={`badge ${BADGE[s.status]}`}>{SUBSCRIBER_STATUS[s.status]}</span>
                        {SOURCES[s.source] ?? s.source} · {timeAgo(s.created_at)}
                      </div>
                      {s.page_url && <div className="max-w-[40ch] truncate text-xs text-muted max-md:hidden">{s.page_url.replace(/^https?:\/\/[^/]+/, '') || '/'}</div>}
                    </td>
                    <td className="max-md:hidden">
                      <span className={`badge ${BADGE[s.status]}`}>{SUBSCRIBER_STATUS[s.status]}</span>
                      {s.status === 'confirmed' && s.confirmed_at && <div className="mt-1 text-xs text-muted max-md:hidden">{formatDateTime(s.confirmed_at)}</div>}
                    </td>
                    <td className="whitespace-nowrap max-md:hidden">
                      <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600">{SOURCES[s.source] ?? s.source}</span>
                    </td>
                    <td className="whitespace-nowrap text-sm text-zinc-600 max-md:hidden" title={formatDateTime(s.created_at)}>
                      {timeAgo(s.created_at)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {s.status === 'pending' && (
                          <form action={resendConfirmation}>
                            <input type="hidden" name="id" value={s.id} />
                            <button type="submit" className="btn btn-sm btn-light" title="Pošalji email za potvrdu ponovo">
                              <Send className="size-3.5" />
                              <span className="max-lg:sr-only">Pošalji ponovo</span>
                            </button>
                          </form>
                        )}
                        {s.status === 'confirmed' && (
                          <form action={unsubscribeSubscriber}>
                            <input type="hidden" name="id" value={s.id} />
                            <ConfirmSubmit message={`Odjaviti ${s.email}?`} className="btn btn-sm btn-light">
                              <MailX className="size-3.5" />
                              <span className="max-lg:sr-only">Odjavi</span>
                            </ConfirmSubmit>
                          </form>
                        )}
                        <form action={deleteSubscriber}>
                          <input type="hidden" name="id" value={s.id} />
                          <ConfirmSubmit
                            message={`Trajno obrisati ${s.email}? Ovo se koristi za zahtev za brisanje podataka i ne može da se vrati.`}
                            className="btn btn-sm btn-light hover:text-rose-600"
                          >
                            <Trash2 className="size-3.5" />
                            <span className="sr-only">Obriši</span>
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
        <Pagination page={page} pageSize={size} href={pageHref} sizes={SIZES} total={found ?? total} noun="pretplatnika" />
      </div>
      <p className="mt-4 text-xs text-muted">
        Nepotvrđene prijave se same brišu posle {PENDING_DAYS} dana. Za slanje newslettera izvezi potvrđene u CSV i uvezi ih u Resend (Audiences) ili drugi alat;
        u svaki email ide link za odjavu.
      </p>
    </>
  );
}
