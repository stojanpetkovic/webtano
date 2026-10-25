-- A lead can ask for several services, on the webtano.com form and in the admin.
-- The old single `service` column stays, filled with the first one, so nothing that reads it breaks.
alter table crm_deals add column if not exists services text[] not null default '{}';

update crm_deals
set services = array[service]
where services = '{}'
  and service in ('new-website', 'redesign', 'seo', 'ads', 'other');
