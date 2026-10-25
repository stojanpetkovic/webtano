import type { Metadata } from 'next';
import { PageHeading } from '@/components/admin/PageHeading';
import { DealForm } from '@/components/admin/crm/DealForm';

export const metadata: Metadata = { title: 'Novi lid' };

export default function NewDealPage() {
  return (
    <>
      <PageHeading title="Novi lid" crumbs={[{ label: 'WebTano CRM' }, { label: 'Lidovi', href: '/admin/crm/leads' }]} description="Za lidove koji nisu stigli preko forme: poziv, preporuka, LinkedIn." />
      <div className="card max-w-3xl">
        <div className="card-body">
          <DealForm />
        </div>
      </div>
    </>
  );
}
