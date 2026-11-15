/*
 * Reads the "Call details" report that Google Ads exports (Reports → Call
 * details → Download → CSV): one row per call that came straight from an ad
 * (call assets, call-only ads), which never touches the website and so is not
 * in the site's own call count.
 *
 * The file is UTF-16 LE with tabs (Google's "CSV" for Excel), or UTF-8 with
 * commas when re-saved. Two title lines ("Call details", the period) come
 * before the header row.
 */

export interface AdCall {
  /** Local time of the call in the Ads account's time zone, "YYYY-MM-DDTHH:MM". */
  t: string;
  /** Duration in seconds. */
  d: number;
  /** Caller area code, or "" when Google hides the number. */
  a: string;
  /** Caller number as Google shows it, or "". */
  p: string;
  /** true when answered ("Received"). */
  ok: boolean;
  /** Call type, e.g. "Mobile click-to-call". */
  ty: string;
  campaign: string;
}

export interface AdCallsFile {
  from: string;
  to: string;
  calls: AdCall[];
}

export class AdsCallsError extends Error {}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const pad = (n: number) => String(n).padStart(2, '0');

function decode(bytes: Uint8Array): string {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes.subarray(2));
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes.subarray(2));
  // UTF-16 without a byte order mark: every other byte of ASCII text is zero.
  if (bytes.length > 3 && bytes[1] === 0 && bytes[3] === 0) return new TextDecoder('utf-16le').decode(bytes);
  return new TextDecoder('utf-8').decode(bytes).replace(/^﻿/, '');
}

/** Splits one line on tabs or commas, honouring double quotes. */
function cells(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** "Nov 1, 2026, 1:00:00 PM" or "2026-11-01 13:00:00" → "2026-11-01T13:00". */
function parseTime(s: string): string | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})/.exec(s);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}T${pad(Number(iso[4]))}:${iso[5]}`;
  const m = /^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),\s*(\d{4}),?\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*([AP]M)?/i.exec(s);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  if (!month) return null;
  let h = Number(m[4]) % 12;
  if (!m[6]) h = Number(m[4]);
  else if (m[6].toUpperCase() === 'PM') h += 12;
  return `${m[3]}-${pad(month)}-${pad(Number(m[2]))}T${pad(h)}:${m[5]}`;
}

/** "November 1, 2026 - November 12, 2026" → both days, or null. */
function parsePeriod(s: string): [string, string] | null {
  const days = [...s.matchAll(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),\s*(\d{4})/g)]
    .map((m) => (MONTHS[m[1].toLowerCase()] ? `${m[3]}-${pad(MONTHS[m[1].toLowerCase()])}-${pad(Number(m[2]))}` : null))
    .filter((d): d is string => Boolean(d));
  return days.length >= 2 ? [days[0], days.at(-1)!] : null;
}

export function parseAdsCallsCsv(bytes: Uint8Array): AdCallsFile {
  const lines = decode(bytes).split(/\r?\n/);
  const headerAt = lines.findIndex((l) => /start time/i.test(l) && /duration/i.test(l));
  if (headerAt < 0) {
    if (lines.some((l) => /impressions/i.test(l))) throw new AdsCallsError('wrong-report');
    throw new AdsCallsError('not-calls');
  }
  const sep = lines[headerAt].includes('\t') ? '\t' : ',';
  const head = cells(lines[headerAt], sep).map((h) => h.toLowerCase());
  const col = (re: RegExp) => head.findIndex((h) => re.test(h));
  const c = {
    time: col(/^start time/),
    dur: col(/^duration/),
    area: col(/area code/),
    phone: col(/phone number/),
    status: col(/^status/),
    type: col(/call type/),
    campaign: col(/^campaign$/),
  };
  if (c.time < 0 || c.dur < 0) throw new AdsCallsError('not-calls');

  const calls: AdCall[] = [];
  for (const line of lines.slice(headerAt + 1)) {
    if (!line.trim()) continue;
    const r = cells(line, sep);
    const t = parseTime(r[c.time] ?? '');
    if (!t) continue; // totals or footer lines
    const clean = (i: number) => (i >= 0 ? (r[i] ?? '').replace(/^-+$/, '').trim() : '');
    calls.push({
      t,
      d: Math.max(0, Math.round(Number((r[c.dur] ?? '0').replace(/[^\d.]/g, '')) || 0)),
      a: clean(c.area),
      p: clean(c.phone),
      ok: !/missed|propu/i.test(clean(c.status)),
      ty: clean(c.type),
      campaign: clean(c.campaign).slice(0, 120),
    });
  }
  if (!calls.length) throw new AdsCallsError('no-calls');
  calls.sort((a, b) => a.t.localeCompare(b.t));

  const period = lines.slice(0, headerAt).map(parsePeriod).find(Boolean) ?? null;
  const first = calls[0].t.slice(0, 10);
  const last = calls.at(-1)!.t.slice(0, 10);
  const [from, to] = period ?? [first, last];
  return { from: from < first ? from : first, to: to > last ? to : last, calls };
}
