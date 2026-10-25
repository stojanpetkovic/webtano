'use client';

import { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { GRID, INK, applyChartTheme } from '../chartTheme';

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// Income and expenses as side-by-side bars per month, EBITDA as a line over them.
const INCOME = '#1baf7a';
const EXPENSE = '#eb6834';

export function FinanceChart({
  labels,
  income,
  expenses,
  ebitda,
  currency,
}: {
  labels: string[];
  income: number[];
  expenses: number[];
  ebitda: number[];
  currency: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    applyChartTheme();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const full = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });
    const short = new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 });
    const chart = new Chart(canvas.current, {
      data: {
        labels,
        datasets: [
          { type: 'bar', label: 'Prihodi', data: income, backgroundColor: INCOME, borderRadius: 5, maxBarThickness: 22, order: 2 },
          { type: 'bar', label: 'Rashodi', data: expenses, backgroundColor: EXPENSE, borderRadius: 5, maxBarThickness: 22, order: 2 },
          {
            type: 'line',
            label: 'EBITDA',
            data: ebitda,
            borderColor: INK,
            backgroundColor: INK,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduced ? false : { duration: 600 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', align: 'start' },
          tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${full.format(Number(c.parsed.y))}` } },
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 12 } },
          y: {
            border: { display: false },
            grid: { color: (c) => (c.tick.value === 0 ? '#d4d7de' : GRID) },
            ticks: { maxTicksLimit: 6, padding: 8, callback: (v) => short.format(Number(v)) },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [labels, income, expenses, ebitda, currency]);

  return <canvas ref={canvas} role="img" aria-label="Prihodi, rashodi i EBITDA po mesecima" />;
}
