import type { InvoiceStatus } from './types';

/** What WebTano earns from. The keys match SERVICES where they overlap, so a project's service picks its category. */
export const INCOME_CATEGORIES: Record<string, string> = {
  website: 'Izrada sajta',
  redesign: 'Redizajn',
  seo: 'Lokalni SEO',
  ads: 'Google Ads upravljanje',
  maintenance: 'Održavanje i hosting',
  consulting: 'Konsultacije',
  other: 'Ostalo',
};

/**
 * Where money goes. `operating: false` marks taxes, interest and depreciation,
 * which EBITDA leaves out and net profit counts.
 */
export const EXPENSE_CATEGORIES: Record<string, { label: string; operating: boolean }> = {
  software: { label: 'Softver i alati', operating: true },
  hosting: { label: 'Hosting i domeni', operating: true },
  contractors: { label: 'Saradnici i podizvođači', operating: true },
  marketing: { label: 'Marketing i oglasi', operating: true },
  equipment: { label: 'Oprema (sitna)', operating: true },
  office: { label: 'Kancelarija i internet', operating: true },
  education: { label: 'Edukacija', operating: true },
  accounting: { label: 'Knjigovodstvo i pravne usluge', operating: true },
  bank: { label: 'Bankarske provizije', operating: true },
  travel: { label: 'Putovanja', operating: true },
  other: { label: 'Ostalo', operating: true },
  tax: { label: 'Porezi i doprinosi', operating: false },
  interest: { label: 'Kamate', operating: false },
  depreciation: { label: 'Amortizacija', operating: false },
};

export const INVOICE_STATUS: Record<InvoiceStatus, { label: string; badge: string }> = {
  draft: { label: 'Nacrt', badge: 'badge-lost' },
  issued: { label: 'Izdat', badge: 'badge-new' },
  paid: { label: 'Plaćen', badge: 'badge-won' },
  void: { label: 'Storniran', badge: 'badge-spam' },
};

export const INCOME_SOURCE: Record<string, string> = { manual: 'Ručno', project: 'Projekat', invoice: 'Račun' };

/** Income category for a project, from its first service. */
export function categoryFor(services: string[] | null | undefined): string {
  const first = services?.[0];
  if (first === 'new-website') return 'website';
  if (first && first in INCOME_CATEGORIES) return first;
  return 'other';
}

/** "WT-0007" from the prefix in Podešavanja → Fakture. */
export const invoiceNumber = (prefix: string, n: number) => `${prefix}${String(n).padStart(4, '0')}`;

/** Subtotal, discount, tax and total of an invoice's lines. */
export function invoiceTotals(items: { qty: number; unit_price: number }[], discountPct = 0, taxPct = 0) {
  const round = (n: number) => Math.round(n * 100) / 100;
  const subtotal = round(items.reduce((s, i) => s + Number(i.qty) * Number(i.unit_price), 0));
  const discount = round((subtotal * Number(discountPct || 0)) / 100);
  const taxable = subtotal - discount;
  const tax = round((taxable * Number(taxPct || 0)) / 100);
  return { subtotal, discount, tax, total: round(taxable + tax) };
}

/** Whole money in the base currency, as the finance pages show it. */
export function cash(n: number, currency = 'USD', cents = false) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n || 0);
}

export const PERIODS = {
  month: 'Ovaj mesec',
  quarter: 'Ovaj kvartal',
  ytd: 'Ova godina',
  '12m': 'Poslednjih 12 meseci',
  last_year: 'Prošla godina',
} as const;
export type Period = keyof typeof PERIODS;

/** First and last day (inclusive, YYYY-MM-DD) of a period, by the calendar in Belgrade. */
export function periodRange(period: Period, today: string): { from: string; to: string } {
  const y = Number(today.slice(0, 4));
  const m = Number(today.slice(5, 7));
  const pad = (n: number) => String(n).padStart(2, '0');
  const lastDay = (yy: number, mm: number) => new Date(Date.UTC(yy, mm, 0)).getUTCDate();
  switch (period) {
    case 'month':
      return { from: `${y}-${pad(m)}-01`, to: `${y}-${pad(m)}-${pad(lastDay(y, m))}` };
    case 'quarter': {
      const q = Math.floor((m - 1) / 3) * 3 + 1;
      return { from: `${y}-${pad(q)}-01`, to: `${y}-${pad(q + 2)}-${pad(lastDay(y, q + 2))}` };
    }
    case 'ytd':
      return { from: `${y}-01-01`, to: `${y}-12-31` };
    case 'last_year':
      return { from: `${y - 1}-01-01`, to: `${y - 1}-12-31` };
    default: {
      const start = new Date(Date.UTC(y, m - 12, 1));
      return { from: `${start.getUTCFullYear()}-${pad(start.getUTCMonth() + 1)}-01`, to: `${y}-${pad(m)}-${pad(lastDay(y, m))}` };
    }
  }
}

/** The months from one date to another, as YYYY-MM. */
export function monthsBetween(from: string, to: string): string[] {
  const out: string[] = [];
  let y = Number(from.slice(0, 4));
  let m = Number(from.slice(5, 7));
  const endY = Number(to.slice(0, 4));
  const endM = Number(to.slice(5, 7));
  while (y < endY || (y === endY && m <= endM)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'];
/** "2026-10" → "okt 26" */
export const shortMonth = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(2, 4)}`;

/** Today in Belgrade, as YYYY-MM-DD. */
export const todayBelgrade = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Belgrade' }).format(new Date());

export function addDays(day: string, days: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
