import { db } from './supabase';
import { dayKey } from './stats';

/*
 * Google AI impressions: how often a site was shown in Google's AI Overviews
 * and AI Mode, read from Search Console exports uploaded on the report page
 * (see gscAi.ts and the site_ai_reports migration).
 */

export interface AiUpload {
  id: string;
  file_name: string;
  date_from: string;
  date_to: string;
  total: number;
  created_at: string;
}

interface AiReportRow extends AiUpload {
  daily: Record<string, number>;
  pages: [string, number][];
  countries: [string, number][];
  devices: [string, number][];
}

export interface AiImpressions {
  total: number;
  /** The same number for the previous period, or null when the uploads do not cover it. */
  previous: number | null;
  daily: { day: string; count: number }[];
  /** Days of the period that an upload covers. */
  covered: number;
  days: number;
  /** The last day any upload has data for. */
  lastDay: string;
  /** Breakdowns from the newest upload that overlaps the period, and the dates that upload spans. */
  pages: { label: string; count: number }[];
  countries: { label: string; count: number }[];
  devices: { label: string; count: number }[];
  breakdownFrom: string;
  breakdownTo: string;
}

/** Every upload for a site, oldest first; `missing` when the migration has not been run. */
export async function aiReports(siteId: string): Promise<{ rows: AiReportRow[]; missing: boolean }> {
  const { data, error } = await db()
    .from('site_ai_reports')
    .select('id, file_name, date_from, date_to, total, created_at, daily, pages, countries, devices')
    .eq('site_id', siteId)
    .order('created_at', { ascending: true });
  if (error) return { rows: [], missing: true };
  return { rows: (data ?? []) as AiReportRow[], missing: false };
}

const path = (url: string) => {
  try {
    const u = new URL(url);
    return u.pathname || '/';
  } catch {
    return url;
  }
};

/** The numbers for the given calendar days, or null when no upload covers any of them. */
export function aiImpressionsFor(rows: AiReportRow[], current: string[], previous: string[]): AiImpressions | null {
  // Newer uploads win on days that two files both cover.
  const merged = new Map<string, number>();
  for (const r of rows) for (const [day, n] of Object.entries(r.daily ?? {})) merged.set(day, n);

  const covered = current.filter((d) => merged.has(d)).length;
  if (!covered) return null;
  const prevCovered = previous.filter((d) => merged.has(d)).length;
  const sum = (days: string[]) => days.reduce((n, d) => n + (merged.get(d) ?? 0), 0);

  const inPeriod = new Set(current);
  const source =
    [...rows].reverse().find((r) => Object.keys(r.daily ?? {}).some((d) => inPeriod.has(d))) ?? rows.at(-1)!;
  // Pages are grouped by path, so "/?utm_source=…" counts with "/".
  const list = (items: [string, number][] | undefined, limit: number, label = (s: string) => s) => {
    const sums = new Map<string, number>();
    for (const [l, n] of items ?? []) sums.set(label(l), (sums.get(label(l)) ?? 0) + n);
    return [...sums.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([l, count]) => ({ label: l, count }));
  };

  return {
    total: sum(current),
    // Compare only when the earlier period is (nearly) fully covered, so a
    // missing month does not show as a drop.
    previous: previous.length && prevCovered >= previous.length * 0.9 ? sum(previous) : null,
    daily: current.map((day) => ({ day, count: merged.get(day) ?? 0 })),
    covered,
    days: current.length,
    lastDay: [...merged.keys()].sort().at(-1)!,
    pages: list(source.pages, 8, path),
    countries: list(source.countries, 6),
    devices: list(source.devices, 3),
    breakdownFrom: source.date_from,
    breakdownTo: source.date_to,
  };
}

/** The last `days` days including today in the site's timezone, and the `days` before them. */
export async function siteAiImpressions(siteId: string, timeZone: string, days: number): Promise<AiImpressions | null> {
  const dayAgo = (i: number) => dayKey(new Date(Date.now() - i * 86_400_000), timeZone);
  const { rows } = await aiReports(siteId);
  return aiImpressionsFor(
    rows,
    Array.from({ length: days }, (_, i) => dayAgo(days - 1 - i)),
    Array.from({ length: days }, (_, i) => dayAgo(2 * days - 1 - i)),
  );
}
