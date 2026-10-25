import { createElement } from 'react';
import {
  Camera,
  FilePlus2,
  Globe,
  LayoutTemplate,
  type LucideIcon,
  MapPin,
  Megaphone,
  MousePointerClick,
  Package,
  Palette,
  PenLine,
  Rocket,
  Server,
  ShieldCheck,
  Star,
  TrendingUp,
} from 'lucide-react';

// The first rule whose words appear in the item's name picks its icon.
const RULES: [RegExp, LucideIcon][] = [
  [/hosting|care|maintenance|server/i, Server],
  [/local services|lsa/i, ShieldCheck],
  [/google ads|ppc|ads\b/i, MousePointerClick],
  [/growth plan/i, TrendingUp],
  [/seo|map|local/i, MapPin],
  [/authority/i, Rocket],
  [/growth site/i, LayoutTemplate],
  [/site|website|landing/i, Globe],
  [/blog|article|content|copy/i, PenLine],
  [/page/i, FilePlus2],
  [/logo|brand|design/i, Palette],
  [/photo|video/i, Camera],
  [/review/i, Star],
  [/social|marketing|campaign/i, Megaphone],
];

export function itemIcon(name: string): LucideIcon {
  return RULES.find(([re]) => re.test(name))?.[1] ?? Package;
}

/** How each billing type looks, so one-time and monthly items never get mixed up. */
export const BILLING = {
  once: { label: 'Jednokratno', tile: 'bg-blue-50 text-blue-600 ring-blue-100', pill: 'bg-blue-50 text-blue-700 ring-blue-200/70', bar: 'bg-blue-500' },
  monthly: { label: 'Mesečno', tile: 'bg-emerald-50 text-emerald-600 ring-emerald-100', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70', bar: 'bg-emerald-500' },
} as const;

export function ItemIcon({ name, recurring, className = 'size-10' }: { name: string; recurring: boolean; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-xl ring-1 ring-inset ${BILLING[recurring ? 'monthly' : 'once'].tile} ${className}`} aria-hidden="true">
      {createElement(itemIcon(name), { className: 'size-[18px]' })}
    </span>
  );
}
