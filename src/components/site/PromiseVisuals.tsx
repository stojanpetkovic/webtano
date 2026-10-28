import { BellRing, Code2, FileText, Globe, Lock, MapPin, Megaphone, Phone, Server } from 'lucide-react';
import { getI18n } from '@/lib/i18n-site';

// Small illustrations for the three rules in "How we work". They play once
// their card is revealed, like the service visuals.

/** A service area map with one area reserved and the rest locked. */
export async function AreaVisual() {
  const { t } = await getI18n();
  const cells = Array.from({ length: 12 }, (_, i) => i);
  const yours = 5;
  return (
    <div>
      <ul className="mx-auto grid max-w-[13rem] grid-cols-4 gap-1.5" aria-hidden>
        {cells.map((i) => (
          <li
            key={i}
            className={`svc-row flex aspect-square items-center justify-center rounded-lg ring-1 ${
              i === yours ? 'bg-accent text-ink-950 shadow-glow ring-accent' : 'bg-white/[0.03] text-white/20 ring-white/[0.07]'
            }`}
            style={{ '--row-delay': `${150 + i * 40}ms` } as React.CSSProperties}
          >
            {i === yours ? <MapPin className="h-4 w-4" /> : <Lock className="h-3 w-3" />}
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-3 flex max-w-[13rem] items-center justify-between gap-3 font-mono text-[10px] tracking-wide text-white/45 uppercase">
        <span className="text-accent">{t('Your area', 'Vaša oblast')}</span>
        <span>{t('Closed to others', 'Zatvoreno za druge')}</span>
      </p>
    </div>
  );
}

/** Everything the client owns, each row marked as theirs. */
export async function OwnershipVisual() {
  const { t } = await getI18n();
  const rows = [
    { icon: Globe, label: t('Domain', 'Domen') },
    { icon: Code2, label: t('Website code', 'Kod sajta') },
    { icon: Server, label: 'Hosting' },
    { icon: Megaphone, label: t('Google Ads account', 'Google Ads nalog') },
  ];
  return (
    <ul className="space-y-1.5">
      {rows.map((row, i) => (
        <li
          key={row.label}
          className="svc-row flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-2.5 py-2 ring-1 ring-white/[0.08]"
          style={{ '--row-delay': `${200 + i * 120}ms` } as React.CSSProperties}
        >
          <row.icon className="h-3.5 w-3.5 text-white/50" aria-hidden />
          <span className="flex-1 text-xs text-white/80">{row.label}</span>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] tracking-wide text-accent uppercase ring-1 ring-accent/25">
            {t('Yours', 'Vaše')}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Leads arriving as they happen, then one report a month. */
export async function NumbersVisual() {
  const { t } = await getI18n();
  const rows = [
    { icon: Phone, title: t('New call', 'Nov poziv'), meta: t('Google Ads · just now', 'Google Ads · upravo'), hot: true },
    { icon: BellRing, title: t('New form', 'Nova forma'), meta: t('Services page · 4 min', 'Stranica usluga · pre 4 min'), hot: false },
    { icon: FileText, title: t('Monthly report', 'Mesečni izveštaj'), meta: t('Sent on the 1st', 'Stiže 1. u mesecu'), hot: false },
  ];
  return (
    <ul className="space-y-1.5">
      {rows.map((row, i) => (
        <li
          key={row.title}
          className={`svc-row flex items-center gap-2.5 rounded-lg px-2.5 py-2 ring-1 ${
            row.hot ? 'bg-white text-ink-950 ring-white' : 'bg-white/[0.04] text-white/80 ring-white/[0.08]'
          }`}
          style={{ '--row-delay': `${200 + i * 140}ms` } as React.CSSProperties}
        >
          <span className={`flex h-6 w-6 items-center justify-center rounded-full ${row.hot ? 'bg-azure-700 text-accent' : 'bg-white/10 text-white/60'}`}>
            <row.icon className="h-3 w-3" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">{row.title}</span>
            <span className={`block truncate text-[10px] ${row.hot ? 'text-zinc-500' : 'text-white/45'}`}>{row.meta}</span>
          </span>
          {row.hot && <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" aria-hidden />}
        </li>
      ))}
    </ul>
  );
}

/** A phone with sound waves going out, for the section's big statement. */
export function RingingPhone() {
  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center" aria-hidden>
      <span className="ring-wave absolute inset-0 rounded-full ring-1 ring-accent/40" />
      <span className="ring-wave absolute inset-0 rounded-full ring-1 ring-accent/40 [animation-delay:0.8s]" />
      <span className="ring-wave absolute inset-0 rounded-full ring-1 ring-accent/40 [animation-delay:1.6s]" />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink-950 shadow-glow">
        <Phone className="phone-ring h-7 w-7" />
      </span>
    </div>
  );
}
