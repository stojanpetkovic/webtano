'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { LogOut, Settings } from 'lucide-react';

/** The avatar in the top right corner: who is signed in, settings and sign out. Closes on an outside click or Escape. */
export function ProfileMenu({ email, initial }: { email: string; initial: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: Event) => {
      const el = ref.current;
      if (!el?.open) return;
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !el.contains(e.target as Node)) el.open = false;
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, []);

  return (
    <details ref={ref} className="group relative">
      <summary
        className="grid size-9 cursor-pointer list-none place-items-center rounded-full bg-gradient-to-br from-accent to-primary text-sm font-semibold text-white ring-offset-2 ring-offset-body transition group-open:ring-2 group-open:ring-accent/40 [&::-webkit-details-marker]:hidden"
        aria-label="Profil"
        title={email}
      >
        {initial}
      </summary>
      <div className="absolute end-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_32px_-12px_rgb(11_13_20/0.25)]">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-primary text-sm font-semibold text-white">{initial}</span>
          <div className="min-w-0 leading-tight">
            <div className="text-[13px] font-medium text-ink">WebTano</div>
            <div className="truncate text-xs text-muted">{email}</div>
          </div>
        </div>
        <div className="p-1.5">
          <Link
            href="/admin/settings"
            onClick={() => ref.current && (ref.current.open = false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-zinc-700 transition hover:bg-zinc-50 hover:text-ink"
          >
            <Settings className="size-4 text-zinc-400" /> Podešavanja
          </Link>
          <form method="post" action="/admin/logout">
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-zinc-700 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="size-4 text-zinc-400" /> Odjava
            </button>
          </form>
        </div>
      </div>
    </details>
  );
}
