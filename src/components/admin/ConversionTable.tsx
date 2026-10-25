import { rate } from '@/lib/admin/analytics';
import { getAdminI18n } from '@/lib/admin/i18n';
import { HTML_LANG } from '@/lib/i18n';

// A breakdown where each row has visits, inquiries and calls, so the client
// sees which channel or page actually turns visitors into contacts.
export async function ConversionTable({
  title,
  columnLabel,
  countLabel,
  rows,
  empty,
}: {
  title: string;
  columnLabel: string;
  countLabel: string;
  rows: { label: string; count: number; leads: number; calls: number }[];
  empty?: string;
}) {
  const { lang, t } = await getAdminI18n();
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>{columnLabel}</th>
              <th className="text-right">{countLabel}</th>
              <th className="text-right">{t('Inquiries', 'Upiti')}</th>
              <th className="text-right">{t('Calls', 'Pozivi')}</th>
              <th className="text-right">{t('Rate', 'Stopa')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-6">
                  {empty ?? t('No data yet.', 'Još nema podataka.')}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="max-w-[16rem] truncate text-zinc-700" title={row.label}>
                  {row.label}
                </td>
                <td className="text-right tabular-nums">{row.count.toLocaleString(HTML_LANG[lang])}</td>
                <td className="text-right tabular-nums font-semibold text-ink">{row.leads}</td>
                <td className="text-right tabular-nums font-semibold text-ink">{row.calls}</td>
                <td className="text-right tabular-nums text-muted">{rate(row.leads + row.calls, row.count, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
