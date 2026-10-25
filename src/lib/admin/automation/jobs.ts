import { db } from '../supabase';
import { formatDate } from '../format';
import { STAGE_LABEL, dealServices, SERVICES } from '../crm/labels';
import type { Deal, Task } from '../crm/types';
import { OWNER_FOOTER, adminUrl, layout } from './emails';
import { alreadyQueued, queue, type QueueResult } from './outbox';
import type { Mode } from './registry';
import { ownerEmail, type AppSettings } from '../settings';

/** The wall clock where Stojan reads these emails (Podešavanja, Belgrade by default). */
export function localClock(now: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      weekday: 'short',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour), weekday: parts.weekday as string };
}

const OPEN_STAGES = ['new', 'contacted', 'qualified', 'proposal'];
const services = (d: Deal) =>
  dealServices(d)
    .map((k) => SERVICES[k]?.sr)
    .join(', ');

/**
 * Once a day, in the three hours from the hour set in Podešavanja (8:00 by default), weekdays
 * unless weekends are on: what needs Stojan today.
 * The window keeps a late run from sending a "morning" email in the afternoon.
 */
export async function morningDigest(now: Date, mode: Mode, settings: AppSettings): Promise<QueueResult[]> {
  const n = settings.notifications;
  const to = ownerEmail(settings);
  const { date, hour, weekday } = localClock(now, n.timezone);
  const weekend = ['Sat', 'Sun'].includes(weekday);
  if ((weekend && !n.digest_weekends) || hour < n.digest_hour || hour >= n.digest_hour + 3 || !to) return [];
  const key = `morning-digest:${date}`;
  if (await alreadyQueued(key)) return [];

  const [{ data: fresh }, { data: due }, { data: tasks }] = await Promise.all([
    db().from('crm_deals').select('*').eq('archived', false).eq('stage', 'new').order('created_at', { ascending: false }).limit(15),
    db().from('crm_deals').select('*').eq('archived', false).in('stage', OPEN_STAGES).lte('next_step_at', date).order('next_step_at').limit(15),
    db().from('crm_tasks').select('*, crm_projects(name)').neq('status', 'done').lte('due_date', date).order('due_date').limit(20),
  ]);
  const newDeals = (fresh ?? []) as Deal[];
  const dueDeals = (due ?? []) as Deal[];
  const dueTasks = (tasks ?? []) as (Task & { crm_projects: { name: string } | null })[];
  if (!newDeals.length && !dueDeals.length && !dueTasks.length) return [];

  const counts = [
    newDeals.length && `${newDeals.length} ${newDeals.length === 1 ? 'novi lid' : 'novih lidova'}`,
    dueDeals.length && `${dueDeals.length} ${dueDeals.length === 1 ? 'sledeći korak' : 'sledećih koraka'}`,
    dueTasks.length && `${dueTasks.length} ${dueTasks.length === 1 ? 'zadatak' : 'zadataka'}`,
  ].filter(Boolean);
  const { html, text } = layout({
    eyebrow: 'Jutarnji pregled',
    heading: 'Šta te danas čeka',
    intro: `Dobro jutro. Za danas: ${counts.join(', ')}.`,
    sections: [
      {
        title: 'Novi lidovi, još bez odgovora',
        rows: newDeals.map((d) => ({
          label: d.company ? `${d.name} · ${d.company}` : d.name,
          note: [services(d), `stigao ${formatDate(d.created_at, 'sr')}`].filter(Boolean).join(' · '),
          href: adminUrl(`/admin/crm/leads/${d.id}`),
        })),
      },
      {
        title: 'Sledeći korak na redu',
        rows: dueDeals.map((d) => ({
          label: d.next_step || d.name,
          note: `${d.name} · ${STAGE_LABEL[d.stage].sr} · ${d.next_step_at! < date ? `kasni od ${formatDate(d.next_step_at!, 'sr')}` : 'danas'}`,
          href: adminUrl(`/admin/crm/leads/${d.id}`),
        })),
      },
      {
        title: 'Zadaci',
        rows: dueTasks.map((t) => ({
          label: t.title,
          note: `${t.crm_projects?.name ?? 'Bez projekta'} · ${t.due_date! < date ? `kasni od ${formatDate(t.due_date!, 'sr')}` : 'danas'}`,
          href: adminUrl(t.project_id ? `/admin/crm/projects/${t.project_id}` : '/admin/crm/tasks'),
        })),
      },
    ],
    button: { label: 'Otvori lidove', href: adminUrl('/admin/crm/leads') },
    footer: OWNER_FOOTER,
  });
  return [await queue({ kind: 'morning-digest', dedupeKey: key, to, subject: `Danas: ${counts.join(', ')}`, html, text }, mode)];
}

/**
 * A form lead still in "Novi" a set number of hours (24 by default) after it came in, with nothing logged on it
 * but the system note. Leads older than the set number of days (7) are left alone, so the first run
 * does not flood the inbox with old ones.
 */
export async function unansweredLeads(now: Date, mode: Mode, settings: AppSettings): Promise<QueueResult[]> {
  const { unanswered_hours: hours, unanswered_days: days } = settings.notifications;
  const to = ownerEmail(settings);
  if (!to) return [];
  const dayAgo = new Date(now.getTime() - hours * 3600e3).toISOString();
  const weekAgo = new Date(now.getTime() - days * 24 * 3600e3).toISOString();
  const { data } = await db()
    .from('crm_deals')
    .select('*, crm_activity(kind)')
    .eq('archived', false)
    .eq('stage', 'new')
    .not('lead_id', 'is', null)
    .lte('created_at', dayAgo)
    .gte('created_at', weekAgo);
  const waiting = ((data ?? []) as (Deal & { crm_activity: { kind: string }[] })[]).filter((d) => d.crm_activity.every((a) => a.kind === 'system'));

  const results: QueueResult[] = [];
  for (const d of waiting) {
    const key = `unanswered-lead:${d.id}`;
    if (await alreadyQueued(key)) continue;
    const href = adminUrl(`/admin/crm/leads/${d.id}`);
    const { html, text } = layout({
      eyebrow: 'Lid bez odgovora',
      heading: `${d.name} čeka odgovor već ${hours} h`,
      intro: `Upit sa webtano.com stigao je ${formatDate(d.created_at, 'sr')} i još je u fazi Novi. Što pre odgovoriš, veća je šansa za dogovor.`,
      sections: [
        {
          title: 'Lid',
          rows: [{ label: d.company ? `${d.name} · ${d.company}` : d.name, note: [services(d), d.email, d.phone].filter(Boolean).join(' · '), href }],
        },
      ],
      button: { label: 'Otvori lid', href },
      footer: OWNER_FOOTER,
    });
    results.push(
      await queue(
        {
          kind: 'unanswered-lead',
          dedupeKey: key,
          to,
          subject: `Lid bez odgovora: ${d.name}`,
          html,
          text,
          replyTo: d.email,
          dealId: d.id,
        },
        mode,
      ),
    );
  }
  return results;
}
