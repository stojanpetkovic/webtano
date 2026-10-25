import { Chart } from 'chart.js';
import type { Lang } from '@/lib/i18n';

export const INK = '#0b0d14';
export const GRID = '#eef0f4';
export const TICK = '#8a8f9c';

/** Shared look: Geist, quiet axes and a dark tooltip. Applied once per page. */
export function applyChartTheme() {
  const d = Chart.defaults;
  d.font.family = getComputedStyle(document.body).fontFamily;
  d.font.size = 11.5;
  d.color = TICK;
  d.plugins.tooltip.backgroundColor = INK;
  d.plugins.tooltip.titleColor = '#fff';
  d.plugins.tooltip.bodyColor = 'rgba(255,255,255,0.8)';
  d.plugins.tooltip.padding = 10;
  d.plugins.tooltip.cornerRadius = 10;
  d.plugins.tooltip.boxPadding = 4;
  d.plugins.tooltip.usePointStyle = true;
  d.plugins.tooltip.titleFont = { weight: 600, size: 12 };
  d.plugins.legend.labels.usePointStyle = true;
  d.plugins.legend.labels.pointStyle = 'circle';
  d.plugins.legend.labels.boxWidth = 7;
  d.plugins.legend.labels.boxHeight = 7;
  d.plugins.legend.labels.padding = 16;
  d.plugins.legend.labels.color = '#52525b';
}

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  sr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
};

/** "2026-10-24" → "Oct 24" / "24. okt" */
export function shortDay(day: string, lang: Lang) {
  const d = Number(day.slice(8, 10));
  const m = MONTHS[lang][Number(day.slice(5, 7)) - 1];
  return lang === 'sr' ? `${d}. ${m}` : `${m} ${d}`;
}
