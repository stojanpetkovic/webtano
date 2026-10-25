-- Finansije: invoices with their lines, income and expenses.
-- Income is the ledger the reports read (cash basis): a manual entry, a finished
-- project, or an invoice marked paid. An invoice that is not paid yet counts as
-- outstanding, not as income. Only new tables; nothing existing changes.

create table if not exists fin_invoices (
  id uuid primary key default gen_random_uuid(),
  -- Shown with the prefix from Podešavanja → Fakture, as WT-0001.
  number integer not null unique,
  customer_id uuid references crm_customers (id) on delete set null,
  project_id uuid references crm_projects (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'issued', 'paid', 'void')),
  category text not null default 'website',
  currency text not null default 'USD',
  issue_date date not null default current_date,
  due_date date,
  discount_pct numeric(5, 2) not null default 0,
  tax_pct numeric(5, 2) not null default 0,
  notes text,
  -- The customer's name and address as they were when the invoice was issued.
  bill_to jsonb not null default '{}',
  sent_at timestamptz,
  sent_to text,
  paid_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists fin_invoices_customer_idx on fin_invoices (customer_id);
create index if not exists fin_invoices_issue_idx on fin_invoices (issue_date desc);

create table if not exists fin_invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references fin_invoices (id) on delete cascade,
  position integer not null default 0,
  description text not null,
  qty numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0
);
create index if not exists fin_invoice_items_invoice_idx on fin_invoice_items (invoice_id, position);

create table if not exists fin_income (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD',
  category text not null default 'other',
  description text,
  customer_id uuid references crm_customers (id) on delete set null,
  project_id uuid references crm_projects (id) on delete set null,
  -- One income entry per paid invoice.
  invoice_id uuid unique references fin_invoices (id) on delete set null,
  source text not null default 'manual' check (source in ('manual', 'project', 'invoice')),
  created_at timestamptz not null default now()
);
create index if not exists fin_income_date_idx on fin_income (date desc);

create table if not exists fin_expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD',
  category text not null default 'other',
  vendor text,
  description text,
  recurring boolean not null default false,
  project_id uuid references crm_projects (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists fin_expenses_date_idx on fin_expenses (date desc);

-- Only the server (secret key) reads and writes them.
alter table fin_invoices enable row level security;
alter table fin_invoice_items enable row level security;
alter table fin_income enable row level security;
alter table fin_expenses enable row level security;
