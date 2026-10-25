'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOpen, BriefcaseBusiness, House, ScanSearch, Tag } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: House },
  { href: '/work', label: 'Work', icon: BriefcaseBusiness },
  { href: '/pricing', label: 'Pricing', icon: Tag },
  { href: '/blog', label: 'Blog', icon: BookOpen },
];

/**
 * A phone-only tab bar, like an app: the main pages one tap away and the free
 * check as the raised action. It slides away while scrolling down or typing,
 * and comes back on the way up.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let typing = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setHidden(typing || (y > last && y > 240));
      last = y;
    };
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && t.matches('input, textarea, select');
    const onFocusIn = (e: FocusEvent) => {
      if (!isField(e.target)) return;
      typing = true;
      setHidden(true);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!isField(e.target)) return;
      typing = false;
      setHidden(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav
      aria-label="Quick"
      className={`fixed inset-x-3 bottom-[calc(0.625rem+env(safe-area-inset-bottom))] z-50 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        hidden ? 'pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <ul className="grid grid-cols-5 items-center rounded-[1.4rem] bg-ink-975/85 p-1.5 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.65),inset_0_1px_0_rgb(255_255_255/0.06)] ring-1 ring-white/10 backdrop-blur-xl backdrop-saturate-150">
        {tabs.slice(0, 2).map((t) => (
          <Tab key={t.href} {...t} active={isActive(t.href)} />
        ))}
        <li className="flex justify-center">
          <Link
            href="/#hero-form"
            aria-label="Free website check"
            className="-mt-6 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-accent text-ink-950 shadow-[0_0_0_5px_rgb(5_6_10),0_10px_24px_-6px_rgb(1_175_233/0.7)] transition active:scale-95"
          >
            <ScanSearch className="h-6 w-6" aria-hidden />
          </Link>
        </li>
        {tabs.slice(2).map((t) => (
          <Tab key={t.href} {...t} active={isActive(t.href)} />
        ))}
      </ul>
    </nav>
  );
}

function Tab({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof House; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`relative flex h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-medium transition active:scale-95 ${
          active ? 'bg-white/[0.07] text-white' : 'text-white/55'
        }`}
      >
        <Icon className={`h-5 w-5 transition ${active ? 'text-accent' : ''}`} strokeWidth={active ? 2.2 : 1.8} aria-hidden />
        {label}
      </Link>
    </li>
  );
}
