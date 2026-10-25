-- Customers are people: the person's name leads and the company is optional.
-- Tree Jaws and Mahalo Tree Service belong to one client, so their two customers
-- become one, keeping the Tree Jaws row and moving everything from Mahalo onto it.

alter table crm_customers alter column company drop not null;

do $$
declare
  keep uuid := (select id from crm_customers where website = 'treejaws.com' order by created_at limit 1);
  gone uuid := (select id from crm_customers where website = 'mahalotreeservice.com' order by created_at limit 1);
begin
  if keep is null or gone is null or keep = gone then
    return;
  end if;
  update crm_customer_sites set customer_id = keep where customer_id = gone;
  update crm_deals set customer_id = keep where customer_id = gone;
  update crm_proposals set customer_id = keep where customer_id = gone;
  update crm_projects set customer_id = keep where customer_id = gone;
  update crm_activity set customer_id = keep where customer_id = gone;
  update crm_customers
  set company = null,
      services = (select array(select distinct unnest(c1.services || c2.services)) from crm_customers c1, crm_customers c2 where c1.id = keep and c2.id = gone)
  where id = keep;
  delete from crm_customers where id = gone;
end $$;

-- The person's own sites: no company name, just the person.
update crm_customers set company = null where website = 'stojanpetkovic.com';
