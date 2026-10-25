-- WebTano CRM price list: the items offered in proposals, edited in the admin
-- under Cenovnik. Only adds the crm_items table. The first run fills it with the
-- prices from webtano.com/pricing; after that the admin owns the list.

create table if not exists crm_items (
  id uuid primary key default gen_random_uuid(),
  group_name text not null default 'Ostalo',
  name text not null,
  details text,
  unit_price numeric(12, 2) not null default 0,
  recurring boolean not null default false,
  -- Hidden items stay in old proposals but are not offered in new ones.
  active boolean not null default true,
  position double precision not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists crm_items_position_idx on crm_items (position);
alter table crm_items enable row level security;

insert into crm_items (group_name, name, details, unit_price, recurring, position)
select * from (values
    ('Sajtovi', 'Starter site', 'Up to 8 pages · A page for each main service · Copywriting included · Mobile-first, loads in about a second · Call and form tracking · Google Business Profile setup · Ready in 2 to 3 weeks', 2900, false, 10),
    ('Sajtovi', 'Growth site', 'Up to 25 pages · Service and location pages · Blog with 4 articles to start · Structured data for services and FAQs · Redirects from your old site · Call and form tracking · Ready in 4 to 6 weeks', 5900, false, 20),
    ('Sajtovi', 'Authority site (from)', '50 pages or more · Local guides for every area you serve · Custom design and photography direction · Content plan for the first year · Call and form tracking · Price agreed after the free check', 9900, false, 30),
    ('Mesečni planovi', 'Local SEO plan', 'Google Business Profile management · Two new service or local pages a month · Technical SEO and speed fixes · Review requests and replies · Citations and local mentions · Call and form tracking · Monthly report and a call', 900, true, 40),
    ('Mesečni planovi', 'Growth plan', 'Everything in Local SEO · Everything in Google Ads · Local Services Ads management · Landing pages built for your ads · Cost per lead by channel · Priority support, reply within one business day', 1900, true, 50),
    ('Mesečni planovi', 'Google Ads plan', 'Account setup or full audit · Keywords, negatives and ads per service · Bids and budgets reviewed twice a month · Call and conversion tracking · Storm-season budget plan · Monthly report and a call', 750, true, 60),
    ('Dodaci', 'Hosting and care', 'Hosting in your name, updates, backups, uptime monitoring and small edits.', 99, true, 70),
    ('Dodaci', 'Local Services Ads management', 'Setup and management, with lead disputes handled for you.', 300, true, 80),
    ('Dodaci', 'Blog article', 'Researched article written for your market, with images and FAQs.', 350, false, 90),
    ('Dodaci', 'Extra page', 'Additional service or location page, written and designed to match your site.', 250, false, 100)
) as seed (group_name, name, details, unit_price, recurring, position)
where not exists (select 1 from crm_items);
