import { rate } from '@/lib/admin/analytics';

// A breakdown where each row has visits, inquiries and calls, so the client
// sees which channel or page actually turns visitors into contacts.
export function ConversionTable({
  title,
  columnLabel,
  countLabel,
  rows,
  empty = 'Još nema podataka.',
}: {
  title: string;
  columnLabel: string;
  countLabel: string;
  rows: { label: string; count: number; leads: number; calls: number }[];
  empty?: string;
}) {
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
              <th className="text-right">Upiti</th>
              <th className="text-right">Pozivi</th>
              <th className="text-right">Stopa</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-6">
                  {empty}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="max-w-[16rem] truncate text-zinc-700" title={row.label}>
                  {row.label}
                </td>
                <td className="text-right tabular-nums">{row.count.toLocaleString('sr-Latn-RS')}</td>
                <td className="text-right tabular-nums font-semibold text-ink">{row.leads}</td>
                <td className="text-right tabular-nums font-semibold text-ink">{row.calls}</td>
                <td className="text-right tabular-nums text-muted">{rate(row.leads + row.calls, row.count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
