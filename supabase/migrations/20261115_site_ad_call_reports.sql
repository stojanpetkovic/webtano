-- Pozivi sa Google Ads oglasa: "Call details" exports from Google Ads (calls
-- that came straight from an ad and never touched the website), uploaded by
-- hand on a site's report page.
--
-- Each row is one uploaded file; its calls are kept as JSON. When two uploads
-- cover the same day, the newer one counts, so overlapping exports never
-- count a call twice.
--
-- Safe to run more than once.

create table if not exists site_ad_call_reports (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites (id) on delete cascade,
  file_name text not null,
  date_from date not null,
  date_to date not null,
  total integer not null default 0,
  calls jsonb not null default '[]',   -- [{"t":"2026-11-01T13:00","d":45,"a":"954","p":"+1 954-…","ok":true,"ty":"Mobile click-to-call","campaign":"…"}]
  created_at timestamptz not null default now()
);

create index if not exists site_ad_call_reports_site_idx on site_ad_call_reports (site_id, date_to desc);

-- Read and written only by the server with the secret key.
alter table site_ad_call_reports enable row level security;
