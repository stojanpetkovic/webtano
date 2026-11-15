import { strFromU8, unzipSync } from 'fflate';

/*
 * Reads a Google Search Console export of the "Search generative AI features"
 * report (how often a site was shown in AI Overviews and AI Mode). Google
 * gives these numbers only in the Search Console screen and its export, not
 * through the API, so the admin uploads the file by hand.
 *
 * Accepted: the .xlsx export, or the .zip of CSV files ("Download CSV").
 * Both hold the sheets Chart (Date, Impressions), Pages, Countries, Devices
 * and Filters.
 */

export interface GscAiReport {
  from: string;
  to: string;
  total: number;
  /** YYYY-MM-DD → impressions */
  daily: Record<string, number>;
  pages: [string, number][];
  countries: [string, number][];
  devices: [string, number][];
}

type Table = string[][];

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
}

/** Column index from a cell reference such as "B12". */
function columnOf(ref: string): number {
  let n = 0;
  for (const ch of ref.replace(/\d+$/, '')) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

/** Excel's day number (1900 system) as YYYY-MM-DD, for files re-saved in Excel. */
function serialDate(n: number): string {
  return new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 86_400_000).toISOString().slice(0, 10);
}

function readXlsx(files: Record<string, Uint8Array>): Map<string, Table> {
  const text = (path: string) => (files[path] ? strFromU8(files[path]) : '');
  const shared = [...text('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    decodeXml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')),
  );
  const rels = new Map(
    [...text('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*>/g)].map((m) => [
      /Id="([^"]+)"/.exec(m[0])?.[1] ?? '',
      (/Target="([^"]+)"/.exec(m[0])?.[1] ?? '').replace(/^\/?xl\//, '').replace(/^\//, ''),
    ]),
  );
  const tables = new Map<string, Table>();
  for (const m of text('xl/workbook.xml').matchAll(/<sheet\b[^>]*>/g)) {
    const name = decodeXml(/name="([^"]+)"/.exec(m[0])?.[1] ?? '');
    const rid = /r:id="([^"]+)"/.exec(m[0])?.[1] ?? '';
    const xml = text(`xl/${rels.get(rid) ?? ''}`);
    const rows: Table = [];
    for (const row of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
      const cells: string[] = [];
      for (const c of row[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const attrs = c[1];
        const body = c[2] ?? '';
        const ref = /r="([A-Z]+\d+)"/.exec(attrs)?.[1];
        const type = /t="([^"]+)"/.exec(attrs)?.[1];
        const v = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1];
        let value = '';
        if (type === 's' && v !== undefined) value = shared[Number(v)] ?? '';
        else if (type === 'inlineStr') value = decodeXml([...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join(''));
        else if (v !== undefined) value = decodeXml(v);
        cells[ref ? columnOf(ref) : cells.length] = value;
      }
      rows.push(Array.from(cells, (x) => x ?? ''));
    }
    tables.set(name.toLowerCase(), rows);
  }
  return tables;
}

/** A small CSV reader: quoted fields, doubled quotes, commas and newlines inside quotes. */
function readCsv(text: string): Table {
  const rows: Table = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

function readZipOfCsv(files: Record<string, Uint8Array>): Map<string, Table> {
  const tables = new Map<string, Table>();
  for (const [path, data] of Object.entries(files)) {
    if (!/\.csv$/i.test(path)) continue;
    const name = path.split('/').pop()!.replace(/\.csv$/i, '').toLowerCase();
    tables.set(name, readCsv(strFromU8(data)));
  }
  return tables;
}

const num = (s: string | undefined) => {
  const n = Number(String(s ?? '').replace(/[\s,]/g, ''));
  return Number.isFinite(n) ? Math.round(n) : 0;
};

/** Two-column [label, impressions] rows of a sheet, without its header, biggest first. */
function pairs(table: Table | undefined, limit: number): [string, number][] {
  if (!table?.length) return [];
  const header = table[0].map((h) => h.trim().toLowerCase());
  const col = header.findIndex((h) => h === 'impressions' || h === 'prikazi');
  const valueAt = col >= 0 ? col : 1;
  return table
    .slice(1)
    .map((r): [string, number] => [String(r[0] ?? '').trim(), num(r[valueAt])])
    .filter(([label, n]) => label && n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export class GscAiError extends Error {}

export function parseGscAiExport(bytes: Uint8Array): GscAiReport {
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(bytes);
  } catch {
    throw new GscAiError('not-zip');
  }
  const tables = files['xl/workbook.xml'] ? readXlsx(files) : readZipOfCsv(files);
  const chart = tables.get('chart') ?? tables.get('dates') ?? tables.get('grafikon');
  if (!chart?.length) throw new GscAiError('no-chart');

  const header = chart[0].map((h) => h.trim().toLowerCase());
  // The normal Performance report also has a Chart sheet, with clicks. Its
  // impressions are all of Google search, not the AI features, so refuse it.
  if (header.some((h) => h === 'clicks' || h === 'klikovi')) throw new GscAiError('performance-report');
  const dateCol = header.findIndex((h) => h === 'date' || h === 'datum');
  const impCol = header.findIndex((h) => h === 'impressions' || h === 'prikazi');
  if (dateCol < 0 || impCol < 0) throw new GscAiError('no-chart');

  const daily: Record<string, number> = {};
  for (const r of chart.slice(1)) {
    const raw = String(r[dateCol] ?? '').trim();
    const day = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : /^\d+(\.\d+)?$/.test(raw) ? serialDate(Number(raw)) : null;
    if (day) daily[day] = num(r[impCol]);
  }
  const days = Object.keys(daily).sort();
  if (!days.length) throw new GscAiError('no-chart');

  return {
    from: days[0],
    to: days.at(-1)!,
    total: days.reduce((n, d) => n + daily[d], 0),
    daily,
    pages: pairs(tables.get('pages') ?? tables.get('stranice'), 50),
    countries: pairs(tables.get('countries') ?? tables.get('zemlje'), 30),
    devices: pairs(tables.get('devices') ?? tables.get('uređaji') ?? tables.get('uredjaji'), 5),
  };
}
