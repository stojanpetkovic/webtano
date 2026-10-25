import type { Metadata } from 'next';
import { PageHeading } from '@/components/admin/PageHeading';
import { CustomerForm } from '@/components/admin/crm/CustomerForm';

export const metadata: Metadata = { title: 'Novi klijent' };

export default function NewCustomerPage() {
  return (
    <>
      <PageHeading title="Novi klijent" crumbs={[{ label: 'WebTano CRM' }, { label: 'Klijenti', href: '/admin/crm/customers' }]} />
      <div className="card max-w-3xl">
        <div className="card-body">
          <CustomerForm />
        </div>
      </div>
    </>
  );
}
