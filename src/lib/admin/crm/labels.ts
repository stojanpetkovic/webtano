import type { L, Lang } from '@/lib/i18n';
import type { DealStage, ProjectStatus, ProposalStatus, TaskPriority, TaskStatus, ActivityKind } from './types';

export const STAGES: { key: DealStage; label: L; dot: string }[] = [
  { key: 'new', label: { en: 'New', sr: 'Novi' }, dot: 'bg-sky-500' },
  { key: 'contacted', label: { en: 'Contacted', sr: 'Kontaktiran' }, dot: 'bg-amber-500' },
  { key: 'qualified', label: { en: 'Qualified', sr: 'Kvalifikovan' }, dot: 'bg-violet-500' },
  { key: 'proposal', label: { en: 'Proposal sent', sr: 'Ponuda poslata' }, dot: 'bg-cyan-500' },
  { key: 'won', label: { en: 'Won', sr: 'Dogovoren' }, dot: 'bg-emerald-500' },
  { key: 'lost', label: { en: 'Lost', sr: 'Izgubljen' }, dot: 'bg-zinc-400' },
];
export const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.key, s.label])) as Record<DealStage, L>;

export const PROPOSAL_STATUS: Record<ProposalStatus, { label: L; badge: string }> = {
  draft: { label: { en: 'Draft', sr: 'Nacrt' }, badge: 'badge-lost' },
  sent: { label: { en: 'Sent', sr: 'Poslata' }, badge: 'badge-new' },
  accepted: { label: { en: 'Accepted', sr: 'Prihvaćena' }, badge: 'badge-won' },
  declined: { label: { en: 'Declined', sr: 'Odbijena' }, badge: 'badge-spam' },
};

export const PROJECT_STATUS: Record<ProjectStatus, { label: L; badge: string }> = {
  not_started: { label: { en: 'Not started', sr: 'Nije počeo' }, badge: 'badge-lost' },
  in_progress: { label: { en: 'In progress', sr: 'U toku' }, badge: 'badge-new' },
  on_hold: { label: { en: 'On hold', sr: 'Na čekanju' }, badge: 'badge-contacted' },
  done: { label: { en: 'Done', sr: 'Završen' }, badge: 'badge-won' },
  cancelled: { label: { en: 'Cancelled', sr: 'Otkazan' }, badge: 'badge-spam' },
};

export const TASK_COLUMNS: { key: TaskStatus; label: L; dot: string }[] = [
  { key: 'todo', label: { en: 'To do', sr: 'Za uraditi' }, dot: 'bg-zinc-400' },
  { key: 'doing', label: { en: 'In progress', sr: 'U toku' }, dot: 'bg-sky-500' },
  { key: 'review', label: { en: 'In review', sr: 'Na proveri' }, dot: 'bg-amber-500' },
  { key: 'done', label: { en: 'Done', sr: 'Završeno' }, dot: 'bg-emerald-500' },
];
export const TASK_STATUS_LABEL = Object.fromEntries(TASK_COLUMNS.map((s) => [s.key, s.label])) as Record<TaskStatus, L>;

export const PRIORITY: Record<TaskPriority, { label: L; cls: string }> = {
  low: { label: { en: 'Low', sr: 'Nizak' }, cls: 'bg-zinc-100 text-zinc-600' },
  medium: { label: { en: 'Medium', sr: 'Srednji' }, cls: 'bg-sky-50 text-sky-700' },
  high: { label: { en: 'High', sr: 'Visok' }, cls: 'bg-amber-50 text-amber-700' },
  urgent: { label: { en: 'Urgent', sr: 'Hitno' }, cls: 'bg-rose-50 text-rose-700' },
};

export const ACTIVITY: Record<ActivityKind, L> = {
  note: { en: 'Note', sr: 'Beleška' },
  call: { en: 'Call', sr: 'Poziv' },
  email: { en: 'Email', sr: 'Email' },
  meeting: { en: 'Meeting', sr: 'Sastanak' },
  system: { en: 'System', sr: 'Sistem' },
};

/** The services on the webtano.com form, as the form sends them. */
export const SERVICES: Record<string, L> = {
  'new-website': { en: 'New website', sr: 'Novi sajt' },
  redesign: { en: 'Redesign', sr: 'Redizajn' },
  seo: { en: 'Local SEO', sr: 'Lokalni SEO' },
  ads: { en: 'Google Ads', sr: 'Google Ads' },
  other: { en: 'Something else', sr: 'Nešto drugo' },
};

/** Turns what a lead sent ("new-website, ads", or one key) into known SERVICES keys. */
export function parseServices(value: unknown): string[] {
  const list = Array.isArray(value) ? value : String(value ?? '').split(',');
  return [...new Set(list.map((s) => String(s).trim()).filter((k) => k in SERVICES))];
}

/** A deal's services, falling back to the single service of older rows. */
export const dealServices = (d: { services?: string[] | null; service?: string | null }) => (d.services?.length ? d.services : parseServices(d.service));

/** A customer's display name: the person, else the business. */
export function customerName(c: { contact_name?: string | null; company?: string | null }, lang: Lang) {
  return c.contact_name?.trim() || c.company?.trim() || (lang === 'sr' ? 'Bez imena' : 'No name');
}

export function money(n: number | null | undefined, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: n && n % 1 ? 2 : 0 }).format(n ?? 0);
}

/** One-time and monthly sums of a proposal, after its discount. */
export function totals(items: { qty: number; unit_price: number; recurring?: boolean }[], discountPct = 0) {
  const factor = 1 - Number(discountPct || 0) / 100;
  const sum = (recurring: boolean) =>
    items.filter((i) => Boolean(i.recurring) === recurring).reduce((n, i) => n + Number(i.qty) * Number(i.unit_price), 0);
  const oneTimeGross = sum(false);
  const monthlyGross = sum(true);
  return {
    oneTimeGross,
    monthlyGross,
    oneTime: oneTimeGross * factor,
    monthly: monthlyGross * factor,
    discount: (oneTimeGross + monthlyGross) * (1 - factor),
  };
}

/** The price list's starting groups in English; groups Stojan names himself show as written. */
const GROUP_EN: Record<string, string> = { Sajtovi: 'Websites', 'Mesečni planovi': 'Monthly plans', Dodaci: 'Add-ons', Ostalo: 'Other' };
export const groupLabel = (name: string, lang: Lang) => (lang === 'en' ? (GROUP_EN[name] ?? name) : name);
