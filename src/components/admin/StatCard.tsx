import type { LucideIcon } from 'lucide-react';
import { Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Sparkline } from './Sparkline';

// KPI card: label with an icon chip, the number, how it changed and a sparkline.
type Color = 'primary' | 'success' | 'warning' | 'secondary' | 'info' | 'danger';

// Full class names, so Tailwind sees each one in the source.
const palette: Record<Color, { chip: string; line: string }> = {
  primary: { chip: 'bg-sky-50 text-primary ring-sky-600/10', line: '#0279b0' },
  success: { chip: 'bg-emerald-50 text-emerald-600 ring-emerald-600/10', line: '#10b981' },
  warning: { chip: 'bg-amber-50 text-amber-600 ring-amber-600/10', line: '#f59e0b' },
  secondary: { chip: 'bg-violet-50 text-violet-600 ring-violet-600/10', line: '#8b5cf6' },
  info: { chip: 'bg-cyan-50 text-cyan-600 ring-cyan-600/10', line: '#01afe9' },
  danger: { chip: 'bg-rose-50 text-rose-600 ring-rose-600/10', line: '#f43f5e' },
};

export function StatCard({
  label,
  value,
  note,
  tone = 'neutral',
  icon: Icon = Activity,
  color = 'primary',
  trend,
  className = '',
}: {
  label: string;
  value: string | number;
  /** "+12% vs…": a leading signed percentage becomes the coloured pill. */
  note?: string;
  tone?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  color?: Color;
  /** Daily values, oldest first, drawn as a sparkline. */
  trend?: number[];
  className?: string;
}) {
  const c = palette[color];
  const match = note?.match(/^([+-−]?\d+%)\s*(.*)$/);
  const delta = match?.[1];
  const rest = match ? match[2] : note;
  const Arrow = tone === 'down' ? ArrowDownRight : ArrowUpRight;

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon ring-1 ring-inset ${c.chip}`}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <div className="flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between min-[480px]:gap-3">
        <div className="stat-value">{value}</div>
        {trend && <Sparkline data={trend} color={c.line} className="mb-0.5 h-8 w-full shrink-0 min-[480px]:h-9 min-[480px]:w-24 sm:w-28" />}
      </div>
      {(delta || rest) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 max-[479px]:[&>span:last-child:not(:first-child)]:hidden">
          {delta && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium tabular-nums ${
                tone === 'up' ? 'bg-emerald-50 text-emerald-700' : tone === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {tone !== 'neutral' && <Arrow className="size-3" />}
              {delta}
            </span>
          )}
          {rest && <span>{rest}</span>}
        </div>
      )}
    </div>
  );
}
