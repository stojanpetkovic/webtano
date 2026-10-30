-- Newsletter sign-ups are kept apart from leads.
--
-- 1. newsletter_subscribers also holds sign-ups from client sites (site_id set).
--    A row with site_id null is the WebTano newsletter itself, as before.
-- 2. A subscriber can later be turned into a lead: lead_id (client site) or
--    deal_id (WebTano CRM) points at what was made from it.
-- 3. Email-only "newsletter" leads that came in before this change are moved
--    over to the subscriber list and removed from the leads.
--
-- Safe to run more than once. To see first which leads part 3 will move, run:
--   select s.name, l.form_name, l.visitor_email, l.data, l.created_at from leads l join sites s on s.id = l.site_id
--   where l.visitor_email is not null and l.visitor_name is null and l.visitor_phone is null order by l.created_at desc;

alter table newsletter_subscribers add column if not exists site_id uuid references sites (id) on delete cascade;
alter table newsletter_subscribers add column if not exists lead_id uuid references leads (id) on delete set null;
alter table newsletter_subscribers add column if not exists deal_id uuid references crm_deals (id) on delete set null;
alter table newsletter_subscribers add column if not exists converted_at timestamptz;

-- One address once per list: the same email may be on WebTano's list and on a client's.
alter table newsletter_subscribers drop constraint if exists newsletter_subscribers_email_key;
create unique index if not exists newsletter_subscribers_site_email_idx
  on newsletter_subscribers (site_id, email) nulls not distinct;
create index if not exists newsletter_subscribers_site_idx on newsletter_subscribers (site_id, created_at desc);

-- 3. The old email-only leads. A lead counts as a sign-up when it has an email,
--    no name and no phone, and every other field is a known technical one
--    (source, lang, consent...) or the form is named like a newsletter form.
drop table if exists moved_leads;
create temporary table moved_leads as
select l.*
from leads l
where l.visitor_email is not null
  and l.visitor_name is null
  and l.visitor_phone is null
  and (
    l.form_name ~* '(newsletter|subscri|pretplat|signup|sign-up|mailing)'
    or not exists (
      select 1 from jsonb_object_keys(l.data::jsonb) k
      where k !~* '^(e-?mail.*|source|lang|locale|language|consent|gdpr|agree.*|acceptance.*|terms|privacy|subscribe|newsletter|list|tags?|redirect|form.*|page|url|company_url)$'
    )
  );

-- WebTano's own rows are already on its list (the sign-up stored them there too).
insert into newsletter_subscribers (site_id, email, status, source, page_url, token, ip_hash, user_agent, confirmed_at, created_at, updated_at)
select distinct on (m.site_id, lower(m.visitor_email))
  m.site_id, lower(m.visitor_email), 'confirmed', 'form', m.page_url,
  substr(replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''), 1, 48), m.ip_hash, m.user_agent, m.created_at, m.created_at, m.created_at
from moved_leads m
join sites s on s.id = m.site_id
where s.site_key <> '4efb22cf8b22fa845d7a39b243a17934'
order by m.site_id, lower(m.visitor_email), m.created_at
on conflict do nothing;

-- Their CRM cards were made only from an email: drop the ones nobody has worked on yet.
delete from crm_deals d
using moved_leads m
where d.lead_id = m.id and d.stage = 'new'
  and not exists (select 1 from crm_proposals p where p.deal_id = d.id)
  and not exists (select 1 from crm_activity a where a.deal_id = d.id and a.kind <> 'system');

delete from leads l using moved_leads m where l.id = m.id;

drop table if exists moved_leads;
