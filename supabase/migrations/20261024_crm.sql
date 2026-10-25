-- WebTano CRM: WebTano's own sales pipeline, customers, proposals, projects and tasks.
-- Only adds new crm_ tables; nothing existing changes, so stojanpetkovic.com keeps
-- working on the same database. RLS is on with no policies: only the service
-- role used by the admin can read or write.

create table if not exists crm_customers (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text,
  email text,
  phone text,
  website text,
  address text,
  city text,
  country text,
  industry text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  notes text,
  created_at timestamptz not null default now()
);

-- A deal on the board. Leads from the webtano.com form are copied in with lead_id set;
-- deals can also be added by hand.
create table if not exists crm_deals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid unique references leads (id) on delete set null,
  customer_id uuid references crm_customers (id) on delete set null,
  name text not null,
  company text,
  email text,
  phone text,
  website text,
  source text,
  service text,
  value numeric(12, 2) not null default 0,
  stage text not null default 'new'
    check (stage in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  position double precision not null default 0,
  lost_reason text,
  next_step text,
  next_step_at date,
  -- Set instead of deleting a form lead, so the next sync does not bring it back.
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists crm_deals_stage_idx on crm_deals (stage, position);

create table if not exists crm_activity (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references crm_deals (id) on delete cascade,
  customer_id uuid references crm_customers (id) on delete cascade,
  project_id uuid,
  kind text not null default 'note' check (kind in ('note', 'call', 'email', 'meeting', 'system')),
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists crm_activity_deal_idx on crm_activity (deal_id, created_at desc);
create index if not exists crm_activity_customer_idx on crm_activity (customer_id, created_at desc);

create sequence if not exists crm_proposal_number;
create table if not exists crm_proposals (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique default nextval('crm_proposal_number'),
  customer_id uuid references crm_customers (id) on delete set null,
  deal_id uuid references crm_deals (id) on delete set null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  currency text not null default 'USD',
  issue_date date not null default current_date,
  valid_until date,
  discount_pct numeric(5, 2) not null default 0,
  intro text,
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm_proposal_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references crm_proposals (id) on delete cascade,
  position integer not null default 0,
  description text not null,
  details text,
  qty numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  recurring boolean not null default false
);
create index if not exists crm_proposal_items_idx on crm_proposal_items (proposal_id, position);

create table if not exists crm_projects (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references crm_customers (id) on delete set null,
  proposal_id uuid references crm_proposals (id) on delete set null,
  name text not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'on_hold', 'done', 'cancelled')),
  start_date date,
  deadline date,
  budget numeric(12, 2),
  description text,
  created_at timestamptz not null default now()
);

create table if not exists crm_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references crm_projects (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'review', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date date,
  position double precision not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists crm_tasks_project_idx on crm_tasks (project_id, status, position);

alter table crm_activity
  drop constraint if exists crm_activity_project_fk,
  add constraint crm_activity_project_fk foreign key (project_id) references crm_projects (id) on delete cascade;

alter table crm_customers enable row level security;
alter table crm_deals enable row level security;
alter table crm_activity enable row level security;
alter table crm_proposals enable row level security;
alter table crm_proposal_items enable row level security;
alter table crm_projects enable row level security;
alter table crm_tasks enable row level security;
