import { BellRing, Code2, FileText, Globe, Lock, MapPin, Megaphone, Phone, Server } from 'lucide-react';

// Small illustrations for the three rules in "How we work". They play once
// their card is revealed, like the service visuals.

/** A service area map with one area reserved and the rest locked. */
export function AreaVisual() {
  const cells = Array.from({ length: 12 }, (_, i) => i);
  const yours = 5;
  return (
    <div>
      <ul className="mx-auto grid max-w-[13rem] grid-cols-4 gap-1.5" aria-hidden>
        {cells.map((i) => (
          <li
            key={i}
            className={`svc-row flex aspect-square items-center justify-center rounded-lg ring-1 ${
              i === yours ? 'bg-lime text-forest-950 shadow-glow ring-lime' : 'bg-white/[0.03] text-white/20 ring-white/[0.07]'
            }`}
            style={{ '--row-delay': `${150 + i * 40}ms` } as React.CSSProperties}
          >
            {i === yours ? <MapPin className="h-4 w-4" /> : <Lock className="h-3 w-3" />}
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-3 flex max-w-[13rem] items-center justify-between gap-3 font-mono text-[10px] tracking-wide text-white/45 uppercase">
        <span className="text-lime">Your area</span>
        <span>Closed to others</span>
      </p>
    </div>
  );
}

/** Everything the client owns, each row marked as theirs. */
export function OwnershipVisual() {
  const rows = [
    { icon: Globe, label: 'Domain' },
    { icon: Code2, label: 'Website code' },
    { icon: Server, label: 'Hosting' },
    { icon: Megaphone, label: 'Google Ads account' },
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
          <span className="rounded-full bg-lime/15 px-2 py-0.5 font-mono text-[9px] tracking-wide text-lime uppercase ring-1 ring-lime/25">
            Yours
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Leads arriving as they happen, then one report a month. */
export function NumbersVisual() {
  const rows = [
    { icon: Phone, title: 'New call', meta: 'Google Ads · just now', hot: true },
    { icon: BellRing, title: 'New form', meta: 'Tree removal page · 4 min', hot: false },
    { icon: FileText, title: 'Monthly report', meta: 'Sent on the 1st', hot: false },
  ];
  return (
    <ul className="space-y-1.5">
      {rows.map((row, i) => (
        <li
          key={row.title}
          className={`svc-row flex items-center gap-2.5 rounded-lg px-2.5 py-2 ring-1 ${
            row.hot ? 'bg-white text-forest-950 ring-white' : 'bg-white/[0.04] text-white/80 ring-white/[0.08]'
          }`}
          style={{ '--row-delay': `${200 + i * 140}ms` } as React.CSSProperties}
        >
          <span className={`flex h-6 w-6 items-center justify-center rounded-full ${row.hot ? 'bg-forest-700 text-lime' : 'bg-white/10 text-white/60'}`}>
            <row.icon className="h-3 w-3" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">{row.title}</span>
            <span className={`block truncate text-[10px] ${row.hot ? 'text-zinc-500' : 'text-white/45'}`}>{row.meta}</span>
          </span>
          {row.hot && <span className="h-2 w-2 animate-pulse-dot rounded-full bg-lime" aria-hidden />}
        </li>
      ))}
    </ul>
  );
}

/** A phone with sound waves going out, for the section's big statement. */
export function RingingPhone() {
  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center" aria-hidden>
      <span className="ring-wave absolute inset-0 rounded-full ring-1 ring-lime/40" />
      <span className="ring-wave absolute inset-0 rounded-full ring-1 ring-lime/40 [animation-delay:0.8s]" />
      <span className="ring-wave absolute inset-0 rounded-full ring-1 ring-lime/40 [animation-delay:1.6s]" />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-lime text-forest-950 shadow-glow">
        <Phone className="phone-ring h-7 w-7" />
      </span>
    </div>
  );
}
