'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Marks every [data-reveal] element visible once it enters the viewport. */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-visible])');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.setAttribute('data-visible', ''));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-visible', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
