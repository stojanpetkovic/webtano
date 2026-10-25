'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Chart, ArcElement, DoughnutController, Tooltip } from 'chart.js';
import { SERIES } from './chartColors';
import { applyChartTheme } from './chartTheme';

Chart.register(ArcElement, DoughnutController, Tooltip);

interface Slice {
  label: string;
  count: number;
  /** A fixed colour (status colours); otherwise the categorical order. */
  color?: string;
}

/** A doughnut with the total in the middle and a legend that doubles as the table of values. */
export function DonutChart({
  title,
  items,
  sub,
  empty = 'Još nema podataka.',
  currency,
}: {
  title: string;
  items: Slice[];
  sub?: string;
  empty?: string;
  /** Values are money in this currency (finance pages); otherwise counts. */
  currency?: string;
}) {
  const fmt = (n: number) =>
    currency ? new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: n >= 100_000 ? 'compact' : 'standard', maximumFractionDigits: 0 }).format(n) : n.toLocaleString('sr-Latn-RS');
  const canvas = useRef<HTMLCanvasElement>(null);
  const total = items.reduce((n, i) => n + i.count, 0);
  const colors = useMemo(() => items.map((it, i) => it.color ?? SERIES[i % SERIES.length]), [items]);

  useEffect(() => {
    if (!canvas.current || total === 0) return;
    applyChartTheme();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chart = new Chart(canvas.current, {
      type: 'doughnut',
      data: {
        labels: items.map((i) => i.label),
        datasets: [{ data: items.map((i) => i.count), backgroundColor: colors, borderColor: '#fff', borderWidth: 2, hoverOffset: 6, borderRadius: 4 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        layout: { padding: 6 },
        animation: reduced ? false : { animateRotate: true, duration: 800 },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [items, colors, total]);

  return (
    <div className="card">
      <div className="card-header border-b-0 pb-0">
        <div>
          <h2 className="card-title">{title}</h2>
          {sub && <p className="card-sub">{sub}</p>}
        </div>
      </div>
      <div className="card-body flex flex-1 flex-col items-center justify-center gap-6">
        {total === 0 ? (
          <p className="text-muted">{empty}</p>
        ) : (
          <>
            <div className="relative size-44 shrink-0">
              <canvas ref={canvas} role="img" aria-label={`${title}: ${items.map((i) => `${i.label} ${i.count}`).join(', ')}`} />
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-2xl font-semibold tracking-tight text-ink tabular-nums">{fmt(total)}</div>
                  <div className="text-[11px] text-zinc-500">ukupno</div>
                </div>
              </div>
            </div>
            <ul className="w-full min-w-0 space-y-2">
              {items.map((it, i) => (
                <li key={it.label} className="flex items-center gap-2.5 text-[13px]">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: colors[i] }} />
                  <span className="min-w-0 flex-1 truncate text-zinc-700" title={it.label}>
                    {it.label}
                  </span>
                  <span className="font-semibold text-ink tabular-nums">{currency ? fmt(it.count) : it.count}</span>
                  <span className="w-10 text-right text-xs text-zinc-400 tabular-nums">{Math.round((it.count / total) * 100)}%</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
