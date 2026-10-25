-- Which services each customer has with WebTano (the same keys as the lead form:
-- new-website, redesign, seo, ads, other). Only adds a column to crm_customers.
-- Also adds Stojan's own sites as one customer, so every site has an owner in the CRM.

alter table crm_customers add column if not exists services text[] not null default '{}';

-- What the imported clients have today; editable on each customer afterwards.
update crm_customers set services = '{new-website,ads}' where website = 'treejaws.com' and services = '{}';
update crm_customers set services = '{new-website}'
where website in ('mahalotreeservice.com', 'zubarpancevo.com', 'prevozpacijenatacaretrans.rs') and services = '{}';

with owner as (
  insert into crm_customers (company, contact_name, email, website, country, city, industry, services)
  select s.client_name, s.client_name, s.client_emails[1], s.domain, 'Srbija', null, 'Lični projekti', '{new-website}'
  from sites s
  where s.domain = 'stojanpetkovic.com'
    and not exists (select 1 from crm_customer_sites cs where cs.site_id = s.id)
  returning id
)
insert into crm_customer_sites (site_id, customer_id)
select s.id, owner.id
from owner
join sites s on s.domain in ('stojanpetkovic.com', 'sftreeremoval.com', 'kakosepravi.com', 'koznaobuca.com')
where not exists (select 1 from crm_customer_sites cs where cs.site_id = s.id);
