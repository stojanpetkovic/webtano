'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOpen, BriefcaseBusiness, House, ScanSearch, Tag } from 'lucide-react';
import { useLocalePath, useT } from '@/components/i18n/LangProvider';
import { splitPath, type T } from '@/lib/i18n';

const tabs = (t: T) => [
  { href: '/', label: t('Home', 'Početna'), icon: House },
  { href: '/work', label: t('Work', 'Radovi'), icon: BriefcaseBusiness },
  { href: '/pricing', label: t('Pricing', 'Cene'), icon: Tag },
  { href: '/blog', label: 'Blog', icon: BookOpen },
];

/**
 * A phone-only tab bar, like an app: the main pages one tap away and the free
 * check as the raised action. It slides away while scrolling down or typing,
 * and comes back on the way up.
 */
export function MobileTabBar() {
  const t = useT();
  const lp = useLocalePath();
  const pathname = splitPath(usePathname()).path;
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
      aria-label={t('Quick', 'Brzi meni')}
      className={`fixed inset-x-3 bottom-[calc(0.625rem+env(safe-area-inset-bottom))] z-50 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        hidden ? 'pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <ul className="grid grid-cols-5 items-center rounded-[1.75rem] bg-white/80 p-1.5 shadow-[0_8px_24px_-12px_rgb(10_14_30/0.18)] ring-1 ring-black/[0.06] backdrop-blur-2xl backdrop-saturate-[1.8]">
        {tabs(t).slice(0, 2).map((tab) => (
          <Tab key={tab.href} {...tab} href={lp(tab.href)} active={isActive(tab.href)} />
        ))}
        <li className="flex justify-center">
          <Link
            href={lp('/#hero-form')}
            aria-label={t('Free website check', 'Besplatna provera sajta')}
            className="flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-[1.25rem] bg-accent text-[11px] font-semibold text-ink-950 transition active:scale-95"
          >
            <ScanSearch className="h-5 w-5" strokeWidth={2.2} aria-hidden />
            {t('Check', 'Provera')}
          </Link>
        </li>
        {tabs(t).slice(2).map((tab) => (
          <Tab key={tab.href} {...tab} href={lp(tab.href)} active={isActive(tab.href)} />
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
        className={`relative flex h-12 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] text-[11px] font-medium transition active:scale-95 ${
          active ? 'bg-black/[0.05] text-ink-950' : 'text-zinc-500'
        }`}
      >
        <Icon className={`h-5 w-5 transition ${active ? 'text-azure-700' : ''}`} strokeWidth={active ? 2.2 : 1.8} aria-hidden />
        {label}
      </Link>
    </li>
  );
}
