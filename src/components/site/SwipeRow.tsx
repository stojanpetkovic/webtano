'use client';

import { Children, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * On phones, a row of cards you swipe through one at a time, with dots that
 * follow along. From the md breakpoint up it is a plain element, so the
 * desktop grid passed in className applies unchanged.
 */
export function SwipeRow({ children, className = '', label, as: Tag = 'div' }: { children: ReactNode; className?: string; label: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const items = [...el.children] as HTMLElement[];
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        items.forEach((c, i) => {
          if (Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) < Math.abs(items[best].offsetLeft + items[best].offsetWidth / 2 - mid)) best = i;
        });
        setActive(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (i: number) => {
    const el = ref.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({ left: item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <>
      <Tag
        ref={ref}
        className={`swipe-row ${className} max-md:-mx-4 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-3.5 max-md:space-y-0 max-md:overflow-x-auto max-md:overscroll-x-contain max-md:px-4 max-md:pb-1 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden max-md:[&>*]:w-[86%] max-md:[&>*]:shrink-0 max-md:[&>*]:snap-center max-md:[&>*>*]:h-full`}
      >
        {children}
      </Tag>
      <div className="mt-6 flex items-center justify-center gap-1.5 md:hidden" role="group" aria-label={label}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show card ${i + 1} of ${count}`}
            aria-current={i === active}
            className="flex h-6 items-center px-0.5"
          >
            <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-accent' : 'w-1.5 bg-current opacity-25'}`} />
          </button>
        ))}
      </div>
    </>
  );
}
