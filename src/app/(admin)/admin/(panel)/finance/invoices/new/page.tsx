import type { Metadata } from 'next';
import { PageHeading } from '@/components/admin/PageHeading';
import { InvoiceEditor } from '@/components/admin/finance/InvoiceEditor';
import { appSettings } from '@/lib/admin/settings';
import { priceList } from '@/lib/admin/crm/priceList';
import { toParams } from '@/lib/admin/params';
import { financeOptions } from '@/lib/admin/finance/options';
import { todayBelgrade } from '@/lib/admin/finance/labels';
import { Notice } from '../../Ledger';
import { getAdminI18n } from '@/lib/admin/i18n';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('New invoice', 'Novi račun') };
}

export default async function NewInvoicePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t } = await getAdminI18n();
  const query = toParams(await searchParams);
  const [settings, options, prices] = await Promise.all([appSettings(), financeOptions(lang), priceList()]);
  return (
    <>
      <PageHeading
        title={t('New invoice', 'Novi račun')}
        crumbs={[{ label: t('Finance', 'Finansije'), href: '/admin/finance' }, { label: t('Invoices', 'Računi'), href: '/admin/finance/invoices' }]}
        description={t('The invoice is in English and goes to the client as a PDF. Income is recorded when you mark it as paid.', 'Račun je na engleskom i ide klijentu kao PDF. Prihod se knjiži kad ga označiš kao plaćen.')}
      />
      <Notice code={query.get('notice')} extra={{ items: ['alert-danger', t('Add at least one item with a description.', 'Dodaj bar jednu stavku sa opisom.')] }} />
      <InvoiceEditor
        customers={options.customers}
        projects={options.projects}
        priceList={prices.map((p) => ({ group: p.group, description: p.description, unit_price: p.unit_price }))}
        defaults={{
          today: todayBelgrade(),
          dueDays: settings.invoices.due_days,
          taxPct: settings.invoices.tax_pct,
          currency: settings.proposals.currency || 'USD',
          customerId: query.get('customer') ?? undefined,
          projectId: query.get('project') ?? undefined,
        }}
      />
    </>
  );
}
