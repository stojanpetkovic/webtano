// Horizontal bars drawn in CSS: readable in print and needs no JavaScript.
export function BarList({
  title,
  items,
  empty = 'Još nema podataka.',
  sub,
}: {
  title: string;
  items: { label: string; count: number }[];
  empty?: string;
  sub?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const total = items.reduce((n, i) => n + i.count, 0);
  return (
    <div className="card">
      <div className="card-header border-b-0 pb-0">
        <div>
          <h2 className="card-title">{title}</h2>
          {sub && <p className="card-sub">{sub}</p>}
        </div>
      </div>
      <div className="card-body space-y-1.5">
        {items.length === 0 && <p className="text-muted">{empty}</p>}
        {items.map((item) => (
          <div key={item.label} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-2 text-[13px]">
            <div className="absolute inset-y-0 left-0 rounded-lg bg-accent/10" style={{ width: `${(item.count / max) * 100}%` }} aria-hidden="true" />
            <span className="relative truncate text-zinc-700" title={item.label}>
              {item.label}
            </span>
            <span className="relative flex shrink-0 items-baseline gap-2">
              <span className="font-semibold text-ink tabular-nums">{item.count.toLocaleString('sr-Latn-RS')}</span>
              {total > 0 && <span className="w-9 text-right text-[11px] text-zinc-400 tabular-nums">{Math.round((item.count / total) * 100)}%</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
