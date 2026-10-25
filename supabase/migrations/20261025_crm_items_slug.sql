-- Links price list items to the prices on webtano.com/pricing and the home page.
-- An item with a slug sets that plan's price on the site; the rest of the plan
-- (name, features, notes) stays in src/content/pricing.ts.

alter table crm_items add column if not exists slug text unique;

update crm_items set slug = v.slug
from (values
  ('Starter site', 'starter-site'),
  ('Growth site', 'growth-site'),
  ('Authority site (from)', 'authority-site'),
  ('Local SEO plan', 'local-seo'),
  ('Growth plan', 'growth'),
  ('Google Ads plan', 'google-ads'),
  ('Hosting and care', 'hosting'),
  ('Local Services Ads management', 'local-services-ads'),
  ('Blog article', 'extra-article'),
  ('Extra page', 'extra-page')
) as v (name, slug)
where crm_items.name = v.name
  and crm_items.slug is null
  and not exists (select 1 from crm_items taken where taken.slug = v.slug);
