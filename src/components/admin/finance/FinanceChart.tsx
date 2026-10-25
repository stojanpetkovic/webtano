'use client';

import { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { GRID, INK, applyChartTheme } from '../chartTheme';
import { useLang } from '@/components/i18n/LangProvider';
import { translator } from '@/lib/i18n';

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
  const lang = useLang();
  const t = translator(lang);
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
          { type: 'bar', label: t('Income', 'Prihodi'), data: income, backgroundColor: INCOME, borderRadius: 5, maxBarThickness: 22, order: 2 },
          { type: 'bar', label: t('Expenses', 'Rashodi'), data: expenses, backgroundColor: EXPENSE, borderRadius: 5, maxBarThickness: 22, order: 2 },
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
    // t comes from lang, which is listed; t itself is a new function every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels, income, expenses, ebitda, currency, lang]);

  return <canvas ref={canvas} role="img" aria-label={t('Income, expenses and EBITDA by month', 'Prihodi, rashodi i EBITDA po mesecima')} />;
}
