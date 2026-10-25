import type { Metadata } from 'next';
import { PageHeading } from '@/components/admin/PageHeading';
import { ProjectForm } from '@/components/admin/crm/ProjectForm';
import { db } from '@/lib/admin/supabase';
import { toParams } from '@/lib/admin/params';
import type { Customer } from '@/lib/admin/crm/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Novi projekat' };

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const customerId = toParams(await searchParams).get('customer') ?? undefined;
  const { data } = await db().from('crm_customers').select('id, company').order('company');
  return (
    <>
      <PageHeading title="Novi projekat" crumbs={[{ label: 'WebTano CRM' }, { label: 'Projekti', href: '/admin/crm/projects' }]} />
      <div className="card max-w-3xl">
        <div className="card-body">
          <ProjectForm customers={(data ?? []) as Pick<Customer, 'id' | 'company'>[]} customerId={customerId} />
        </div>
      </div>
    </>
  );
}
