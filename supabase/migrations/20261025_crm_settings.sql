-- Admin settings (Podešavanja): one row per section, the values as JSON.
-- Anything missing falls back to the defaults in src/lib/admin/settings.ts.
create table if not exists crm_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
alter table crm_settings enable row level security;
