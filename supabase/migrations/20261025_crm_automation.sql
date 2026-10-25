-- Phase 1 of the automation plan: settings per automation, and one outbox that is
-- both the send queue and the log. Only new tables; nothing existing changes.

create table if not exists crm_automations (
  key text primary key,
  enabled boolean not null default true,
  -- auto: sent at once; approve: waits in the outbox until it is sent from the admin.
  mode text not null default 'approve' check (mode in ('auto', 'approve')),
  last_run_at timestamptz,
  updated_at timestamptz not null default now()
);

-- 'all' is the main switch: enabled = false pauses every automation.
insert into crm_automations (key, enabled, mode) values
  ('all', true, 'auto'),
  ('morning-digest', true, 'auto'),
  ('unanswered-lead', true, 'auto')
on conflict (key) do nothing;

create table if not exists crm_outbox (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  -- One key per email ("morning-digest:2026-10-26"): a second insert with it is refused, so nothing goes twice.
  dedupe_key text not null unique,
  to_email text not null,
  subject text not null,
  html text not null,
  text text not null,
  reply_to text,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'skipped', 'failed')),
  error text,
  provider_id text,
  customer_id uuid references crm_customers (id) on delete set null,
  deal_id uuid references crm_deals (id) on delete set null,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index if not exists crm_outbox_status_idx on crm_outbox (status, created_at desc);

alter table crm_automations enable row level security;
alter table crm_outbox enable row level security;
