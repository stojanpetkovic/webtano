// Rows of the fin_ tables (supabase/migrations/20261025_finance.sql).

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'void';

export interface BillTo {
  name?: string | null;
  company?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface Invoice {
  id: string;
  number: number;
  customer_id: string | null;
  project_id: string | null;
  status: InvoiceStatus;
  category: string;
  currency: string;
  issue_date: string;
  due_date: string | null;
  discount_pct: number;
  tax_pct: number;
  notes: string | null;
  bill_to: BillTo;
  sent_at: string | null;
  sent_to: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  position: number;
  description: string;
  qty: number;
  unit_price: number;
}

export interface Income {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  description: string | null;
  customer_id: string | null;
  project_id: string | null;
  invoice_id: string | null;
  source: 'manual' | 'project' | 'invoice';
  created_at: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  vendor: string | null;
  description: string | null;
  recurring: boolean;
  project_id: string | null;
  created_at: string;
}
