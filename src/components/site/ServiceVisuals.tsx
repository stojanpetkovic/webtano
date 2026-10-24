import { FileText, MapPin, Phone, Star } from 'lucide-react';

// Small illustrations for the service cards. They show how each service looks
// in use, with example data, and animate once their card scrolls into view.

/** A Lighthouse-style speed score that fills up. */
export function SpeedVisual() {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden>
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="7" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            className="svc-gauge"
            style={{ '--gauge-full': c, '--gauge-to': c * 0.07 } as React.CSSProperties}
          />
        </svg>
        <div>
          <p className="font-display text-4xl text-white">96</p>
          <p className="font-mono text-[10px] tracking-wide text-white/50 uppercase">Mobile speed score</p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent ring-1 ring-accent/20">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Loads in 1.2 s
          </p>
        </div>
      </div>
      <ul className="mt-5 grid grid-cols-3 gap-2">
        {[
          ['100', 'Accessibility'],
          ['100', 'Best practices'],
          ['100', 'SEO'],
        ].map(([v, k], i) => (
          <li
            key={k}
            className="svc-row rounded-xl bg-white/[0.04] px-2 py-2.5 text-center ring-1 ring-white/10"
            style={{ '--row-delay': `${500 + i * 120}ms` } as React.CSSProperties}
          >
            <p className="font-display text-lg text-accent">{v}</p>
            <p className="font-mono text-[9px] tracking-wide text-white/45 uppercase">{k}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A local search result with the client on top. */
export function SearchVisual() {
  const rows = [
    { name: 'Your Tree Service', top: true },
    { name: 'Competitor A', top: false },
    { name: 'Competitor B', top: false },
  ];
  return (
    <ul className="space-y-2">
      {rows.map((row, i) => (
        <li
          key={row.name}
          className={`svc-row flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ${
            row.top ? 'bg-white text-ink-950 shadow-lift ring-white' : 'bg-white/[0.04] text-white/55 ring-white/10'
          }`}
          style={{ '--row-delay': `${200 + i * 120}ms` } as React.CSSProperties}
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${row.top ? 'bg-azure-700 text-accent' : 'bg-white/10'}`}
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{row.name}</span>
            <span className={`flex items-center gap-1 text-[11px] ${row.top ? 'text-zinc-500' : 'text-white/35'}`}>
              <Star className={`h-3 w-3 ${row.top ? 'fill-amber-400 text-amber-400' : ''}`} aria-hidden />
              {row.top ? '4.9 · Open now' : '4.2 · Closes soon'}
            </span>
          </span>
          {row.top && (
            <span className="rounded-full bg-azure-50 px-2 py-0.5 font-mono text-[10px] text-azure-700 ring-1 ring-azure-100">#1</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Cost per lead by campaign: the money moves to what works. */
export function AdsVisual() {
  const bars = [
    { label: 'Tree removal', value: 92, cpl: '$38' },
    { label: 'Emergency', value: 74, cpl: '$46' },
    { label: 'Trimming', value: 48, cpl: '$61' },
    { label: 'Stump grinding', value: 22, cpl: 'paused' },
  ];
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[10px] tracking-wide text-white/45 uppercase">
        <span>Budget by campaign</span>
        <span>Cost per lead</span>
      </div>
      <ul className="mt-3 space-y-3">
        {bars.map((b, i) => (
          <li key={b.label} className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3 text-xs sm:grid-cols-[8rem_1fr_4rem]">
            <span className="truncate text-white/70">{b.label}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
              <span
                className={`svc-bar block h-full rounded-full ${b.cpl === 'paused' ? 'bg-white/20' : 'bg-gradient-to-r from-azure-600 to-accent'}`}
                style={{ '--bar': `${b.value}%`, '--bar-delay': `${i * 110}ms` } as React.CSSProperties}
              />
            </span>
            <span className={`text-right font-mono ${b.cpl === 'paused' ? 'text-white/35' : 'text-accent'}`}>{b.cpl}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A live feed of leads arriving. */
export function LeadsVisual() {
  const leads = [
    { icon: Phone, title: 'Call from Google Ads', meta: 'Tree removal · 2 min ago' },
    { icon: FileText, title: 'Quote form', meta: '“Oak over the roof” · 18 min ago' },
    { icon: Phone, title: 'Call from Google Maps', meta: 'Emergency · 1 h ago' },
    { icon: FileText, title: 'Booking request', meta: 'Stump grinding · 3 h ago' },
  ];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="font-mono text-[10px] tracking-wide text-white/45 uppercase">New leads</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-accent uppercase">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden />
          Live
        </span>
      </div>
      <ul className="space-y-2">
        {leads.map((l, i) => (
          <li
            key={l.title + l.meta}
            className="svc-row flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/10"
            style={{ '--row-delay': `${150 + i * 140}ms` } as React.CSSProperties}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-ink-950">
              <l.icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">{l.title}</span>
              <span className="block truncate text-[11px] text-white/45">{l.meta}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
        {[
          ['74', 'Leads'],
          ['$41', 'Per lead'],
          ['7.9%', 'Rate'],
        ].map(([v, k]) => (
          <div key={k}>
            <p className="font-display text-lg text-white">{v}</p>
            <p className="font-mono text-[9px] tracking-wide text-white/40 uppercase">{k}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-white p-3 text-ink-950">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">Monthly report</span>
          <span className="font-mono text-[10px] text-zinc-500">Leads per day</span>
        </div>
        <div className="mt-2 flex h-14 items-end gap-1" aria-hidden>
          {[30, 45, 38, 60, 52, 70, 48, 66, 80, 58, 74, 90, 68, 84].map((h, i) => (
            <span
              key={i}
              className="svc-spark flex-1 rounded-t-sm bg-gradient-to-t from-azure-700 to-azure-600"
              style={{ '--spark': `${h}%`, '--bar-delay': `${i * 45}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
