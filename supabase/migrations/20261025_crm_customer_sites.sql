-- Links client websites (the sites table, shared with stojanpetkovic.com) to CRM
-- customers. Only adds the crm_customer_sites table; sites itself is not changed.
-- The first run adds the existing clients as customers, each linked to its site,
-- with the contact name and email already saved on the site.

create table if not exists crm_customer_sites (
  site_id uuid primary key references sites (id) on delete cascade,
  customer_id uuid not null references crm_customers (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists crm_customer_sites_customer_idx on crm_customer_sites (customer_id);
alter table crm_customer_sites enable row level security;

with seed (domain, country, city, industry) as (
  values
    ('treejaws.com', 'USA', 'South Florida', 'Tree service'),
    ('mahalotreeservice.com', 'USA', null, 'Tree service'),
    ('zubarpancevo.com', 'Srbija', 'Pančevo', 'Stomatologija'),
    ('prevozpacijenatacaretrans.rs', 'Srbija', 'Beograd', 'Prevoz pacijenata')
),
added as (
  insert into crm_customers (company, contact_name, email, website, country, city, industry)
  select s.name, s.client_name, s.client_emails[1], s.domain, seed.country, seed.city, seed.industry
  from seed
  join sites s on s.domain = seed.domain
  where not exists (select 1 from crm_customer_sites cs where cs.site_id = s.id)
    and not exists (select 1 from crm_customers c where c.website = s.domain)
  returning id, website
)
insert into crm_customer_sites (site_id, customer_id)
select s.id, added.id from added join sites s on s.domain = added.website;
