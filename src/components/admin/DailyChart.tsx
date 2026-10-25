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
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { SERIES } from './chartColors';
import { GRID, applyChartTheme, shortDay } from './chartTheme';
import { useLang } from '@/components/i18n/LangProvider';
import { HTML_LANG } from '@/lib/i18n';

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend);

interface Series {
  label: string;
  data: number[];
  /** Fixed colour slot, so a series keeps its colour when others are hidden. */
  slot?: number;
}

function ChartCanvas({ title, labels, series, variant }: { title: string; labels: string[]; series: Series[]; variant: 'bar' | 'area' }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const lang = useLang();

  useEffect(() => {
    if (!canvas.current) return;
    applyChartTheme();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const color = (s: Series, i: number) => SERIES[(s.slot ?? i) % SERIES.length];
    const chart = new Chart(canvas.current, {
      type: variant === 'area' ? 'line' : 'bar',
      data: {
        labels: labels.map((d) => shortDay(d, lang)),
        datasets: series.map((s, i) =>
          variant === 'area'
            ? {
                label: s.label,
                data: s.data,
                borderColor: color(s, i),
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointHoverBorderColor: '#fff',
                pointHoverBackgroundColor: color(s, i),
                tension: 0.35,
                fill: series.length === 1 ? 'origin' : false,
                backgroundColor: (ctx: { chart: Chart }) => {
                  const { ctx: c, chartArea } = ctx.chart;
                  if (!chartArea) return 'transparent';
                  const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                  g.addColorStop(0, color(s, i) + '33');
                  g.addColorStop(1, color(s, i) + '00');
                  return g;
                },
              }
            : {
                label: s.label,
                data: s.data,
                backgroundColor: color(s, i),
                hoverBackgroundColor: color(s, i),
                borderColor: '#fff',
                borderWidth: series.length > 1 ? { top: 2 } : 0,
                borderSkipped: 'bottom' as const,
                borderRadius: 4,
                maxBarThickness: 18,
              },
        ),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduced ? false : { duration: 700, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: series.length > 1, position: 'bottom', align: 'start' },
          tooltip: {
            callbacks: {
              footer: (items) =>
                items.length > 1
                  ? `${lang === 'sr' ? 'Ukupno' : 'Total'}: ${items.reduce((n, it) => n + Number(it.raw ?? 0), 0).toLocaleString(HTML_LANG[lang])}`
                  : '',
            },
          },
        },
        scales: {
          x: {
            stacked: variant === 'bar',
            grid: { display: false },
            border: { display: false },
            ticks: { maxRotation: 0, autoSkipPadding: 18 },
          },
          y: {
            stacked: variant === 'bar',
            beginAtZero: true,
            border: { display: false },
            grid: { color: GRID },
            ticks: { precision: 0, maxTicksLimit: 5, padding: 8 },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [labels, series, variant, lang]);

  return <canvas ref={canvas} aria-label={title} role="img" />;
}

export function DailyChart({
  title,
  labels,
  series,
  note,
  total,
  variant = 'bar',
  height = 'h-56 sm:h-72',
}: {
  title: string;
  labels: string[];
  series: Series[];
  note?: string;
  /** A headline number shown under the title. */
  total?: string;
  variant?: 'bar' | 'area';
  height?: string;
}) {
  return (
    <div className="card">
      <div className="card-header border-b-0 pb-0">
        <div>
          <h2 className="card-title">{title}</h2>
          {total && <div className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{total}</div>}
        </div>
        {note && <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500">{note}</span>}
      </div>
      <div className="card-body pt-4">
        <div className={`relative ${height}`}>
          <ChartCanvas title={title} labels={labels} series={series} variant={variant} />
        </div>
      </div>
    </div>
  );
}
