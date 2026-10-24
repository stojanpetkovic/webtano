'use client';

import { useEffect, useState } from 'react';

/** "On this page" list that marks the section being read. */
export function TableOfContents({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter((h): h is HTMLElement => !!h);
    const onScroll = () => {
      // The last heading that has passed the top third of the screen.
      let current = headings[0]?.id;
      for (const h of headings) if (h.getBoundingClientRect().top < window.innerHeight * 0.33) current = h.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">On this page</p>
      <ol className="mt-4 space-y-0.5 border-l border-zinc-200">
        {items.map((i) => {
          const on = i.id === active;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={on ? 'location' : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition ${
                  on ? 'border-accent font-medium text-ink-950' : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-ink-950'
                }`}
              >
                {i.text.replace(/^\d+\.\s*/, '')}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
