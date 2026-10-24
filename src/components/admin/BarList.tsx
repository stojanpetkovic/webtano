// Horizontal bars drawn in CSS: readable in print and needs no JavaScript.
export function BarList({
  title,
  items,
  empty = 'Još nema podataka.',
}: {
  title: string;
  items: { label: string; count: number }[];
  empty?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="card-body space-y-3">
        {items.length === 0 && <p className="text-muted">{empty}</p>}
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between gap-3 text-[13px]">
              <span className="truncate text-zinc-700" title={item.label}>
                {item.label}
              </span>
              <span className="font-semibold text-ink tabular-nums">{item.count}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-zinc-100">
              <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
