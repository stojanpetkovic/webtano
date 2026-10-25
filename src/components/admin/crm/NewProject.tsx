import { Modal } from '@/components/admin/Modal';
import { ProjectForm } from './ProjectForm';
import { db } from '@/lib/admin/supabase';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { CustomerOption } from '@/lib/admin/crm/types';

/** "New project" as a pop-up, with the customer chosen when given. */
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
  const { t } = await getAdminI18n();
  const { data } = await db().from('crm_customers').select('id, company, contact_name').order('contact_name');
  return (
    <Modal label={label} title={t('New project', 'Novi projekat')} buttonClassName={buttonClassName} defaultOpen={defaultOpen} closeHref={closeHref}>
      <ProjectForm customers={(data ?? []) as CustomerOption[]} customerId={customerId} />
    </Modal>
  );
}
