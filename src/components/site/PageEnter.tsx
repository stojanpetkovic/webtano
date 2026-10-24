'use client';

import { useState, type ReactNode } from 'react';

let firstPage = true;

/** Fades each new page in after a client-side navigation, like a screen change in an app. The first page loads without it. */
export function PageEnter({ children }: { children: ReactNode }) {
  const [animate] = useState(() => {
    if (typeof window === 'undefined') return false;
    const a = !firstPage;
    firstPage = false;
    return a;
  });
  return <div className={animate ? 'page-enter' : undefined}>{children}</div>;
}
