import type { Metadata } from 'next';
import { PageHeading } from '@/components/admin/PageHeading';
import { InvoiceEditor } from '@/components/admin/finance/InvoiceEditor';
import { appSettings } from '@/lib/admin/settings';
import { priceList } from '@/lib/admin/crm/priceList';
import { toParams } from '@/lib/admin/params';
import { financeOptions } from '@/lib/admin/finance/options';
import { todayBelgrade } from '@/lib/admin/finance/labels';
import { Notice } from '../../Ledger';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Novi račun' };

export default async function NewInvoicePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const [settings, options, prices] = await Promise.all([appSettings(), financeOptions(), priceList()]);
  return (
    <>
      <PageHeading
        title="Novi račun"
        crumbs={[{ label: 'Finansije', href: '/admin/finance' }, { label: 'Računi', href: '/admin/finance/invoices' }]}
        description="Račun je na engleskom i ide klijentu kao PDF. Prihod se knjiži kad ga označiš kao plaćen."
      />
      <Notice code={query.get('notice')} extra={{ items: ['alert-danger', 'Dodaj bar jednu stavku sa opisom.'] }} />
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
