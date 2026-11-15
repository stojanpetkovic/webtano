-- Google AI prikazi: Search Console exports of the "Search generative AI
-- features" report (how often a site was shown in AI Overviews / AI Mode),
-- uploaded by hand on a site's report page. Google gives these numbers only
-- in Search Console, not through its API.
--
-- Only the numbers read from the file are kept, not the file itself. When two
-- uploads cover the same day, the newer one counts.
--
-- Safe to run more than once.

create table if not exists site_ai_reports (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites (id) on delete cascade,
  file_name text not null,
  date_from date not null,
  date_to date not null,
  total integer not null default 0,
  daily jsonb not null default '{}',       -- {"2026-11-01": 18, ...}
  pages jsonb not null default '[]',       -- [["https://…", 651], ...]
  countries jsonb not null default '[]',
  devices jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists site_ai_reports_site_idx on site_ai_reports (site_id, date_to desc);

-- Read and written only by the server with the secret key.
alter table site_ai_reports enable row level security;
