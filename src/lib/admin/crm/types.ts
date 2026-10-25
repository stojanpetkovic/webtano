// Rows of the crm_ tables (supabase/migrations/20261024_crm.sql).

export type DealStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'declined';
export type ProjectStatus = 'not_started' | 'in_progress' | 'on_hold' | 'done' | 'cancelled';
export type TaskStatus = 'todo' | 'doing' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ActivityKind = 'note' | 'call' | 'email' | 'meeting' | 'system';

/** A customer is a person; their company and websites hang off them. */
export interface Customer {
  id: string;
  /** Optional: the business name, also shown on proposals. */
  company: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  industry: string | null;
  /** Keys of SERVICES (labels.ts): what the customer has with WebTano. */
  services: string[];
  status: 'active' | 'inactive';
  notes: string | null;
  created_at: string;
}

export interface Deal {
  id: string;
  lead_id: string | null;
  customer_id: string | null;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  source: string | null;
  /** The first of services; kept for older code and rows. */
  service: string | null;
  /** SERVICES keys, one or more. */
  services: string[];
  value: number;
  stage: DealStage;
  position: number;
  lost_reason: string | null;
  next_step: string | null;
  next_step_at: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  deal_id: string | null;
  customer_id: string | null;
  project_id: string | null;
  kind: ActivityKind;
  body: string;
  created_at: string;
}

export interface Proposal {
  id: string;
  number: number;
  customer_id: string | null;
  deal_id: string | null;
  title: string;
  status: ProposalStatus;
  currency: string;
  issue_date: string;
  valid_until: string | null;
  discount_pct: number;
  intro: string | null;
  terms: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProposalItem {
  id: string;
  proposal_id: string;
  position: number;
  description: string;
  details: string | null;
  qty: number;
  unit_price: number;
  recurring: boolean;
}

export interface Project {
  id: string;
  customer_id: string | null;
  proposal_id: string | null;
  name: string;
  status: ProjectStatus;
  start_date: string | null;
  deadline: string | null;
  budget: number | null;
  description: string | null;
  /** SERVICES keys, one or more. */
  services: string[];
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  position: number;
  completed_at: string | null;
  created_at: string;
}

/** A row of crm_items: something on the price list that can go into a proposal. */
export interface CatalogItem {
  id: string;
  /** Set on items whose price is shown on webtano.com (the plan's id in src/content/pricing.ts). */
  slug: string | null;
  group_name: string;
  name: string;
  details: string | null;
  unit_price: number;
  recurring: boolean;
  active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

/** What a customer picker needs. */
export type CustomerOption = Pick<Customer, 'id' | 'company' | 'contact_name'>;

/** A row of crm_customer_sites: a client website that belongs to a customer. */
export interface CustomerSite {
  site_id: string;
  customer_id: string;
  created_at: string;
}
