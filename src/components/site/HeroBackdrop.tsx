"use client";

import { useEffect, useRef } from "react";

// Grid lines sit every 64px (see .grid-lines), so the signals run exactly on them.
const ROWS = [3, 6, 9];
const COLS = [4, 11, 17];

/**
 * The moving layer behind the hero: drifting light, small signals travelling
 * along the grid, and on desktop a soft spotlight that follows the pointer.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section || !window.matchMedia("(pointer: fine)").matches)
      return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = section.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - box.left}px`);
        el.style.setProperty("--my", `${e.clientY - box.top}px`);
        el.style.setProperty("--spot", "1");
      });
    };
    const onLeave = () => el.style.setProperty("--spot", "0");
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="hero-backdrop pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="hero-aurora hero-aurora-a" />
      <div className="hero-aurora hero-aurora-b" />
      <div className="grid-lines absolute inset-0" />
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_0%,#000_35%,transparent_85%)]">
        {ROWS.map((r, i) => (
          <span
            key={`r${r}`}
            className="hero-beam-x"
            style={{ top: r * 64, animationDelay: `${i * 2.7}s` }}
          />
        ))}
        {COLS.map((c, i) => (
          <span
            key={`c${c}`}
            className="hero-beam-y"
            style={{ left: c * 64, animationDelay: `${1.3 + i * 3.1}s` }}
          />
        ))}
      </div>
      <div className="hero-pointer" />
    </div>
  );
}
