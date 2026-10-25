import type { DealStage, ProjectStatus, ProposalStatus, TaskPriority, TaskStatus, ActivityKind } from './types';

export const STAGES: { key: DealStage; label: string; dot: string }[] = [
  { key: 'new', label: 'Novi', dot: 'bg-sky-500' },
  { key: 'contacted', label: 'Kontaktiran', dot: 'bg-amber-500' },
  { key: 'qualified', label: 'Kvalifikovan', dot: 'bg-violet-500' },
  { key: 'proposal', label: 'Ponuda poslata', dot: 'bg-cyan-500' },
  { key: 'won', label: 'Dogovoren', dot: 'bg-emerald-500' },
  { key: 'lost', label: 'Izgubljen', dot: 'bg-zinc-400' },
];
export const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.key, s.label])) as Record<DealStage, string>;

export const PROPOSAL_STATUS: Record<ProposalStatus, { label: string; badge: string }> = {
  draft: { label: 'Nacrt', badge: 'badge-lost' },
  sent: { label: 'Poslata', badge: 'badge-new' },
  accepted: { label: 'Prihvaćena', badge: 'badge-won' },
  declined: { label: 'Odbijena', badge: 'badge-spam' },
};

export const PROJECT_STATUS: Record<ProjectStatus, { label: string; badge: string }> = {
  not_started: { label: 'Nije počeo', badge: 'badge-lost' },
  in_progress: { label: 'U toku', badge: 'badge-new' },
  on_hold: { label: 'Na čekanju', badge: 'badge-contacted' },
  done: { label: 'Završen', badge: 'badge-won' },
  cancelled: { label: 'Otkazan', badge: 'badge-spam' },
};

export const TASK_COLUMNS: { key: TaskStatus; label: string; dot: string }[] = [
  { key: 'todo', label: 'Za uraditi', dot: 'bg-zinc-400' },
  { key: 'doing', label: 'U toku', dot: 'bg-sky-500' },
  { key: 'review', label: 'Na proveri', dot: 'bg-amber-500' },
  { key: 'done', label: 'Završeno', dot: 'bg-emerald-500' },
];
export const TASK_STATUS_LABEL = Object.fromEntries(TASK_COLUMNS.map((s) => [s.key, s.label])) as Record<TaskStatus, string>;

export const PRIORITY: Record<TaskPriority, { label: string; cls: string }> = {
  low: { label: 'Nizak', cls: 'bg-zinc-100 text-zinc-600' },
  medium: { label: 'Srednji', cls: 'bg-sky-50 text-sky-700' },
  high: { label: 'Visok', cls: 'bg-amber-50 text-amber-700' },
  urgent: { label: 'Hitno', cls: 'bg-rose-50 text-rose-700' },
};

export const ACTIVITY: Record<ActivityKind, string> = {
  note: 'Beleška',
  call: 'Poziv',
  email: 'Email',
  meeting: 'Sastanak',
  system: 'Sistem',
};

/** The services on the webtano.com form, as the form sends them. */
export const SERVICES: Record<string, string> = {
  'new-website': 'Novi sajt',
  redesign: 'Redizajn',
  seo: 'Lokalni SEO',
  ads: 'Google Ads',
  other: 'Nešto drugo',
};

/** A customer's display name: the person, else the business. */
export function customerName(c: { contact_name?: string | null; company?: string | null }) {
  return c.contact_name?.trim() || c.company?.trim() || 'Bez imena';
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
