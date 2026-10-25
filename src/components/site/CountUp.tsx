'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/components/i18n/LangProvider';

/**
 * Counts the number inside a value like "1,010", "11.2%" or "< 1 day" up from
 * zero when it scrolls into view. Serbian values are written the Serbian way,
 * "1.010" and "11,2%". The server renders the final value, so it reads
 * correctly without JavaScript.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  const sr = useLang() === 'sr';

  useEffect(() => {
    const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
    const el = ref.current;
    if (!match || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, prefix, digits, suffix] = match;
    const [group, point] = sr ? ['.', ','] : [',', '.'];
    const target = Number(digits.split(group).join('').replace(point, '.'));
    const decimals = digits.includes(point) ? digits.split(point)[1].length : 0;
    const grouped = digits.includes(group);
    // de-DE groups with a dot and uses a decimal comma, as Serbian does, also for four digits.
    const format = (n: number) =>
      prefix +
      n.toLocaleString(sr ? 'de-DE' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped }) +
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
  }, [value, duration, sr]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}
