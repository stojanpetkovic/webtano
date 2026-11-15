import { db } from './supabase';
import { dayKey } from './stats';
import type { AdCall } from './adsCallsCsv';

/*
 * Calls straight from Google Ads (call assets, call-only ads), read from the
 * "Call details" files uploaded on a site's report page (see adsCallsCsv.ts
 * and the site_ad_call_reports migration). These calls never touch the
 * website, so they are counted apart from the site's own calls.
 */

export interface AdCallsUpload {
  id: string;
  file_name: string;
  date_from: string;
  date_to: string;
  total: number;
  created_at: string;
}

interface AdCallsRow extends AdCallsUpload {
  calls: AdCall[];
}

/** A call longer than this counts as a real conversation, as in Google Ads' default call conversion. */
export const LONG_CALL_SECONDS = 60;

export interface AdCallsStats {
  total: number;
  answered: number;
  missed: number;
  /** Answered calls of at least LONG_CALL_SECONDS. */
  long: number;
  /** Average length of answered calls, in seconds. */
  avgSeconds: number;
  /** Same total for the previous period, or null when the uploads do not cover it. */
  previous: number | null;
  daily: { day: string; count: number }[];
  campaigns: { label: string; count: number; long: number }[];
  /** Calls in the period, newest first. */
  calls: AdCall[];
  covered: number;
  days: number;
  lastDay: string;
}

/** Every upload for a site, oldest first; `missing` when the migration has not been run. */
export async function adCallReports(siteId: string): Promise<{ rows: AdCallsRow[]; missing: boolean }> {
  const { data, error } = await db()
    .from('site_ad_call_reports')
    .select('id, file_name, date_from, date_to, total, created_at, calls')
    .eq('site_id', siteId)
    .order('created_at', { ascending: true });
  if (error) return { rows: [], missing: true };
  return { rows: (data ?? []) as AdCallsRow[], missing: false };
}

const daysBetween = (from: string, to: string) => {
  const out: string[] = [];
  for (let t = Date.parse(`${from}T12:00:00Z`); t <= Date.parse(`${to}T12:00:00Z`); t += 86_400_000) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
};

/** The numbers for the given calendar days, or null when no upload covers any of them. */
export function adCallsFor(rows: AdCallsRow[], current: string[], previous: string[]): AdCallsStats | null {
  // Each day takes its calls from the newest file that covers it, so
  // overlapping exports never count a call twice.
  const owner = new Map<string, number>();
  rows.forEach((r, i) => daysBetween(r.date_from, r.date_to).forEach((d) => owner.set(d, i)));
  const byDay = new Map<string, AdCall[]>();
  rows.forEach((r, i) => {
    for (const c of r.calls ?? []) {
      const d = c.t.slice(0, 10);
      if (owner.get(d) !== i) continue;
      byDay.set(d, [...(byDay.get(d) ?? []), c]);
    }
  });

  const covered = current.filter((d) => owner.has(d)).length;
  if (!covered) return null;
  const prevCovered = previous.filter((d) => owner.has(d)).length;
  const inPeriod = current.flatMap((d) => byDay.get(d) ?? []);
  const answered = inPeriod.filter((c) => c.ok);
  const isLong = (c: AdCall) => c.ok && c.d >= LONG_CALL_SECONDS;

  const campaigns = new Map<string, { count: number; long: number }>();
  for (const c of inPeriod) {
    const k = c.campaign || '—';
    const v = campaigns.get(k) ?? { count: 0, long: 0 };
    v.count++;
    if (isLong(c)) v.long++;
    campaigns.set(k, v);
  }

  return {
    total: inPeriod.length,
    answered: answered.length,
    missed: inPeriod.length - answered.length,
    long: inPeriod.filter(isLong).length,
    avgSeconds: answered.length ? Math.round(answered.reduce((s, c) => s + c.d, 0) / answered.length) : 0,
    // Compare only when the earlier period is (nearly) fully covered.
    previous:
      previous.length && prevCovered >= previous.length * 0.9 ? previous.reduce((n, d) => n + (byDay.get(d)?.length ?? 0), 0) : null,
    daily: current.map((day) => ({ day, count: byDay.get(day)?.length ?? 0 })),
    campaigns: [...campaigns.entries()].map(([label, v]) => ({ label, ...v })).sort((a, b) => b.count - a.count),
    calls: [...inPeriod].sort((a, b) => b.t.localeCompare(a.t)),
    covered,
    days: current.length,
    lastDay: [...owner.keys()].sort().at(-1)!,
  };
}

/** The last `days` days including today in the site's timezone, and the `days` before them. */
export async function siteAdCalls(siteId: string, timeZone: string, days: number): Promise<AdCallsStats | null> {
  const dayAgo = (i: number) => dayKey(new Date(Date.now() - i * 86_400_000), timeZone);
  const { rows } = await adCallReports(siteId);
  return adCallsFor(
    rows,
    Array.from({ length: days }, (_, i) => dayAgo(days - 1 - i)),
    Array.from({ length: days }, (_, i) => dayAgo(2 * days - 1 - i)),
  );
}

/** "1:05" from 65 seconds. */
export const minSec = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** "+1 954 ••• 9766": enough to recognise a caller in a report without printing the whole number. */
export function maskPhone(p: string): string {
  const digits = p.replace(/\D/g, '');
  if (digits.length < 7) return p || '—';
  const m = /^\+?(\d{1,3})[\s-]*\(?(\d{3})\)?/.exec(p.trim());
  return m ? `+${m[1]} ${m[2]} ••• ${digits.slice(-4)}` : `••• ${digits.slice(-4)}`;
}
