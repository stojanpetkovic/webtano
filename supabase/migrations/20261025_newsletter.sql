-- Newsletter sign-ups from the webtano.com popup and footer, with double opt-in.
-- A row starts as 'pending', turns 'confirmed' when the link in the confirmation
-- email is used, and 'unsubscribed' from the link in any newsletter email.
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  -- Stored lowercased, so one address is one row.
  email text not null unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  source text not null default 'footer',
  page_url text,
  -- The exact wording the visitor agreed to, as proof of consent.
  consent_text text,
  token text not null unique,
  ip_hash text,
  user_agent text,
  confirm_sent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists newsletter_subscribers_created_idx on newsletter_subscribers (created_at desc);
create index if not exists newsletter_subscribers_ip_idx on newsletter_subscribers (ip_hash, created_at desc);
-- Only the server (secret key) reads and writes it.
alter table newsletter_subscribers enable row level security;
