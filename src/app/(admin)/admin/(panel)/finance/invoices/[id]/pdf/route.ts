import { appSettings } from '@/lib/admin/settings';
import { loadInvoice } from '@/lib/admin/finance/data';
import { invoiceNumber } from '@/lib/admin/finance/labels';
import { invoicePdf } from '@/lib/admin/finance/pdf';

export const dynamic = 'force-dynamic';

/** The invoice PDF: shown in the browser, or saved with ?download=1. Behind the admin login like every /admin path. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const found = await loadInvoice((await params).id);
  if (!found) return new Response('Not found', { status: 404 });
  const settings = await appSettings();
  const pdf = await invoicePdf(found.invoice, found.items, settings);
  const name = `${invoiceNumber(settings.invoices.prefix, found.invoice.number)}.pdf`;
  const download = new URL(request.url).searchParams.has('download');
  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${name}"`,
      'Cache-Control': 'no-store',
    },
  });
}
