import { Modal } from '@/components/admin/Modal';
import { ProjectForm } from './ProjectForm';
import { db } from '@/lib/admin/supabase';
import type { Customer } from '@/lib/admin/crm/types';

/** "Novi projekat" as a pop-up, with the customer chosen when given. */
export async function NewProject({
  customerId,
  label,
  buttonClassName,
  defaultOpen,
  closeHref,
}: {
  customerId?: string;
  label?: React.ReactNode;
  buttonClassName?: string;
  defaultOpen?: boolean;
  closeHref?: string;
}) {
  const { data } = await db().from('crm_customers').select('id, company').order('company');
  return (
    <Modal label={label} title="Novi projekat" buttonClassName={buttonClassName} defaultOpen={defaultOpen} closeHref={closeHref}>
      <ProjectForm customers={(data ?? []) as Pick<Customer, 'id' | 'company'>[]} customerId={customerId} />
    </Modal>
  );
}
