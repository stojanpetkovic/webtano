import type { LucideIcon } from 'lucide-react';
import { Activity } from 'lucide-react';

// Tailwick's pastel stat card: tinted background, a solid icon tile, a faint
// oversized icon in the corner, then the number and its label.
type Color = 'primary' | 'success' | 'warning' | 'secondary' | 'info' | 'danger';

// Full class names, so Tailwind sees each one in the source.
const palette: Record<Color, { card: string; tile: string; mark: string }> = {
  primary: { card: 'bg-primary/15', tile: 'bg-primary', mark: 'text-primary/10' },
  success: { card: 'bg-success/15', tile: 'bg-success', mark: 'text-success/10' },
  warning: { card: 'bg-danger/15', tile: 'bg-danger', mark: 'text-danger/10' },
  secondary: { card: 'bg-secondary/15', tile: 'bg-secondary', mark: 'text-secondary/10' },
  info: { card: 'bg-info/15', tile: 'bg-info', mark: 'text-info/10' },
  danger: { card: 'bg-red-500/15', tile: 'bg-red-500', mark: 'text-red-500/10' },
};

export function StatCard({
  label,
  value,
  note,
  tone = 'neutral',
  icon: Icon = Activity,
  color = 'primary',
}: {
  label: string;
  value: string | number;
  note?: string;
  tone?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  color?: Color;
}) {
  const c = palette[color];
  return (
    <div className={`stat-card ${c.card}`}>
      <Icon className={`stat-watermark ${c.mark}`} aria-hidden="true" />
      <div className={`stat-icon ${c.tile}`}>
        <Icon className="size-6" />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {note && (
        <div
          className={`mt-1.5 text-xs ${tone === 'up' ? 'text-green-700' : tone === 'down' ? 'text-orange-700' : 'text-zinc-600'}`}
        >
          {note}
        </div>
      )}
    </div>
  );
}
