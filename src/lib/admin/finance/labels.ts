import type { L, Lang } from '@/lib/i18n';
import type { InvoiceStatus } from './types';

/** What WebTano earns from. The keys match SERVICES where they overlap, so a project's service picks its category. */
export const INCOME_CATEGORIES: Record<string, L> = {
  website: { en: 'Website build', sr: 'Izrada sajta' },
  redesign: { en: 'Redesign', sr: 'Redizajn' },
  seo: { en: 'Local SEO', sr: 'Lokalni SEO' },
  ads: { en: 'Google Ads management', sr: 'Google Ads upravljanje' },
  maintenance: { en: 'Maintenance and hosting', sr: 'Održavanje i hosting' },
  consulting: { en: 'Consulting', sr: 'Konsultacije' },
  other: { en: 'Other', sr: 'Ostalo' },
};

/**
 * Where money goes. `operating: false` marks taxes, interest and depreciation,
 * which EBITDA leaves out and net profit counts.
 */
export const EXPENSE_CATEGORIES: Record<string, { label: L; operating: boolean }> = {
  software: { label: { en: 'Software and tools', sr: 'Softver i alati' }, operating: true },
  hosting: { label: { en: 'Hosting and domains', sr: 'Hosting i domeni' }, operating: true },
  contractors: { label: { en: 'Contractors and freelancers', sr: 'Saradnici i podizvođači' }, operating: true },
  marketing: { label: { en: 'Marketing and ads', sr: 'Marketing i oglasi' }, operating: true },
  equipment: { label: { en: 'Equipment (small)', sr: 'Oprema (sitna)' }, operating: true },
  office: { label: { en: 'Office and internet', sr: 'Kancelarija i internet' }, operating: true },
  education: { label: { en: 'Education', sr: 'Edukacija' }, operating: true },
  accounting: { label: { en: 'Accounting and legal', sr: 'Knjigovodstvo i pravne usluge' }, operating: true },
  bank: { label: { en: 'Bank fees', sr: 'Bankarske provizije' }, operating: true },
  travel: { label: { en: 'Travel', sr: 'Putovanja' }, operating: true },
  other: { label: { en: 'Other', sr: 'Ostalo' }, operating: true },
  tax: { label: { en: 'Taxes and contributions', sr: 'Porezi i doprinosi' }, operating: false },
  interest: { label: { en: 'Interest', sr: 'Kamate' }, operating: false },
  depreciation: { label: { en: 'Depreciation', sr: 'Amortizacija' }, operating: false },
};

export const INVOICE_STATUS: Record<InvoiceStatus, { label: L; badge: string }> = {
  draft: { label: { en: 'Draft', sr: 'Nacrt' }, badge: 'badge-lost' },
  issued: { label: { en: 'Issued', sr: 'Izdat' }, badge: 'badge-new' },
  paid: { label: { en: 'Paid', sr: 'Plaćen' }, badge: 'badge-won' },
  void: { label: { en: 'Void', sr: 'Storniran' }, badge: 'badge-spam' },
};

export const INCOME_SOURCE: Record<string, L> = {
  manual: { en: 'Manual', sr: 'Ručno' },
  project: { en: 'Project', sr: 'Projekat' },
  invoice: { en: 'Invoice', sr: 'Račun' },
};

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
  month: { en: 'This month', sr: 'Ovaj mesec' },
  quarter: { en: 'This quarter', sr: 'Ovaj kvartal' },
  ytd: { en: 'This year', sr: 'Ova godina' },
  '12m': { en: 'Last 12 months', sr: 'Poslednjih 12 meseci' },
  last_year: { en: 'Last year', sr: 'Prošla godina' },
} as const satisfies Record<string, L>;
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

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  sr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
};
/** "2026-10" → "Oct 26" / "okt 26" */
export const shortMonth = (ym: string, lang: Lang) => `${MONTHS[lang][Number(ym.slice(5, 7)) - 1]} ${ym.slice(2, 4)}`;

/** Today in Belgrade, as YYYY-MM-DD. */
export const todayBelgrade = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Belgrade' }).format(new Date());

export function addDays(day: string, days: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
