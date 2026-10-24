'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Series {
  label: string;
  data: number[];
  /** Drawn as a line on its own right-hand axis, for a small count beside a large one. */
  line?: boolean;
}

const palette = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#0ea5e9', '#f97316', '#ec4899', '#14b8a6'];

function ChartCanvas({ title, labels, series }: { title: string; labels: string[]; series: Series[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasLine = series.some((s) => s.line);
    const chart = new Chart(canvas.current, {
      type: 'bar',
      data: {
        labels: labels.map((d) => d.slice(8, 10) + '.' + d.slice(5, 7) + '.'),
        datasets: series.map((s, i) =>
          s.line
            ? {
                type: 'line' as const,
                label: s.label,
                data: s.data,
                yAxisID: 'y1',
                borderColor: '#22c55e',
                backgroundColor: '#22c55e',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.3,
              }
            : {
                type: 'bar' as const,
                label: s.label,
                data: s.data,
                backgroundColor: palette[i % palette.length],
                borderRadius: 3,
                maxBarThickness: 22,
              },
        ),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduced ? false : undefined,
        plugins: { legend: { display: series.length > 1, position: 'bottom' } },
        scales: {
          x: { stacked: !hasLine, grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 12 } },
          y: { stacked: !hasLine, beginAtZero: true, ticks: { precision: 0 } },
          ...(hasLine
            ? { y1: { position: 'right' as const, beginAtZero: true, grid: { display: false }, ticks: { precision: 0 } } }
            : {}),
        },
      },
    });
    return () => chart.destroy();
  }, [labels, series]);

  return <canvas ref={canvas} aria-label={title} role="img" />;
}

export function DailyChart({ title, labels, series, note }: { title: string; labels: string[]; series: Series[]; note?: string }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        {note && <span className="text-xs text-muted">{note}</span>}
      </div>
      <div className="card-body">
        <div className="relative h-64">
          <ChartCanvas title={title} labels={labels} series={series} />
        </div>
      </div>
    </div>
  );
}
