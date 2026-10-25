-- Each project covers one or more of the services in SERVICES (src/lib/admin/crm/labels.ts).
alter table crm_projects add column if not exists services text[] not null default '{}';

-- Projects opened from a proposal take the service of the proposal's deal.
update crm_projects p
set services = array[d.service]
from crm_proposals pr
join crm_deals d on d.id = pr.deal_id
where p.proposal_id = pr.id
  and p.services = '{}'
  and d.service in ('new-website', 'redesign', 'seo', 'ads', 'other');
