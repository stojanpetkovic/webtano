'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts the number inside a value like "1,010", "11.2%" or "< 1 day" up from
 * zero when it scrolls into view. The server renders the final value, so it
 * reads correctly without JavaScript.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
    const el = ref.current;
    if (!match || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ''));
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
    const grouped = digits.includes(',');
    const format = (n: number) =>
      prefix +
      n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped }) +
      suffix;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setText(format(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        setText(format(0));
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}
